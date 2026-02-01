const Toolbar = ({ color, setColor, width, setWidth, undo, clear }) => {
  const colors = ["#000000", "#FF0000", "#00FF00", "#0000FF", "#FFA500"];
  const widths = [3, 5, 10, 15];

  return (
    <div className="absolute top-5 left-1/2 transform -translate-x-1/2 bg-white px-6 py-3 rounded-xl shadow-xl flex gap-6 z-20 border border-gray-200">
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

        <div className="relative w-8 h-8 rounded-full overflow-hidden border-2 border-gray-200 cursor-pointer">
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="absolute -top-2 -left-2 w-12 h-12 p-0 border-0 cursor-pointer"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <span className="text-xs font-bold text-gray-400 uppercase">Size</span>
        <div className="flex gap-2">
          {widths.map((w) => (
            <button
              key={w}
              onClick={() => setWidth(w)}
              className={`rounded-full bg-gray-800 transition-all ${
                width === w
                  ? "bg-black ring-2 ring-offset-1 ring-gray-400"
                  : "bg-gray-300 hover:bg-gray-400"
              }`}
              style={{ width: w * 2, height: w * 2 }}
            />
          ))}
        </div>
      </div>
      <div className="flex items-center gap-2 border-l pl-6 border-gray-300">
        <button
          onClick={undo}
          className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-sm transition-colors"
        >
          ↩ Undo
        </button>
        <button
          onClick={clear}
          className="p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 font-bold text-sm transition-colors"
        >
          🗑️ Clear
        </button>
      </div>
    </div>
  );
};

export default Toolbar;
