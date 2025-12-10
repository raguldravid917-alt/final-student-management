// src/components/StudentProfileModal.jsx
import React from "react";

export default function StudentProfileModal({ student, onClose }) {
  if (!student) return null;

  const urlWithProtocol = (url) => {
    if (!url) return "";
    if (url.startsWith("http")) return url;
    return `https://${url}`;
  };

  return (
    <div className="overlay">
      <div className="profile-card">
        <div className="profile-header">
          <div className="profile-avatar">
            {student.name
              .split(" ")
              .map((p) => p[0])
              .join("")
              .slice(0, 2)
              .toUpperCase()}
          </div>
          <div>
            <h2 className="profile-name">{student.name}</h2>
            <p className="profile-city">{student.city || "No city"}</p>
          </div>
          <button className="close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="profile-body">
          <div className="profile-row">
            <span className="label">Email:</span>
            <span>{student.email}</span>
          </div>
          <div className="profile-row">
            <span className="label">Phone:</span>
            <span>{student.phone || "Not provided"}</span>
          </div>
          <div className="profile-row">
            <span className="label">Website:</span>
            {student.website ? (
              <a
                href={urlWithProtocol(student.website)}
                target="_blank"
                rel="noreferrer"
              >
                {student.website}
              </a>
            ) : (
              <span>Not provided</span>
            )}
          </div>
          <div className="profile-row">
            <span className="label">Company / College:</span>
            <span>{student.company || "Not provided"}</span>
          </div>
        </div>

        <div className="profile-footer">
          <p>Client-side view only. Data from JSONPlaceholder + local edits.</p>
        </div>
      </div>
    </div>
  );
}
