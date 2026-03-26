import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { RatingStars } from "@/components/ui/rating-stars";
import {
  bulkImportReviewsAction,
  deleteReviewAction,
  updateReviewAction
} from "@/app/admin/actions";
import { formatDate } from "@/lib/format";
import { getAdminReviewPageByProductSlug } from "@/lib/queries";

type AdminProductReviewsPageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string; status?: string }>;
};

const pageSize = 50;
const csvColumns = "displayName,email,rating,title,content,verifiedPurchase,status";

function buildPageHref(slug: string, page: number) {
  return `/admin/reviews/${slug}?page=${page}`;
}

export default async function AdminProductReviewsPage({
  params,
  searchParams
}: AdminProductReviewsPageProps) {
  const [{ slug }, query] = await Promise.all([params, searchParams]);
  const requestedPage = Number.parseInt(query.page || "1", 10);
  const reviewPage = await getAdminReviewPageByProductSlug(
    slug,
    Number.isFinite(requestedPage) ? requestedPage : 1,
    pageSize
  );

  if (!reviewPage) {
    notFound();
  }

  const {
    product,
    reviews,
    totalReviewCount,
    publishedReviewCount,
    pendingReviewCount,
    hiddenReviewCount,
    currentPage,
    totalPages
  } = reviewPage;
  const fromReview = totalReviewCount === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const toReview = Math.min(currentPage * pageSize, totalReviewCount);
  const redirectTo = buildPageHref(product.slug, currentPage);

  return (
    <div className="admin-page">
      <div className="admin-page__header">
        <p className="eyebrow">Reviews / {product.name}</p>
        <h1>Edit reviews for {product.name}.</h1>
        <p>
          Moderate reviews, update ratings, and import more comments for this product without
          loading the rest of the catalog.
        </p>
      </div>

      <div className="stack-row">
        <Link href="/admin/reviews" className="button button--secondary">
          Back to Products
        </Link>
        <Link href={`/shop/${product.slug}`} className="button button--ghost">
          View Product Page
        </Link>
      </div>

      {query.status ? <p className="notice">Review action completed: {query.status}.</p> : null}

      <section className="admin-review-detail admin-product-card">
        <div className="admin-review-detail__hero">
          <div className="admin-product-card__media">
            <Image src={product.imageUrl} alt={product.name} width={420} height={420} />
          </div>

          <div className="admin-review-detail__content">
            <div className="product-card__meta">
              <span>{product.category}</span>
              <span>{product.status}</span>
              <span>{totalReviewCount} total reviews</span>
            </div>
            <h2>{product.name}</h2>
            <p>{product.shortDescription}</p>

            <div className="admin-review-group__stats">
              <div className="admin-review-group__stat">
                <strong>{publishedReviewCount}</strong>
                <span>Published</span>
              </div>
              <div className="admin-review-group__stat">
                <strong>{pendingReviewCount}</strong>
                <span>Pending</span>
              </div>
              <div className="admin-review-group__stat">
                <strong>{hiddenReviewCount}</strong>
                <span>Hidden</span>
              </div>
              <div className="admin-review-group__stat">
                <strong>{totalPages}</strong>
                <span>Pages at 50 each</span>
              </div>
            </div>

            <div className="product-card__meta">
              {product.averageRating ? (
                <RatingStars
                  rating={product.averageRating}
                  reviewCount={product.reviewCount}
                  size="sm"
                  showCount
                />
              ) : (
                <span>No published rating yet</span>
              )}
            </div>

            <form action={bulkImportReviewsAction} encType="multipart/form-data" className="admin-form">
              <input type="hidden" name="productSlug" value={product.slug} />
              <input type="hidden" name="redirectTo" value={redirectTo} />
              <div className="field">
                <label htmlFor={`csvFile-${product.id}`}>Upload CSV for {product.name}</label>
                <input
                  id={`csvFile-${product.id}`}
                  name="csvFile"
                  type="file"
                  accept=".csv,text/csv"
                />
              </div>
              <p className="form-note">
                CSV columns: <code>{csvColumns}</code>
              </p>
              <button type="submit" className="button button--primary">
                Import CSV
              </button>
            </form>
          </div>
        </div>
      </section>

      <section className="admin-form">
        <div className="admin-review-pagination">
          <div>
            <h2>Review list</h2>
            <p className="form-note">
              Showing {fromReview} to {toReview} of {totalReviewCount} reviews.
            </p>
          </div>

          <div className="stack-row">
            <Link
              href={currentPage > 1 ? buildPageHref(product.slug, currentPage - 1) : "#"}
              className={`button button--secondary${currentPage > 1 ? "" : " button--disabled"}`}
              aria-disabled={currentPage <= 1}
            >
              Previous
            </Link>
            <span className="pill">
              Page {currentPage} of {totalPages}
            </span>
            <Link
              href={currentPage < totalPages ? buildPageHref(product.slug, currentPage + 1) : "#"}
              className={`button button--secondary${currentPage < totalPages ? "" : " button--disabled"}`}
              aria-disabled={currentPage >= totalPages}
            >
              Next
            </Link>
          </div>
        </div>
      </section>

      <div className="admin-review-list">
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <article key={review.id} className="admin-form admin-review-item">
              <div className="admin-review-item__header">
                <div>
                  <h3>{review.title}</h3>
                  <p>
                    {review.displayName} / {formatDate(review.createdAt)} /{" "}
                    {review.customerEmail || "No customer record"}
                  </p>
                </div>
                <RatingStars rating={review.rating} size="sm" />
              </div>

              <form action={updateReviewAction}>
                <input type="hidden" name="id" value={review.id} />
                <input type="hidden" name="productSlug" value={product.slug} />
                <input type="hidden" name="redirectTo" value={redirectTo} />
                <div className="admin-form__grid">
                  <div className="field">
                    <label>Display name</label>
                    <input name="displayName" defaultValue={review.displayName} />
                  </div>
                  <div className="field">
                    <label>Rating</label>
                    <input
                      name="rating"
                      type="number"
                      min="1"
                      max="5"
                      defaultValue={review.rating}
                    />
                  </div>
                  <div className="field">
                    <label>Status</label>
                    <select name="status" defaultValue={review.status}>
                      <option value="PENDING">PENDING</option>
                      <option value="PUBLISHED">PUBLISHED</option>
                      <option value="HIDDEN">HIDDEN</option>
                    </select>
                  </div>
                  <label className="field field--checkbox">
                    <input
                      type="checkbox"
                      name="verifiedPurchase"
                      defaultChecked={review.verifiedPurchase}
                    />
                    Verified purchase
                  </label>
                </div>
                <div className="field">
                  <label>Title</label>
                  <input name="title" defaultValue={review.title} />
                </div>
                <div className="field">
                  <label>Content</label>
                  <textarea name="content" defaultValue={review.content} />
                </div>
                <div className="field">
                  <label>Admin notes</label>
                  <textarea name="adminNotes" defaultValue={review.adminNotes ?? ""} />
                </div>
                <button type="submit" className="button button--primary">
                  Save review
                </button>
              </form>

              <form action={deleteReviewAction}>
                <input type="hidden" name="id" value={review.id} />
                <input type="hidden" name="productSlug" value={product.slug} />
                <input type="hidden" name="redirectTo" value={redirectTo} />
                <button type="submit" className="button button--ghost">
                  Delete review
                </button>
              </form>
            </article>
          ))
        ) : (
          <section className="admin-form admin-review-item">
            <h3>No reviews yet</h3>
            <p>Upload a CSV for {product.name} or wait for customer reviews to appear here.</p>
          </section>
        )}
      </div>
    </div>
  );
}
