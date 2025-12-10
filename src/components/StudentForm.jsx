// src/components/StudentForm.jsx
import React, { useEffect, useState } from "react";

const emptyForm = {
  name: "",
  email: "",
  phone: "",
  website: "",
  city: "",
  company: "",
};

export default function StudentForm({ mode = "add", initialData, onCancel, onSubmit }) {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (mode === "edit" && initialData) {
      setForm({
        name: initialData.name || "",
        email: initialData.email || "",
        phone: initialData.phone || "",
        website: initialData.website || "",
        city: initialData.city || "",
        company: initialData.company || "",
      });
    } else {
      setForm(emptyForm);
    }
  }, [mode, initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!form.email.trim()) newErrors.email = "Email is required";
    if (form.email && !form.email.includes("@"))
      newErrors.email = "Email is invalid";
    if (!form.city.trim()) newErrors.city = "City is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit(form);
  };

  return (
    <div className="overlay">
      <div className="form-card">
        <div className="form-header">
          <h2>{mode === "add" ? "Add New Student" : "Edit Student"}</h2>
          <button className="close-btn" onClick={onCancel}>
            ✕
          </button>
        </div>

        <form className="form-body" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-field">
              <label>Name *</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Student Name"
              />
              {errors.name && <p className="error-text">{errors.name}</p>}
            </div>

            <div className="form-field">
              <label>Email *</label>
              <input
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="student@example.com"
              />
              {errors.email && <p className="error-text">{errors.email}</p>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-field">
              <label>Phone</label>
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="+91 98765 43210"
              />
            </div>

            <div className="form-field">
              <label>Website</label>
              <input
                name="website"
                value={form.website}
                onChange={handleChange}
                placeholder="student-portfolio.com"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-field">
              <label>City *</label>
              <input
                name="city"
                value={form.city}
                onChange={handleChange}
                placeholder="Coimbatore"
              />
              {errors.city && <p className="error-text">{errors.city}</p>}
            </div>

            <div className="form-field">
              <label>Company / College</label>
              <input
                name="company"
                value={form.company}
                onChange={handleChange}
                placeholder="XYZ College"
              />
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn secondary" onClick={onCancel}>
              Cancel
            </button>
            <button type="submit" className="btn primary">
              {mode === "add" ? "Add Student" : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
