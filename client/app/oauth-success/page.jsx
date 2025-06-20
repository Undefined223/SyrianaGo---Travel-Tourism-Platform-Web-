"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/app/contexts/UserContext";

export default function OAuthCallback() {
  const router = useRouter();
  const { fetchUserProfile } = useUser();

  useEffect(() => {
    const handleOAuthCallback = async () => {
      try {
        // Extract token from URL or use a backend endpoint to get user data
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get("token");
        
        if (token) {
          localStorage.setItem("accessToken", token);
          await fetchUserProfile(token);
          router.push("/");
        } else {
          throw new Error("Authentication failed");
          
        }
      } catch (err) {
        console.error("OAuth failed:", err);
          router.push("/");


      }
    };

    handleOAuthCallback();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p>Processing authentication...</p>
    </div>
  );
}