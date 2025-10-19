import Loader from "../Loader";

interface ButtonProps {
    text: string;
    loading?: boolean;
    onClick?: () => void;
    type?: "button" | "submit";
    disabled?: boolean;
}

export default function Button({
    text,
    loading = false,
    onClick,
    type = "button",
    disabled = false,
}: ButtonProps) {
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled || loading}
            className={`w-full py-2 px-4 text-white font-semibold rounded-lg shadow-md transition-transform duration-300 ${loading || disabled
                ? "bg-blue-300 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600 hover:scale-[1.02] active:scale-[0.98]"
                }`}
        >
            {loading ? <Loader size="sm" /> : text}
        </button>
    );
}