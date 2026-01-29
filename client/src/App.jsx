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
      <div style={{ padding: "10px", background: "#f0f0f0" }}>
        <h1>Collaborative Canvas</h1>
      </div>
      <div style={{ flex: 1, overflow: "hidden" }}>
        <Whiteboard />
      </div>
    </div>
  );
}

export default App;
