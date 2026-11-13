export default function DeleteConfirmDialog({
  fullName,
  deleting,
  onCancel,
  onConfirm,
}) {
  return (
    <div className="student-detail-overlay" role="presentation">
      <div
        className="student-detail-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-title"
      >
        <h3 id="delete-title">Delete this student?</h3>
        <p>{fullName} will be permanently removed. This cannot be undone.</p>
        <div className="student-detail-dialog-actions">
          <button
            className="student-detail-btn student-detail-btn-secondary"
            type="button"
            onClick={onCancel}
            disabled={deleting}
          >
            Cancel
          </button>
          <button
            className="student-detail-btn student-detail-btn-danger"
            type="button"
            onClick={onConfirm}
            disabled={deleting}
          >
            {deleting ? "Deleting..." : "Yes, delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
