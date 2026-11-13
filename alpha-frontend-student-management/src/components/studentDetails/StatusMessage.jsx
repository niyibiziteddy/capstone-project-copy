export default function StatusMessage({ children, isError = false }) {
  return (
    <p
      className={`student-detail-state${
        isError ? " student-detail-state-error" : ""
      }`}
    >
      {children}
    </p>
  );
}
