import ProfileSummary from "../StudentProfile";

export default function StudentProfile({
  student,
  isEditing,
  saving,
  onEdit,
  onCancel,
  onSave,
}) {
  return (
    <div className="student-detail-profile-row">
      <ProfileSummary student={student} variant="detail" />

      {isEditing ? (
        <div className="student-detail-edit-actions">
          <button
            className="student-detail-btn student-detail-btn-secondary"
            type="button"
            onClick={onCancel}
            disabled={saving}
          >
            Cancel
          </button>
          <button
            className="student-detail-btn student-detail-btn-primary"
            type="button"
            onClick={onSave}
            disabled={saving}
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      ) : (
        <button
          className="student-detail-btn student-detail-btn-primary"
          type="button"
          onClick={onEdit}
        >
          Edit
        </button>
      )}
    </div>
  );
}
