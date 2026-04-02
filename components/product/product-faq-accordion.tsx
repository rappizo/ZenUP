type ProductFaqItem = {
  question: string;
  answer: string;
};

type ProductFaqAccordionProps = {
  items: ProductFaqItem[];
};

export function ProductFaqAccordion({ items }: ProductFaqAccordionProps) {
  return (
    <div className="product-faq">
      {items.map((item, index) => (
        <details key={item.question} className="product-faq__item" open={index === 0}>
          <summary className="product-faq__summary">
            <span>{item.question}</span>
            <span className="product-faq__icon" aria-hidden="true">
              +
            </span>
          </summary>
          <div className="product-faq__content">
            <p>{item.answer}</p>
          </div>
        </details>
      ))}
    </div>
  );
}
