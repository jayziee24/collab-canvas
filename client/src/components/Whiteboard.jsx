import { useEffect, useRef } from "react";

const Whiteboard = () => {
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

    const interval = setInterval(() => {
      if(strokeBuffer.current.length > 0){
        const packet = {
          type: "draw_line",
          points: [...strokeBuffer.current],
          color: "black",
          width: 5
        }
        console.log("Packet Ready:", packet);

        strokeBuffer.current = [];
      }
    },50)

    return () => {
      window.removeEventListener("resize", setCanvasSize);
      clearInterval(interval);
    };

  }, []);

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

    strokeBuffer.current.push({x, y});
    lastPos.current = { x, y };
  };

  const stopDrawing = () => {
    isDrawing.current = false;
  };

  return (
    <canvas
      ref={canvasRef}
      onMouseDown={startDrawing}
      onMouseMove={draw}
      onMouseUp={stopDrawing}
      onMouseLeave={stopDrawing}
      style={{
        border: "1px solid #ccc",
        cursor: "crosshair",
        touchAction: "none",
      }}
    />
  );
};

export default Whiteboard;
