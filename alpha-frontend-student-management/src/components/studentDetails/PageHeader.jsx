import { formatToday } from "../../utils/studentHelpers";

export default function PageHeader() {
  return (
    <header className="student-detail-header">
      <div className="student-detail-welcome-block">
        <h1 className="student-detail-welcome">Welcome</h1>
        <p className="student-detail-current-date">{formatToday()}</p>
      </div>
      <label className="student-detail-search">
        <svg
          aria-hidden="true"
          className="student-detail-search-icon"
          viewBox="0 0 24 24"
          fill="none"
        >
          <circle cx="10.8" cy="10.8" r="6.3" />
          <path d="m15.4 15.4 4.1 4.1" />
        </svg>
        <input type="search" aria-label="Search" placeholder="Search" />
      </label>
    </header>
  );
}
