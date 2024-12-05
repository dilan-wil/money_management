'use client'
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the dashboard page
    router.push("/dashboard");
  }, [router]);

  return null; // Return null since the user is redirected
}
