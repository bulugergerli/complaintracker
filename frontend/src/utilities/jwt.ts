import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  exp?: number; // The expiration time might be optional
  user_id: number;
  role_id: number;
  // Add other fields you expect in the token, if necessary
}

const CheckTokenExpiration = (token: string): boolean => {
  if (!token) {
    return false; // No token provided
  }

  try {
    const decodedToken: DecodedToken = jwtDecode(token);
    if (!decodedToken.exp) {
      return false; // The exp field is not present
    }

    const currentTime = Date.now() / 1000; // Current time in seconds

    return decodedToken.exp >= currentTime; // Return true if the token is valid, false if it has expired
  } catch (error) {
    console.error("Invalid token", error);
    return false; // Invalid token
  }
};


const ReturnTokenPayload = (token: string): DecodedToken | null => {
  if (!token) {
    return null; // No token provided
  }
  try {
    const decodedToken: DecodedToken = jwtDecode(token);
    const tokenData = {
      user_id: decodedToken.user_id,
      role_id: decodedToken.role_id,
    };
    return tokenData;
  } catch (error) {
    console.error("Invalid token", error);
    return null; // Invalid token
  }
};

export { ReturnTokenPayload, CheckTokenExpiration };
