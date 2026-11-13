import { useSearchParams } from "react-router-dom";
import "./pagination.css";
import { useState } from "react";

export default function Pagination({ students }) {
  const {
    currentPage = 1,
    totalPages = 0,
    totalItems = 0,
  } = students?.meta ?? {};
  const [serchParams, setSeatchParams] = useSearchParams();
  const [activePage, setActivePage] = useState(currentPage);
  const studentCount = Array.isArray(students)
    ? students.length
    : Array.isArray(students?.data)
    ? students.data.length
    : Array.isArray(students?.students)
    ? students.students.length
    : 0;

  function handlePagButtons(page) {
    setActivePage(page);
    const currentParams = Object.fromEntries(serchParams);
    setSeatchParams({ ...currentParams, page });
  }
  const pages = [];

  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }

  const buttons = pages.map((page, ind) => (
    <button
      className={page === activePage ? "current" : ""}
      key={ind}
      onClick={() => handlePagButtons(page)}
    >
      {page}
    </button>
  ));
  return (
    <>
      {(totalItems > 10 || studentCount > 0) && (
        <div className="pagination-buttons">{buttons}</div>
      )}
    </>
  );
}
