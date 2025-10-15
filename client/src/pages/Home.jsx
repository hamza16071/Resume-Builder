import React from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white flex flex-col justify-center items-center p-8">
      <div className="text-center max-w-4xl">
        <h1 className="text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
          AI Resume Builder <span className="text-indigo-600">PRO</span>
        </h1>

        <p className="text-gray-600 text-lg mb-8">
          Build stunning resumes effortlessly. Choose from modern templates,
          customize easily, and export professional PDFs with just one click.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-10">
          <button
            onClick={() => navigate("/builder")}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg shadow-lg hover:bg-indigo-700 transition-all duration-300"
          >
            Start Building
          </button>
          <button
            onClick={() => navigate("/templates")}
            className="px-6 py-3 border border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 transition-all duration-300"
          >
            Explore Templates
          </button>
        </div>

        <div className="flex justify-center">
          <img
            src="src/image.png"
            alt="Resume Builder Preview"
            className="w-full max-w-3xl rounded-3xl shadow-2xl hover:scale-105 transition-transform duration-500"
          />
        </div>

        <p className="text-gray-500 mt-8 text-sm">
          ✨ 100+ Resume Templates | 🚀 1-Click PDF Export | 🎨 Fully Customizable
        </p>
      </div>
    </div>
  );
}
