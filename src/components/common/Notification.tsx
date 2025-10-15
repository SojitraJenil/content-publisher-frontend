import { motion, AnimatePresence } from "framer-motion";
import { Check, AlertCircle, Undo2 } from "lucide-react";

interface NotificationProps {
    notification: { type: string; message: string } | null;
    showUndo?: boolean;
    onUndo?: () => void;
}

export default function Notification({ notification, showUndo, onUndo }: NotificationProps) {
    return (
        <AnimatePresence>
            {notification && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="fixed top-20 right-4 z-50"
                >
                    <div
                        className={`flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg ${notification.type === "success" ? "bg-green-500" : "bg-red-500"
                            } text-white`}
                    >
                        {notification.type === "success" ? (
                            <Check size={18} />
                        ) : (
                            <AlertCircle size={18} />
                        )}
                        <span>{notification.message}</span>
                        {showUndo && onUndo && (
                            <button
                                onClick={onUndo}
                                className="ml-2 flex items-center gap-1 px-2 py-1 bg-white/20 hover:bg-white/30 rounded transition-colors"
                            >
                                <Undo2 size={14} />
                                Undo
                            </button>
                        )}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}