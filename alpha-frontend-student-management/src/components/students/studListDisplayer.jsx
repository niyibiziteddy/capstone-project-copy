import apiClient from "../../api/client";
import { Link } from "react-router-dom";
import { FaEye } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import { toast } from "react-toastify";
import { useSearchParams } from "react-router-dom";

export default function StudListDisplayer({ student, profile_url }) {
  const [searchParams, setSearchParams] = useSearchParams(false);
  async function handleDelete(studId) {
    const currentParams = Object.fromEntries(searchParams);
    console.log(typeof studId, studId);
    const success = window.confirm(
      `Do you want to delete the student with id ${studId}?`,
    );
    if (!success) return;
    try {
      const result = await apiClient.delete(`/${studId}`);
      console.log(result.data.success);
      result.data.success &&
        toast.success("Student Deleted Sucessfully", { autoClose: 2000 });
      setSearchParams({ ...currentParams });
    } catch (error) {
      console.log(error);
      toast.error("Error occured on deletion, try again", { autoClose: 2000 });
    }
  }
  return (
    <>
      <tr>
        <td data-label="Student">
          <div className="profile">
            <img src={profile_url} alt="" />
            <p>
              {student.firstName} {student.lastName}
            </p>
          </div>
        </td>
        <td data-label="Student ID">{student.studentId}</td>
        <td data-label="Enrollment date">
          {student.enrollmentDate.split("T")[0]}
        </td>
        <td data-label="Status">{student.status}</td>
        <td data-label="Action">
          <div style={{ display: "flex", gap: "15px", height: "30px" }}>
            <MdDeleteForever
              onClick={() => handleDelete(Number(student.id))}
              size="1.3rem"
              color="red"
              style={{ cursor: "pointer" }}
            />
            <Link to={`/students/${student.id}`}>
              <FaEye
                size="1.3rem"
                color="black"
                style={{ cursor: "pointer" }}
              />
            </Link>
          </div>
        </td>
      </tr>
    </>
  );
}
