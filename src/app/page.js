"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Base64 } from 'js-base64';



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

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Start the connect flow with the user text
    router.push(`/api/connect?userText=${encodeURIComponent(userText)}`);
  };

  // Loader logic when status is 'processing'
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

      // If status is "processing", poll for updates
      if (status === "processing" && token) {        
        setLoading(true);

        const pollStatus = async () => {          
          // const res = await fetch(process.env.PYTHON_API_CHECK_STATUS, {
          const res = await fetch('https://gos-backend.onrender.com/api/process_data', {
            method: "GET",
            headers: {
              "Authorization": `Bearer ${token}`, // Send token in headers
            },
          });
          const data = await res.json();

          if (data.status === "completed") {
            setLoading(false);
            setCompleted(true);
            localStorage.removeItem('access_token');
            localStorage.removeItem('status');
          } else {
            setTimeout(pollStatus, 5000); // Poll again in 3 seconds
          }
        };

        pollStatus();
      }
    }
  }, []);

  return (
    <div>
      {!loading && !completed && (
        <form onSubmit={handleSubmit}>
          <h1>Enter Your Goal or Description</h1>
          <input
            type="text"
            value={userText}
            onChange={(e) => setUserText(e.target.value)}
            required
          />
          <button type="submit">Connect to Notion</button>
        </form>
      )}

      {loading && (
        <div>
          <h1>Loading...</h1>
          <p>Processing your data. Please wait.</p>
        </div>
      )}

      {completed && (
        <div>
          <h1>Process Completed</h1>
          <p>Your data has been successfully processed!</p>
        </div>
      )}
    </div>
  );
}
