import { useUser } from "@/app/contexts/UserContext";
import { useLanguage } from "@/app/contexts/LanguageContext";
import { useState } from "react";
import { updateUser } from "@/app/lib/https/auth.https";

export default function SettingsPage() {
  const { user, setUser } = useUser();
  const { t } = useLanguage();

  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess("");
    setError("");

    if (form.newPassword && form.newPassword !== form.confirmNewPassword) {
      setError(t("user.passwordsDontMatch") || "Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const payload = {
        name: form.name,
        email: form.email,
        oldPassword: form.oldPassword,
        newPassword: form.newPassword,
      };
      const updated = await updateUser(payload);
      setUser(updated);
      setSuccess(t("user.profileUpdated") || "Profile updated!");
      setForm((prev) => ({
        ...prev,
        oldPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      }));
    } catch (err) {
      setError(
        err?.message ||
        t("user.profileUpdateError") ||
        "Update failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-xl shadow">
      <h1 className="text-2xl font-bold mb-6">{t("user.settings")}</h1>
      <form onSubmit={handleSubmit}>
        {/* Name */}
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">{t("user.name")}</label>
          <input
            type="text"
            name="name"
            className="w-full border border-gray-300 rounded px-3 py-2"
            value={form.name}
            onChange={handleChange}
            required
            placeholder={t("user.namePlaceholder")}
          />
        </div>
        {/* Email */}
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">{t("user.email")}</label>
          <input
            type="email"
            name="email"
            className="w-full border border-gray-300 rounded px-3 py-2"
            value={form.email}
            onChange={handleChange}
            required
            placeholder={t("user.emailPlaceholder")}
          />
        </div>
        {/* Old Password */}
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">{t("user.oldPassword")}</label>
          <input
            type="password"
            name="oldPassword"
            className="w-full border border-gray-300 rounded px-3 py-2"
            value={form.oldPassword}
            onChange={handleChange}
            autoComplete="current-password"
            required={!!form.newPassword || form.email !== user?.email}
            placeholder={t("user.oldPasswordPlaceholder")}
          />
        </div>
        {/* New Password */}
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">{t("user.newPassword")}</label>
          <input
            type="password"
            name="newPassword"
            className="w-full border border-gray-300 rounded px-3 py-2"
            value={form.newPassword}
            onChange={handleChange}
            autoComplete="new-password"
            placeholder={t("user.newPasswordPlaceholder")}
          />
        </div>
        {/* Confirm New Password */}
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">{t("user.confirmNewPassword")}</label>
          <input
            type="password"
            name="confirmNewPassword"
            className="w-full border border-gray-300 rounded px-3 py-2"
            value={form.confirmNewPassword}
            onChange={handleChange}
            autoComplete="new-password"
            placeholder={t("user.confirmNewPasswordPlaceholder")}
          />
        </div>
        {success && <div className="mb-2 text-green-600">{success}</div>}
        {error && <div className="mb-2 text-red-600">{error}</div>}
        <button
          type="submit"
          className="bg-[#337914] text-white px-6 py-2 rounded font-semibold hover:bg-green-700 transition"
          disabled={loading}
        >
          {loading ? t("common.loading") : t("user.save")}
        </button>
      </form>
    </div>
  );
}