import { useState } from "react";

export default function useStudentEdit(student) {
  const [editState, setEditState] = useState(null);
  const isEditing = editState !== null && editState.student === student;

  function startEdit() {
    setEditState({
      student,
      draft: {
        ...student,
        dateOfBirth: String(student?.dateOfBirth || "").slice(0, 10),
        enrollmentDate: String(student?.enrollmentDate || "").slice(0, 10),
      },
    });
  }

  function cancelEdit() {
    setEditState(null);
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setEditState((prev) =>
      prev?.student === student
        ? { ...prev, draft: { ...prev.draft, [name]: value } }
        : prev,
    );
  }

  const current = isEditing ? editState.draft : student;

  return { isEditing, current, startEdit, cancelEdit, handleChange };
}
