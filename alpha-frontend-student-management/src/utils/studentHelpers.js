export function getFullName(student) {
  return student ? `${student.firstName} ${student.lastName}` : "";
}

export function getInitials(student) {
  if (!student) return "";
  return `${student.firstName?.[0] ?? ""}${student.lastName?.[0] ?? ""}`.toUpperCase();
}

export function formatToday() {
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "short",
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date());
}
