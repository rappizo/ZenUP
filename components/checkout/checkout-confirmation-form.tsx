"use client";

import { useEffect, useState } from "react";
import type { CheckoutDraft } from "@/lib/checkout-draft";
import { CONTIGUOUS_US_STATES } from "@/lib/us-address";

type CheckoutConfirmationFormProps = {
  contact: {
    email: string;
    firstName: string;
    lastName: string;
  };
  draft: CheckoutDraft | null;
};

export function CheckoutConfirmationForm({
  contact,
  draft
}: CheckoutConfirmationFormProps) {
  const [billingSameAsShipping, setBillingSameAsShipping] = useState(
    draft?.billingSameAsShipping ?? true
  );
  const [shippingFullName, setShippingFullName] = useState(
    draft?.shippingAddress?.fullName || `${contact.firstName} ${contact.lastName}`.trim()
  );
  const [shippingAddress1, setShippingAddress1] = useState(draft?.shippingAddress?.address1 || "");
  const [shippingAddress2, setShippingAddress2] = useState(draft?.shippingAddress?.address2 || "");
  const [shippingCity, setShippingCity] = useState(draft?.shippingAddress?.city || "");
  const [shippingState, setShippingState] = useState(draft?.shippingAddress?.state || "");
  const [shippingPostalCode, setShippingPostalCode] = useState(
    draft?.shippingAddress?.postalCode || ""
  );
  const [billingFullName, setBillingFullName] = useState(
    draft?.billingAddress?.fullName || `${contact.firstName} ${contact.lastName}`.trim()
  );
  const [billingAddress1, setBillingAddress1] = useState(draft?.billingAddress?.address1 || "");
  const [billingAddress2, setBillingAddress2] = useState(draft?.billingAddress?.address2 || "");
  const [billingCity, setBillingCity] = useState(draft?.billingAddress?.city || "");
  const [billingState, setBillingState] = useState(draft?.billingAddress?.state || "");
  const [billingPostalCode, setBillingPostalCode] = useState(
    draft?.billingAddress?.postalCode || ""
  );

  useEffect(() => {
    if (!billingSameAsShipping) {
      return;
    }

    setBillingFullName(shippingFullName);
    setBillingAddress1(shippingAddress1);
    setBillingAddress2(shippingAddress2);
    setBillingCity(shippingCity);
    setBillingState(shippingState);
    setBillingPostalCode(shippingPostalCode);
  }, [
    billingSameAsShipping,
    shippingAddress1,
    shippingAddress2,
    shippingCity,
    shippingFullName,
    shippingPostalCode,
    shippingState
  ]);

  return (
    <form action="/checkout/start" method="post" className="checkout-confirmation-form">
      <input type="hidden" name="email" value={contact.email} />
      <input type="hidden" name="firstName" value={contact.firstName} />
      <input type="hidden" name="lastName" value={contact.lastName} />

      <section className="admin-form">
        <div className="checkout-confirmation-form__header">
          <div>
            <p className="eyebrow">Shipping address</p>
            <h2>Where should we send the order?</h2>
          </div>
          <span className="pill">Contiguous U.S. only</span>
        </div>

        <div className="admin-form__grid">
          <div className="field">
            <label htmlFor="shippingFullName">Full name</label>
            <input
              id="shippingFullName"
              name="shippingFullName"
              value={shippingFullName}
              onChange={(event) => setShippingFullName(event.target.value)}
              required
            />
          </div>
          <div className="field">
            <label htmlFor="shippingAddress1">Address line 1</label>
            <input
              id="shippingAddress1"
              name="shippingAddress1"
              value={shippingAddress1}
              onChange={(event) => setShippingAddress1(event.target.value)}
              required
            />
          </div>
          <div className="field">
            <label htmlFor="shippingAddress2">Address line 2</label>
            <input
              id="shippingAddress2"
              name="shippingAddress2"
              value={shippingAddress2}
              onChange={(event) => setShippingAddress2(event.target.value)}
            />
          </div>
          <div className="field">
            <label htmlFor="shippingCity">City</label>
            <input
              id="shippingCity"
              name="shippingCity"
              value={shippingCity}
              onChange={(event) => setShippingCity(event.target.value)}
              required
            />
          </div>
          <div className="field">
            <label htmlFor="shippingState">State</label>
            <select
              id="shippingState"
              name="shippingState"
              value={shippingState}
              onChange={(event) => setShippingState(event.target.value)}
              required
            >
              <option value="">Select a state</option>
              {CONTIGUOUS_US_STATES.map((state) => (
                <option key={state.code} value={state.code}>
                  {state.name}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="shippingPostalCode">ZIP code</label>
            <input
              id="shippingPostalCode"
              name="shippingPostalCode"
              value={shippingPostalCode}
              onChange={(event) => setShippingPostalCode(event.target.value)}
              inputMode="numeric"
              required
            />
          </div>
        </div>
      </section>

      <section className="admin-form">
        <div className="checkout-confirmation-form__header">
          <div>
            <p className="eyebrow">Billing address</p>
            <h2>Confirm the billing details for payment.</h2>
          </div>
        </div>

        <label className="field field--checkbox">
          <input
            type="checkbox"
            name="billingSameAsShipping"
            checked={billingSameAsShipping}
            onChange={(event) => setBillingSameAsShipping(event.target.checked)}
          />
          <span>The same as shipping address</span>
        </label>

        {!billingSameAsShipping ? (
          <div className="admin-form__grid">
            <div className="field">
              <label htmlFor="billingFullName">Full name</label>
              <input
                id="billingFullName"
                name="billingFullName"
                value={billingFullName}
                onChange={(event) => setBillingFullName(event.target.value)}
                required={!billingSameAsShipping}
              />
            </div>
            <div className="field">
              <label htmlFor="billingAddress1">Address line 1</label>
              <input
                id="billingAddress1"
                name="billingAddress1"
                value={billingAddress1}
                onChange={(event) => setBillingAddress1(event.target.value)}
                required={!billingSameAsShipping}
              />
            </div>
            <div className="field">
              <label htmlFor="billingAddress2">Address line 2</label>
              <input
                id="billingAddress2"
                name="billingAddress2"
                value={billingAddress2}
                onChange={(event) => setBillingAddress2(event.target.value)}
              />
            </div>
            <div className="field">
              <label htmlFor="billingCity">City</label>
              <input
                id="billingCity"
                name="billingCity"
                value={billingCity}
                onChange={(event) => setBillingCity(event.target.value)}
                required={!billingSameAsShipping}
              />
            </div>
            <div className="field">
              <label htmlFor="billingState">State</label>
              <select
                id="billingState"
                name="billingState"
                value={billingState}
                onChange={(event) => setBillingState(event.target.value)}
                required={!billingSameAsShipping}
              >
                <option value="">Select a state</option>
                {CONTIGUOUS_US_STATES.map((state) => (
                  <option key={state.code} value={state.code}>
                    {state.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <label htmlFor="billingPostalCode">ZIP code</label>
              <input
                id="billingPostalCode"
                name="billingPostalCode"
                value={billingPostalCode}
                onChange={(event) => setBillingPostalCode(event.target.value)}
                inputMode="numeric"
                required={!billingSameAsShipping}
              />
            </div>
          </div>
        ) : (
          <div className="checkout-confirmation-form__same-address">
            <p>Billing address will be copied from the shipping address when you continue.</p>
          </div>
        )}
      </section>

      <div className="stack-row">
        <button type="submit" className="button button--primary">
          Continue to secure payment
        </button>
      </div>
    </form>
  );
}
