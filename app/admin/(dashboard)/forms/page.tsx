import Link from "next/link";
import { formatDate } from "@/lib/format";
import { getFormSubmissionSummaries } from "@/lib/queries";

type AdminFormsPageProps = {
  searchParams: Promise<{ status?: string }>;
};

export default async function AdminFormsPage({ searchParams }: AdminFormsPageProps) {
  const [summaries, params] = await Promise.all([getFormSubmissionSummaries(), searchParams]);

  return (
    <div className="admin-page">
      <div className="admin-page__header">
        <p className="eyebrow">Form Submissions</p>
        <h1>Open each form to review what customers have submitted.</h1>
        <p>
          Keep Contact and Subscribe submissions organized by form type, then drill into each
          submission for the full message and handling status.
        </p>
      </div>

      {params.status ? <p className="notice">Submission action completed: {params.status}.</p> : null}

      <div className="admin-product-grid">
        {summaries.map((summary) => (
          <article key={summary.formKey} className="admin-product-card">
            <div className="admin-product-card__body">
              <div className="product-card__meta">
                <span>{summary.totalCount} total</span>
                <span>{summary.unhandledCount} unhandled</span>
              </div>
              <h3>{summary.formLabel}</h3>
              <p>{summary.description}</p>
              <ul className="admin-list">
                <li>
                  Latest: {summary.latestSubmittedAt ? formatDate(summary.latestSubmittedAt) : "No submissions yet"}
                </li>
                <li>Search by email inside the form workspace</li>
                <li>Click through to view each submission in full</li>
              </ul>
              <Link href={`/admin/forms/${summary.formKey}`} className="button button--primary">
                Open submissions
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
