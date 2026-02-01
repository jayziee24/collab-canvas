# Collaborative Canvas

A low-latency, multi-user whiteboard application built to demonstrate mastery of the HTML5 Canvas API and WebSocket synchronization. This project implements a custom engine for real-time collaboration, state management, and conflict resolution without reliance on third-party drawing libraries.

**Live Application:** [https://collab-canvas-theta-one.vercel.app](https://collab-canvas-theta-one.vercel.app)

## Deliverables Checklist

### Core Requirements
- [x] **Frontend:** React-based UI with raw HTML5 Canvas implementation (No Fabric.js/Konva).
- [x] **Backend:** Node.js & Socket.io server for event broadcasting.
- [x] **Real-Time Sync:** Immediate propagation of drawing events to all connected clients.
- [x] **User Indicators:** Real-time cursors displaying user names and unique identification colors.
- [x] **Global Undo/Redo:** Implementation of "Atomic Stroke" logic to undo specific user actions without disrupting the shared state.
- [x] **Conflict Resolution:** Server-side stroke identification prevents race conditions during concurrent edits.
- [x] **Variable Stroke Width:** UI controls for dynamic brush sizing.
- [x] **Eraser Tool:** Dedicated tool for content removal.

### Bonus Features Implemented

- [x] **Image Export:** Functionality to save the current canvas state as a PNG file.
- [x] **Touch Event Handling:** Basic support for touch-based devices.
- [x] **Latency Simulation:** UI indicator for network status.

## Setup Instructions

### Prerequisites
* Node.js (v18 or higher)
* npm (Node Package Manager)

### 1. Repository Setup
Clone the repository and navigate to the project root:
```bash
git clone https://github.com/jayziee24/collab-canvas.git
cd collab-canvas
```

### 2. Backend Initialization

The server handles WebSocket connections and maintains the in-memory drawing history.

```bash
cd server
npm install
npm start
# Output: Server is running on port 3001
```

### 3. Frontend Initialization

The client application provides the drawing interface and state visualization.

```bash
cd client
npm install
npm run dev
# Output: Local: http://localhost:5173
```

## Testing Protocol
To verify the application functionality, please follow these steps:

**Synchronization Test:** Open the application in two distinct browser windows. Drawing in one window should result in immediate updates in the second window.

**Identity Verification:** Hover over the "Online" status indicator. The current user is marked as "(You)", verifying that socket IDs are correctly mapped to local state.

**Atomic Undo Test:**

User A draws a shape.

User B draws a shape overlapping User A's drawing.

User A clicks "Undo".

Expected Result: Only User A's shape is removed. User B's drawing remains intact. This confirms the server is filtering history by Stroke ID rather than performing a simple stack pop.

## Technical Architecture
**Network Optimization:** The application utilizes a batching strategy. Mouse movement events are buffered and emitted in 50ms intervals. This reduces network request frequency by approximately 90% while maintaining visual fidelity through client-side line interpolation.

**State Management:** The server acts as the single source of truth, maintaining an ordered array of draw events (drawHistory). Client-side rendering is handled via refs to prevent unnecessary React re-renders during high-frequency drawing operations.

## Known Limitations
**Latency:** The production server is hosted in a standard availability zone. Users connecting from geographically distant regions may observe network latency inherent to the physical distance.

**Data Persistence:** Drawing history is stored in server RAM. A server restart will reset the canvas state.

## Time Allocation
**Total Development Time: 25 Hours**

* **Core Architecture (8 Hours):** Canvas API implementation and WebSocket event stream configuration.

* **State Synchronization (10 Hours):** Developing the Atomic Stroke ID logic to solve the interleaved undo/redo problem.

* **UI/UX & Refinement (5 Hours):** Implementing the toolbar, user list, and responsive layout adjustments.

* **Deployment & Documentation (2 Hours):** Configuration of Vercel/Render pipelines and documentation writing.
