import { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";

interface InputFieldProps {
    label: string;
    name: string;
    type?: string;
    placeholder?: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    error?: string;
    showPasswordToggle?: boolean;
}

export default function InputField({
    label,
    name,
    type = "text",
    placeholder,
    value,
    onChange,
    error,
    showPasswordToggle = false,
}: InputFieldProps) {
    const [showPassword, setShowPassword] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState("");

    const inputType = showPasswordToggle ? (showPassword ? "text" : "password") : type;

    useEffect(() => {
        if (label.toLowerCase() === "password" && value) {
            const strongRegex =
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
            const mediumRegex =
                /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{6,}$/;

            if (strongRegex.test(value)) setPasswordStrength("Strong");
            else if (mediumRegex.test(value)) setPasswordStrength("Medium");
            else setPasswordStrength("Weak");
        } else {
            setPasswordStrength("");
        }
    }, [value, label]);

    const strengthColor =
        passwordStrength === "Strong"
            ? "text-green-600"
            : passwordStrength === "Medium"
                ? "text-yellow-500"
                : passwordStrength === "Weak"
                    ? "text-red-500"
                    : "text-gray-400";

    return (
        <div className="mb-4 relative">
            <label className="text-sm font-medium text-gray-600 block mb-1">
                {label}
            </label>

            <input
                name={name}
                type={inputType}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                className={`w-full px-4 py-2 pr-10 rounded-lg border ${error
                    ? "border-red-400 focus:ring-red-400"
                    : "border-gray-300 focus:ring-blue-400"
                    } focus:ring-2 focus:outline-none transition duration-300`}
            />

            {showPasswordToggle && value && (
                <span
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-9 cursor-pointer text-gray-500 hover:text-gray-700 transition-colors"
                >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </span>
            )}

            {label.toLowerCase() === "password" && passwordStrength && (
                <p className={`text-xs font-medium mt-1 ${strengthColor}`}>
                    Strength: {passwordStrength}
                </p>
            )}

            {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
        </div>
    );
}