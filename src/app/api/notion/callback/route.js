// src/app/api/notion/callback/route.js
import { NextResponse } from "next/server";
import { Base64 } from 'js-base64'; 

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const TOKEN_URL = "https://api.notion.com/v1/oauth/token";
const REDIRECT_URI = process.env.REDIRECT_URI;

// const PYTHON_API_URL = process.env.PYTHON_API_URL;
const ENCODING_KEY = process.env.ENCODING_KEY;

function encodeAccessToken(token, key) {
    const combined = `${token}:${key}`;
    return Base64.encode(combined);
  }

export async function GET(req) {
  // Extract authorization code from query params
  const { searchParams } = new URL(req.url);
  const authCode = searchParams.get("code");
  const userText = searchParams.get("state");

  // Exchange authorization code for access token
  const authHeader = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64");
  const tokenResponse = await fetch(TOKEN_URL, {
    method: "POST",
    headers: {
      Authorization: `Basic ${authHeader}`,
      "Content-Type": "application/json",
      "Notion-Version": "2022-06-28",
    },
    body: JSON.stringify({
      grant_type: "authorization_code",
      code: authCode,
      redirect_uri: REDIRECT_URI,
    }),
  });


  const tokenData = await tokenResponse.json();
  const accessToken = tokenData.access_token;
  const encodedAccessToken = encodeAccessToken(accessToken, ENCODING_KEY);
  
  const PYTHON_API_URL = 'https://gos-backend.onrender.com/api/process_data'
  // Start background processing (you can refactor this to an actual background process or use workers)
  fetch('https://gos-backend.onrender.com/api/process_data', {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      access_token: accessToken,
      user_text: userText, // This can come from the session or another source
    }),
  });

  const host = req.headers.get("host");
  const redirectUrl = `http://${host}/?encoded_token=${encodedAccessToken}&status=processing`;

  // Redirect to the homepage
  return NextResponse.redirect(redirectUrl);
}