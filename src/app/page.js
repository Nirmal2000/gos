"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Base64 } from 'js-base64';

const API_URL = "https://api.gumroad.com/v2/licenses/verify";



export default function Home() {
  const [userText, setUserText] = useState("");  
  const router = useRouter();
  const [buttonLoading, setButtonLoading] = useState(false);  
  const [activationKey, setActivationKey] = useState("");  
  const [buttonText, setButtonText] = useState("Activate Key"); 
  const [isKeyActivated, setIsKeyActivated] = useState()
  
  
  const handleKeySubmit = async (e) => {
    e.preventDefault();
    setButtonLoading(true);
    
    // Make API request to verify the license
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        product_id: "jBiOzSf-G99a3MDu7whIiA==", // Replace with your product ID
        license_key: activationKey,
        increment_uses_count: "true", // Optional
      }),
    });

    const data = await response.json();

    // Check if the activation is successful
    if (data.success) {            
      setIsKeyActivated(true); // Update the state      
      
    } else {
      alert("Invalid Activation key!"); // Display an error message
    }

    setButtonLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();   
    setButtonLoading(true); 
    router.push(`/api/connect?userText=${encodeURIComponent(userText)}&actkey=${localStorage.getItem('activation_key_')}`);    
  };

  return (    
    <div className="relative flex flex-col items-center justify-center min-h-screen custom-background from-blue-800 to-blue-600 px-4 pt-20 sm:pt-2">


      <div className="flex-grow flex flex-col items-center justify-center"> 
      {/* Title */}
      <h1 className="font-brunoAce text-white text-[64px] sm:text-[102px] leading-[78px] sm:leading-[123px] text-center mb-1 sm:mb-20 mt-1 sm:mt-1">
        Goal OS
      </h1>
      
      <h2 className="font-abeeZee text-white text-[14px] sm:text-[18px] leading-[20px] sm:leading-[24px] text-center mb-1 sm:mb-1">
        Don’t be shy, tell us your goal 😉!
      </h2>
      {/* } */}

      {!isKeyActivated && (
        <form onSubmit={handleKeySubmit} className="relative w-full max-w-[628px] mt-6">
          <p className="font-abeeZee text-white text-[10px] sm:text-[15px] leading-[20px] sm:leading-[24px] text-center mb-1 sm:mb-1">
        Get your activation key <a href="https://sachinsoundar.gumroad.com/l/goalos" className="underline">here!</a>
          </p>
          <input
            type="text"
            value={activationKey}
            onChange={(e) => setActivationKey(e.target.value)}
            className="relative text-center w-full h-[45px] pl-4 pr-4 rounded-[32px] bg-gray-200/25 placeholder:text-white/60 font-abeeZee text-[20px] leading-[24px] outline-none z-10"
            placeholder="Enter your activation key"
            required
          />
          <button
            type="submit"
            className="w-[160px] h-[40px] mt-7 mx-auto bg-gray-200/90 backdrop-blur-md rounded-[30px] text-[#2C4C80] font-abeeZee font-medium text-[15px] leading-[24px] text-center flex items-center justify-center"
          >
            {buttonLoading ? "Activating..." : buttonText} {/* Show button text */}
          </button>
        </form>
      )}

      {isKeyActivated && (
        <form onSubmit={handleSubmit} className="relative w-full max-w-[628px] mt-6">
          {/* Input field container */}
          <div className="relative w-full h-[45px]">
            {/* Background with blur effect */}
            <div className="absolute inset-0 bg-gray-200/25 backdrop-blur-sm rounded-[32px]"></div>

            {/* Icon/Image on the left side */}
            <div className="absolute left-0 top-1/2 transform opacity-80 -translate-y-1/2 w-[50.85px] h-[57px] bg-[url('/images/shine.png')] bg-cover"></div>

            {/* Input field (not affected by blur) */}
            <input
              type="text"
              value={userText}
              onChange={(e) => setUserText(e.target.value)}
              className="relative w-full h-full pl-[50px] pr-4 py-2 rounded-[32px] bg-transparent text-white placeholder:text-white/60 font-abeeZee text-[16px] leading-[24px] outline-none z-10"
              placeholder="I wanna start a drop shipping business. Within a month."
              required
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            className="w-[160px] h-[40px] mt-7 mx-auto bg-gray-200/90 backdrop-blur-md rounded-[30px] text-[#2C4C80] font-abeeZee font-bold text-[15px] leading-[24px] text-center flex items-center justify-center"
          >
            {buttonLoading ? (
              <div className="loader rounded-full border-4 border-t-transparent border-[#2C4C80] w-4 h-4 animate-spin"></div>
            ) : (
              'Connect to Notion'
            )}
          </button>
        </form>
      )}

      </div>

      <footer className="pb-10 sm:mt-16 flex items-center justify-center gap-6 ">
          <img src="/images/notion-logo.svg" alt="Notion Logo" className="w-24 h-24" />
          <img src="/images/by.svg" alt="Third Logo" className="w-4 h-4" />          
          <img src="/images/notiontemplateslogo.svg" alt="Notion Templates Logo" className="w-24 h-24" />
        </footer>
    </div>
  );
}
