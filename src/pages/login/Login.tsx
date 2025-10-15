import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import API from "../../api/axiosInstance";
import { Eye, EyeOff, CheckCircle, XCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Login({ setToken }: { setToken: (token: string | null) => void }) {
    const navigate = useNavigate();
    const [form, setForm] = useState({ email: "", password: "" });
    const [state, setState] = useState({
        loading: false,
        showPassword: false,
        message: "",
        success: false,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setState((prev) => ({ ...prev, loading: true, message: "" }));
        try {
            const { data } = await API.post("/auth/login", form);
            localStorage.setItem("token", data.token);
            setToken(data.token);
            setState({
                loading: false,
                showPassword: false,
                message: "✅ Login successful! Redirecting...",
                success: true,
            });
            setTimeout(() => {
                navigate("/publications");
            }, 1000);
        } catch (error: any) {
            setState({
                loading: false,
                showPassword: false,
                message: error.response?.data?.message || "Login failed",
                success: false,
            });
        }
    };

    const { loading, showPassword, message, success } = state;

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 via-white to-purple-100 px-4">
            <form
                onSubmit={handleSubmit}
                className="backdrop-blur-md bg-white/70 border border-white/30 shadow-2xl rounded-2xl p-8 w-full max-w-sm animate-fade-in"
            >
                <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
                    Login
                </h1>

                <div className="mb-4">
                    <label className="text-sm font-medium text-gray-600 block mb-1">
                        Email
                    </label>
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

                <div className="mb-6 relative">
                    <label className="text-sm font-medium text-gray-600 block mb-1">
                        Password
                    </label>
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
                            onClick={() =>
                                setState((prev) => ({
                                    ...prev,
                                    showPassword: !prev.showPassword,
                                }))
                            }
                            className="absolute right-3 top-9 cursor-pointer text-gray-500 hover:text-gray-700 transition-colors"
                        >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </span>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full py-2 px-4 text-white font-semibold rounded-lg shadow-md transition-transform duration-300 ${loading
                        ? "bg-blue-300 cursor-not-allowed"
                        : "bg-blue-500 hover:bg-blue-600 hover:scale-[1.02] active:scale-[0.98]"
                        }`}
                >
                    {loading ? "Logging in..." : "Login"}
                </button>

                <AnimatePresence>
                    {message && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.5 }}
                            className={`mt-4 text-center flex items-center justify-center gap-2 ${success ? "text-green-600" : "text-red-600"
                                }`}
                        >
                            {success ? (
                                <CheckCircle size={20} className="text-green-600" />
                            ) : (
                                <XCircle size={20} />
                            )}
                            <span>{message}</span>
                        </motion.div>
                    )}
                </AnimatePresence>

                <p
                    onClick={() => navigate("/signup")}
                    className="text-sm text-blue-600 mt-4 text-center hover:underline cursor-pointer transition-opacity duration-200"
                >
                    New user? Sign up
                </p>
            </form>
        </div>
    );
}