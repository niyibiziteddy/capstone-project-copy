import { useState } from "react";
import "./StudentProfile.css";

function StudentProfile({ student, variant = "default" }) {
  const [failedImageUrl, setFailedImageUrl] = useState(null);

  if (!student) {
    return <p>Student information not available.</p>;
  }

  const fullName =
    `${student.firstName || ""} ${student.lastName || ""}`.trim();

  const profilePicture = student.profilePicture;

  const showImage = profilePicture && failedImageUrl !== profilePicture;

  return (
    <div className={`student-profile student-profile--${variant}`}>
      <div className="profile-avatar">
        {showImage ? (
          <img
            src={profilePicture}
            alt={`${fullName || "Student"} profile`}
            onError={() => setFailedImageUrl(profilePicture)}
          />
        ) : (
          <div className="default-avatar">
            {student.firstName?.charAt(0)?.toUpperCase() || "S"}
          </div>
        )}
      </div>

      <div className="profile-info">
        <h3>{fullName || "Student Name"}</h3>
        <p>{student.email || "No email available"}</p>
      </div>
    </div>
  );
}

export default StudentProfile;
