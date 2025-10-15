import React, { useState } from 'react';
import API from '../services/api.js';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

const empty = {
  name: '',
  title: '',
  email: '',
  phone: '',
  summary: '',
  skills: [],
  experience: [],
  education: []
};

export default function Builder(){
  const loc = useLocation();
  const initialTemplate = loc.state?.template || 'modern';
  const [template, setTemplate] = useState(initialTemplate);
  const [form, setForm] = useState(empty);
  const [skillInput, setSkillInput] = useState('');
  const [msg, setMsg] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);

  function addSkill(){
    if(skillInput.trim()){
      setForm({...form, skills: [...form.skills, skillInput.trim()] });
      setSkillInput('');
    }
  }

  function addExperience(){
    setForm({...form, experience: [...form.experience, { role: 'Developer', company: '', from:'', to:'', details:'' }] });
  }

  function addEducation(){
    setForm({...form, education: [...form.education, { degree:'BSc', institution:'', year:'', details:'' }] });
  }

  function handleFile(e){
    const f = e.target.files[0];
    if(!f) return;
    setImageFile(f);
    const reader = new FileReader();
    reader.onload = ()=>{
      setPreview(reader.result);
    };
    reader.readAsDataURL(f);
  }

  async function downloadPDF(){
    try{
      setMsg('Generating PDF...');
      // prepare payload; prefer file base64 if provided, else url
      let imageBase64 = null;
      if(imageFile && preview) imageBase64 = preview;
      const payload = { ...form, template, imageBase64, imageUrl };
      const res = await API.post('/resume/pdf', payload, { responseType: 'blob' });
      const blob = new Blob([res.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${(form.name||'resume').replace(/\s+/g,'_')}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setMsg('PDF downloaded');
    }catch(err){
      console.error(err);
      setMsg('Failed to generate PDF');
      alert(err.response?.data?.error || err.message);
    }
  }

  return (
    <div className="container mt-8">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-xl font-bold mb-3">Resume Builder</h2>
          <div className="mb-3">
            <label className="block text-sm font-medium">Template</label>
            <select value={template} onChange={e=>setTemplate(e.target.value)} className="w-full p-2 border rounded">
              <option value="classic">Classic</option>
              <option value="modern">Modern</option>
              <option value="creative">Creative</option>
            </select>
          </div>
          <div className="mb-3">
            <input placeholder="Full name" value={form.name} onChange={e=>setForm({...form, name:e.target.value})} className="w-full p-2 border rounded" />
          </div>
          <div className="mb-3">
            <input placeholder="Title (e.g. Frontend Developer)" value={form.title} onChange={e=>setForm({...form, title:e.target.value})} className="w-full p-2 border rounded" />
          </div>
          <div className="mb-3 grid grid-cols-2 gap-2">
            <input placeholder="Email" value={form.email} onChange={e=>setForm({...form, email:e.target.value})} className="p-2 border rounded" />
            <input placeholder="Phone" value={form.phone} onChange={e=>setForm({...form, phone:e.target.value})} className="p-2 border rounded" />
          </div>
          <div className="mb-3">
            <textarea placeholder="Professional summary" value={form.summary} onChange={e=>setForm({...form, summary:e.target.value})} className="w-full p-2 border rounded" />
          </div>

          <div className="mb-3">
            <label className="block text-sm font-medium">Profile Photo (file)</label>
            <input type="file" accept="image/*" onChange={handleFile} className="mb-2" />
            <label className="block text-sm font-medium">Or Image URL</label>
            <input placeholder="https://example.com/photo.jpg" value={imageUrl} onChange={e=>setImageUrl(e.target.value)} className="w-full p-2 border rounded" />
            {preview && <img src={preview} className="mt-2 w-24 h-24 object-cover rounded" alt="preview" />}
          </div>

          <div className="mb-3">
            <label className="block text-sm font-medium">Skills</label>
            <div className="flex gap-2">
              <input placeholder="Add skill" value={skillInput} onChange={e=>setSkillInput(e.target.value)} className="p-2 border rounded flex-1" />
              <button type="button" onClick={addSkill} className="btn bg-emerald-600 text-white">Add</button>
            </div>
            <div className="mt-2">{form.skills.map((s,i)=> <span key={i} className="inline-block bg-gray-100 px-2 py-1 rounded mr-2 text-sm">{s}</span>)}</div>
          </div>

          <div className="mb-3">
            <label className="block text-sm font-medium">Experience</label>
            <div className="space-y-2">
              {form.experience.map((exp, idx)=> (
                <div key={idx} className="p-3 border rounded">
                  <input placeholder="Role" value={exp.role} onChange={e=>{ const arr=[...form.experience]; arr[idx].role = e.target.value; setForm({...form, experience: arr})}} className="w-full p-2 border rounded mb-1" />
                  <input placeholder="Company" value={exp.company} onChange={e=>{ const arr=[...form.experience]; arr[idx].company = e.target.value; setForm({...form, experience: arr})}} className="w-full p-2 border rounded mb-1" />
                  <input placeholder="From" value={exp.from} onChange={e=>{ const arr=[...form.experience]; arr[idx].from = e.target.value; setForm({...form, experience: arr})}} className="p-2 border rounded mr-2" />
                  <input placeholder="To" value={exp.to} onChange={e=>{ const arr=[...form.experience]; arr[idx].to = e.target.value; setForm({...form, experience: arr})}} className="p-2 border rounded" />
                  <textarea placeholder="Details" value={exp.details} onChange={e=>{ const arr=[...form.experience]; arr[idx].details = e.target.value; setForm({...form, experience: arr})}} className="w-full p-2 border rounded mt-2" />
                </div>
              ))}
              <button type="button" onClick={addExperience} className="btn bg-white border">Add Experience</button>
            </div>
          </div>

          <div className="mb-3">
            <label className="block text-sm font-medium">Education</label>
            <div className="space-y-2">
              {form.education.map((ed, idx)=> (
                <div key={idx} className="p-3 border rounded">
                  <input placeholder="Degree" value={ed.degree} onChange={e=>{ const arr=[...form.education]; arr[idx].degree = e.target.value; setForm({...form, education: arr})}} className="w-full p-2 border rounded mb-1" />
                  <input placeholder="Institution" value={ed.institution} onChange={e=>{ const arr=[...form.education]; arr[idx].institution = e.target.value; setForm({...form, education: arr})}} className="w-full p-2 border rounded mb-1" />
                  <input placeholder="Year" value={ed.year} onChange={e=>{ const arr=[...form.education]; arr[idx].year = e.target.value; setForm({...form, education: arr})}} className="p-2 border rounded" />
                  <textarea placeholder="Details" value={ed.details} onChange={e=>{ const arr=[...form.education]; arr[idx].details = e.target.value; setForm({...form, education: arr})}} className="w-full p-2 border rounded mt-2" />
                </div>
              ))}
              <button type="button" onClick={addEducation} className="btn bg-white border">Add Education</button>
            </div>
          </div>

          <div className="flex gap-3 mt-4">
            <button onClick={downloadPDF} className="btn bg-emerald-600 text-white">Export PDF</button>
            <div className="text-sm text-gray-600 mt-2">{msg}</div>
          </div>
        </div>

        <div className="card">
          <h3 className="font-semibold mb-2">Live Preview</h3>
          <div className="preview">
            <h2 className="text-xl font-bold">{form.name || 'Full name'}</h2>
            <div className="text-sm text-gray-600">{form.title}</div>
            <div className="text-sm mt-2">{form.email} • {form.phone}</div>
            <p className="mt-2">{form.summary}</p>
            <div className="mt-2"><strong>Skills:</strong> {form.skills.join(', ')}</div>
            <div className="mt-2"><strong>Experience:</strong>
              {form.experience.map((e,i)=>(<div key={i} className="mt-1"><strong>{e.role}</strong> at {e.company} ({e.from} - {e.to})<div className="text-sm">{e.details}</div></div>))}
            </div>
            <div className="mt-2"><strong>Education:</strong>
              {form.education.map((ed,i)=>(<div key={i} className="mt-1">{ed.degree} — {ed.institution} ({ed.year})</div>))}
            </div>
            {preview && <div className="mt-3"><img src={preview} alt="preview" className="w-28 h-28 object-cover rounded" /></div>}
            {imageUrl && !preview && <div className="mt-3"><img src={imageUrl} alt="url" className="w-28 h-28 object-cover rounded" /></div>}
          </div>
        </div>
      </div>
    </div>
  );
}
