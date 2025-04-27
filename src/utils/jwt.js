// Utility for decoding JWT and checking expiry
import { jwtDecode } from "jwt-decode";

export function getTokenExpiration(token) {
  try {
    const decoded = jwtDecode(token);
    if (decoded.exp) {
      return decoded.exp * 1000; // ms
    }
    return null;
  } catch (e) {
    return null;
  }
}

export function isTokenExpired(token) {
  const exp = getTokenExpiration(token);
  if (!exp) return true;
  return Date.now() > exp;
}
