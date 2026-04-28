import nodemailer from "nodemailer";
import {
  getBrevoSettings,
  hasBrevoTransactionalPrerequisites,
  sendBrevoTransactionalEmail,
  type BrevoSettings
} from "@/lib/brevo";
import { prisma } from "@/lib/db";
import {
  getSubscribeCouponDescription,
  SUBSCRIBE_COUPON_CODE,
  SUBSCRIBE_COUPON_PERCENT_OFF
} from "@/lib/subscribe-offer";

export const EMAIL_CONFIG_INCOMPLETE_REASON = "Email configuration is incomplete.";

type EmailSettings = {
  enabled: boolean;
  smtpHost: string;
  smtpPort: number;
  smtpSecure: boolean;
  smtpUser: string;
  smtpPass: string;
  fromName: string;
  fromEmail: string;
  contactRecipient: string;
  brevo: BrevoSettings;
};

type EmailSendResult =
  | {
      delivered: true;
      provider: "brevo" | "smtp";
      messageId?: string | null;
      accepted?: string[];
      rejected?: string[];
    }
  | {
      delivered: false;
      reason: string;
      provider?: "brevo" | "smtp" | null;
      stage?: "config" | "send";
    };

function parseBool(value: string | undefined) {
  return value === "true" || value === "1" || value === "on";
}

function toEmailSettings(record: Record<string, string>): EmailSettings {
  return {
    enabled: parseBool(record.email_enabled),
    smtpHost: record.smtp_host || "",
    smtpPort: Number.parseInt(record.smtp_port || "587", 10),
    smtpSecure: parseBool(record.smtp_secure),
    smtpUser: record.smtp_user || "",
    smtpPass: record.smtp_pass || "",
    fromName: record.email_from_name || "ZenUP",
    fromEmail: record.email_from_address || "",
    contactRecipient: record.contact_recipient || record.email_from_address || "",
    brevo: getBrevoSettings(record)
  };
}

export async function getEmailSettings() {
  const settings = await prisma.storeSetting.findMany({
    where: {
      key: {
        in: [
          "email_enabled",
          "smtp_host",
          "smtp_port",
          "smtp_secure",
          "smtp_user",
          "smtp_pass",
          "email_from_name",
          "email_from_address",
          "contact_recipient",
          "brevo_enabled",
          "brevo_api_key",
          "brevo_sender_name",
          "brevo_sender_email",
          "brevo_reply_to",
          "brevo_test_email",
          "brevo_subscribers_list_id",
          "brevo_contact_list_id",
          "brevo_customers_list_id"
        ]
      }
    }
  });

  const record = settings.reduce<Record<string, string>>((accumulator, item) => {
    accumulator[item.key] = item.value;
    return accumulator;
  }, {});

  return toEmailSettings(record);
}

function canSendEmail(settings: EmailSettings) {
  return Boolean(
    settings.enabled &&
      (hasBrevoTransactionalPrerequisites(settings.brevo) ||
        (settings.smtpHost &&
          settings.smtpPort &&
          settings.smtpUser &&
          settings.smtpPass &&
          settings.fromEmail))
  );
}

function canSendSmtpEmail(settings: EmailSettings) {
  return Boolean(
    settings.smtpHost &&
      settings.smtpPort &&
      settings.smtpUser &&
      settings.smtpPass &&
      settings.fromEmail
  );
}

