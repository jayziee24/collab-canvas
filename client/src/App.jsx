import io from "socket.io-client";
import Whiteboard from "./components/Whiteboard.jsx";

const socket = io.connect("http://localhost:3001");

function App() {
  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div className="p-4 bg-gray-100 border-b border-gray-300">
        <h1>Collaborative Canvas</h1>
      </div>
      <div style={{ flex: 1, overflow: "hidden" }}>
        <Whiteboard socket={socket} />
      </div>
    </div>
  );
}

export default App;
