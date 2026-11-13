import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import apiClient from "../api/client";
import "./StudentDetail.css";

import PageHeader from "../components/studentDetails/PageHeader";
import StatusMessage from "../components/studentDetails/StatusMessage";
import StudentProfile from "../components/studentDetails/StudentProfile";
import StudentFields from "../components/studentDetails/StudentFields";
import StudentEmailSection from "../components/studentDetails/StudentEmailSection";
import DeleteConfirmDialog from "../components/studentDetails/DeleteConfirmDialog";

import useStudent from "../hooks/useStudent";
import useStudentEdit from "../hooks/useStudentEdit";
import useDeleteStudent from "../hooks/useDeleteStudent";
import { getFullName } from "../utils/studentHelpers";

const VALID_STATUSES = ["active", "inactive", "graduated", "suspended"];

function today() {
  return new Date().toISOString().slice(0, 10);
}

function validateStudentDraft(draft) {
  const errors = {};
  const firstName = String(draft.firstName || "").trim();
  const lastName = String(draft.lastName || "").trim();
  const email = String(draft.email || "").trim();
  const contactNumber = String(draft.contactNumber || "").trim();
  const dateOfBirth = String(draft.dateOfBirth || "").slice(0, 10);
  const enrollmentDate = String(draft.enrollmentDate || "").slice(0, 10);
  const status = String(draft.status || "").trim();

  if (firstName.length < 2) {
    errors.firstName = "First name must be at least 2 characters.";
  } else if (firstName.length > 50) {
    errors.firstName = "First name must not exceed 50 characters.";
  }

  if (lastName.length < 2) {
    errors.lastName = "Last name must be at least 2 characters.";
  } else if (lastName.length > 50) {
    errors.lastName = "Last name must not exceed 50 characters.";
  }

  if (!email.includes("@") || !email.includes(".")) {
    errors.email = "Email must be a full address, such as name@gmail.com.";
  }

  if (!contactNumber) {
    errors.contactNumber = "Enter a contact number.";
  }

  if (!dateOfBirth) {
    errors.dateOfBirth = "Enter a date of birth.";
  } else if (dateOfBirth > today()) {
    errors.dateOfBirth = "Date of birth must not be in the future.";
  }

  if (!enrollmentDate) {
    errors.enrollmentDate = "Enter an enrollment date.";
  } else if (dateOfBirth && enrollmentDate <= dateOfBirth) {
    errors.enrollmentDate = "Enrollment date must be after the date of birth.";
  }

  if (!status) {
    errors.status =
      "Enter a status (Active, Inactive, Graduated, or Suspended).";
  } else if (!VALID_STATUSES.includes(status.toLowerCase())) {
    errors.status =
      "Invalid status. Must be Active, Inactive, Graduated, or Suspended.";
  }

  return errors;
}

function parseDetailServerError(err) {
  if (!err.response) {
    return {
      message:
        err.customMessage ||
        "Could not reach the server. Please check your connection.",
      fieldErrors: {},
    };
  }

  const data = err.response.data || {};
  const fieldErrors = {};
  const extraMessages = [];
  const rawDetails = data.details || data.errors;

  const mapKey = (rawKey) => {
    const k = String(rawKey || "").toLowerCase();
    if (
      k.includes("first_name") ||
      k.includes("firstname") ||
      k.includes("first name")
    )
      return "firstName";
    if (
      k.includes("last_name") ||
      k.includes("lastname") ||
      k.includes("last name")
    )
      return "lastName";
    if (k.includes("email")) return "email";
    if (
      k.includes("contact_number") ||
      k.includes("contactnumber") ||
      k.includes("contact number")
    )
      return "contactNumber";
    if (
      k.includes("student_id") ||
      k.includes("studentid") ||
      k.includes("student id")
    )
      return "studentId";
    if (
      k.includes("date_of_birth") ||
      k.includes("dateofbirth") ||
      k.includes("date of birth")
    )
      return "dateOfBirth";
    if (
      k.includes("enrollment_date") ||
      k.includes("enrollmentdate") ||
      k.includes("enrollment date")
    )
      return "enrollmentDate";
    if (k.includes("status")) return "status";
    return null;
  };

  if (Array.isArray(rawDetails)) {
    for (const item of rawDetails) {
      if (item && typeof item === "object") {
        const rawField = item.field || item.path || item.param || "";
        const msg = String(item.message || item.msg || JSON.stringify(item));
        const mapped = mapKey(rawField) || mapKey(msg);
        if (mapped) fieldErrors[mapped] = msg;
        else extraMessages.push(msg);
      } else {
        const text = String(item);
        const mapped = mapKey(text);
        if (mapped) fieldErrors[mapped] = text;
        else extraMessages.push(text);
      }
    }
  } else if (typeof rawDetails === "string" && rawDetails) {
    const mapped = mapKey(rawDetails);
    if (mapped) fieldErrors[mapped] = rawDetails;
    else extraMessages.push(rawDetails);
  } else if (rawDetails && typeof rawDetails === "object") {
    for (const [key, value] of Object.entries(rawDetails)) {
      const mapped = mapKey(key);
      if (mapped) fieldErrors[mapped] = String(value);
      else extraMessages.push(`${key}: ${value}`);
    }
  }

  const detailSummary = [
    ...Object.entries(fieldErrors).map(([key, msg]) => `${key}: ${msg}`),
    ...extraMessages,
  ].join(" | ");

  const baseMsg =
    data.message || err.customMessage || "Could not update student details.";

  return {
    message: detailSummary ? `${baseMsg} (${detailSummary})` : baseMsg,
    fieldErrors,
  };
}

