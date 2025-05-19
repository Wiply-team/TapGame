"use client";
import dynamic from "next/dynamic";
import { useState, useRef } from "react";
import FountainParticles from "@/components/FountainParticles";

// Динамический импорт с отключением SSR
const PhaserGame = dynamic(() => import('@/components/PhaserGame'), { ssr: false });

export default function Home() {
  const [particleImage, setParticleImage] = useState<string>("https://upload.wikimedia.org/wikipedia/commons/7/78/BlackStar.PNG");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setParticleImage(reader.result as string);
    reader.readAsDataURL(file);
  };

  return (
     <main className="relative bg-gradient-to-br from-blue-100 to-blue-300 min-h-screen flex flex-col justify-center items-center">

    {/* <main className="relative min-h-screen flex flex-col justify-center items-center bg-transparent"> */}
      <div className="absolute top-20 left-4 z-30 flex flex-col gap-2 hidden sm:flex">
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="text-black"
        />
        <button
          onClick={() => setParticleImage("https://upload.wikimedia.org/wikipedia/commons/7/78/BlackStar.PNG")}
          className="px-2 py-1 bg-blue-500 text-white rounded"
        >
          Reset to Default
        </button>
      </div>
      <PhaserGame />
      <FountainParticles particleImage={particleImage} />
    </main>
  );

}
