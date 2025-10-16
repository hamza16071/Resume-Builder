import React, { useState } from "react";
import API from "../services/api.js";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";

const empty = {
  name: "",
  title: "",
  email: "",
  phone: "",
  summary: "",
  skills: [],
  experience: [],
  education: [],
};

export default function Builder() {
  const loc = useLocation();
  const initialTemplate = loc.state?.template || "modern";
  const [template, setTemplate] = useState(initialTemplate);
  const [form, setForm] = useState(empty);
  const [skillInput, setSkillInput] = useState("");
  const [msg, setMsg] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);

  function addSkill() {
    if (skillInput.trim()) {
      setForm({ ...form, skills: [...form.skills, skillInput.trim()] });
      setSkillInput("");
    }
  }

  function addExperience() {
    setForm({
      ...form,
      experience: [
        ...form.experience,
        { role: "Developer", company: "", from: "", to: "", details: "" },
      ],
    });
  }

  function addEducation() {
    setForm({
      ...form,
      education: [
        ...form.education,
        { degree: "BSc", institution: "", year: "", details: "" },
      ],
    });
  }

  function handleFile(e) {
    const f = e.target.files[0];
    if (!f) return;
    setImageFile(f);
    const reader = new FileReader();
    reader.onload = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(f);
  }

  async function downloadPDF() {
    try {
      setMsg("Generating PDF...");
      let imageBase64 = null;
      if (imageFile && preview) imageBase64 = preview;
      const payload = { ...form, template, imageBase64, imageUrl };
      const res = await API.post("/resume/pdf", payload, {
        responseType: "blob",
      });
      const blob = new Blob([res.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${(form.name || "resume").replace(/\s+/g, "_")}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setMsg("✅ PDF downloaded successfully");
    } catch (err) {
      console.error(err);
      setMsg("❌ Failed to generate PDF");
      alert(err.response?.data?.error || err.message);
    }
  }

  return (
    <motion.div
      className="min-h-screen bg-gray-50 px-6 py-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-8">
        {/* Left Side - Form */}
        <div className="bg-white p-6 rounded-xl shadow-md border">
          <h2 className="text-2xl font-bold mb-4 text-emerald-700">
            Resume Builder
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Template</label>
              <select
                value={template}
                onChange={(e) => setTemplate(e.target.value)}
                className="w-full p-2 border rounded"
              >
                <option value="classic">Classic</option>
                <option value="modern">Modern</option>
                <option value="creative">Creative</option>
              </select>
            </div>

            <input
              placeholder="Full name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full p-2 border rounded"
            />

            <input
              placeholder="Title (e.g. Frontend Developer)"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full p-2 border rounded"
            />

            <div className="grid grid-cols-2 gap-3">
              <input
                placeholder="Email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="p-2 border rounded"
              />
              <input
                placeholder="Phone"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="p-2 border rounded"
              />
            </div>

            <textarea
              placeholder="Professional summary"
              value={form.summary}
              onChange={(e) => setForm({ ...form, summary: e.target.value })}
              className="w-full p-2 border rounded"
            />

            {/* Image Section */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Profile Photo (file or URL)
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFile}
                className="mb-2"
              />
              <input
                placeholder="https://example.com/photo.jpg"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="w-full p-2 border rounded"
              />
              {(preview || imageUrl) && (
                <img
                  src={preview || imageUrl}
                  className="mt-2 w-24 h-24 object-cover rounded-full border"
                  alt="profile"
                />
              )}
            </div>

            {/* Skills */}
            <div>
              <label className="block text-sm font-medium mb-1">Skills</label>
              <div className="flex gap-2">
                <input
                  placeholder="Add skill"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  className="p-2 border rounded flex-1"
                />
                <button
                  type="button"
                  onClick={addSkill}
                  className="bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-700"
                >
                  Add
                </button>
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {form.skills.map((s, i) => (
                  <span
                    key={i}
                    className="bg-gray-100 px-3 py-1 rounded-full text-sm"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Experience */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Experience
              </label>
              {form.experience.map((exp, idx) => (
                <div key={idx} className="p-3 border rounded mb-2">
                  <input
                    placeholder="Role"
                    value={exp.role}
                    onChange={(e) => {
                      const arr = [...form.experience];
                      arr[idx].role = e.target.value;
                      setForm({ ...form, experience: arr });
                    }}
                    className="w-full p-2 border rounded mb-1"
                  />
                  <input
                    placeholder="Company"
                    value={exp.company}
                    onChange={(e) => {
                      const arr = [...form.experience];
                      arr[idx].company = e.target.value;
                      setForm({ ...form, experience: arr });
                    }}
                    className="w-full p-2 border rounded mb-1"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      placeholder="From"
                      value={exp.from}
                      onChange={(e) => {
                        const arr = [...form.experience];
                        arr[idx].from = e.target.value;
                        setForm({ ...form, experience: arr });
                      }}
                      className="p-2 border rounded"
                    />
                    <input
                      placeholder="To"
                      value={exp.to}
                      onChange={(e) => {
                        const arr = [...form.experience];
                        arr[idx].to = e.target.value;
                        setForm({ ...form, experience: arr });
                      }}
                      className="p-2 border rounded"
                    />
                  </div>
                  <textarea
                    placeholder="Details"
                    value={exp.details}
                    onChange={(e) => {
                      const arr = [...form.experience];
                      arr[idx].details = e.target.value;
                      setForm({ ...form, experience: arr });
                    }}
                    className="w-full p-2 border rounded mt-2"
                  />
                </div>
              ))}
              <button
                type="button"
                onClick={addExperience}
                className="border px-4 py-2 rounded hover:bg-gray-50"
              >
                Add Experience
              </button>
            </div>

            {/* Education */}
            <div>
              <label className="block text-sm font-medium mb-1">Education</label>
              {form.education.map((ed, idx) => (
                <div key={idx} className="p-3 border rounded mb-2">
                  <input
                    placeholder="Degree"
                    value={ed.degree}
                    onChange={(e) => {
                      const arr = [...form.education];
                      arr[idx].degree = e.target.value;
                      setForm({ ...form, education: arr });
                    }}
                    className="w-full p-2 border rounded mb-1"
                  />
                  <input
                    placeholder="Institution"
                    value={ed.institution}
                    onChange={(e) => {
                      const arr = [...form.education];
                      arr[idx].institution = e.target.value;
                      setForm({ ...form, education: arr });
                    }}
                    className="w-full p-2 border rounded mb-1"
                  />
                  <input
                    placeholder="Year"
                    value={ed.year}
                    onChange={(e) => {
                      const arr = [...form.education];
                      arr[idx].year = e.target.value;
                      setForm({ ...form, education: arr });
                    }}
                    className="p-2 border rounded"
                  />
                  <textarea
                    placeholder="Details"
                    value={ed.details}
                    onChange={(e) => {
                      const arr = [...form.education];
                      arr[idx].details = e.target.value;
                      setForm({ ...form, education: arr });
                    }}
                    className="w-full p-2 border rounded mt-2"
                  />
                </div>
              ))}
              <button
                type="button"
                onClick={addEducation}
                className="border px-4 py-2 rounded hover:bg-gray-50"
              >
                Add Education
              </button>
            </div>

            <div className="flex gap-3 mt-4 items-center">
              <button
                onClick={downloadPDF}
                className="bg-emerald-600 text-white px-5 py-2 rounded hover:bg-emerald-700"
              >
                Export PDF
              </button>
              <span className="text-sm text-gray-600">{msg}</span>
            </div>
          </div>
        </div>

        {/* Right Side - Live Preview */}
        <div className="bg-white p-6 rounded-xl shadow-md border overflow-hidden">
          <h3 className="font-semibold mb-3 text-emerald-700">Live Preview</h3>
          <div className="border rounded-lg p-4 min-h-[400px]">
            <h2
              className="text-3xl font-bold text-center break-words"
              style={{
                fontSize: form.name.length > 20 ? "1.5rem" : "2rem",
              }}
            >
              {form.name || "Full Name"}
            </h2>
            <div className="text-gray-600 text-center break-words">
              {form.title}
            </div>
            <div className="text-sm text-center mt-1 break-words">
              {form.email} • {form.phone}
            </div>
            <p className="mt-3 text-sm text-justify break-words">
              {form.summary}
            </p>

            <div className="mt-3 text-sm">
              <strong>Skills:</strong> {form.skills.join(", ")}
            </div>

            <div className="mt-3 text-sm">
              <strong>Experience:</strong>
              {form.experience.map((e, i) => (
                <div key={i} className="mt-1 break-words">
                  <strong>{e.role}</strong> at {e.company} ({e.from} - {e.to})
                  <div className="text-gray-700">{e.details}</div>
                </div>
              ))}
            </div>

            <div className="mt-3 text-sm">
              <strong>Education:</strong>
              {form.education.map((ed, i) => (
                <div key={i} className="mt-1 break-words">
                  {ed.degree} — {ed.institution} ({ed.year})
                </div>
              ))}
            </div>

            {(preview || imageUrl) && (
              <div className="mt-5 flex justify-center">
                <img
                  src={preview || imageUrl}
                  alt="profile"
                  className="w-28 h-28 object-cover rounded-full border shadow-sm"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