export async function studentDetailsLoader({ params }) {
  try {
    const response = await apiClient.get("/" + params.id);
    return response.data.data || response.data;
  } catch (error) {
    if (error.response?.status === 400) {
      return {
        loadError: "Student record not found. They may have been deleted.",
      };
    }
    return {
      loadError:
        error.response?.data?.message ||
        "Could not reach the server. Please check your connection.",
    };
  }
}

export default function StudentDetail() {
  const navigate = useNavigate();
  const { id } = useParams();

  const { student, setStudent, loading, error, notFound } = useStudent(id);
  const { isEditing, current, startEdit, cancelEdit, handleChange } =
    useStudentEdit(student);
  const {
    showConfirm,
    openConfirm,
    closeConfirm,
    deleting,
    actionError,
    handleDelete,
  } = useDeleteStudent(id);

  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});

  function onFieldChange(e) {
    const { name } = e.target;
    handleChange(e);
    setFieldErrors((prev) => ({ ...prev, [name]: "" }));
    setSaveError(null);
  }

  async function handleSave() {
    if (!current) return;
    setSaveError(null);

    const clientErrors = validateStudentDraft(current);
    setFieldErrors(clientErrors);
    if (Object.keys(clientErrors).length > 0) {
      const summary = Object.entries(clientErrors)
        .map(([key, msg]) => `${key}: ${msg}`)
        .join(" | ");
      setSaveError(`Validation failed: ${summary}`);
      return;
    }

    setSaving(true);

    const normalizedStatus =
      current.status.trim().charAt(0).toUpperCase() +
      current.status.trim().slice(1).toLowerCase();

    const payload = {
      firstName: String(current.firstName || "").trim(),
      lastName: String(current.lastName || "").trim(),
      email: String(current.email || "").trim(),
      contactNumber: String(current.contactNumber || "").trim(),
      dateOfBirth: String(current.dateOfBirth || "").slice(0, 10),
      enrollmentDate: String(current.enrollmentDate || "").slice(0, 10),
      status: normalizedStatus,
      profilePicture:
        String(current.profilePicture || "").trim() ||
        "https://example.com/default-profile.png",
    };

    try {
      const response = await apiClient.put(`/${id}`, payload);
      const savedData = response.data?.data || { ...student, ...payload };
      setStudent({
        ...savedData,
        dateOfBirth: String(savedData.dateOfBirth || "").slice(0, 10),
        enrollmentDate: String(savedData.enrollmentDate || "").slice(0, 10),
      });
      setFieldErrors({});
      cancelEdit();
      toast.success(response.data?.message || "Student updated.", {
        autoClose: 2000,
      });
    } catch (err) {
      const parsed = parseDetailServerError(err);
      setFieldErrors((prev) => ({ ...prev, ...parsed.fieldErrors }));
      setSaveError(parsed.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="student-detail-page">
      <PageHeader />

      <section className="student-detail-card" aria-label="Student details">
        <div className="student-detail-banner" />

        <div className="student-detail-card-body">
          {loading && <StatusMessage>Loading student...</StatusMessage>}

          {!loading && notFound && (
            <StatusMessage>
              Student not found. Check the id and try again.
            </StatusMessage>
          )}

          {!loading && error && <StatusMessage isError>{error}</StatusMessage>}

          {student && (
            <>
              <StudentProfile
                student={student}
                isEditing={isEditing}
                saving={saving}
                onEdit={() => {
                  setSaveError(null);
                  setFieldErrors({});
                  startEdit();
                }}
                onCancel={() => {
                  setSaveError(null);
                  setFieldErrors({});
                  cancelEdit();
                }}
                onSave={handleSave}
              />
              {saveError && <StatusMessage isError>{saveError}</StatusMessage>}
              <StudentFields
                values={current}
                isEditing={isEditing}
                onChange={onFieldChange}
                errors={fieldErrors}
              />
              <StudentEmailSection email={student.email} />
            </>
          )}

          {actionError && <StatusMessage isError>{actionError}</StatusMessage>}

          <div className="student-detail-actions">
            <button
              className="student-detail-btn student-detail-btn-secondary"
              type="button"
              onClick={() => navigate("/students")}
            >
              ← Back to list
            </button>

            {student && (
              <button
                className="student-detail-btn student-detail-btn-danger"
                type="button"
                onClick={openConfirm}
                disabled={isEditing}
              >
                Delete
              </button>
            )}
          </div>
        </div>
      </section>

      {showConfirm && (
        <DeleteConfirmDialog
          fullName={getFullName(student)}
          deleting={deleting}
          onCancel={closeConfirm}
          onConfirm={handleDelete}
        />
      )}
    </main>
  );
}