function getOutgoingEmailProvider(settings: EmailSettings): "brevo" | "smtp" | null {
  if (!settings.enabled) {
    return null;
  }

  if (hasBrevoTransactionalPrerequisites(settings.brevo)) {
    return "brevo";
  }

  if (canSendSmtpEmail(settings)) {
    return "smtp";
  }

  return null;
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

async function sendEmailWithTransport(input: {
  settings: EmailSettings;
  to: string;
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
}): Promise<EmailSendResult> {
  const transporter = nodemailer.createTransport({
    host: input.settings.smtpHost,
    port: input.settings.smtpPort,
    secure: input.settings.smtpSecure,
    auth: {
      user: input.settings.smtpUser,
      pass: input.settings.smtpPass
    }
  });

  try {
    const info = await transporter.sendMail({
      from: `"${input.settings.fromName}" <${input.settings.fromEmail}>`,
      to: input.to,
      replyTo: input.replyTo || undefined,
      subject: input.subject,
      text: input.text,
      html: input.html
    });

    return {
      delivered: true,
      provider: "smtp",
      accepted: Array.isArray(info.accepted) ? info.accepted.map(String) : [],
      rejected: Array.isArray(info.rejected) ? info.rejected.map(String) : []
    };
  } catch (error) {
    return {
      delivered: false,
      provider: "smtp",
      stage: "send",
      reason: error instanceof Error ? error.message : "SMTP delivery failed."
    };
  }
}

async function sendConfiguredEmail(input: {
  to: string;
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
}): Promise<EmailSendResult> {
  const settings = await getEmailSettings();

  if (!canSendEmail(settings)) {
    return {
      delivered: false,
      provider: null,
      stage: "config",
      reason: EMAIL_CONFIG_INCOMPLETE_REASON
    };
  }

  const provider = getOutgoingEmailProvider(settings);

  if (!provider) {
    return {
      delivered: false,
      provider: null,
      stage: "config",
      reason: EMAIL_CONFIG_INCOMPLETE_REASON
    };
  }

  if (provider === "brevo") {
    try {
      const delivery = await sendBrevoTransactionalEmail({
        settings: settings.brevo,
        ...input
      });

      return {
        delivered: true,
        provider: "brevo",
        messageId: delivery.messageId,
        accepted: delivery.accepted,
        rejected: []
      };
    } catch (error) {
      if (canSendSmtpEmail(settings)) {
        console.error("Brevo transactional delivery failed, falling back to SMTP:", error);
        return sendEmailWithTransport({
          settings,
          ...input
        });
      }

      return {
        delivered: false,
        provider: "brevo",
        stage: "send",
        reason: error instanceof Error ? error.message : "Brevo transactional delivery failed."
      };
    }
  }

  return sendEmailWithTransport({
    settings,
    ...input
  });
}

export async function sendCustomerWelcomeEmail(input: {
  email: string;
  firstName?: string | null;
  password: string;
}) {
  const name = input.firstName || "there";

  return sendConfiguredEmail({
    to: input.email,
    subject: "Your ZenUP account is ready",
    text: `Hi ${name}, your ZenUP account has been created. You can sign in with ${input.email} and temporary password ${input.password}.`,
    html: `
      <div style="font-family:Arial,sans-serif;line-height:1.7;color:#2e2825">
        <h2 style="font-family:Georgia,serif;color:#0f6a35">Welcome to ZenUP</h2>
        <p>Hi ${name}, your account has been created so you can track orders, points, and reviews.</p>
        <p><strong>Login email:</strong> ${input.email}</p>
        <p><strong>Temporary password:</strong> ${input.password}</p>
        <p>You can sign in and update your password anytime from the account center.</p>
      </div>
    `
  });
}

export async function sendContactSubmissionEmails(input: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) {
  const settings = await getEmailSettings();

  if (!canSendEmail(settings) || !settings.contactRecipient) {
    return { delivered: false, reason: EMAIL_CONFIG_INCOMPLETE_REASON };
  }

  const internalResult = await sendConfiguredEmail({
    to: settings.contactRecipient,
    replyTo: input.email,
    subject: `[Contact] ${input.subject}`,
    text: `${input.name} <${input.email}>\n\n${input.message}`,
    html: `
      <div style="font-family:Arial,sans-serif;line-height:1.7;color:#2e2825">
        <h2 style="font-family:Georgia,serif;color:#0f6a35">New contact form submission</h2>
        <p><strong>Name:</strong> ${escapeHtml(input.name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(input.email)}</p>
        <p><strong>Subject:</strong> ${escapeHtml(input.subject)}</p>
        <p>${escapeHtml(input.message).replace(/\n/g, "<br />")}</p>
      </div>
    `
  });

  if (!internalResult.delivered) {
    return internalResult;
  }

  const customerResult = await sendConfiguredEmail({
    to: input.email,
    subject: "We received your message",
    text: `Hi ${input.name}, thanks for contacting ZenUP. We received your message and will get back to you soon.`,
    html: `
      <div style="font-family:Arial,sans-serif;line-height:1.7;color:#2e2825">
        <h2 style="font-family:Georgia,serif;color:#0f6a35">Thank you for contacting ZenUP</h2>
        <p>Hi ${escapeHtml(input.name)}, we received your message and our team will follow up soon.</p>
        <p><strong>Your subject:</strong> ${escapeHtml(input.subject)}</p>
      </div>
    `
  });

  if (!customerResult.delivered) {
    return customerResult;
  }

  return {
    delivered: true,
    provider: customerResult.provider,
    messageId: customerResult.messageId,
    accepted: customerResult.accepted,
    rejected: customerResult.rejected
  };
}

export async function sendSubscriptionCouponEmail(input: {
  email: string;
}) {
  return sendConfiguredEmail({
    to: input.email,
    subject: `${SUBSCRIBE_COUPON_PERCENT_OFF}% off your first ZenUP purchase`,
    text: `Welcome to ZenUP. Your subscriber offer is ${SUBSCRIBE_COUPON_CODE}. Apply it at checkout for ${getSubscribeCouponDescription()}. If you do not see this email in your inbox, please check your spam or promotions folder.`,
    html: `
      <div style="font-family:Arial,sans-serif;line-height:1.7;color:#2e2825">
        <h2 style="font-family:Georgia,serif;color:#0f6a35">Welcome to ZenUP</h2>
        <p>Thank you for subscribing. Your welcome offer is ready.</p>
        <p><strong>Coupon code:</strong> ${SUBSCRIBE_COUPON_CODE}</p>
        <p><strong>Offer:</strong> ${getSubscribeCouponDescription()}</p>
        <p>Enter the code at checkout on your first order. If you do not see this email in your inbox, please check your spam or promotions folder.</p>
      </div>
    `
  });
}
