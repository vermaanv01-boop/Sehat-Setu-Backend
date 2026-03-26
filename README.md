# SehatSetu Backend

This is the Node.js + Express backend for the SehatSetu platform, built to bridge the gap between rural PHCs and urban specialist doctors.

## Prerequisites
- Node.js (v18+ recommended)
- MongoDB running locally or a MongoDB Atlas URI

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure environment variables:
   Ensure your `.env` file is present in the root directory.
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/sehatsetu
   JWT_SECRET=your_super_secret_jwt_key_here
   FRONTEND_URL=http://localhost:5173
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

## Key API Endpoints

### Authentication `/api/auth`
- `POST /register`: Register a new Doctor or Healthcare Worker.
- `POST /login`: Authenticate and get a JWT.
- `GET /me`: Get current logged-in user profile.

### Cases `/api/cases`
- `POST /patient`: (PHC Worker) Create a new patient profile and an empty case.
- `GET /`: Get all cases (filtered by role).
- `POST /:id/upload`: (PHC Worker) Upload a medical report/image.
- `PUT /:id`: (Specialist) Update case status and add notes.

### Facilities `/api/facilities`
- `GET /nearby?lng=<long>&lat=<lat>&maxDistance=10000`: Find nearby PHCs or hospitals using MongoDB Geospatial indexing.

## WebSockets
The server utilizes `Socket.io` attached to the main HTTP server to emit real-time events:
- `new_case`: Fired when a PHC worker uploads a new case.
- `case_updated`: Fired when a specialist updates the case status or notes.
