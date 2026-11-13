import { useRouteError, useNavigate } from "react-router-dom";
import "./AllStudents.css";

export default function ErrorPage() {
  const error = useRouteError();
  const navigate = useNavigate();

  console.error("Route Error caught:", error);

  const errorMessage =
    error?.data?.message ||
    error?.statusText ||
    error?.message ||
    "An unexpected error occurred.";

  return (
    <div className="error-banner-card" style={{ margin: "50px auto", maxWidth: "500px" }}>
      <h2>Oops! Something went wrong.</h2>
      <p>{errorMessage}</p>
      {error?.status && <p><strong>Status:</strong> {error.status}</p>}
      <button className="error-retry-btn" onClick={() => navigate("/students")}>
        Try Again
      </button>
    </div>
  );
}