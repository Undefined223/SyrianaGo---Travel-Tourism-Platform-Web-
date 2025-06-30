"use client";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useLanguage } from "@/app/contexts/LanguageContext";
import { useUser } from "@/app/contexts/UserContext";
import { loginWithGoogle, verify2FA } from "@/app/lib/https/auth.https";

export default function LoginPage() {
  const { t, language } = useLanguage();
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [show2FA, setShow2FA] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [otpError, setOtpError] = useState("");
  const { login } = useUser();

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const result = await login(data);
      
      if (result.twoFactorRequired) {
        setUserEmail(data.email);
        setShow2FA(true);
        reset(); // Clear the form
      } else {
        router.push("/");
      }
    } catch (err) {
      alert(err.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handle2FASubmit = async (e) => {
    e.preventDefault();
    if (!otpCode.trim()) {
      setOtpError("Please enter the verification code");
      return;
    }

    setIsLoading(true);
    setOtpError("");
    
    try {
      const result = await verify2FA({ email: userEmail, code: otpCode });
      
      // Store the tokens and user data
      localStorage.setItem("accessToken", result.accessToken);
      localStorage.setItem("user", JSON.stringify(result.user));
      
      router.push("/");
    } catch (err) {
      setOtpError(err.response?.data?.message || "Invalid verification code");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    setShow2FA(false);
    setUserEmail("");
    setOtpCode("");
    setOtpError("");
  };

  const handleGoogleLogin = () => {
    loginWithGoogle();
  };

  // Regular login form
  if (!show2FA) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-600 rounded-lg mb-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h4M9 7h6m-6 4h6m-6 4h6" />
              </svg>
            </div>
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">{t("login.title")}</h1>
            <p className="text-gray-600">{t("login.subtitle")}</p>
          </div>

          {/* Login Card */}
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  {t("login.email")}
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder={t("login.emailPlaceholder")}
                  {...register("email", {
                    required: t("login.requiredEmail"),
                    pattern: {
                      value: /^\S+@\S+$/i,
                      message: t("login.invalidEmail")
                    }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
                {errors.email && (
                  <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  {t("login.password")}
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder={t("login.passwordPlaceholder")}
                    {...register("password", {
                      required: t("login.requiredPassword"),
                      minLength: {
                        value: 6,
                        message: t("login.minPassword")
                      }
                    })}
                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                      </svg>
                    ) : (
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-600 text-sm mt-1">{errors.password.message}</p>
                )}
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-600">{t("login.rememberMe")}</span>
                </label>
                <a
                  href="#"
                  className="text-sm text-blue-600 hover:text-blue-500 font-medium"
                >
                  {t("login.forgotPassword")}
                </a>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 text-white py-2.5 px-4 rounded-md font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {t("login.signingIn")}
                  </div>
                ) : (
                  t("login.signIn")
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="mt-6 mb-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">{t("login.orContinueWith")}</span>
                </div>
              </div>
            </div>

            {/* Google Login Button */}
            <button
              onClick={handleGoogleLogin}
              className="w-full bg-white border border-gray-300 text-gray-700 py-2.5 px-4 rounded-md font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors flex items-center justify-center"
            >
              <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                <path fill="none" d="M0 0h24v24H0z" />
              </svg>
              {t("login.google")}
            </button>

            {/* Signup Link */}
            <p className="mt-6 text-center text-gray-600 text-sm">
              {t("login.noAccount")}{" "}
              <a href={`/${language}/auth/register`} className="text-blue-600 hover:text-blue-500 font-medium">
                {t("login.signUp")}
              </a>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // 2FA verification form
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-600 rounded-lg mb-4">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">Two-Factor Authentication</h1>
          <p className="text-gray-600">
            We've sent a verification code to <span className="font-medium">{userEmail}</span>
          </p>
        </div>

        {/* 2FA Card */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-8">
          <form onSubmit={handle2FASubmit} className="space-y-6">
            {/* OTP Input */}
            <div>
              <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-2">
                Verification Code
              </label>
              <input
                id="otp"
                type="text"
                value={otpCode}
                onChange={(e) => {
                  setOtpCode(e.target.value);
                  setOtpError(""); // Clear error when user types
                }}
                placeholder="Enter 6-digit code"
                maxLength="6"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-center text-lg tracking-widest"
                autoComplete="one-time-code"
              />
              {otpError && (
                <p className="text-red-600 text-sm mt-1">{otpError}</p>
              )}
            </div>

            {/* Info Text */}
            <div className="text-sm text-gray-600 text-center">
              Didn't receive the code? Check your spam folder or{" "}
              <button
                type="button"
                className="text-blue-600 hover:text-blue-500 font-medium"
                onClick={() => {
                  // You can implement resend OTP functionality here
                  alert("Resend functionality not implemented yet");
                }}
              >
                resend code
              </button>
            </div>

            {/* Verify Button */}
            <button
              type="submit"
              disabled={isLoading || !otpCode.trim()}
              className="w-full bg-blue-600 text-white py-2.5 px-4 rounded-md font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Verifying...
                </div>
              ) : (
                "Verify Code"
              )}
            </button>

            {/* Back to Login */}
            <button
              type="button"
              onClick={handleBackToLogin}
              className="w-full text-gray-600 hover:text-gray-700 py-2 text-sm font-medium transition-colors"
            >
              ← Back to login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}