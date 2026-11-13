import { useLoaderData, useNavigate, useParams } from "react-router-dom";
import apiClient from "../api/client";
import "./AllStudents.css"

export async function studentDetailsLoader( {params} ) {
  try {
    const response = await apiClient.get("/" + params.id)
    return response.data.data || response.data
  } catch (error) {
    if (error.response?.status === 400) {
      return { loadError: "Student record not found. They may have been deleted." };
    }
    return {
      loadError: error.response?.data?.message || "Could not reach the server. Please check your connection."
    };
  }
}


export default function StudentDetails() {
  const { id } = useParams();
  const student = useLoaderData();
  const navigate = useNavigate();

  if(student?.loadError) {
    return(
      <div className="error-banner-card">
        <h3>Unable to Load Student Details</h3>
        <p>{student.loadError}</p>
        <button className="error-retry-btn">
          Back to Student Roster
        </button>
      </div>
    )
  }
  return (
    <>
      <h1>Data for the student {id}</h1>
    </>
  );
}
