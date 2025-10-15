import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axiosInstance";
import { Eye, EyeOff, CheckCircle, XCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Signup() {
    const navigate = useNavigate();
    const [form, setForm] = useState({ name: "", email: "", password: "" });
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [message, setMessage] = useState<{ text: string; type: "success" | "error" | "" }>({ text: "", type: "" });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ text: "", type: "" });

        try {
            await API.post("/auth/signup", form);
            setMessage({ text: "🎉 Signup successful! Redirecting...", type: "success" });
            setTimeout(() => navigate("/"), 500);
        } catch (error: any) {
            setMessage({
                text: error.response?.data?.message || "Signup failed",
                type: "error",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-pink-100 via-white to-blue-100 px-4">
            <form
                onSubmit={handleSubmit}
                className="backdrop-blur-md bg-white/70 border border-white/30 shadow-xl rounded-2xl p-8 w-full max-w-sm animate-fade-in"
            >
                <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
                    Create Account
                </h1>

                {/* --- Name --- */}
                <div className="mb-4">
                    <label className="text-sm font-medium text-gray-600 block mb-1">Full Name</label>
                    <input
                        name="name"
                        type="text"
                        placeholder="John Doe"
                        value={form.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none transition duration-300"
                    />
                </div>

                {/* --- Email --- */}
                <div className="mb-4">
                    <label className="text-sm font-medium text-gray-600 block mb-1">Email</label>
                    <input
                        name="email"
                        type="email"
                        placeholder="you@example.com"
                        value={form.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none transition duration-300"
                    />
                </div>

                {/* --- Password --- */}
                <div className="mb-6 relative">
                    <label className="text-sm font-medium text-gray-600 block mb-1">Password</label>
                    <input
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={form.password}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 pr-10 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none transition duration-300"
                    />
                    {form.password && (
                        <span
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-9 cursor-pointer text-gray-500 hover:text-gray-700 transition-colors"
                        >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </span>
                    )}
                </div>

                {/* --- Submit Button --- */}
                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full py-2 px-4 text-white font-semibold rounded-lg shadow-md transition-transform duration-300 ${loading
                        ? "bg-blue-300 cursor-not-allowed"
                        : "bg-blue-500 hover:bg-blue-600 hover:scale-[1.02] active:scale-[0.98]"
                        }`}
                >
                    {loading ? "Creating..." : "Sign Up"}
                </button>

                {/* --- Animated Message (Success / Error) --- */}
                <AnimatePresence>
                    {message.text && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.5 }}
                            className={`mt-4 text-center flex items-center justify-center gap-2 ${message.type === "success" ? "text-green-600" : "text-red-600"
                                }`}
                        >
                            {message.type === "success" ? (
                                <CheckCircle size={20} />
                            ) : (
                                <XCircle size={20} />
                            )}
                            <span>{message.text}</span>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* --- Login Link --- */}
                <p
                    onClick={() => navigate("/")}
                    className="text-sm text-blue-600 mt-4 text-center hover:underline cursor-pointer transition-opacity duration-200"
                >
                    Already have an account? Login
                </p>
            </form>
        </div>
    );
}
