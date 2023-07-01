import type { RegisterData } from "../../types";

export const validateRegistration = ({
  confirmPassword,
  password,
  username,
}: RegisterData) => {
  if (!username || !password || !confirmPassword) {
    return { msg: "Enter all required data", valid: false };
  }
  if (password !== confirmPassword) {
    return { msg: "Passwords do not match", valid: false };
  }
  // IMPLEMENT MORE VALIDATION (REQUIRE LENGTH, PASSWORD COMPLEXITY, ...)
  return { msg: "Valid register data", valid: true };
};
