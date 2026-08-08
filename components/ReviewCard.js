export default function ReviewCard({ review }) {
  const stars = '★'.repeat(review.rating) + '☆'.repeat(5 - review.rating);
  return (
    <div className="card">
      <div style={{ color: '#FECD01', letterSpacing: 2, marginBottom: 8 }}>{stars}</div>
      <p style={{ fontSize: 14, opacity: 0.85 }}>&quot;{review.text}&quot;</p>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginTop: 10 }}>
        <strong>{review.customer_name}</strong>
        <span style={{ opacity: 0.6 }}>{review.item}</span>
      </div>
    </div>
  );
}
