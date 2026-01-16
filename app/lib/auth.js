import { SignJWT, jwtVerify } from "jose";
import { webcrypto as crypto } from "crypto";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET_KEY || "fallback-secret-change-in-production"
);

const ACCESS_TOKEN_EXPIRY = "3d";
const REFRESH_TOKEN_EXPIRY = "30d";

// Hash password with PBKDF2
export const hashPassword = async (password) => {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    { name: "PBKDF2" },
    false,
    ["deriveBits"]
  );
  const key = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt,
      iterations: 100000,
      hash: "SHA-256",
    },
    keyMaterial,
    256
  );
  return `${Buffer.from(salt).toString("hex")}:${Buffer.from(key).toString(
    "hex"
  )}`;
};

// Verify password
export const verifyPassword = async (password, hashedPassword) => {
  const [saltHex, keyHex] = hashedPassword.split(":");
  const salt = Buffer.from(saltHex, "hex");
  const storedKey = Buffer.from(keyHex, "hex");

  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    { name: "PBKDF2" },
    false,
    ["deriveBits"]
  );
  const derivedKey = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt,
      iterations: 100000,
      hash: "SHA-256",
    },
    keyMaterial,
    256
  );

  return Buffer.from(derivedKey).equals(storedKey);
};

// Generate JWT access token
export const generateAccessToken = async (userId) => {
  try {
    const token = await new SignJWT({ userId })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime(ACCESS_TOKEN_EXPIRY)
      .sign(JWT_SECRET);

    console.log("Generated token (sample):", token.substring(0, 25) + "...");
    return token;
  } catch (error) {
    console.error("Error generating token:", error);
    throw error;
  }
};

// Generate JWT refresh token
export const generateRefreshToken = async (userId) => {
  return await new SignJWT({ userId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(REFRESH_TOKEN_EXPIRY)
    .sign(JWT_SECRET);
};

// Verify JWT token
export const verifyToken = async (token) => {
  try {
    if (!token || typeof token !== "string") {
      console.error("Invalid token provided for verification");
      return null;
    }

    if(token.startsWith('Bearer ')) {
      token = token.slice(7).trim();
    }

    console.log("Verifying token sample:", token.substring(0, 25) + "...");

    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload;
  } catch (error) {
    console.log('Token verification error:', error);
    console.log('Token recieved: ', token);
    console.error("Token verification failed:", error.message);
    return null;
  }
};

// Extract token from headers/cookies
export const extractTokenFromRequest = (request) => {
  const authHeader = request.headers.get("Authorization");
  if (authHeader && authHeader.startsWith("Bearer ")) {
    console.log('Authorization header:', authHeader);
    return authHeader.slice(7).trim() || null;
  }
  console.log('Authorization header:', authHeader);

  const cookieHeader = request.headers.get("cookie");
  if (cookieHeader) {
    const cookies = cookieHeader.split(";").reduce((acc, cookie) => {
      const [name, value] = cookie.trim().split("=");
      if (name && value) acc[name] = decodeURIComponent(value);
      return acc;
    }, {});

    return (
      cookies.accessToken ||
      cookies.token ||
      cookies["auth-token"] ||
      cookies["auth_token"] ||
      null
    );
  }

  return null;
};

// Get userId directly from request
export const getUserIdFromRequest = async (request) => {
  const token = extractTokenFromRequest(request);
  if (!token) return null;

  const decoded = await verifyToken(token);
  return decoded?.userId || null;
};


export const getAuthHeadersFromCookies = () => {
  if (typeof document === "undefined") {
    console.warn("getAuthHeadersFromCookies called on server");
    return { "Content-Type": "application/json" };
  }

  const cookies = document.cookie.split(";").reduce((acc, cookie) => {
    const [name, value] = cookie.trim().split("=");
    if (name && value) acc[name] = decodeURIComponent(value);
    return acc;
  }, {});

  const token = cookies.accessToken || null;

  if (!token) {
    console.warn("No auth token found in cookies");
    return { "Content-Type": "application/json" };
  }

  return {
    Authorization: `${token}`,
    "Content-Type": "application/json",
  };
};

export const isExist = () =>{
  const cookies = document.cookie.split(";").reduce((acc, cookie) => {
    const [name, value] = cookie.trim().split("=");
    if (name && value) acc[name] = decodeURIComponent(value);
    return acc;
  }, {});

  const token = cookies.accessToken || null;
  return token !== null;
}
