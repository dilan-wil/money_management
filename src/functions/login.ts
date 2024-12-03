import { auth } from "./firebase"
import { signInWithEmailAndPassword } from "firebase/auth"

interface FormData {
  email: string;
  password: string;
}

export async function login(formData: FormData) {
    console.log(formData)
    const {email, password} = formData
    if (!email || !password) {
      throw new Error("Email and password must be provided.");
    }
    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log("logged in")
      return true
      // Navigate to the home page
    } catch (error: any) {
      if (error.code === "auth/user-not-found") {
        console.error("User not found");
      } else if (error.code === "auth/wrong-password") {
        console.error("Incorrect password");
      } else if (error.code === "auth/invalid-email") {
        console.error("Invalid email");
      } else {
        console.error("Error:", error.message);
      }
    }
}
