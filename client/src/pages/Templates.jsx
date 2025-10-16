import React from "react";
import { Link } from "react-router-dom";

const templates = [
  {
    id: "classic",
    name: "Classic",
    desc: "Clean, minimal, and professional look for traditional resumes.",
  },
  {
    id: "modern",
    name: "Modern",
    desc: "Bold header with profile photo support and sleek styling.",
  },
  {
    id: "creative",
    name: "Creative",
    desc: "Stylish sidebar layout with accent colors and strong visuals.",
  },
];

export default function Templates() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-emerald-50 flex flex-col items-center justify-center px-6 py-12">
      <h2 className="text-4xl font-extrabold mb-10 text-emerald-700 text-center tracking-wide">
        Choose Your Resume Template
      </h2>

      <div className="grid md:grid-cols-3 gap-8 w-full max-w-6xl">
        {templates.map((t) => (
          <div
            key={t.id}
            className="bg-white shadow-lg rounded-xl p-6 text-center border hover:shadow-2xl transition-all transform hover:scale-105"
          >
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              {t.name}
            </h3>
            <p className="text-gray-600 mb-4 leading-relaxed">{t.desc}</p>

            <div className="flex justify-center">
              <Link
                to="/builder"
                state={{ template: t.id }}
                className="inline-block bg-emerald-600 text-white font-medium px-5 py-2 rounded-md hover:bg-emerald-700 transition"
              >
                Use Template
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
