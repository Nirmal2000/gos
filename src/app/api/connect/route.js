// src/app/api/connect/route.js
import { NextResponse } from "next/server";

const CLIENT_ID = process.env.CLIENT_ID;
const isProduction = process.env.NODE_ENV === 'production';
const BASE_URL = isProduction
  ? process.env.NEXT_PUBLIC_PROD_URL
  : process.env.NEXT_PUBLIC_DEV_URL;
const REDIRECT_URI = `${BASE_URL}/api/notion/callback`;

export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const userText = searchParams.get("userText");
    const actKey = searchParams.get("actkey");
    const combinedString = `${userText}||${actKey}`;
  
    // Construct Notion's OAuth URL with all required parameters
    const authUrl = new URL('https://api.notion.com/v1/oauth/authorize');
    authUrl.searchParams.append('client_id', CLIENT_ID);
    authUrl.searchParams.append('response_type', 'code');
    authUrl.searchParams.append('owner', 'user');
    authUrl.searchParams.append('redirect_uri', REDIRECT_URI);
    authUrl.searchParams.append('state', combinedString);

    return NextResponse.redirect(authUrl.toString());
  }