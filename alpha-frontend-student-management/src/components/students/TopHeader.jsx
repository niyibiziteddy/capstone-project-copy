import { useState } from "react";
import "./TopHeader.css";
import { useNavigate, useSearchParams } from "react-router-dom";
import { MdSearch } from "react-icons/md";

export default function TopHeader() {
  const navigate = useNavigate();
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [isSearched, setIsSearched] = useState(false);
  const [searchStud, setSearchStud] = useState("");
  const [studRes, setStudRes] = useState("");
  const [isStatusOpen, setIsStatusOpen] = useState(false);

  function handleFilter(type, order) {
    setIsSortOpen(false);
    const currentParams = Object.fromEntries(searchParams);
    setSearchParams({ ...currentParams, sortBy: type, sortOrder: order });
  }

  function handleStatus(status) {
    setIsStatusOpen(false);
    const currentParams = Object.fromEntries(searchParams);
    setSearchParams({ ...currentParams, status: status });
  }
  function handleSubmit(e) {
    console.log(searchParams);
    const result = e.target.firstElementChild.value;
    const currentParams = Object.fromEntries(searchParams);
    setStudRes(result);
    setIsSearched(true);
    setSearchParams({ ...currentParams, search: result, page: 1 });
    setSearchStud("");
    e.preventDefault();
  }
  function handleAllStudent() {
    setIsSearched(false);
    setSearchParams({});
  }
  return (
    <>
      <div className="top-header">
        {isSortOpen && (
          <div className="cover" onClick={() => setIsSortOpen(false)}></div>
        )}
        <div className="upper-layer">
          <h1>All Students</h1>
          <form onSubmit={(e) => handleSubmit(e)}>
            <input
              type="text"
              name=""
              id=""
              value={searchStud}
              onChange={(e) => setSearchStud(e.target.value)}
            />
            <button className="search-btn" type="submit">
              <MdSearch />
            </button>
          </form>
          <button
            className="add-students"
            onClick={() => navigate("/students/add")}
          >
            Add student
          </button>
        </div>
        <div className="filter-options">
          {isSearched && <div className="results">Results for {studRes}</div>}
          <button onClick={() => handleAllStudent()} className="all-button">
            All Students
          </button>
          <button
            onClick={() => setIsSortOpen(!isSortOpen)}
            className="sort-by"
          >
            SortBy
          </button>
          <button
            onClick={() => setIsStatusOpen(!isStatusOpen)}
            className="sort-by"
          >
            status
          </button>
          <div
            style={{ display: `${isStatusOpen ? "flex" : "none"}` }}
            className="options"
          >
            <h3 onClick={() => handleStatus("active")} className="filters">
              Active
            </h3>
            <h3 onClick={() => handleStatus("inactive")} className="filters">
              Inactive
            </h3>
            <h3 onClick={() => handleStatus("graduated")} className="filters">
              Graduated
            </h3>
          </div>
          <div
            style={{ display: `${isSortOpen ? "flex" : "none"}` }}
            className="options"
          >
            <h3 onClick={() => handleFilter("name", "asc")} className="filters">
              Name{" "}
              <span style={{ fontWeight: "200", fontSize: "0.8rem" }}>A-Z</span>
            </h3>
            <h3
              onClick={() => handleFilter("name", "desc")}
              className="filters"
            >
              Name{" "}
              <span style={{ fontWeight: "200", fontSize: "0.8rem" }}>Z-A</span>
            </h3>
            <h3
              onClick={() => handleFilter("enrollment_date", "desc")}
              className="filters"
            >
              Enrollment-date{" "}
              <span style={{ fontWeight: "200", fontSize: "0.8rem" }}>
                Newest First
              </span>
            </h3>
            <h3
              onClick={() => handleFilter("enrollment_date", "asc")}
              className="filters"
            >
              Enrollment-date{" "}
              <span style={{ fontWeight: "200", fontSize: "0.8rem" }}>
                Oldest first
              </span>
            </h3>
          </div>
        </div>
      </div>
    </>
  );
}
