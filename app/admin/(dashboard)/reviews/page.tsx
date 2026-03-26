import Image from "next/image";
import { RatingStars } from "@/components/ui/rating-stars";
import {
  bulkImportReviewsAction,
  deleteReviewAction,
  updateReviewAction
} from "@/app/admin/actions";
import { formatDate } from "@/lib/format";
import { getAllReviews, getProducts } from "@/lib/queries";

type AdminReviewsPageProps = {
  searchParams: Promise<{ status?: string }>;
};

const csvColumns = "displayName,email,rating,title,content,verifiedPurchase,status";

export default async function AdminReviewsPage({ searchParams }: AdminReviewsPageProps) {
  const [products, reviews, params] = await Promise.all([getProducts(), getAllReviews(), searchParams]);
  const reviewsByProduct = new Map<string, typeof reviews>();

  for (const product of products) {
    reviewsByProduct.set(product.id, []);
  }

  for (const review of reviews) {
    const bucket = reviewsByProduct.get(review.productId);

    if (bucket) {
      bucket.push(review);
    }
  }

  return (
    <div className="admin-page">
      <div className="admin-page__header">
        <p className="eyebrow">Reviews</p>
        <h1>Manage product reviews by product.</h1>
        <p>
          Each product below has its own review workspace, so you can review moderation, edit
          individual comments, and import review batches with a CSV file.
        </p>
      </div>

      {params.status ? <p className="notice">Review action completed: {params.status}.</p> : null}

      <section className="admin-form">
        <h2>CSV import format</h2>
        <p className="form-note">
          Upload one CSV per product. Use this column order in the first row:
          <br />
          <code>{csvColumns}</code>
        </p>
      </section>

      <div className="admin-review-groups">
        {products.map((product) => {
          const productReviews = reviewsByProduct.get(product.id) ?? [];
          const publishedCount = productReviews.filter((review) => review.status === "PUBLISHED").length;
          const pendingCount = productReviews.filter((review) => review.status === "PENDING").length;
          const hiddenCount = productReviews.filter((review) => review.status === "HIDDEN").length;

          return (
            <section
              key={product.id}
              id={`product-${product.slug}`}
              className="admin-review-group admin-product-card"
            >
              <div className="admin-review-group__overview">
                <div className="admin-product-card__media">
                  <Image src={product.imageUrl} alt={product.name} width={420} height={420} />
                </div>

                <div className="admin-review-group__body">
                  <div className="product-card__meta">
                    <span>{product.category}</span>
                    <span>{product.status}</span>
                  </div>
                  <h2>{product.name}</h2>
                  <p>{product.shortDescription}</p>

                  <div className="admin-review-group__stats">
                    <div className="admin-review-group__stat">
                      <strong>{productReviews.length}</strong>
                      <span>Total reviews</span>
                    </div>
                    <div className="admin-review-group__stat">
                      <strong>{publishedCount}</strong>
                      <span>Published</span>
                    </div>
                    <div className="admin-review-group__stat">
                      <strong>{pendingCount}</strong>
                      <span>Pending</span>
                    </div>
                    <div className="admin-review-group__stat">
                      <strong>{hiddenCount}</strong>
                      <span>Hidden</span>
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
                      <span>No rating yet</span>
                    )}
                  </div>

                  <form action={bulkImportReviewsAction} encType="multipart/form-data">
                    <input type="hidden" name="productSlug" value={product.slug} />
                    <div className="field">
                      <label htmlFor={`csvFile-${product.id}`}>Upload CSV</label>
                      <input
                        id={`csvFile-${product.id}`}
                        name="csvFile"
                        type="file"
                        accept=".csv,text/csv"
                      />
                    </div>
                    <p className="form-note">
                      Columns: <code>{csvColumns}</code>
                    </p>
                    <button type="submit" className="button button--primary">
                      Import CSV for {product.name}
                    </button>
                  </form>
                </div>
              </div>

              <div className="admin-review-list">
                {productReviews.length > 0 ? (
                  productReviews.map((review) => (
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
                        <button type="submit" className="button button--ghost">
                          Delete review
                        </button>
                      </form>
                    </article>
                  ))
                ) : (
                  <section className="admin-form admin-review-item">
                    <h3>No reviews yet</h3>
                    <p>
                      Upload a CSV for {product.name} or wait for customer reviews to appear here
                      after purchase.
                    </p>
                  </section>
                )}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
