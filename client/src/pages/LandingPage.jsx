// src/pages/LandingPage.jsx
import React, { useState, useRef, useEffect } from "react";
import Layout from "../Components/Layout/Layout";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import backgroundImage from "@/assets/background.png";
import {
  FaMicrophone,
  FaArrowLeft,
  FaArrowRight,
  FaPaintBrush
} from "react-icons/fa";

export default function LandingPage() {
  const [sliderRef, slider] = useKeenSlider({
    loop: true,
    slides: { perView: 1, spacing: 15 },
    animation: {
      duration: 800,
      easing: (t) => t * (2 - t),
    },
    drag: true,
    created(slider) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("animate-fadeInUp");
            } else {
              entry.target.classList.remove("animate-fadeInUp");
            }
          });
        },
        { threshold: 0.1 }
      );

      document.querySelectorAll(".keen-slider__slide").forEach((slide) => {
        observer.observe(slide);
      });
    },
  });

  const [text, setText] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [editImage, setEditImage] = useState(null);
  const [recording, setRecording] = useState(false);
  const [mode, setMode] = useState("Tailored");
  const recognitionRef = useRef(null);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const handleVoice = () => {
    if (!recording) {
      const recognition = new window.webkitSpeechRecognition();
      recognition.lang = "en-US";
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => setRecording(true);
      recognition.onend = () => setRecording(false);
      recognition.onresult = (e) => {
        setText(e.results[0][0].transcript);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } else {
      recognitionRef.current?.stop();
    }
  };

  const handleSave = (imageIndex) => {
    setShowPopup(true);
  };

  const handleEdit = (imageIndex) => {
    setEditImage(`/img${imageIndex}.png`);
    setShowEditPopup(true);
  };

  const handleGenerate = () => {
    alert("Generate feature coming soon!");
  };

  const handleBrushClick = () => {
    alert("Brush tool activated (inpainting placeholder)");
  };

  return (
    <Layout>
      <div className="h-screen overflow-hidden flex bg-white relative">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20 z-0"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        />

        <div className="flex-1 relative w-full z-10">
          <div className="flex flex-col justify-between p-4 max-w-4xl mx-auto h-full">
            <div className="flex justify-end items-center py-4">
              <div className="space-x-2">
                <button
                  onClick={() => setMode("Tailored")}
                  className={`px-4 py-2 rounded-full border ${
                    mode === "Tailored"
                      ? "bg-yellow-600 text-white"
                      : "bg-white text-yellow-600 border-yellow-600"
                  }`}
                >
                  Tailored
                </button>
                <button
                  onClick={() => setMode("Optional")}
                  className={`px-4 py-2 rounded-full border ${
                    mode === "Optional"
                      ? "bg-yellow-600 text-white"
                      : "bg-white text-yellow-600 border-yellow-600"
                  }`}
                >
                  Optional
                </button>
              </div>
            </div>

            <div className="relative w-full flex-1 flex items-center">
              <div ref={sliderRef} className="keen-slider w-full">
                {[1, 2, 3].map((num) => (
                  <div
                    key={num}
                    className="keen-slider__slide flex flex-col items-center justify-between space-y-6"
                  >
                    <div className="border border-yellow-600 rounded-xl overflow-hidden w-full h-[340px] max-w-xl">
                      <img
                        src={`/img${num}.png`}
                        alt={`Jewelry ${num}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex gap-6">
                      <button
                        onClick={() => handleSave(num)}
                        className="bg-white text-yellow-600 border border-yellow-600 px-8 py-3 rounded-full hover:bg-yellow-50 text-base"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => handleEdit(num)}
                        className="bg-white text-yellow-600 border border-yellow-600 px-8 py-3 rounded-full hover:bg-yellow-50 text-base"
                      >
                        Edit
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <button
                onClick={() => slider.current?.prev()}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-yellow-100 hover:bg-yellow-200 text-yellow-700 rounded-full p-4 shadow-lg"
              >
                <FaArrowLeft />
              </button>
              <button
                onClick={() => slider.current?.next()}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-yellow-100 hover:bg-yellow-200 text-yellow-700 rounded-full p-4 shadow-lg"
              >
                <FaArrowRight />
              </button>
            </div>

            <div className="relative w-full mx-auto mt-4">
              <input
                type="text"
                value={recording ? "Recording..." : text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Describe your jewelry design or speak..."
                className={`w-full border-2 border-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-400 p-4 pl-14 rounded-full text-base ${
                  recording ? "text-yellow-600" : ""
                }`}
                readOnly={recording}
              />
              <button
                onClick={handleVoice}
                className="absolute left-5 top-1/2 transform -translate-y-1/2 text-yellow-600"
              >
                <FaMicrophone size={20} />
              </button>
            </div>

            <div className="flex justify-center mt-4 mb-2">
              <button
                onClick={handleGenerate}
                className="bg-yellow-600 text-white border border-yellow-600 px-20 py-5 rounded-full hover:bg-yellow-700 text-base shadow-md"
              >
                Generate
              </button>
            </div>

            {showPopup && (
              <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                <div className="bg-white p-8 rounded-xl shadow-lg space-y-4 text-center border border-yellow-600">
                  <h2 className="text-lg font-serif text-yellow-600">
                    Your design has been saved successfully.
                  </h2>
                  <button
                    onClick={() => setShowPopup(false)}
                    className="bg-yellow-600 text-white px-6 py-2 rounded-full text-base"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}

            {showEditPopup && (
              <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                <div className="bg-white p-6 rounded-xl shadow-lg space-y-4 w-full max-w-2xl relative border border-yellow-600">
                  <button
                    onClick={() => setShowEditPopup(false)}
                    className="absolute top-3 right-3 text-yellow-600 text-xl font-bold"
                  >
                    ✕
                  </button>
                  <div className="w-full h-[300px] border border-yellow-600 rounded-xl overflow-hidden relative">
                    <img
                      src={editImage}
                      alt="Edit Jewelry"
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={handleBrushClick}
                      className="absolute top-3 left-3 bg-white border border-yellow-600 text-yellow-600 px-4 py-2 rounded-full hover:bg-yellow-50 shadow"
                    >
                      <FaPaintBrush className="inline mr-2" /> Brush
                    </button>
                  </div>
                  <input
                    type="text"
                    placeholder="Describe your edit..."
                    className="w-full border border-yellow-600 rounded-full p-3 text-base focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  />
                  <button
                    className="w-full border border-yellow-600 text-yellow-600 rounded-full py-3 hover:bg-yellow-50"
                  >
                    Submit Edit
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
