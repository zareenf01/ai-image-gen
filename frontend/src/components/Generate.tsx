import React, { useState } from "react";
import { Link } from "react-router-dom";
import { PlaceholdersAndVanishInput } from "./ui/Input";
import axios from "axios";
import { TypewriterEffect } from "./ui/TypeWrite";
function Generate() {
  const placeholders = [
    "What would you like to generate?",
    "Enter your prompt here...",
    "Try something creative...",
  ];

  const [prompt, setPrompt] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const api = import.meta.env.VITE_API_URL;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPrompt(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitted prompt:", prompt);

    if (!prompt.trim()) {
      setError("Please enter a prompt");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const response = await axios.post(
        `${api}`,
        { prompt },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Response:", response.status);

      if (response.status === 200) {
        setImageUrl(`data:image/jpeg;base64,${response.data.image_data}`);

        console.log("Image set");
      } else {
        console.error("Error:", response.data);
        setError("Failed to generate image");
      }
    } catch (error) {
      console.error("Error generating image:", error);
      setError("Error connecting to server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-3 flex flex-col justify-center ">
      <div className="flex flex-col md:flex-row  p-5 md:mx-8">
        <Link to="/">
          <h1 className="text-3xl font-bold text-white">Imagify.</h1>
        </Link>
      </div>
      <div className="w-full flex flex-col  h-screen ">
        {loading && (
          <div className="text-center -pt-10">
            <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-yellow-500 mx-auto"></div>
            <h2 className="text-zinc-900 dark:text-white mt-4">
              Please wait...
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400">
              Generating your Image
            </p>
          </div>
        )}

        {error && (
          <div className="mb-4 text-white bg-red-800 p-3 rounded-lg">
            {error}
          </div>
        )}

        {imageUrl && (
          <div className="mt-8 mb-8 mx-auto">
            <img
              src={imageUrl}
              alt="Generated"
              className="rounded-lg shadow-lg max-w-lg"
            />
          </div>
        )}

        {!imageUrl && !loading && (
          <div className="mt-28 mb-28">
            <TypewriterEffect
              words={[
                { text: "Generate" },
                { text: "awesome" },
                { text: "images" },
                { text: "with" },
                { text: "Imagify" },
              ]}
              className="text-white text-center text-3xl md:text-6xl"
            />
          </div>
        )}

        <PlaceholdersAndVanishInput
          placeholders={placeholders}
          onChange={handleChange}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}

export default Generate;
