import TopHeader from "../components/students/TopHeader";
import Table from "../components/students/Table";
import Pagination from "../components/students/Pagination";
import Footer from "../components/Footer";
import { useLoaderData, useNavigate } from "react-router-dom";
import "./AllStudents.css";

export default function AllStudents() {
  const loaderData = useLoaderData();
  const navigate = useNavigate();
  if (loaderData?.loadError) {
    return (
      <>
        <TopHeader />
        <div className="error-banner-card">
          <h3>Connection Failed</h3>
          <p>{loaderData.loadError}</p>
          <button
            className="error-retry-btn"
            onClick={() => window.location.reload()}
          >
            Retry Connection
          </button>
        </div>
      </>
    );
  }

  const studentsData = loaderData?.data ?? [];

  return (
    <>
      <TopHeader />
      <Table students={studentsData} />
      <Pagination students={loaderData} />
      <Footer />
    </>
  );
}
