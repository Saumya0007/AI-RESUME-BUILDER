import React, { useState } from "react";
import api from "../utils/api";

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

  const [resumeFile, setResumeFile] = useState(null);
  const [uploadMessage, setUploadMessage] = useState("");

  const [question, setQuestion] = useState("");
  const [chatResponse, setChatResponse] = useState("");

  const [jobDescription, setJobDescription] = useState("");
  const [atsResult, setAtsResult] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
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
      const res = await api.post("/generate-resume", {
        userData,
      });

      let output =
        res.data.resume || "No resume generated.";

      output = output
        .replace(/\*\*/g, "")
        .replace(
          /^([A-Z][A-Za-z\s]+)$/gm,
          "<h2 class='text-blue-400 text-xl font-semibold mt-4 mb-1'>$1</h2>"
        )
        .replace(/\n/g, "<br/>");

      setResume(output);
    } catch (err) {
      console.error(err);
      setResume(
        "Error generating resume. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const uploadResume = async () => {
    if (!resumeFile) return;

    const data = new FormData();
    data.append("file", resumeFile);

    try {
      const res = await fetch(
        "http://127.0.0.1:8000/upload-resume",
        {
          method: "POST",
          body: data,
        }
      );

      const result = await res.json();

      setUploadMessage(
        result.message || "Resume Uploaded"
      );
    } catch (error) {
      console.error(error);
      setUploadMessage("Upload Failed");
    }
  };

  const askAI = async () => {
    try {
      const res = await fetch(
        "http://127.0.0.1:8000/chat-resume",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            question,
          }),
        }
      );

      const data = await res.json();

      setChatResponse(data.answer);
    } catch (error) {
      console.error(error);
    }
  };

  const checkATS = async () => {
    try {
      const resumeText = `
${formData.summary}
${formData.skills}
${formData.projects}
${formData.experience}
`;

      const res = await fetch(
        "http://127.0.0.1:8000/ats-check",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            resume_text: resumeText,
            job_description: jobDescription,
          }),
        }
      );

      const data = await res.json();

      setAtsResult(data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white flex flex-col items-center p-6">
      <h1 className="text-4xl font-bold mb-6">
        AI Career Copilot
      </h1>

      <div className="w-full max-w-3xl bg-white/10 backdrop-blur-md rounded-2xl shadow-lg p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            className="p-3 rounded-lg bg-white/20"
          />

          <input
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="p-3 rounded-lg bg-white/20"
          />

          <input
            name="phone"
            placeholder="Phone"
            value={formData.phone}
            onChange={handleChange}
            className="p-3 rounded-lg bg-white/20"
          />

          <input
            name="education"
            placeholder="Education"
            value={formData.education}
            onChange={handleChange}
            className="p-3 rounded-lg bg-white/20"
          />
        </div>

        <textarea
          name="summary"
          placeholder="Summary"
          value={formData.summary}
          onChange={handleChange}
          className="w-full h-24 p-3 rounded-lg bg-white/20"
        />

        <textarea
          name="skills"
          placeholder="Skills"
          value={formData.skills}
          onChange={handleChange}
          className="w-full h-24 p-3 rounded-lg bg-white/20"
        />

        <textarea
          name="experience"
          placeholder="Experience"
          value={formData.experience}
          onChange={handleChange}
          className="w-full h-24 p-3 rounded-lg bg-white/20"
        />

        <textarea
          name="projects"
          placeholder="Projects"
          value={formData.projects}
          onChange={handleChange}
          className="w-full h-24 p-3 rounded-lg bg-white/20"
        />

        <button
          onClick={generateResume}
          disabled={loading}
          className="w-full py-3 bg-blue-600 rounded-xl"
        >
          {loading
            ? "Generating..."
            : "Generate Resume"}
        </button>
      </div>

      {resume && (
        <div
          className="w-full max-w-3xl bg-white/10 rounded-2xl p-6 mt-6"
          dangerouslySetInnerHTML={{
            __html: resume,
          }}
        />
      )}

      <div className="w-full max-w-3xl bg-white/10 rounded-2xl p-6 mt-6">
        <h2 className="text-2xl font-bold mb-4">
          Resume Upload
        </h2>

        <input
          type="file"
          onChange={(e) =>
            setResumeFile(
              e.target.files[0]
            )
          }
        />

        <button
          onClick={uploadResume}
          className="w-full mt-3 bg-green-600 p-3 rounded-xl"
        >
          Upload Resume
        </button>

        <p className="mt-3">
          {uploadMessage}
        </p>
      </div>

      <div className="w-full max-w-3xl bg-white/10 rounded-2xl p-6 mt-6">
        <h2 className="text-2xl font-bold mb-4">
          AI Career Coach
        </h2>

        <textarea
          value={question}
          onChange={(e) =>
            setQuestion(
              e.target.value
            )
          }
          placeholder="Ask AI..."
          className="w-full h-24 p-3 rounded-lg bg-white/20"
        />

        <button
          onClick={askAI}
          className="w-full mt-3 bg-purple-600 p-3 rounded-xl"
        >
          Ask AI
        </button>

        {chatResponse && (
          <div className="mt-4">
            {chatResponse}
          </div>
        )}
      </div>

      <div className="w-full max-w-3xl bg-white/10 rounded-2xl p-6 mt-6">
        <h2 className="text-2xl font-bold mb-4">
          ATS Analyzer
        </h2>

        <textarea
          value={jobDescription}
          onChange={(e) =>
            setJobDescription(
              e.target.value
            )
          }
          placeholder="Paste Job Description"
          className="w-full h-40 p-3 rounded-lg bg-white/20"
        />

        <button
          onClick={checkATS}
          className="w-full mt-3 bg-orange-600 p-3 rounded-xl"
        >
          Analyze ATS
        </button>

        {atsResult && (
          <div className="mt-4">
            <h3 className="font-bold">
              ATS Score:
              {" "}
              {atsResult.ats_score}%
            </h3>

            <h4 className="mt-3 font-bold">
              Matched Skills
            </h4>

            <ul>
              {atsResult.matched_keywords?.map(
                (skill, index) => (
                  <li key={index}>
                    • {skill}
                  </li>
                )
              )}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}