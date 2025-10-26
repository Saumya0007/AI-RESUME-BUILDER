import React, { useState } from "react";
import api from "../utils/api";  // Changed

export default function Dashboard() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    summary: "",
    skills: "",
    experience: "",
    education: "",
    projects: "",
  });
  const [resume, setResume] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const generateResume = async () => {
    setLoading(true);
    setResume("");

    const userData = `
Name: ${formData.name}
Email: ${formData.email}
Phone: ${formData.phone}
Summary: ${formData.summary}
Skills: ${formData.skills}
Experience: ${formData.experience}
Education: ${formData.education}
Projects: ${formData.projects}
    `;

    try {
      const res = await api.post("/generate-resume", {  // Changed
        userData,
      });

      // Remove markdown asterisks ** and format blue headings
      let output = res.data.resume || "No resume generated.";
      output = output
        .replace(/\*\*/g, "") // remove markdown bold markers
        .replace(/^([A-Z][A-Za-z\s]+)$/gm, "<h2 class='text-blue-400 text-xl font-semibold mt-4 mb-1'>$1</h2>") // headings
        .replace(/\n/g, "<br/>");

      setResume(output);
    } catch (err) {
      console.error(err);
      setResume("Error generating resume. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white flex flex-col items-center p-6">
      <h1 className="text-4xl font-bold mb-6 text-center">
        AI Resume Builder (Free)
      </h1>

      <div className="w-full max-w-3xl bg-white/10 backdrop-blur-md rounded-2xl shadow-lg p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            className="p-3 rounded-lg bg-white/20 text-white placeholder-gray-300 focus:outline-none"
          />
          <input
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            className="p-3 rounded-lg bg-white/20 text-white placeholder-gray-300 focus:outline-none"
          />
          <input
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
            className="p-3 rounded-lg bg-white/20 text-white placeholder-gray-300 focus:outline-none"
          />
          <input
            name="education"
            placeholder="Education"
            value={formData.education}
            onChange={handleChange}
            className="p-3 rounded-lg bg-white/20 text-white placeholder-gray-300 focus:outline-none"
          />
        </div>

        <textarea
          name="summary"
          placeholder="Professional Summary"
          value={formData.summary}
          onChange={handleChange}
          className="w-full h-24 p-3 rounded-lg bg-white/20 text-white placeholder-gray-300 focus:outline-none"
        />
        <textarea
          name="skills"
          placeholder="Skills (comma-separated)"
          value={formData.skills}
          onChange={handleChange}
          className="w-full h-24 p-3 rounded-lg bg-white/20 text-white placeholder-gray-300 focus:outline-none"
        />
        <textarea
          name="experience"
          placeholder="Work Experience"
          value={formData.experience}
          onChange={handleChange}
          className="w-full h-24 p-3 rounded-lg bg-white/20 text-white placeholder-gray-300 focus:outline-none"
        />
        <textarea
          name="projects"
          placeholder="Projects"
          value={formData.projects}
          onChange={handleChange}
          className="w-full h-24 p-3 rounded-lg bg-white/20 text-white placeholder-gray-300 focus:outline-none"
        />

        <button
          onClick={generateResume}
          disabled={loading}
          className="w-full py-3 mt-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-xl font-semibold text-lg transition-all duration-200"
        >
          {loading ? "Generating..." : "Generate Resume"}
        </button>
      </div>

      {resume && (
        <div
          className="w-full max-w-3xl bg-white/10 backdrop-blur-md rounded-2xl shadow-lg p-6 mt-6 text-left text-gray-100"
          dangerouslySetInnerHTML={{ __html: resume }}
        />
      )}
    </div>
  );
}