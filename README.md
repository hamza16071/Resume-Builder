Resume Builder PRO - Full package (Frontend + Backend)

Run locally (PowerShell):
1. Start Backend:
   cd server
   npm install
   copy .env.example .env
   npm run dev
2. Start Frontend (new terminal):
   cd client
   npm install
   npm run dev
3. Open http://localhost:5173
API endpoint:
POST /api/resume/pdf -> returns PDF (Content-Type: application/pdf)
Payload supports optional imageBase64 (data URL) or imageUrl.
