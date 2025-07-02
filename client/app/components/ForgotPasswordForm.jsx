"use client";
import { useState } from "react";
import { useLanguage } from "@/app/contexts/LanguageContext";
import { forgotPassword } from "../lib/https/auth.https";

export default function ForgotPasswordForm({ onBack }) {
  const { t } = useLanguage();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setStatus({ type: "error", message: t("resetPassword.requiredEmail") });
      return;
    }

    setIsLoading(true);
    setStatus(null);

    try {
      await forgotPassword(email);
      setStatus({ 
        type: "success", 
        message: t("resetPassword.resetEmailSent") 
      });
    } catch (err) {
      setStatus({ 
        type: "error", 
        message: err.message || t("resetPassword.emailSendFailed") 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-600 rounded-lg mb-4">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">
          {t("resetPassword.forgotPassword")}
        </h1>
        <p className="text-gray-600">
          {t("resetPassword.forgotPasswordSubtitle")}
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-8">
        {status && (
          <div className={`mb-4 p-3 rounded-md ${status.type === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
            {status.message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              {t("resetPassword.emailAddress")}
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t("resetPassword.emailPlaceholder")}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>
          
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-2.5 px-4 rounded-md font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? t("resetPassword.sending") : t("resetPassword.sendResetLink")}
          </button>
        </form>

        <button
          onClick={onBack}
          className="w-full mt-4 text-gray-600 hover:text-gray-700 py-2 text-sm font-medium transition-colors"
        >
          ← {t("resetPassword.backToLogin")}
        </button>
      </div>
    </div>
  );
}