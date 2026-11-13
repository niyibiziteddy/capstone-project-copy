import { useState } from "react";
import { useLoaderData, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import apiClient from "../api/client";
import logo from "../assets/logo.png";
import "./StudentForm.css";
import profile_url from "../assets/profile_url.jpg";

const emptyStudent = {
  studentId: "",
  firstName: "",
  lastName: "",
  email: "",
  contactNumber: "",
  dateOfBirth: "",
  enrollmentDate: "",
  status: "",
  profilePicture: "",
};

function today() {
  return new Date().toISOString().slice(0, 10);
}

function checkStudent(student, isEdit) {
  const errors = {};

  if (!isEdit) {
    if (student.studentId.trim() === "") {
      errors.studentId = "Enter a student ID.";
    } else if (!/^\d+$/.test(student.studentId.trim())) {
      errors.studentId = "Student ID must contain only numbers.";
    }
  }
  if (student.firstName.trim().length < 2) {
    errors.firstName = "First name must be at least 2 characters.";
  } else if (student.firstName.trim().length > 50) {
    errors.firstName = "First name must not exceed 50 characters.";
  }
  if (student.lastName.trim().length < 2) {
    errors.lastName = "Last name must be at least 2 characters.";
  } else if (student.lastName.trim().length > 50) {
    errors.lastName = "Last name must not exceed 50 characters.";
  }
  if (!student.email.includes("@") || !student.email.includes(".")) {
    errors.email = "Email must be a full address, such as name@gmail.com.";
  }
  if (student.contactNumber.trim() === "") {
    errors.contactNumber = "Enter a contact number.";
  }
  if (student.dateOfBirth === "") {
    errors.dateOfBirth = "Enter a date of birth.";
  } else if (student.dateOfBirth > today()) {
    errors.dateOfBirth = "Date of birth must not be in the future.";
  }
  if (student.enrollmentDate === "") {
    errors.enrollmentDate = "Enter an enrollment date.";
  } else if (
    student.dateOfBirth &&
    student.enrollmentDate <= student.dateOfBirth
  ) {
    errors.enrollmentDate = "Enrollment date must be after the date of birth.";
  }

  return errors;
}

function parseServerError(error) {
  if (!error.response) {
    return {
      message:
        "Could not reach the server. Check your connection and try again.",
      fieldErrors: {},
    };
  }

  const data = error.response.data || {};
  const fieldErrors = {};
  const extraMessages = [];

  const rawDetails = data.details || data.errors;

  if (Array.isArray(rawDetails)) {
    for (const item of rawDetails) {
      if (item && typeof item === "object") {
        const rawField = item.field || item.path || item.param || "";
        const msg = String(item.message || item.msg || JSON.stringify(item));
        if (rawField === "firstName" || rawField === "first_name")
          fieldErrors.firstName = msg;
        else if (rawField === "lastName" || rawField === "last_name")
          fieldErrors.lastName = msg;
        else if (rawField === "email") fieldErrors.email = msg;
        else if (rawField === "contactNumber" || rawField === "contact_number")
          fieldErrors.contactNumber = msg;
        else if (rawField === "studentId" || rawField === "student_id")
          fieldErrors.studentId = msg;
        else if (rawField === "dateOfBirth" || rawField === "date_of_birth")
          fieldErrors.dateOfBirth = msg;
        else if (
          rawField === "enrollmentDate" ||
          rawField === "enrollment_date"
        )
          fieldErrors.enrollmentDate = msg;
        else if (rawField in emptyStudent) fieldErrors[rawField] = msg;
        else extraMessages.push(msg);
        continue;
      }

      const text = String(item);
      const lower = text.toLowerCase();
      if (
        lower.includes("first_name") ||
        lower.includes("firstname") ||
        lower.includes("first name")
      ) {
        fieldErrors.firstName = text;
      } else if (
        lower.includes("last_name") ||
        lower.includes("lastname") ||
        lower.includes("last name")
      ) {
        fieldErrors.lastName = text;
      } else if (lower.includes("email")) {
        fieldErrors.email =
          lower.includes("taken") ||
          lower.includes("already") ||
          lower.includes("exists") ||
          lower.includes("unique")
            ? "This email is already taken."
            : text;
      } else if (
        lower.includes("contact_number") ||
        lower.includes("contactnumber") ||
        lower.includes("contact number")
      ) {
        fieldErrors.contactNumber =
          lower.includes("taken") ||
          lower.includes("already") ||
          lower.includes("exists") ||
          lower.includes("unique")
            ? "This contact number is already taken."
            : text;
      } else if (
        lower.includes("student_id") ||
        lower.includes("studentid") ||
        lower.includes("student id")
      ) {
        fieldErrors.studentId =
          lower.includes("taken") ||
          lower.includes("already") ||
          lower.includes("exists") ||
          lower.includes("unique")
            ? "This student ID is already taken."
            : text;
      } else if (
        lower.includes("date_of_birth") ||
        lower.includes("dateofbirth") ||
        lower.includes("date of birth")
      ) {
        fieldErrors.dateOfBirth = text;
      } else if (
        lower.includes("enrollment_date") ||
        lower.includes("enrollmentdate") ||
        lower.includes("enrollment date")
      ) {
        fieldErrors.enrollmentDate = text;
      } else {
        extraMessages.push(text);
      }
    }
  } else if (typeof rawDetails === "string" && rawDetails) {
    extraMessages.push(rawDetails);
  } else if (rawDetails && typeof rawDetails === "object") {
    for (const [key, value] of Object.entries(rawDetails)) {
      if (key === "first_name") fieldErrors.firstName = String(value);
      else if (key === "last_name") fieldErrors.lastName = String(value);
      else if (key === "contact_number")
        fieldErrors.contactNumber = String(value);
      else if (key === "student_id") fieldErrors.studentId = String(value);
      else if (key === "date_of_birth") fieldErrors.dateOfBirth = String(value);
      else if (key === "enrollment_date")
        fieldErrors.enrollmentDate = String(value);
      else if (key in emptyStudent) {
        fieldErrors[key] = String(value);
      } else {
        extraMessages.push(`${key}: ${value}`);
      }
    }
  }

  const detailSummary = [
    ...Object.entries(fieldErrors).map(([key, msg]) => `${key}: ${msg}`),
    ...extraMessages,
  ].join(" ");

  return {
    message: detailSummary
      ? `${data.message || "Validation failed."} (${detailSummary})`
      : data.message || "The server rejected this student.",
    fieldErrors,
  };
}

function formatStudent(saved) {
  if (!saved || saved.loadError) return emptyStudent;

  return {
    studentId: saved.studentId || "",
    firstName: saved.firstName || "",
    lastName: saved.lastName || "",
    email: saved.email || "",
    contactNumber: saved.contactNumber || "",
    dateOfBirth: String(saved.dateOfBirth || "").slice(0, 10),
    enrollmentDate: String(saved.enrollmentDate || "").slice(0, 10),
    status: saved.status || "",
    profilePicture: saved.profilePicture || profile_url,
  };
}

// student loader
export async function studentLoader({ params }) {
  try {
    console.log(params);
    const response = await apiClient.get("/" + params.id);
    return response.data.data;
  } catch (error) {
    return { loadError: parseServerError(error).message };
  }
}

export default function StudentForm({ mode = "add", id }) {
  const isEdit = mode === "edit";
  const navigate = useNavigate();
  const loadedStudent = useLoaderData();
  const [student, setStudent] = useState(() =>
    isEdit ? formatStudent(loadedStudent) : emptyStudent,
  );
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState(loadedStudent?.loadError || "");
  const [messageType, setMessageType] = useState(
    loadedStudent?.loadError ? "error" : "",
  );
  const [saving, setSaving] = useState(false);

  function updateField(event) {
    const fieldName = event.target.name;
    const fieldValue = event.target.value;

    setStudent({ ...student, [fieldName]: fieldValue });
    setErrors({ ...errors, [fieldName]: "" });
    setMessage("");
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");

    const foundErrors = checkStudent(student, isEdit);
    setErrors(foundErrors);
    if (Object.keys(foundErrors).length > 0) return;

    const studentData = {
      firstName: student.firstName.trim(),
      lastName: student.lastName.trim(),
      email: student.email.trim(),
      contactNumber: student.contactNumber.trim(),
      dateOfBirth: student.dateOfBirth,
      enrollmentDate: student.enrollmentDate,
      status: student.status || "Active",
      profilePicture: student.profilePicture.trim() || profile_url,
    };

    setSaving(true);
    try {
      let response;
      if (isEdit) {
        response = await apiClient.put("/" + id, studentData);
        toast.success(response.data.message || "Student updated.", {
          autoClose: 2000,
        });
      } else {
        response = await apiClient.post("/", {
          studentId: student.studentId.trim(),
          ...studentData,
        });
        toast.success(response.data.message || "Student added.", {
          autoClose: 2000,
        });
        setStudent(emptyStudent);
      }
      setMessageType("success");
      navigate("/students");
    } catch (error) {
      // Keep the typed values, highlight the invalid fields in red, and show why the save failed.
      const parsed = parseServerError(error);
      setErrors((current) => ({ ...current, ...parsed.fieldErrors }));
      setMessage(parsed.message);
      setMessageType("error");
    } finally {
      setSaving(false);
    }
  }

  const busy = saving;

  return (
    <div className="student-modal-backdrop">
      <section
        className="student-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="student-form-title"
      >
        <header className="student-modal-header">
          <div className="student-modal-brand">
            <img src={logo} alt="" />
            <span>STUDENTSYNC</span>
          </div>
          <h1 id="student-form-title">
            {isEdit ? "Edit student" : "Add new student"}
          </h1>
        </header>

        <form className="student-modal-form" onSubmit={handleSubmit} noValidate>
          {message && <p className={"form-banner " + messageType}>{message}</p>}

          <div className="form-row">
            <Input
              label="First Name"
              name="firstName"
              value={student.firstName}
              onChange={updateField}
              error={errors.firstName}
              disabled={busy}
            />
            <Input
              label="Last Name"
              name="lastName"
              value={student.lastName}
              onChange={updateField}
              error={errors.lastName}
              disabled={busy}
            />
          </div>
          <div className="form-row">
            <Input
              label="Date Of Birth"
              name="dateOfBirth"
              type="date"
              value={student.dateOfBirth}
              onChange={updateField}
              error={errors.dateOfBirth}
              disabled={busy}
              max={today()}
            />
            <Input
              label="Student ID"
              name="studentId"
              value={student.studentId}
              onChange={updateField}
              error={errors.studentId}
              disabled={busy}
              readOnly={isEdit}
            />
          </div>
          <Input
            label="Email"
            name="email"
            type="email"
            value={student.email}
            onChange={updateField}
            error={errors.email}
            disabled={busy}
          />
          <Input
            label="Contact Number"
            name="contactNumber"
            type="tel"
            value={student.contactNumber}
            onChange={updateField}
            error={errors.contactNumber}
            disabled={busy}
          />
          <Input
            label="Enrollment date"
            name="enrollmentDate"
            type="date"
            value={student.enrollmentDate}
            onChange={updateField}
            error={errors.enrollmentDate}
            disabled={busy}
            min={student.dateOfBirth || undefined}
          />

          <div className="form-actions">
            <button className="btn-add" type="submit" disabled={busy}>
              {saving ? "Saving..." : isEdit ? "Save" : "Add"}
            </button>
            <button
              className="btn-cancel"
              type="button"
              onClick={() => navigate("/students")}
              disabled={saving}
            >
              Cancel
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

function Input({
  label,
  name,
  type = "text",
  value,
  onChange,
  error,
  disabled,
  readOnly,
  min,
  max,
}) {
  return (
    <label
      className={"modal-field" + (error ? " has-error" : "")}
      htmlFor={name}
    >
      <span className="label">{label}</span>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        disabled={disabled}
        readOnly={readOnly}
        min={min}
        max={max}
        aria-invalid={Boolean(error)}
      />
      {error && <span className="field-error">{error}</span>}
    </label>
  );
}
