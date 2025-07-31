import { useState, useEffect, useRef } from "react";
import { Howl } from "howler";
import confetti from "canvas-confetti";
import axios from "axios";

const modes = {
  focus: { label: "Focus", minutes: 25, color: "bg-purple-600" },
  short: { label: "Short Break", minutes: 5, color: "bg-green-500" },
  long: { label: "Long Break", minutes: 15, color: "bg-blue-500" },
};

const sounds = {
  none: null,
  lofi: "/sounds/lofi.mp3",
  nature: "/sounds/nature.mp3",
};

export default function Pomodoro() {
  const [mode, setMode] = useState("focus");
  const [secondsLeft, setSecondsLeft] = useState(modes[mode].minutes * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [soundChoice, setSoundChoice] = useState("lofi");
  const [log, setLog] = useState([]);

  const soundRef = useRef(null);

  useEffect(() => {
    setSecondsLeft(modes[mode].minutes * 60);
  }, [mode]);

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsRunning(false);
          triggerConfetti();
          playSound();
          updateLog(mode);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning]);

  useEffect(() => {
    if (soundChoice !== "none") {
      soundRef.current = new Howl({
        src: [sounds[soundChoice]],
        loop: true,
        volume: 0.3,
      });
      soundRef.current.play();
    }

    return () => {
      if (soundRef.current) soundRef.current.stop();
    };
  }, [soundChoice]);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/pomodoro/today", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setLog(res.data);
      } catch (error) {
        console.error("Failed to fetch logs", error);
      }
    };
    fetchLogs();
  }, []);

  const triggerConfetti = () => {
    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
  };

  const playSound = () => {
    new Audio("/sounds/done.mp3").play();
  };

  const updateLog = async (type) => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.post(
        "http://localhost:5000/api/pomodoro/log",
        { mode: type },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setLog((prev) => [...prev, res.data]); // append new log
    } catch (error) {
      console.error("Failed to save log", error);
    }
  };

  const formatTime = () => {
    const m = Math.floor(secondsLeft / 60).toString().padStart(2, "0");
    const s = (secondsLeft % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <div className="min-h-screen overflow-y-auto bg-gradient-to-br from-[#E0C3FC] via-[#8EC5FC] to-[#E0C3FC] dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 text-gray-800 dark:text-gray-100 flex flex-col items-center px-6 py-12 space-y-8">
      <div className="max-w-xl w-full space-y-10">
        {/* Heading */}
        <div className="text-center">
          <h1 className="text-5xl font-extrabold text-white drop-shadow">🍅 Pomodoro Palace</h1>
          <p className="text-white text-md mt-2 italic">Crush goals, take breaks, vibe hard 🎧🔥</p>
        </div>

        {/* Mode Buttons */}
        <div className="flex flex-wrap justify-center gap-4">
          {Object.entries(modes).map(([key, value]) => (
            <button
              key={key}
              onClick={() => {
                setMode(key);
                setIsRunning(false);
              }}
              className={`px-5 py-2 rounded-full font-semibold transition duration-200 shadow ${
                mode === key
                  ? `${value.color} text-white`
                  : "bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-600"
              }`}
            >
              {value.label}
            </button>
          ))}
        </div>

        {/* Timer Display */}
        <div className="bg-white/30 dark:bg-gray-700/40 backdrop-blur-xl border border-white/30 dark:border-gray-600 shadow-xl rounded-3xl p-12 text-center">
          <div className="text-6xl font-mono font-bold text-white drop-shadow">{formatTime()}</div>
          <p className="text-sm text-white mt-1">{modes[mode].label} Mode</p>
        </div>

        {/* Background Music Selector */}
        <div className="bg-white/20 dark:bg-gray-600/40 backdrop-blur-xl p-4 rounded-xl shadow text-center border border-white/30 dark:border-gray-500 space-y-2">
          <p className="font-medium text-white">🎵 Choose Background Vibe</p>
          <div className="relative inline-block w-full">
            <select
              value={soundChoice}
              onChange={(e) => setSoundChoice(e.target.value)}
              className="block w-full px-4 py-2 rounded-lg appearance-none bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 font-semibold shadow focus:outline-none"
            >
              <option value="none">🚫 None</option>
              <option value="lofi">🎧 Lofi</option>
              <option value="nature">🌿 Nature</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 dark:text-gray-300">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.23 8.29a.75.75 0 01.02-1.06z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => setIsRunning((prev) => !prev)}
            className="px-6 py-3 rounded-xl bg-purple-600 text-white font-bold hover:bg-purple-700 shadow"
          >
            {isRunning ? "Pause ⏸️" : "Start ▶️"}
          </button>
          <button
            onClick={() => {
              setSecondsLeft(modes[mode].minutes * 60);
              setIsRunning(false);
            }}
            className="px-6 py-3 rounded-xl bg-white/80 dark:bg-gray-700 text-gray-800 dark:text-gray-100 font-bold hover:bg-white dark:hover:bg-gray-600 shadow"
          >
            Reset 🔄
          </button>
        </div>
      </div>

      {/* Focus Log */}
      <div className="w-full max-w-xl mt-12 mb-10 bg-white/40 dark:bg-gray-700/40 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-white/30 dark:border-gray-600">
        <h3 className="text-xl font-semibold mb-4 text-white drop-shadow">📘 Today's Focus Log</h3>
        {log.length === 0 ? (
          <p className="text-white text-sm italic">No sessions completed yet.</p>
        ) : (
          <ul className="space-y-2 text-white">
            {log.map((entry, index) => (
              <li
                key={index}
                className="flex justify-between items-center bg-white/20 dark:bg-gray-600/50 px-4 py-2 rounded-lg shadow border border-white/20 dark:border-gray-500"
              >
                <span className="font-medium capitalize">{entry.mode}</span>
                <span className="text-sm opacity-80">
                  {new Date(entry.timestamp).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>

  );
}
