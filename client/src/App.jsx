import { useEffect, useState } from "react";
import io from "socket.io-client";
import Toolbar from "./components/Toolbar";
import Whiteboard from "./components/Whiteboard";

const socket = io.connect("https://collab-canvas-server-td95.onrender.com");

function App() {
  const [color, setColor] = useState("#000000");
  const [width, setWidth] = useState(5);
  const [users, setUsers] = useState([]);

  const [myId, setMyId] = useState("");

  useEffect(() => {
    socket.on("connect", () => {
      setMyId(socket.id);
    });

    socket.on("users_update", (data) => {
      setUsers(data);
    });

    return () => {
      socket.off("users_update");
      socket.off("connect");
    };
  }, []);

  const handleUndo = () => socket.emit("undo");
  const handleRedo = () => socket.emit("redo");
  const handleClear = () => socket.emit("clear");

  return (
    <div className="h-screen w-screen flex flex-col bg-white overflow-hidden">
      <Toolbar
        color={color}
        setColor={setColor}
        width={width}
        setWidth={setWidth}
        undo={handleUndo}
        redo={handleRedo}
        clear={handleClear}
        users={users}
        currentUser={myId}
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
