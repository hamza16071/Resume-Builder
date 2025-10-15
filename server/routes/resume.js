import express from "express";
import PDFDocument from "pdfkit";
import axios from "axios";

const router = express.Router();

// helper to load image from data URL or remote url, returns buffer
async function loadImageBuffer(imageUrl, imageBase64) {
  if (imageBase64) {
    // data:image/png;base64,xxxx
    const parts = imageBase64.split(',');
    const b64 = parts.length>1 ? parts[1] : parts[0];
    return Buffer.from(b64, 'base64');
  }
  if (imageUrl) {
    const res = await axios.get(imageUrl, { responseType: 'arraybuffer' });
    return Buffer.from(res.data);
  }
  return null;
}

function drawHeader(doc, data, template) {
  if (template === 'modern') {
    doc.rect(0,0,595,90).fill('#0ea5a4');
    doc.fillColor('white').fontSize(22).font('Helvetica-Bold').text(data.name || '', 40, 26);
    doc.fontSize(10).font('Helvetica').text(data.title || '', 40, 52);
    doc.fillColor('black');
    doc.moveDown(2);
  } else if (template === 'creative') {
    doc.rect(0,0,160,792).fill('#7c3aed');
    doc.fillColor('white').fontSize(20).font('Helvetica-Bold').text(data.name || '', 20, 40, { width: 120 });
    doc.fillColor('#e6e6fa').fontSize(10).font('Helvetica').text(data.title || '', 20, 80, { width: 120 });
    doc.fillColor('black');
    doc.moveDown(2);
  } else {
    // classic
    doc.fontSize(20).font('Helvetica-Bold').text(data.name || '', { align: 'left' });
    doc.moveDown(0.2);
    doc.fontSize(11).font('Helvetica-Oblique').fillColor('#555').text(data.title || '');
    doc.fillColor('black');
    doc.moveDown(0.6);
  }
}

function writeResume(doc, data, template = 'classic', imageBuffer=null) {
  doc.info.Title = `${data.name || 'Resume'} - Resume`;
  // Draw header depending on template
  drawHeader(doc, data, template);

  // profile image for modern/creative
  if (imageBuffer && (template === 'modern' || template === 'creative')) {
    try {
      if (template === 'modern') {
        doc.image(imageBuffer, 450, 18, { width: 80, height: 80, fit: [80,80], align: 'right' });
      } else {
        doc.image(imageBuffer, 30, 140, { width: 100, height: 100, fit: [100,100] });
      }
    } catch(e) {
      // ignore image errors
    }
  }

  // contact line for classic/modern
  if (template === 'classic' || template === 'modern') {
    doc.fontSize(10).font('Helvetica').text(`Email: ${data.email || ''}   |   Phone: ${data.phone || ''}`, { continued: false });
    doc.moveDown(0.6);
  } else {
    // creative: contact at bottom of sidebar
    doc.moveDown(1);
  }

  // Summary
  if (data.summary) {
    doc.fontSize(11).font('Helvetica-Bold').text('Summary');
    doc.fontSize(10).font('Helvetica').text(data.summary);
    doc.moveDown(0.6);
  }

  // Skills
  if (data.skills && data.skills.length) {
    doc.fontSize(11).font('Helvetica-Bold').text('Skills');
    doc.fontSize(10).font('Helvetica').text(data.skills.join(', '));
    doc.moveDown(0.6);
  }

  // Experience
  if (data.experience && data.experience.length) {
    doc.fontSize(11).font('Helvetica-Bold').text('Experience');
    data.experience.forEach(exp => {
      doc.fontSize(10).font('Helvetica-Bold').text(`${exp.role} — ${exp.company} (${exp.from} - ${exp.to})`);
      if (exp.details) doc.fontSize(10).font('Helvetica').text(exp.details);
      doc.moveDown(0.3);
    });
    doc.moveDown(0.4);
  }

  // Education
  if (data.education && data.education.length) {
    doc.fontSize(11).font('Helvetica-Bold').text('Education');
    data.education.forEach(ed => {
      doc.fontSize(10).font('Helvetica-Bold').text(`${ed.degree} — ${ed.institution} (${ed.year})`);
      if (ed.details) doc.fontSize(10).font('Helvetica').text(ed.details);
      doc.moveDown(0.3);
    });
    doc.moveDown(0.2);
  }

  // For creative template, add sidebar contact
  if (template === 'creative') {
    doc.addPage();
  }
}

router.post('/pdf', async (req, res) => {
  try {
    const data = req.body || {};
    const template = data.template || 'classic';
    // load image buffer if present
    const imageBuffer = await loadImageBuffer(data.imageUrl, data.imageBase64).catch(()=>null);

    const doc = new PDFDocument({ margin: 50, size: 'A4' });
    // response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${(data.name||'resume').replace(/\s+/g,'_')}.pdf"`);

    // pipe doc to response and then write
    doc.pipe(res);
    writeResume(doc, data, template, imageBuffer);
    doc.end();
  } catch(err) {
    console.error('PDF generation error:', err);
    res.status(500).json({ error: 'Failed to generate PDF', detail: err.message });
  }
});

export default router;
