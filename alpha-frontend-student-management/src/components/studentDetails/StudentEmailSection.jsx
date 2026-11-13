export default function StudentEmailSection({ email }) {
  return (
    <section className="student-detail-email-section">
      <h3>My email Address</h3>
      <div className="student-detail-email-item">
        <div className="student-detail-email-icon" aria-hidden="true">
          ✉
        </div>
        <div>
          <p>{email}</p>
          <p className="student-detail-muted student-detail-small">
            1 month ago
          </p>
        </div>
      </div>
    </section>
  );
}
