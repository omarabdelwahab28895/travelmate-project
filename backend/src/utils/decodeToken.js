import { jwtDecode } from "jwt-decode"; 

export const decodeToken = (token) => {
  try {
    return jwtDecode(token);
  } catch (error) {
    console.error("Token non valido:", error);
    return null;
  }
};
