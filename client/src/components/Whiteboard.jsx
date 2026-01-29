import { useEffect, useRef } from "react";

const Whiteboard = ({ socket }) => {
  const canvasRef = useRef(null);
  const isDrawing = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });

  const strokeBuffer = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const setCanvasSize = () => {
      const parent = canvas.parentElement;
      canvas.width = parent.offsetWidth * window.devicePixelRatio;
      canvas.height = parent.offsetHeight * window.devicePixelRatio;

      canvas.style.width = `${parent.offsetWidth}px`;
      canvas.style.height = `${parent.offsetHeight}px`;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.lineWidth = 5;
      ctx.strokeStyle = "black";
    };
    setCanvasSize();
    window.addEventListener("resize", setCanvasSize);

    socket.on("draw_line", (data) => {
      if (!data.points || data.points.length === 0) return;
      const ctx = canvas.getContext("2d");
      ctx.beginPath();
      let p1 = data.points[0];
      ctx.moveTo(p1.x, p1.y);
      data.points.forEach((point) => {
        ctx.lineTo(point.x, point.y);
      });
      ctx.stroke();
    });
    const interval = setInterval(() => {
      if (strokeBuffer.current.length > 0) {
        socket.emit("draw_line", {
          points: [...strokeBuffer.current],
          color: "black",
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
    };
  }, [socket]);

  const getMousePos = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const startDrawing = (e) => {
    isDrawing.current = true;
    const { x, y } = getMousePos(e);
    lastPos.current = { x, y };
    strokeBuffer.current = [{ x, y }];
  };

  const draw = (e) => {
    if (!isDrawing.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const { x, y } = getMousePos(e);

    ctx.beginPath();
    ctx.moveTo(lastPos.current.x, lastPos.current.y);
    ctx.lineTo(x, y);
    ctx.stroke();

    strokeBuffer.current.push({ x, y });
    lastPos.current = { x, y };
  };

  const stopDrawing = () => {
    isDrawing.current = false;
    strokeBuffer.current = [];
  };

  return (
    <canvas
      ref={canvasRef}
      onMouseDown={startDrawing}
      onMouseMove={draw}
      onMouseUp={stopDrawing}
      onMouseLeave={stopDrawing}
      className="cursor-crosshair touch-none"
    />
  );
};

export default Whiteboard;
