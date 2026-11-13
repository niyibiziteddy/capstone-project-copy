import Field from "./Field";
import { STUDENT_FIELDS } from "../../utils/constants";

export default function StudentFields({
  values,
  isEditing,
  onChange,
  errors = {},
}) {
  return (
    <div className="student-detail-grid">
      {STUDENT_FIELDS.map(({ label, name, editable }) => (
        <Field
          key={name}
          label={label}
          name={name}
          value={values[name]}
          isEditing={isEditing}
          editable={editable}
          onChange={onChange}
          error={errors[name]}
        />
      ))}
    </div>
  );
}
