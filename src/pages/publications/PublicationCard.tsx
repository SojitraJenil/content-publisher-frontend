import { motion } from "framer-motion";
import { Edit2, Trash2 } from "lucide-react";

interface Publication {
    _id: string;
    title: string;
    content: string;
    status: string;
    createdAt: string;
}

interface PublicationCardProps {
    publication: Publication;
    isSelected: boolean;
    onToggleSelect: (id: string) => void;
    onEdit: any;
    onDelete: (id: string) => void;
    onStatusChange: (id: string, status: string) => void;
}

export default function PublicationCard({
    publication,
    isSelected,
    onToggleSelect,
    onEdit,
    onDelete,
    onStatusChange,
}: PublicationCardProps) {
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
        >
            <div className="p-6">
                <div className="flex items-start gap-4">
                    <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => onToggleSelect(publication._id)}
                        className="mt-1 w-4 h-4 text-blue-500 rounded"
                    />

                    <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900 truncate">
                                {publication.title}
                            </h3>
                            <div className="flex items-center gap-2 flex-shrink-0">
                                <select
                                    value={publication.status}
                                    onChange={(e) =>
                                        onStatusChange(publication._id, e.target.value)
                                    }
                                    className={`px-3 py-1 rounded-full text-xs font-medium border-0 ${publication.status === "published"
                                        ? "bg-green-100 text-green-800"
                                        : "bg-yellow-100 text-yellow-800"
                                        }`}
                                >
                                    <option value="draft">Draft</option>
                                    <option value="published">Published</option>
                                </select>
                            </div>
                        </div>

                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                            {publication.content}
                        </p>

                        <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500">
                                {formatDate(publication.createdAt)}
                            </span>

                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => onEdit(publication)}
                                    className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                >
                                    <Edit2 size={16} />
                                </button>
                                <button
                                    onClick={() => onDelete(publication._id)}
                                    className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}