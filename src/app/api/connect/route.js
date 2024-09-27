// src/app/api/connect/route.js
import { NextResponse } from "next/server";

const CLIENT_ID = process.env.CLIENT_ID;
const REDIRECT_URI = process.env.REDIRECT_URI;
const AUTH_URL = `https://api.notion.com/v1/oauth/authorize?client_id=${CLIENT_ID}&response_type=code&owner=user&redirect_uri=${REDIRECT_URI}`;

export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const userText = searchParams.get("userText");
    const actKey = searchParams.get("actkey");
    const combinedString = `${userText}||${actKey}`;
  
    // Store the userText in the session or pass it along in the redirect URL
    // In this case, we'll pass it to the callback as a query param
    const authUrl = `https://api.notion.com/v1/oauth/authorize?client_id=${CLIENT_ID}&response_type=code&owner=user&redirect_uri=${REDIRECT_URI}&state=${encodeURIComponent(combinedString)}`;
    console.log("Redirecting to:", authUrl); 
    // Redirect to Notion's OAuth page
    return NextResponse.redirect(authUrl);
  }