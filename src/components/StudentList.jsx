// src/components/StudentList.jsx
import React, { useMemo, useState } from "react";

export default function StudentList({ students, onView, onEdit, onDelete }) {
  const [search, setSearch] = useState("");
  const [cityFilter, setCityFilter] = useState("all");

  const cities = useMemo(() => {
    const set = new Set();
    students.forEach((s) => s.city && set.add(s.city));
    return Array.from(set);
  }, [students]);

  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      const matchesSearch =
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.email.toLowerCase().includes(search.toLowerCase());

      const matchesCity =
        cityFilter === "all" ? true : s.city === cityFilter;

      return matchesSearch && matchesCity;
    });
  }, [students, search, cityFilter]);

  return (
    <section className="student-section">
      <div className="student-toolbar">
        <input
          type="text"
          className="search-input"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="filter-select"
          value={cityFilter}
          onChange={(e) => setCityFilter(e.target.value)}
        >
          <option value="all">All Cities</option>
          {cities.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
      </div>

      {filteredStudents.length === 0 ? (
        <div className="status-card">No students found.</div>
      ) : (
        <div className="student-grid">
          {filteredStudents.map((student) => (
            <article key={student.id} className="student-card">
              <div className="avatar-circle">
                {student.name
                  .split(" ")
                  .map((part) => part[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase()}
              </div>
              <div className="student-info">
                <h2 className="student-name">{student.name}</h2>
                <p className="student-email">{student.email}</p>
                <p className="student-meta">
                  <span>{student.city || "No City"}</span> •{" "}
                  <span>{student.company || "No Company"}</span>
                </p>
              </div>

              <div className="student-actions">
                <button
                  className="btn btn-view"
                  onClick={() => onView(student)}
                >
                  View
                </button>
                <button
                  className="btn btn-edit"
                  onClick={() => onEdit(student)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-delete"
                  onClick={() => onDelete(student.id)}
                >
                  Delete
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
