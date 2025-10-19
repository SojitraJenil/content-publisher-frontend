import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axiosInstance";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle } from "lucide-react";
import InputField from "../../components/common/Input/InputField";
import Button from "../../components/common/button/Button";

export default function Login({ setToken }: { setToken: (token: string | null) => void }) {
    const navigate = useNavigate();
    const [form, setForm] = useState({ email: "", password: "" });
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ text: string; type: "success" | "error" | "" }>({ text: "", type: "" });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: "" }); // clear field error
    };

    const validateForm = () => {
        const newErrors: { [key: string]: string } = {};
        if (!form.email.trim()) newErrors.email = "Email is required";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
            newErrors.email = "Enter a valid email address";

        if (!form.password.trim()) newErrors.password = "Password is required";
        else if (form.password.length < 1)
            newErrors.password = "Password must be at least 6 characters";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);
        setMessage({ text: "", type: "" });

        try {
            const { data } = await API.post("/auth/login", form);
            localStorage.setItem("token", data.token);
            setToken(data.token);

            setMessage({ text: "Login successful! Redirecting...", type: "success" });
            setTimeout(() => navigate("/publications"), 1000);
        } catch (error: any) {
            setMessage({
                text: error.response?.data?.message || "Login failed",
                type: "error",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 via-white to-purple-100 px-4">
            <form
                noValidate
                onSubmit={handleSubmit}
                className="backdrop-blur-md bg-white/70 border border-white/30 shadow-2xl rounded-2xl p-8 w-full max-w-sm animate-fade-in"
            >
                <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
                    Login
                </h1>

                <InputField
                    label="Email"
                    name="email"
                    type="email"
                    placeholder="enter your email..."
                    value={form.email}
                    onChange={handleChange}
                    error={errors.email}
                />

                <InputField
                    label="Password"
                    name="password"
                    placeholder="enter your password..."
                    value={form.password}
                    onChange={handleChange}
                    error={errors.password}
                    showPasswordToggle
                />

                <Button text="Login" type="submit" loading={loading} />

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
