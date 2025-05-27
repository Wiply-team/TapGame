"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { animate, press } from "motion";
import { motion, AnimatePresence } from "framer-motion";
import { text } from "stream/consumers";


export default function TapGame() {
  const [tapCount, setTapCount] = useState(0);
  const [timeLeftMs, setTimeLeftMs] = useState(10000); // 10 секунд = 10000 мс
  const [gameOver, setGameOver] = useState(false);
  const [started, setStarted] = useState(false);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [seconds, setSeconds] = useState(10);
  const [textColor, setTextColor] = useState<string>("#000000");



  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const circleRef = useRef<HTMLDivElement | null>(null);

  const isMobile = () =>
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setImageSrc(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const resetImage = () => {
    setImageSrc(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleTap = useCallback(() => {
    if (!started) setStarted(true);
    if (gameOver) return;

    setTapCount((prev) => prev + 1);

    if (circleRef.current) {
      animate(circleRef.current! as any, { transform: "scale(0.9)" }, { duration: 0.1 }).finished.then(() => {
        animate(circleRef.current! as any, { transform: "scale(1)" }, { duration: 0.15 });
      });

    }
  }, [started, gameOver]);

useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.code === "Space") {
      e.preventDefault();
      handleTap();
    }
  };

  window.addEventListener("keydown", handleKeyDown);
  return () => window.removeEventListener("keydown", handleKeyDown);
}, [handleTap]);



  function formatTime(ms: number) {
    const sec = Math.floor(ms / 1000);
    const centis = Math.floor((ms % 1000) / 10);

    const secStr = sec < 10 ? `0${sec}` : `${sec}`;
    const centisStr = centis < 10 ? `0${centis}` : `${centis}`;

    return `${secStr}.${centisStr}`;
  }

  useEffect(() => {
    if (timeLeftMs === 0) setGameOver(true);
  }, [timeLeftMs]);

  useEffect(() => {
    if (!gameOver && started) {
      const start = performance.now();

      const interval = setInterval(() => {
        const elapsed = performance.now() - start;
        const remaining = Math.max(10000 - elapsed, 0);

        setTimeLeftMs(remaining);
        setSeconds(Math.floor(remaining / 1000));
        if (remaining <= 0) {
          clearInterval(interval);
          setGameOver(true);
        }
      }, 50);

      return () => clearInterval(interval);
    }
  }, [gameOver, started]);



  const resetGame = () => {
    setTapCount(0);
    setTimeLeftMs(10000);
    setGameOver(false);
    setStarted(false);
  };

  return (
    <div className="relative z-10 flex flex-col items-center justify-center min-h-screen w-full h-full">

      <div className="absolute top-4 left-4 flex gap-2 hidden sm:flex">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          ref={fileInputRef}
          className="text-sm text-black"
        />
        <button
          onClick={resetImage}
          className="px-2 py-1 bg-red-500 text-white rounded"
        >
          Reset to Default
        </button>
      </div>

      <h2 className="text-4xl font-semibold text-black mb-4"
        style={{ fontFamily: "Bungee, sans-serif" }}
      >

      </h2>


      <div className="absolute top-4 right-4 z-20">
        <input
          type="color"
          value={textColor}
          onChange={(e) => setTextColor(e.target.value)}
          className="w-10 h-10 p-0 border-0"
        />
      </div>


      {/* <h3 className="text-lg text-black mb-6">Clicks: {tapCount}</h3> */}

      {started && (
        <div
          className="absolute inset-0 flex sm:items-center sm:justify-center sm:p-0 items-start justify-center p-4 pointer-events-none select-none"
          style={{
            fontSize: "50vw",
            fontWeight: "900",
            color: `${textColor}26`,

            transform: "rotate(-20deg) skewY(10deg) translate(80px, -60px)",
            textShadow: "10px 10px 30px rgba(0,0,0,0.3)",
            zIndex: 0,
            fontFamily: "Bungee, sans-serif",
          }}
        >
          {tapCount}
        </div>

      )}

      <div
        ref={circleRef}
        onClick={!isMobile() ? handleTap : undefined}
        onTouchStart={isMobile() ? handleTap : undefined}
        className="relative rounded-full overflow-hidden cursor-pointer flex-shrink-0 shadow-lg shadow-black-500/50"
        style={{
          width: "80vw",
          height: "80vw",
          maxWidth: "400px",
          maxHeight: "400px",
          backgroundColor: imageSrc ? "transparent" : textColor,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {imageSrc && (
          <img
            src={imageSrc}
            alt="Uploaded"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        )}
      </div>

      {/* ТАЙМЕР */}
      <h2
        className="text-4xl font-semibold text-black mt-4 sm:absolute sm:top-[20%] sm:left-1/2 sm:transform sm:-translate-x-1/2 sm:mb-4"
        style={{ fontFamily: "Bungee, sans-serif", color: textColor }}
      >
        <motion.span
          key={seconds}
          animate={{ scale: [1, 1.3, 1], opacity: [1, 0.8, 1] }}
          transition={{ duration: 0.4 }}
          className="inline-block"
        >
          {!started ? "Tap the circle" : formatTime(timeLeftMs)}
        </motion.span>
      </h2>

      {gameOver && (
        <div className="text-center animate-fade-in"
          style={{ fontFamily: "Bungee, sans-serif" }}
        >
          {/* <h2 className="text-2xl font-semibold text-black">Game over!</h2>
          <p className="text-black">You tapped {tapCount} times!</p> */}
          <button
            onClick={resetGame}
            className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Again
          </button>
        </div>
      )}
    </div>
  );
}
