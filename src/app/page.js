"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Base64 } from 'js-base64';

const loaderTexts = [
  "Sending your goal to ChatGPT...",
  "Retrieving phases, tasks, and subtasks...",
  "Gathering necessary skills for your project...",
  "Preparing hidden tasks...",
  "Generating images for each phase...",
  "Connecting to Notion API...",
  "Creating task templates in Notion...",
  "Pushing data to Notion database...",
  "Establishing links between tasks and phases...",
  "Verifying data integrity...",
  "Checking for potential errors...",
  "Finishing touches on the setup...",
  "Finalizing the submission process...",
];

// Helper function to decode using Base64 with a secret key
function decodeAccessToken(encodedToken, key) {  
  const decoded = Base64.decode(encodedToken);
  const [token, providedKey] = decoded.split(':');
  if (providedKey === key) {
    return token;
  }
  return null; // Return null if the key doesn't match
}

export default function Home() {
  const [userText, setUserText] = useState("");
  const [loading, setLoading] = useState(false);
  const [completed, setCompleted] = useState(false);
  const router = useRouter();  
  const [accessToken, setAccessToken] = useState(null);
  const ENCODING_KEY = process.env.NEXT_PUBLIC_ENCODING_KEY;
  const [buttonLoading, setButtonLoading] = useState(false);
  const [currentLoaderText, setCurrentLoaderText] = useState(loaderTexts[0]);
  let loaderIndex = 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setButtonLoading(true);
    // Start the connect flow with the user text
    router.push(`/api/connect?userText=${encodeURIComponent(userText)}`);
  };
  useEffect(() => {
    if (loading) {
      const interval = setInterval(() => {
        loaderIndex = (loaderIndex + 1) % loaderTexts.length;
        setCurrentLoaderText(loaderTexts[loaderIndex]);
      }, 12000);

      return () => clearInterval(interval); // Clean up the interval on unmount
    }
  }, [loading]);
  
  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const encodedToken = urlParams.get("encoded_token");
      const status = urlParams.get("status");
      
      let token = undefined;
      if (encodedToken) {
        token = decodeAccessToken(encodedToken, ENCODING_KEY);        
      }
      console.log("-->",encodedToken, status, token)
      setAccessToken(token)

      // If status is "processing", poll for updates
      if (status === "processing" && token) {        
        setLoading(true);

        const pollStatus = async () => {          
          // const res = await fetch(process.env.PYTHON_API_CHECK_STATUS, {
          const res = await fetch('https://gos-backend.onrender.com/api/check_status', {
          // const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/check_status`, {
            method: "GET",
            headers: {
              "Authorization": `Bearer ${token}`, // Send token in headers
            },
          });
          const data = await res.json();

          if (data.status === "completed") {
            setLoading(false);
            setCompleted(true);            
            setButtonLoading(false);
          } else {
            setTimeout(pollStatus, 10000); // Poll again in 3 seconds
          }
        };

        pollStatus();
      }
    }
  }, []);

  const handleResetStatus = async () => {
    // const res = await fetch(`${process.env.BACKEND_URL}/api/reset_status`, {
    const res = await fetch('https://gos-backend.onrender.com/api/reset_status', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        access_token: accessToken,  // You need to pass the correct accessToken
      }),
    });

    const data = await res.json();
    if (data.status === "reset_successful") {
      setCompleted(false);
      setLoading(false);
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen from-blue-800 to-blue-600 bg-custom-gradient px-4 pt-8 sm:pt-12">
      {/* Title */}
      <h1 className="font-brunoAce text-white text-[64px] sm:text-[102px] leading-[78px] sm:leading-[123px] text-center mb-1 sm:mb-2 mt-4 sm:mt-6">
        Goal OS
      </h1>

      {/* Subtitle */}
      <h2 className="font-abeeZee text-white text-[14px] sm:text-[18px] leading-[20px] sm:leading-[24px] text-center mb-1 sm:mb-10">
        Don’t be shy, Enter all your thoughts! <br/>Goal + Specifications + Timeline
      </h2>

      {!loading && !completed && (
        <form onSubmit={handleSubmit} className="relative w-full max-w-[628px]">
          {/* Input field container */}
          <div className="relative w-full h-[45px]">
            {/* Background with blur effect */}
            <div className="absolute inset-0 bg-gray-200/25 backdrop-blur-sm rounded-[32px]"></div>

            {/* Icon/Image on the left side */}
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 w-[55.85px] h-[57px] bg-[url('/images/shine.png')] bg-cover"></div>

            {/* Input field (not affected by blur) */}
            <input
              type="text"
              value={userText}
              onChange={(e) => setUserText(e.target.value)}
              className="relative w-full h-full pl-[80px] pr-4 py-2 rounded-[32px] bg-transparent text-white placeholder:text-white/60 font-abeeZee text-[20px] leading-[24px] outline-none z-10"
              placeholder="I wanna start a drop shipping business. Within a month."
              required
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            className="w-[150px] h-[40px] mt-4 mx-auto bg-gray-200/90 backdrop-blur-md rounded-[30px] text-[#2C4C80] font-abeeZee font-medium text-[15px] leading-[24px] text-center flex items-center justify-center"
          >
            {buttonLoading ? (
              <div className="loader rounded-full border-4 border-t-transparent border-[#2C4C80] w-4 h-4 animate-spin"></div>
            ) : (
              'Connect to Notion'
            )}
          </button>
        </form>
      )}

      {loading && (
        <div className="flex flex-col items-center justify-center">
          <p className="text-white text-center mb-4 font-abeeZee text-[20px]">
            Loading...
          </p>

          <div className="loader rounded-full border-4 border-t-transparent border-white w-16 h-16 animate-spin mb-2"></div>          
          <p className="text-white text-center mb-4 font-abeeZee text-[11px]">
            {currentLoaderText}
          </p>
        </div>
      )}

      {completed && (
        <div className="flex flex-col items-center justify-center">
          <p className="text-white text-center mb-2 font-abeeZee text-[20px]">
            Process Completed
          </p>
          <p className="text-white text-center mb-4 font-abeeZee text-[15px]">
            Please check the Notion app
          </p>
          
    
          {/* Success Icon */}
          <div className="w-16 h-16 bg-[url('/images/success-icon.png')] bg-cover"></div>
        </div>
      )}

      <footer className="mt-10 sm:mt-16 flex items-center justify-center gap-6 ">          
          <img src="/images/notion-logo.svg" alt="Notion Logo" className="w-24 h-24" />
          <img src="/images/by.svg" alt="Third Logo" className="w-4 h-4" />          
          <img src="/images/notiontemplateslogo.svg" alt="Notion Templates Logo" className="w-24 h-24" />
        </footer>
    </div>
  );
}
