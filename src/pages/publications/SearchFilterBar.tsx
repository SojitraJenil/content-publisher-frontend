import { Search, Filter, Plus, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface SearchFilterBarProps {
    searchQuery: string;
    statusFilter: string;
    filterDisable: boolean;
    sortBy: string;
    showFilters: boolean;
    onSearchChange: (query: string) => void;
    onStatusChange: (status: string) => void;
    onSortChange: (sort: string) => void;
    onToggleFilters: () => void;
    onNewPublication: () => void;
}

export default function SearchFilterBar({
    searchQuery,
    statusFilter,
    filterDisable,
    sortBy,
    showFilters,
    onSearchChange,
    onStatusChange,
    onSortChange,
    onToggleFilters,
    onNewPublication,
}: SearchFilterBarProps) {
    return (
        <div className="mb-6 space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        disabled={filterDisable}
                        placeholder="Search publications..."
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>

                <button
                    onClick={onToggleFilters}
                    disabled={filterDisable}
                    className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                    <Filter size={18} />
                    Filters
                    <ChevronDown
                        size={16}
                        className={`transition-transform ${showFilters ? "rotate-180" : ""}`}
                    />
                </button>

                <button
                    onClick={onNewPublication}
                    className="flex items-center gap-2 px-4 py-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors shadow-sm"
                >
                    <Plus size={18} />
                    New Publication
                </button>
            </div>

            <AnimatePresence>
                {showFilters && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="p-4 bg-white rounded-lg border border-gray-200 flex flex-wrap gap-4">
                            <div className="flex items-center gap-2">
                                <label className="text-sm font-medium text-gray-700">Status:</label>
                                <select
                                    value={statusFilter}
                                    onChange={(e) => onStatusChange(e.target.value)}
                                    className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="all">All</option>
                                    <option value="draft">Draft</option>
                                    <option value="published">Published</option>
                                </select>
                            </div>
                            <div className="flex items-center gap-2">
                                <label className="text-sm font-medium text-gray-700">Sort by:</label>
                                <select
                                    value={sortBy}
                                    onChange={(e) => onSortChange(e.target.value)}
                                    className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="newest">Newest First</option>
                                    <option value="oldest">Oldest First</option>
                                    <option value="title">Title A-Z</option>
                                </select>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}