"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/app/contexts/LanguageContext";
import { Trash2, Edit3, Check, X, Users, Shield, User, Store } from "lucide-react";
import {
    deleteUserById,
    getAllUsers,
    updateUserByAdmin,
} from "@/app/lib/https/auth.https";

export default function AdminUsersTab() {
    const [users, setUsers] = useState([]);
    const { t } = useLanguage();

    const [editUserId, setEditUserId] = useState(null);
    const [editField, setEditField] = useState(null);
    const [editValue, setEditValue] = useState("");
    const [toast, setToast] = useState({ show: false, message: "", type: "" });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const data = await getAllUsers();
                setUsers(data);
            } catch (err) {
                console.error("Failed to fetch users", err);
                showToast("Failed to fetch users", "error");
            }
        };
        fetchUsers();
    }, []);

    const showToast = (message, type) => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast({ show: false, message: "", type: "" }), 4000);
    };

    const validateField = (field, value) => {
        switch (field) {
            case "name":
                if (!value.trim()) return "Name is required";
                if (value.trim().length < 2) return "Name must be at least 2 characters";
                if (value.trim().length > 50) return "Name must be less than 50 characters";
                return null;
            case "email":
                if (!value.trim()) return "Email is required";
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) return "Please enter a valid email";
                return null;
            case "role":
                if (!["user", "vendor", "admin"].includes(value)) return "Invalid role selected";
                return null;
            default:
                return null;
        }
    };

    const handleDelete = async (id) => {
        if (!confirm(t("dashboard.confirmDelete"))) return;
        try {
            await deleteUserById(id);
            setUsers((prev) => prev.filter((u) => u._id !== id));
            showToast("User deleted successfully", "success");
        } catch (err) {
            showToast(t("dashboard.errorDeletingUser"), "error");
        }
    };

    const startEdit = (userId, currentValue, field) => {
        setEditUserId(userId);
        setEditField(field);
        setEditValue(currentValue);
        setErrors({});
    };

    const saveEdit = async (user, field) => {
        const error = validateField(field, editValue);
        if (error) {
            setErrors({ [field]: error });
            return;
        }

        if (editValue === user[field]) {
            resetEdit();
            return;
        }

        try {
            await updateUserByAdmin(user._id, { [field]: editValue });
            setUsers((prev) =>
                prev.map((u) =>
                    u._id === user._id ? { ...u, [field]: editValue } : u
                )
            );
            showToast(`${field.charAt(0).toUpperCase() + field.slice(1)} updated successfully`, "success");
        } catch (err) {
            showToast(t("dashboard.errorUpdatingUser"), "error");
        }

        resetEdit();
    };

    const resetEdit = () => {
        setEditUserId(null);
        setEditField(null);
        setEditValue("");
        setErrors({});
    };

    const getRoleIcon = (role) => {
        switch (role) {
            case "admin": return <Shield className="w-4 h-4 text-purple-500" />;
            case "vendor": return <Store className="w-4 h-4 text-blue-500" />;
            default: return <User className="w-4 h-4 text-gray-500" />;
        }
    };

    const getRoleBadgeColor = (role) => {
        switch (role) {
            case "admin": return "bg-purple-100 text-purple-800 border-purple-200";
            case "vendor": return "bg-blue-100 text-blue-800 border-blue-200";
            default: return "bg-gray-100 text-gray-800 border-gray-200";
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
            {/* Toast Notification */}
            {toast.show && (
                <div className={`fixed top-4 right-4 z-50 flex items-center p-4 rounded-lg shadow-lg transform transition-all duration-300 ${
                    toast.type === "success" 
                        ? "bg-green-500 text-white" 
                        : "bg-red-500 text-white"
                }`}>
                    {toast.type === "success" ? <Check className="w-5 h-5 mr-2" /> : <X className="w-5 h-5 mr-2" />}
                    <span className="font-medium">{toast.message}</span>
                </div>
            )}

            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center space-x-3 mb-2">
                        <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
                            <Users className="w-6 h-6 text-white" />
                        </div>
                        <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                            {t("dashboard.users")}
                        </h2>
                    </div>
                    <p className="text-gray-600">Manage user accounts, roles, and permissions</p>
                </div>

                {/* Users Table Card */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                                    <th className="text-left p-6 font-semibold text-gray-700 uppercase tracking-wider text-sm">
                                        {t("user.name")}
                                    </th>
                                    <th className="text-left p-6 font-semibold text-gray-700 uppercase tracking-wider text-sm">
                                        {t("user.email")}
                                    </th>
                                    <th className="text-left p-6 font-semibold text-gray-700 uppercase tracking-wider text-sm">
                                        {t("user.role")}
                                    </th>
                                    <th className="text-left p-6 font-semibold text-gray-700 uppercase tracking-wider text-sm">
                                        {t("common.actions")}
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {users.map((user, index) => (
                                    <tr key={user._id} className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200 group">
                                        {/* Name */}
                                        <td className="p-6">
                                            {editUserId === user._id && editField === "name" ? (
                                                <div className="space-y-2">
                                                    <div className="relative">
                                                        <input
                                                            value={editValue}
                                                            onChange={(e) => setEditValue(e.target.value)}
                                                            onBlur={() => saveEdit(user, "name")}
                                                            onKeyDown={(e) => {
                                                                if (e.key === "Enter") saveEdit(user, "name");
                                                                if (e.key === "Escape") resetEdit();
                                                            }}
                                                            autoFocus
                                                            className={`w-full px-3 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                                                                errors.name ? "border-red-300 bg-red-50" : "border-gray-300"
                                                            }`}
                                                            placeholder="Enter name"
                                                        />
                                                        <div className="absolute right-2 top-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <button
                                                                onClick={() => saveEdit(user, "name")}
                                                                className="p-1 text-green-600 hover:bg-green-100 rounded"
                                                            >
                                                                <Check className="w-4 h-4" />
                                                            </button>
                                                            <button
                                                                onClick={resetEdit}
                                                                className="p-1 text-gray-600 hover:bg-gray-100 rounded"
                                                            >
                                                                <X className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                    {errors.name && (
                                                        <p className="text-red-500 text-xs flex items-center">
                                                            <X className="w-3 h-3 mr-1" />
                                                            {errors.name}
                                                        </p>
                                                    )}
                                                </div>
                                            ) : (
                                                <div className="flex items-center group/name">
                                                    <span
                                                        onDoubleClick={() => startEdit(user._id, user.name, "name")}
                                                        className="font-medium text-gray-900 cursor-pointer hover:text-blue-600 transition-colors flex-1"
                                                        title="Double-click to edit"
                                                    >
                                                        {user.name}
                                                    </span>
                                                    <Edit3 className="w-4 h-4 text-gray-400 opacity-0 group-hover/name:opacity-100 transition-opacity ml-2" />
                                                </div>
                                            )}
                                        </td>

                                        {/* Email */}
                                        <td className="p-6">
                                            {editUserId === user._id && editField === "email" ? (
                                                <div className="space-y-2">
                                                    <div className="relative">
                                                        <input
                                                            value={editValue}
                                                            onChange={(e) => setEditValue(e.target.value)}
                                                            onBlur={() => saveEdit(user, "email")}
                                                            onKeyDown={(e) => {
                                                                if (e.key === "Enter") saveEdit(user, "email");
                                                                if (e.key === "Escape") resetEdit();
                                                            }}
                                                            autoFocus
                                                            type="email"
                                                            className={`w-full px-3 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                                                                errors.email ? "border-red-300 bg-red-50" : "border-gray-300"
                                                            }`}
                                                            placeholder="Enter email"
                                                        />
                                                        <div className="absolute right-2 top-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <button
                                                                onClick={() => saveEdit(user, "email")}
                                                                className="p-1 text-green-600 hover:bg-green-100 rounded"
                                                            >
                                                                <Check className="w-4 h-4" />
                                                            </button>
                                                            <button
                                                                onClick={resetEdit}
                                                                className="p-1 text-gray-600 hover:bg-gray-100 rounded"
                                                            >
                                                                <X className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                    {errors.email && (
                                                        <p className="text-red-500 text-xs flex items-center">
                                                            <X className="w-3 h-3 mr-1" />
                                                            {errors.email}
                                                        </p>
                                                    )}
                                                </div>
                                            ) : (
                                                <div className="flex items-center group/email">
                                                    <span
                                                        onDoubleClick={() => startEdit(user._id, user.email, "email")}
                                                        className="text-gray-600 cursor-pointer hover:text-blue-600 transition-colors flex-1"
                                                        title="Double-click to edit"
                                                    >
                                                        {user.email}
                                                    </span>
                                                    <Edit3 className="w-4 h-4 text-gray-400 opacity-0 group-hover/email:opacity-100 transition-opacity ml-2" />
                                                </div>
                                            )}
                                        </td>

                                        {/* Role */}
                                        <td className="p-6">
                                            {editUserId === user._id && editField === "role" ? (
                                                <div className="space-y-2">
                                                    <div className="relative">
                                                        <select
                                                            value={editValue}
                                                            onChange={(e) => setEditValue(e.target.value)}
                                                            onBlur={() => saveEdit(user, "role")}
                                                            onKeyDown={(e) => {
                                                                if (e.key === "Enter") saveEdit(user, "role");
                                                                if (e.key === "Escape") resetEdit();
                                                            }}
                                                            autoFocus
                                                            className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors bg-white"
                                                        >
                                                            <option value="user">{t("user.user")}</option>
                                                            <option value="vendor">{t("user.vendor")}</option>
                                                            <option value="admin">{t("user.admin")}</option>
                                                        </select>
                                                        <div className="absolute right-2 top-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <button
                                                                onClick={() => saveEdit(user, "role")}
                                                                className="p-1 text-green-600 hover:bg-green-100 rounded"
                                                            >
                                                                <Check className="w-4 h-4" />
                                                            </button>
                                                            <button
                                                                onClick={resetEdit}
                                                                className="p-1 text-gray-600 hover:bg-gray-100 rounded"
                                                            >
                                                                <X className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                    {errors.role && (
                                                        <p className="text-red-500 text-xs flex items-center">
                                                            <X className="w-3 h-3 mr-1" />
                                                            {errors.role}
                                                        </p>
                                                    )}
                                                </div>
                                            ) : (
                                                <div className="flex items-center group/role">
                                                    <span
                                                        onDoubleClick={() => startEdit(user._id, user.role, "role")}
                                                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border cursor-pointer hover:shadow-md transition-all ${getRoleBadgeColor(user.role)}`}
                                                        title="Double-click to edit"
                                                    >
                                                        {getRoleIcon(user.role)}
                                                        <span className="ml-2">{t(`user.${user.role}`)}</span>
                                                    </span>
                                                    <Edit3 className="w-4 h-4 text-gray-400 opacity-0 group-hover/role:opacity-100 transition-opacity ml-2" />
                                                </div>
                                            )}
                                        </td>

                                        {/* Actions */}
                                        <td className="p-6">
                                            <button
                                                onClick={() => handleDelete(user._id)}
                                                className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-200 group/delete"
                                                title="Delete user"
                                            >
                                                <Trash2 className="w-5 h-5 group-hover/delete:scale-110 transition-transform" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {users.length === 0 && (
                            <div className="text-center py-12">
                                <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                <p className="text-gray-500 text-lg">No users found</p>
                                <p className="text-gray-400 text-sm">Users will appear here once they're added to the system</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Stats Footer */}
                <div className="mt-6 bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                    <div className="flex items-center justify-between text-sm text-gray-600">
                        <span>Total users: <span className="font-semibold text-gray-800">{users.length}</span></span>
                        <span>Last updated: <span className="font-semibold text-gray-800">{new Date().toLocaleTimeString()}</span></span>
                    </div>
                </div>
            </div>
        </div>
    );
}