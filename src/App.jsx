// src/App.jsx
import React, { useEffect, useState } from "react";

const API_URL = "https://jsonplaceholder.typicode.com/users";

const emptyForm = {
  name: "",
  email: "",
  phone: "",
  city: "",
  company: "",
};

function App() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedStudentId, setSelectedStudentId] = useState(null);

  // Edit state
  const [editingStudent, setEditingStudent] = useState(null);
  const [editForm, setEditForm] = useState(emptyForm);

  // ADD state
  const [adding, setAdding] = useState(false);
  const [addForm, setAddForm] = useState(emptyForm);

  // Fetch students from API (READ only)
  useEffect(() => {
    async function fetchStudents() {
      try {
        setLoading(true);
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error("Failed to fetch students");
        const data = await res.json();

        const mapped = data.map((u) => ({
          id: u.id,
          name: u.name,
          email: u.email,
          phone: u.phone,
          city: u.address?.city || "",
          company: u.company?.name || "",
        }));

        setStudents(mapped);
        setError("");
      } catch (err) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    }

    fetchStudents();
  }, []);

  const selectedStudent =
    students.find((s) => s.id === selectedStudentId) || null;

  /* ---------- VIEW ---------- */
  const handleView = (student) => {
    setSelectedStudentId(student.id);
    setEditingStudent(null);
    setAdding(false);
  };

  /* ---------- EDIT ---------- */
  const handleEditClick = (student) => {
    setSelectedStudentId(student.id);
    setEditingStudent(student);
    setAdding(false);

    setEditForm({
      name: student.name || "",
      email: student.email || "",
      phone: student.phone || "",
      city: student.city || "",
      company: student.company || "",
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSave = (e) => {
    e.preventDefault();

    setStudents((prev) =>
      prev.map((s) =>
        s.id === editingStudent.id ? { ...s, ...editForm } : s
      )
    );

    setEditingStudent(null);
  };

  const handleEditCancel = () => {
    setEditingStudent(null);
  };

  /* ---------- DELETE (LOCAL) ---------- */
  const handleDelete = (id) => {
    const ok = window.confirm("Delete this student locally?");
    if (!ok) return;

    setStudents((prev) => prev.filter((s) => s.id !== id));

    if (selectedStudentId === id) {
      setSelectedStudentId(null);
      setEditingStudent(null);
    }
  };

  /* ---------- ADD NEW STUDENT (LOCAL) ---------- */
  const handleAddClick = () => {
    setAdding(true);
    setEditingStudent(null);
    setSelectedStudentId(null);
    setAddForm(emptyForm);
  };

  const handleAddChange = (e) => {
    const { name, value } = e.target;
    setAddForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddSave = (e) => {
    e.preventDefault();

    // simple validation
    if (!addForm.name.trim() || !addForm.email.trim()) {
      alert("Name and Email are required");
      return;
    }

    const newStudent = {
      id: Date.now(), // local unique ID
      ...addForm,
    };

    setStudents((prev) => [newStudent, ...prev]);
    setAdding(false);
    setSelectedStudentId(newStudent.id);
    setAddForm(emptyForm);
  };

  const handleAddCancel = () => {
    setAdding(false);
    setAddForm(emptyForm);
  };

  return (
    <div className="page">
      <header className="header">
        <div>
          <h1>Student Management </h1>
          <p>
            • users • List • View • Add  • Edit  •
            Delete 
          </p>
        </div>
        <button className="btn add-header" onClick={handleAddClick}>
          + Add Student
        </button>
      </header>

      {loading && <div className="status info">Loading students...</div>}
      {error && <div className="status error">Error: {error}</div>}

      {!loading && !error && (
        <div className="layout">
          {/* LEFT SIDE – LIST */}
          <section className="list-panel">
            <h2>Students ({students.length})</h2>
            <ul className="student-list">
              {students.map((student) => (
                <li
                  key={student.id}
                  className={
                    "student-item" +
                    (student.id === selectedStudentId ? " active" : "")
                  }
                >
                  <div className="avatar">
                    {student.name
                      .split(" ")
                      .map((p) => p[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase()}
                  </div>
                  <div className="info">
                    <div className="name">{student.name}</div>
                    <div className="email">{student.email}</div>
                    <div className="meta">
                      {student.city || "Unknown city"} •{" "}
                      {student.company || "No company"}
                    </div>
                  </div>
                  <div className="actions">
                    <button
                      className="btn view"
                      onClick={() => handleView(student)}
                    >
                      View
                    </button>
                    <button
                      className="btn edit"
                      onClick={() => handleEditClick(student)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn delete"
                      onClick={() => handleDelete(student.id)}
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          {/* RIGHT SIDE – PROFILE / EDIT / ADD */}
          <section className="detail-panel">
            {!selectedStudent && !editingStudent && !adding && (
              <div className="placeholder">
                👈 select student from Left side or{" "}
                <strong>“Add Student”</strong> use the button.
              </div>
            )}

            {/* View Profile */}
            {selectedStudent && !editingStudent && !adding && (
              <div className="profile-card">
                <h2>Profile</h2>
                <p>
                  <strong>Name:</strong> {selectedStudent.name}
                </p>
                <p>
                  <strong>Email:</strong> {selectedStudent.email}
                </p>
                <p>
                  <strong>Phone:</strong> {selectedStudent.phone}
                </p>
                <p>
                  <strong>City:</strong>{" "}
                  {selectedStudent.city || "Not set"}
                </p>
                <p>
                  <strong>Company:</strong>{" "}
                  {selectedStudent.company || "Not set"}
                </p>

                <button
                  className="btn edit wide"
                  onClick={() => handleEditClick(selectedStudent)}
                >
                  Edit This Student
                </button>
              </div>
            )}

            {/* Edit Form */}
            {editingStudent && !adding && (
              <div className="profile-card">
                <h2>Edit Student (Local Only)</h2>
                <form onSubmit={handleEditSave} className="edit-form">
                  <label>
                    Name
                    <input
                      type="text"
                      name="name"
                      value={editForm.name}
                      onChange={handleEditChange}
                      required
                    />
                  </label>
                  <label>
                    Email
                    <input
                      type="email"
                      name="email"
                      value={editForm.email}
                      onChange={handleEditChange}
                      required
                    />
                  </label>
                  <label>
                    Phone
                    <input
                      type="text"
                      name="phone"
                      value={editForm.phone}
                      onChange={handleEditChange}
                    />
                  </label>
                  <label>
                    City
                    <input
                      type="text"
                      name="city"
                      value={editForm.city}
                      onChange={handleEditChange}
                    />
                  </label>
                  <label>
                    Company
                    <input
                      type="text"
                      name="company"
                      value={editForm.company}
                      onChange={handleEditChange}
                    />
                  </label>

                  <div className="edit-actions">
                    <button
                      type="button"
                      className="btn cancel"
                      onClick={handleEditCancel}
                    >
                      Cancel
                    </button>
                    <button type="submit" className="btn save">
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Add Form */}
            {adding && (
              <div className="profile-card">
                <h2>Add New Student (Local Only)</h2>
                <form onSubmit={handleAddSave} className="edit-form">
                  <label>
                    Name *
                    <input
                      type="text"
                      name="name"
                      value={addForm.name}
                      onChange={handleAddChange}
                      required
                    />
                  </label>
                  <label>
                    Email *
                    <input
                      type="email"
                      name="email"
                      value={addForm.email}
                      onChange={handleAddChange}
                      required
                    />
                  </label>
                  <label>
                    Phone
                    <input
                      type="text"
                      name="phone"
                      value={addForm.phone}
                      onChange={handleAddChange}
                    />
                  </label>
                  <label>
                    City
                    <input
                      type="text"
                      name="city"
                      value={addForm.city}
                      onChange={handleAddChange}
                    />
                  </label>
                  <label>
                    Company
                    <input
                      type="text"
                      name="company"
                      value={addForm.company}
                      onChange={handleAddChange}
                    />
                  </label>

                  <div className="edit-actions">
                    <button
                      type="button"
                      className="btn cancel"
                      onClick={handleAddCancel}
                    >
                      Cancel
                    </button>
                    <button type="submit" className="btn save">
                      Add Student
                    </button>
                  </div>
                </form>
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  );
}

export default App;