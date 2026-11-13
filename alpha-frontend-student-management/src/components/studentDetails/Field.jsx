export default function Field({
  label,
  name,
  value,
  isEditing,
  onChange,
  editable = true,
  error,
}) {
  const canEdit = isEditing && editable;
  const displayValue =
    name === "dateOfBirth" || name === "enrollmentDate"
      ? String(value ?? "").slice(0, 10)
      : (value ?? "");

  return (
    <label className={"student-detail-field" + (error ? " has-error" : "")}>
      <span>{label}</span>
      <input
        type={
          canEdit && (name === "dateOfBirth" || name === "enrollmentDate")
            ? "date"
            : "text"
        }
        name={name}
        value={displayValue}
        readOnly={!canEdit}
        onChange={onChange}
        aria-invalid={Boolean(error)}
      />
      {error && <span className="student-detail-field-error">{error}</span>}
    </label>
  );
}
