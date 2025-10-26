import React, { useState } from "react"
import axios from "axios"

export default function ResumeGenerator() {
  const [resumeData, setResumeData] = useState("")
  const [loading, setLoading] = useState(false)

  const handleGenerate = async () => {
    setLoading(true)
    try {
      const response = await axios.post("http://localhost:3000/generate-resume", {
        userData: localStorage.getItem("user")
      })
      setResumeData(response.data.resume)
    } catch (err) {
      console.error(err)
      alert("Error generating résumé")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Generate Résumé</h2>
      <button
        onClick={handleGenerate}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        disabled={loading}
      >
        {loading ? "Generating..." : "Generate Résumé"}
      </button>

      {resumeData && (
        <div className="mt-4 p-4 border rounded bg-gray-50">
          <pre>{resumeData}</pre>
        </div>
      )}
    </div>
  )
}
