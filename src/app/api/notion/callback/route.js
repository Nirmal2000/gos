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
  const combinedString = searchParams.get("state");
  const [userText, activationKey] = combinedString.split('||')

  // Exchange authorization code for access token
  const authHeader = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64");
  const tokenResponse = await fetch(TOKEN_URL, {
    method: "POST",
    headers: {
      "Authorization": `Basic ${authHeader}`,
      "Content-Type": "application/json",
      "Notion-Version": "2022-06-28",
    },
    body: JSON.stringify({
      grant_type: "authorization_code",
      code: authCode,
      redirect_uri: REDIRECT_URI,
    }),
  });

  if (!tokenResponse.ok) {
    const error = await tokenResponse.text();
    throw new Error(`Failed to fetch access token: ${error}`);
  }


  const tokenData = await tokenResponse.json();
  const accessToken = tokenData.access_token;
  const templateId = tokenData.duplicated_template_id;
  console.log(templateId)
  const encodedAccessToken = encodeAccessToken(accessToken, ENCODING_KEY);
  
  
  await fetch('https://gos-backend.onrender.com/api/process_data', {
  // await fetch('http://127.0.0.1:5001/api/process_data', {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      access_token: accessToken,
      template_id: templateId,
      user_text: userText,
      act_key: activationKey
    }),
  });

  // const host = req.headers.get("host");
  // const redirectUrl = `http://${host}`;

  // Redirect to the homepage
  // return NextResponse.redirect("http://localhost:3000");
  return NextResponse.redirect("https://gos-xi.vercel.app");
}