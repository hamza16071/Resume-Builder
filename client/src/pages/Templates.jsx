import React from 'react';
import { Link } from 'react-router-dom';

const templates = [
  { id: 'classic', name: 'Classic', desc: 'Clean & professional' },
  { id: 'modern', name: 'Modern', desc: 'Colored header, profile photo' },
  { id: 'creative', name: 'Creative', desc: 'Sidebar with accent color' }
];

export default function Templates(){
  return (
    <div className="container mt-8">
      <h2 className="text-2xl font-bold mb-4">Templates</h2>
      <div className="grid md:grid-cols-3 gap-4">
        {templates.map(t=> (
          <div key={t.id} className="card">
            <h3 className="font-semibold">{t.name}</h3>
            <p className="text-sm text-gray-600">{t.desc}</p>
            <div className="mt-3">
              <Link to="/builder" state={{ template: t.id }} className="btn bg-emerald-600 text-white">Use Template</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
