import { useEffect, useRef, useState } from "react";

const Whiteboard = ({ socket, selectedColor, selectedWidth }) => {
  const canvasRef = useRef(null);
  const isDrawing = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });
  const strokeBuffer = useRef([]);

  const colorRef = useRef(selectedColor);
  const widthRef = useRef(selectedWidth);

  const [cursors, setCursors] = useState({});
  const currentStrokeId = useRef(null);

  // Keep refs updated for event listeners
  useEffect(() => {
    colorRef.current = selectedColor;
    widthRef.current = selectedWidth;
  }, [selectedColor, selectedWidth]);

  // --- 1. SOCKET & CANVAS SETUP ---
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const setCanvasSize = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.offsetWidth * window.devicePixelRatio;
        canvas.height = parent.offsetHeight * window.devicePixelRatio;
        canvas.style.width = `${parent.offsetWidth}px`;
        canvas.style.height = `${parent.offsetHeight}px`;
        ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
      }
    };
    setCanvasSize();
    window.addEventListener("resize", setCanvasSize);

    // Socket Listeners
    socket.on("draw_line", (data) => {
      if (!data.points || data.points.length === 0) return;
      const ctx = canvas.getContext("2d");
      ctx.beginPath();
      ctx.strokeStyle = data.color || "black";
      ctx.lineWidth = data.width || 5;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      let p1 = data.points[0];
      ctx.moveTo(p1.x, p1.y);
      data.points.forEach((point) => ctx.lineTo(point.x, point.y));
      ctx.stroke();
    });

    socket.on("board_state", (history) => {
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      history.forEach((data) => {
        if (!data.points || data.points.length === 0) return;
        ctx.beginPath();
        ctx.strokeStyle = data.color || "black";
        ctx.lineWidth = data.width || 5;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        let p1 = data.points[0];
        ctx.moveTo(p1.x, p1.y);
        data.points.forEach((point) => ctx.lineTo(point.x, point.y));
        ctx.stroke();
      });
    });

    socket.on("cursor_update", ({ id, x, y, name, color }) => {
      setCursors((prev) => ({ ...prev, [id]: { x, y, name, color } }));
    });

    // Emitting Loop
    const interval = setInterval(() => {
      if (strokeBuffer.current.length > 0) {
        socket.emit("draw_line", {
          points: [...strokeBuffer.current],
          color: colorRef.current,
          width: widthRef.current,
          strokeId: currentStrokeId.current,
        });
        if (isDrawing.current) {
          const lastPoint =
            strokeBuffer.current[strokeBuffer.current.length - 1];
          strokeBuffer.current = [lastPoint];
        } else {
          strokeBuffer.current = [];
        }
      }
    }, 50);

    return () => {
      window.removeEventListener("resize", setCanvasSize);
      clearInterval(interval);
      socket.off("cursor_update");
      socket.off("draw_line");
      socket.off("board_state");
    };
  }, [socket]);

  // --- 2. DRAWING LOGIC ---
  const getPos = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
  };

  const draw = (x, y) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.beginPath();
    ctx.moveTo(lastPos.current.x, lastPos.current.y);
    ctx.lineTo(x, y);
    ctx.strokeStyle = colorRef.current; // Use Ref for latest color
    ctx.lineWidth = widthRef.current; // Use Ref for latest width
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.stroke();

    strokeBuffer.current.push({ x, y });
    lastPos.current = { x, y };
  };

  // --- 3. MANUAL EVENT LISTENERS (The Fix) ---
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleStart = (e) => {
      e.preventDefault(); // Stop scrolling immediately
      isDrawing.current = true;
      const { x, y } = getPos(e);
      lastPos.current = { x, y };
      strokeBuffer.current = [{ x, y }];
      currentStrokeId.current =
        Date.now().toString() + Math.random().toString(36).substring(2, 9);
    };

    const handleMove = (e) => {
      e.preventDefault(); // Stop scrolling immediately
      const { x, y } = getPos(e);
      socket.emit("cursor_move", { x, y });
      if (isDrawing.current) draw(x, y);
    };

    const handleEnd = (e) => {
      e.preventDefault();
      isDrawing.current = false;
      strokeBuffer.current = [];
    };

    // Attach with { passive: false } to allow preventing default
    canvas.addEventListener("touchstart", handleStart, { passive: false });
    canvas.addEventListener("touchmove", handleMove, { passive: false });
    canvas.addEventListener("touchend", handleEnd, { passive: false });

    // Mouse events don't need passive: false, but we can attach them here for consistency
    canvas.addEventListener("mousedown", handleStart);
    canvas.addEventListener("mousemove", handleMove);
    canvas.addEventListener("mouseup", handleEnd);
    canvas.addEventListener("mouseleave", handleEnd);

    return () => {
      canvas.removeEventListener("touchstart", handleStart);
      canvas.removeEventListener("touchmove", handleMove);
      canvas.removeEventListener("touchend", handleEnd);
      canvas.removeEventListener("mousedown", handleStart);
      canvas.removeEventListener("mousemove", handleMove);
      canvas.removeEventListener("mouseup", handleEnd);
      canvas.removeEventListener("mouseleave", handleEnd);
    };
  }, []); // Run once on mount

  return (
    <div className="relative w-full h-full bg-white">
      <canvas
        ref={canvasRef}
        id="whiteboard-canvas"
        className="cursor-crosshair touch-none block"
      />
      {Object.entries(cursors).map(([id, pos]) => (
        <div
          key={id}
          className="absolute w-4 h-4 rounded-full border-2 border-white shadow-sm pointer-events-none transition-transform duration-100 ease-linear"
          style={{
            backgroundColor: pos.color || "red",
            transform: `translate(${pos.x}px, ${pos.y}px)`,
            top: 0,
            left: 0,
          }}
        >
          <span className="absolute -top-6 left-0 text-[10px] bg-black text-white px-1.5 py-0.5 rounded whitespace-nowrap">
            {pos.name || id.slice(0, 4)}
          </span>
        </div>
      ))}
    </div>
  );
};

export default Whiteboard;
