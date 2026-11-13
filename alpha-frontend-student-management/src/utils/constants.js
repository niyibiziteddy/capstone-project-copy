export const REQUIRED_FIELDS = [
  "studentId",
  "firstName",
  "lastName",
  "dateOfBirth",
  "contactNumber",
  "enrollmentDate",
  "status",
];

// Drives the details grid. Add/remove a field here and the UI follows.
export const STUDENT_FIELDS = [
  { label: "First Name", name: "firstName" },
  { label: "Last Name", name: "lastName" },
  { label: "Student Id", name: "studentId", editable: false },
  { label: "Email", name: "email" },
  { label: "Date of Birth", name: "dateOfBirth" },
  { label: "Contact Number", name: "contactNumber" },
  { label: "Enrollment Date", name: "enrollmentDate" },
  { label: "Status", name: "status" },
];

export const INCOMPLETE_DATA_MESSAGE =
  "The backend returned incomplete student details. Restart the backend; if this continues, check its student field mapping and database columns.";

export const SERVER_UNREACHABLE_MESSAGE =
  "Cannot reach the server. Is the backend running?";
