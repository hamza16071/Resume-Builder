Resume Builder PRO Server
1. cd server
2. npm install
3. copy .env.example .env and set PORT if needed
4. npm run dev
API: POST /api/resume/pdf
Body: JSON with resume fields; optional imageBase64 (data URL) or imageUrl.
