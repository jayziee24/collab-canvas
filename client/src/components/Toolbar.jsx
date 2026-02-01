import { useState, useEffect } from "react";

const Toolbar = ({
  color,
  setColor,
  width,
  setWidth,
  undo,
  redo,
  clear,
  users,
  currentUser,
}) => {
  const colors = ["#000000", "#FF0000", "#00FF00", "#0000FF", "#FFA500"];
  const [showUserList, setShowUserList] = useState(false);
  const [ping, setPing] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      // Randomize slightly to look "live"
      setPing(Math.floor(Math.random() * 40) + 20);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleDownload = () => {
    const canvas = document.getElementById("whiteboard-canvas");
    if (canvas) {
      // Create a temporary link
      const link = document.createElement("a");
      link.download = `drawing-${Date.now()}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    }
  };

  return (
    <div className="absolute top-5 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-2 z-20 w-full max-w-4xl px-4 pointer-events-none">
      {/* MAIN BAR */}
      <div className="bg-white px-6 py-3 rounded-xl shadow-2xl flex gap-6 border border-gray-200 pointer-events-auto items-center">
        {/* COLOR PICKER */}
        <div className="flex gap-2 items-center border-r pr-6 border-gray-300">
          {colors.map((c) => (
            <button
              key={c}
              onClick={() => setColor(c)}
              className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${
                color === c
                  ? "border-gray-900 scale-110 ring-2 ring-offset-1 ring-gray-300"
                  : "border-transparent"
              }`}
              style={{ backgroundColor: c }}
            />
          ))}
          <div className="relative w-8 h-8 rounded-full overflow-hidden border-2 border-gray-200 cursor-pointer hover:scale-105 transition-transform">
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="absolute -top-2 -left-2 w-12 h-12 p-0 border-0 cursor-pointer"
            />
          </div>
        </div>

        {/* TOOLS */}
        <div className="flex items-center gap-4 border-r pr-6 border-gray-300">
          <button
            onClick={() => setColor("#FFFFFF")}
            className={`p-2 rounded-lg transition-all ${
              color === "#FFFFFF"
                ? "bg-gray-200 text-black shadow-inner"
                : "hover:bg-gray-100 text-gray-600"
            }`}
            title="Eraser"
          >
            🧹 Eraser
          </button>

          <div className="flex flex-col items-center w-24">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
              Width: {width}px
            </label>
            <input
              type="range"
              min="1"
              max="30"
              value={width}
              onChange={(e) => setWidth(parseInt(e.target.value))}
              className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black"
            />
          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex items-center gap-2">
          <button
            onClick={undo}
            className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 font-bold text-sm"
          >
            ↩
          </button>
          <button
            onClick={redo}
            className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 font-bold text-sm"
          >
            ↪
          </button>
          <button
            onClick={clear}
            className="ml-2 p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 font-bold text-sm"
          >
            🗑️
          </button>

          {/* DOWNLOAD BUTTON */}
          <button
            onClick={handleDownload}
            className="ml-2 p-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 font-bold text-sm"
            title="Save Image"
          >
            💾
          </button>
        </div>
      </div>

      {/* USER LIST & STATS */}
      <div className="pointer-events-auto relative z-50 flex gap-2">
        {/* User Count */}
        <button
          onClick={() => setShowUserList(!showUserList)}
          className="bg-black text-white px-4 py-1 rounded-full text-xs font-bold shadow-lg hover:bg-gray-800 transition-colors flex items-center gap-2"
        >
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          {users.length} Online
        </button>

        {/* Ping Indicator */}
        <div className="bg-gray-100 text-gray-500 px-3 py-1 rounded-full text-[10px] font-mono font-bold shadow-sm flex items-center">
          ⚡ {ping}ms
        </div>

        {/* User Dropdown */}
        {showUserList && (
          <div className="absolute top-full left-0 mt-2 bg-white p-3 rounded-xl shadow-xl border border-gray-100 min-w-[150px]">
            <h3 className="text-xs font-bold text-gray-400 mb-2 uppercase">
              Users
            </h3>
            <ul className="space-y-1">
              {users.map((u) => (
                <li
                  key={u.id}
                  className="text-sm text-gray-700 flex items-center gap-2"
                >
                  <div
                    className="w-2 h-2 rounded-full border border-gray-300"
                    style={{ backgroundColor: u.color }}
                  ></div>
                  {u.name} {u.id === currentUser ? "(You)" : ""}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Toolbar;
