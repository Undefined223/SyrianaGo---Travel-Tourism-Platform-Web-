"use client";
import { useEffect, useState } from "react";
import { useLanguage } from "../contexts/LanguageContext";

export default function AddToHomeScreen() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const { t } = useLanguage(); // Get translation function

  useEffect(() => {
    function handleBeforeInstallPrompt(e) {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsVisible(true);
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      console.log("User accepted the install prompt");
    } else {
      console.log("User dismissed the install prompt");
    }
    setDeferredPrompt(null);
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <button
      onClick={handleInstallClick}
      className="fixed bottom-5 left-5 bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg shadow-lg z-50 transition-colors duration-300"
      aria-label={t('pwa.installButtonAria')}
    >
      {t('pwa.installButtonText')}
    </button>
  );
}