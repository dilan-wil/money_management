import { auth } from "./firebase"
import { signInWithEmailAndPassword } from "firebase/auth"

interface FormData {
  email: string;
  password: string;
}

export async function login(formData: FormData) {
    console.log(formData)
    const {email, password} = formData

    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log("logged in")
      return true
      // Navigate to the home page
    } catch (error) {
      throw error; // Handle this in the calling component
    }
}
