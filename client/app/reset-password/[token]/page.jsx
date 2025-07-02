"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/app/contexts/LanguageContext";
import { resetPassword } from "@/app/lib/https/auth.https";
import { useParams } from "next/navigation";

export default function ResetPasswordPage({ params }) {
  const { token } = useParams();
  console.log("Reset Password Token:", token);
  const { t } = useLanguage();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!newPassword) {
      setError(t("resetPassword.requiredPassword"));
      return;
    }
    
    if (newPassword.length < 6) {
      setError(t("resetPassword.minPassword"));
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setError(t("resetPassword.passwordsMatch"));
      return;
    }
    
    setIsLoading(true);
    setError("");
    
    try {
      await resetPassword(token, newPassword);
      setSuccess(true);
      
     
    } catch (err) {
      setError(err.message || t("resetPassword.resetFailed"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-600 rounded-lg mb-4">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">
            {success ? t("resetPassword.successTitle") : t("resetPassword.title")}
          </h1>
          <p className="text-gray-600">
            {success 
              ? t("resetPassword.successMessage") 
              : t("resetPassword.subtitle")}
          </p>
        </div>

        {success ? (
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-8 text-center">
            <div className="text-green-500 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-gray-600">{t("resetPassword.redirecting")}</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-8">
            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md">
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  {t("resetPassword.newPassword")}
                </label>
                <input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder={t("resetPassword.newPasswordPlaceholder")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>
              
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  {t("resetPassword.confirmPassword")}
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder={t("resetPassword.confirmPasswordPlaceholder")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>
              
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 text-white py-2.5 px-4 rounded-md font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? t("resetPassword.resetting") : t("resetPassword.resetButton")}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}