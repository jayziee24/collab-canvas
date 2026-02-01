import { useState } from "react";
import io from "socket.io-client";
import Toolbar from "./components/Toolbar"; // Import Toolbar
import Whiteboard from "./components/Whiteboard";

const socket = io.connect("http://localhost:3001");

function App() {
  const [color, setColor] = useState("#000000");
  const [width, setWidth] = useState(5);

  const handleUndo = () => {
    socket.emit("undo");
  }
  const handleClear = () => {
    socket.emit("clear");
  }

  return (
    <div className="h-screen w-screen flex flex-col bg-gray-50 overflow-hidden">
      <Toolbar
        color={color}
        setColor={setColor}
        width={width}
        setWidth={setWidth}
        undo={handleUndo}
        clear={handleClear}
      />
      <div className="flex-1 relative">
        <Whiteboard
          socket={socket}
          selectedColor={color}
          selectedWidth={width}
        />
      </div>
    </div>
  );
}

export default App;
