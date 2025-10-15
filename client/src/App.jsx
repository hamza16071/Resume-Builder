import React from 'react';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import Home from './pages/Home.jsx';
import Builder from './pages/Builder.jsx';
import Templates from './pages/Templates.jsx';

export default function App(){
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/builder" element={<Builder/>} />
        <Route path="/templates" element={<Templates/>} />
      </Routes>
    </BrowserRouter>
  );
}
