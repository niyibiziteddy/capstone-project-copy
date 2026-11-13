import profile_url from "../../assets/profile_url.jpg";
import "./Table.css";
import StudListDisplayer from "./studListDisplayer";
import { useSearchParams, useNavigate } from "react-router-dom";
import apiClient from "../../api/client";

export default function Table({ students }) {
  const studentsList = Array.isArray(students)
    ? students
    : Array.isArray(students?.data)
      ? students.data
      : Array.isArray(students?.students)
        ? students.students
        : Array.isArray(students?.data?.students)
          ? students.data.students
          : [];

  const [searchParams] = useSearchParams();
  const { search } = Object.fromEntries(searchParams);
  const navigate = useNavigate();

  return (
    <>
      {studentsList.length === 0 && !search && (
        <div className="empty-state-card">
          <h3>No Students Found</h3>
          <p>There are no student records registered in the system yet.</p>
          <button
            className="btn-add-empty"
            onClick={() => navigate("/students/add")}
          >
            Add First Student
          </button>
        </div>
      )}
      {(studentsList.length !== 0 || search) && (
        <div className="all-students-table-container">
          <table className="all-students-table">
            <thead>
              <tr>
                <th>User name</th>
                <th>Student Id</th>
                <th>Enrollment date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {studentsList.map((student) => (
                <StudListDisplayer
                  key={student.studentId || student._id}
                  student={student}
                  profile_url={
                    student.profilePicture
                      ? student.profilePicture
                      : profile_url
                  }
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
      {studentsList.length === 0 && search && (
        <h1 style={{ textAlign: "center" }}>No results for {search}</h1>
      )}
    </>
  );
}

export async function studentsLoader({ request }) {
  try {
    const url = new URL(request.url);
    console.log(url);
    const response = await apiClient.get(url.search);
    return response.data;
  } catch (error) {
    console.error("studentsLoader error:", error);
    return {
      loadError:
        error.customMessage ||
        error.response?.data?.message ||
        "Could not connect to the server. Please check your network and try again.",
    };
  }
}
