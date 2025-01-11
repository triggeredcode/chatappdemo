# Real-Time Chat Application

A modern real-time chat application built with React, Node.js, and Socket.IO.

## Features

- Real-time messaging using WebSocket (Socket.IO)
- Public chat room
- Private one-to-one chat
- User online status
- Typing indicators
- Responsive design for mobile and desktop
- Clean and modular code structure

## Tech Stack

- Frontend:
  - React
  - TypeScript
  - Tailwind CSS
  - Socket.IO Client
  - Lucide React (Icons)

- Backend:
  - Node.js
  - Express
  - Socket.IO
  - CORS

## Project Structure

```
├── server/
│   └── index.js           # Backend server code
├── client
   ├── src/
   │   ├── components/
   │   │   └── chat/         # Chat-related components
   │   ├── lib/
   │   │   └── utils.ts      # Utility functions
   │   ├── App.tsx           # Main application component
   │   └── main.tsx         # Application entry point
```

## Getting Started

1. Install dependencies of server and start the server:
   ```bash
   cd server
   npm install
   node index.js
   ```

2. Install frontend dependencies and Start the frontend development server:
   ```bash
   cd client
   npm install
   npm run dev
   ```

3. Open your browser and navigate to `http://localhost:5173`

## Architecture

The application follows a client-server architecture with WebSocket communication:

1. **Backend**
   - Express.js server handles HTTP requests
   - Socket.IO manages real-time communication
   - In-memory storage for users and messages

2. **Frontend**
   - React components for UI
   - Socket.IO client for real-time updates
   - Responsive design with Tailwind CSS

3. **Communication Flow**
   - User logs in → Server broadcasts updated user list
   - User sends message → Server routes to recipient(s)
   - User types → Server broadcasts typing status
   - User selects chat → Server sends chat history