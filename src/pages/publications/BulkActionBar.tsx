import { motion, AnimatePresence } from "framer-motion";
import { Trash2 } from "lucide-react";

interface BulkActionBarProps {
    selectedCount: number;
    onClear: () => void;
    onDelete: () => void;
}

export default function BulkActionBar({ selectedCount, onClear, onDelete }: BulkActionBarProps) {
    return (
        <AnimatePresence>
            {selectedCount > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-lg"
                >
                    <span className="text-sm font-medium text-blue-900">
                        {selectedCount} publication{selectedCount > 1 ? "s" : ""} selected
                    </span>
                    <div className="flex gap-2">
                        <button
                            onClick={onClear}
                            className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                        >
                            Clear
                        </button>
                        <button
                            onClick={onDelete}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm"
                        >
                            <Trash2 size={14} />
                            Delete Selected
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}