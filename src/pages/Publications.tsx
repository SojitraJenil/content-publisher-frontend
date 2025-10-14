import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Search,
    Filter,
    Plus,
    Edit2,
    Trash2,
    LogOut,
    X,
    Check,
    AlertCircle,
    Undo2,
    ChevronDown
} from "lucide-react";

interface Publication {
    _id: string;
    user: string;
    title: string;
    content: string;
    status: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
}

export default function Publications() {
    const [publications, setPublications] = useState<Publication[]>([]);
    const [filteredPubs, setFilteredPubs] = useState<Publication[]>([]);
    const [form, setForm] = useState({ title: "", content: "", status: "draft" });
    const [editingId, setEditingId] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [showForm, setShowForm] = useState(false);
    const [deleteHistory, setDeleteHistory] = useState<Publication[]>([]);
    const [notification, setNotification] = useState<{ type: string; message: string } | null>(null);
    const [showFilters, setShowFilters] = useState(false);
    const [sortBy, setSortBy] = useState("newest");

    const fetchPublications = async () => {
        setLoading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 500));
            const mockData: Publication[] = [
                {
                    _id: "68ee7135e4af8c1996f0200f",
                    user: "68ee70f9e4af8c1996f02007",
                    title: "test",
                    content: "test test jenilll",
                    status: "published",
                    createdAt: "2025-10-14T15:50:13.302Z",
                    updatedAt: "2025-10-14T15:50:13.302Z",
                    __v: 0
                },
            ];
            setPublications(mockData);
            setFilteredPubs(mockData);
        } catch (error) {
            showNotification("error", "Failed to load publications");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPublications();
    }, []);

    useEffect(() => {
        let result = [...publications];

        if (searchQuery) {
            result = result.filter(p =>
                p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                p.content.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        if (statusFilter !== "all") {
            result = result.filter(p => p.status === statusFilter);
        }

        result.sort((a, b) => {
            if (sortBy === "newest") {
                return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            } else if (sortBy === "oldest") {
                return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
            } else {
                return a.title.localeCompare(b.title);
            }
        });

        setFilteredPubs(result);
    }, [searchQuery, statusFilter, publications, sortBy]);

    const showNotification = (type: string, message: string) => {
        setNotification({ type, message });
        setTimeout(() => setNotification(null), 3000);
    };

    const handleSubmit = async () => {
        if (!form.title || !form.content) {
            showNotification("error", "Please fill all fields");
            return;
        }

        setLoading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 500));

            if (editingId) {
                setPublications(prev => prev.map(p =>
                    p._id === editingId ? { ...p, ...form, updatedAt: new Date().toISOString() } : p
                ));
                showNotification("success", "Publication updated successfully");
                setEditingId(null);
            } else {
                const newPub: Publication = {
                    _id: Date.now().toString(),
                    user: "current-user-id",
                    ...form,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                    __v: 0
                };
                setPublications(prev => [newPub, ...prev]);
                showNotification("success", "Publication added successfully");
            }

            setForm({ title: "", content: "", status: "draft" });
            setShowForm(false);
        } catch (error) {
            showNotification("error", "Operation failed");
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (pub: Publication) => {
        setForm({ title: pub.title, content: pub.content, status: pub.status });
        setEditingId(pub._id);
        setShowForm(true);
    };

    const handleDelete = async (id: string) => {
        const pub = publications.find(p => p._id === id);
        if (!pub) return;

        setPublications(prev => prev.filter(p => p._id !== id));
        setDeleteHistory(prev => [...prev, pub]);
        showNotification("success", "Publication deleted. Click undo to restore.");
    };

    const handleBulkDelete = async () => {
        const toDelete = publications.filter(p => selectedIds.has(p._id));
        setPublications(prev => prev.filter(p => !selectedIds.has(p._id)));
        setDeleteHistory(prev => [...prev, ...toDelete]);
        setSelectedIds(new Set());
        showNotification("success", `${toDelete.length} publications deleted. Click undo to restore.`);
    };

    const handleUndo = () => {
        if (deleteHistory.length === 0) return;
        const restored = deleteHistory[deleteHistory.length - 1];
        setPublications(prev => [restored, ...prev]);
        setDeleteHistory(prev => prev.slice(0, -1));
        showNotification("success", "Publication restored");
    };

    const toggleSelection = (id: string) => {
        setSelectedIds(prev => {
            const newSet = new Set(prev);
            if (newSet.has(id)) {
                newSet.delete(id);
            } else {
                newSet.add(id);
            }
            return newSet;
        });
    };

    const toggleSelectAll = () => {
        if (selectedIds.size === filteredPubs.length) {
            setSelectedIds(new Set());
        } else {
            setSelectedIds(new Set(filteredPubs.map(p => p._id)));
        }
    };

    const handleStatusChange = async (id: string, newStatus: string) => {
        setPublications(prev => prev.map(p =>
            p._id === id ? { ...p, status: newStatus, updatedAt: new Date().toISOString() } : p
        ));
        showNotification("success", `Status updated to ${newStatus}`);
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="bg-white shadow-sm border-b sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg"></div>
                            <h1 className="text-xl font-bold text-gray-900">Publications</h1>
                        </div>
                        <button
                            onClick={() => { }}
                            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                        >
                            <LogOut size={18} />
                            <span className="hidden sm:inline">Logout</span>
                        </button>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {notification && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="fixed top-20 right-4 z-50"
                    >
                        <div className={`flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg ${notification.type === "success" ? "bg-green-500" : "bg-red-500"
                            } text-white`}>
                            {notification.type === "success" ? <Check size={18} /> : <AlertCircle size={18} />}
                            <span>{notification.message}</span>
                            {deleteHistory.length > 0 && (
                                <button
                                    onClick={handleUndo}
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

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-6 space-y-4">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Search publications..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            <Filter size={18} />
                            Filters
                            <ChevronDown size={16} className={`transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                        </button>

                        <button
                            onClick={() => {
                                setShowForm(true);
                                setEditingId(null);
                                setForm({ title: "", content: "", status: "draft" });
                            }}
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
                                            onChange={(e) => setStatusFilter(e.target.value)}
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
                                            onChange={(e) => setSortBy(e.target.value)}
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

                    <AnimatePresence>
                        {selectedIds.size > 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-lg"
                            >
                                <span className="text-sm font-medium text-blue-900">
                                    {selectedIds.size} publication{selectedIds.size > 1 ? 's' : ''} selected
                                </span>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setSelectedIds(new Set())}
                                        className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                                    >
                                        Clear
                                    </button>
                                    <button
                                        onClick={handleBulkDelete}
                                        className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm"
                                    >
                                        <Trash2 size={14} />
                                        Delete Selected
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <AnimatePresence>
                    {showForm && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
                            onClick={() => setShowForm(false)}
                        >
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                                onClick={(e) => e.stopPropagation()}
                                className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                            >
                                <div className="p-6">
                                    <div className="flex items-center justify-between mb-6">
                                        <h2 className="text-2xl font-bold text-gray-900">
                                            {editingId ? "Edit Publication" : "New Publication"}
                                        </h2>
                                        <button
                                            onClick={() => setShowForm(false)}
                                            className="text-gray-400 hover:text-gray-600 transition-colors"
                                        >
                                            <X size={24} />
                                        </button>
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                                Title
                                            </label>
                                            <input
                                                type="text"
                                                value={form.title}
                                                onChange={(e) => setForm({ ...form, title: e.target.value })}
                                                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                placeholder="Enter publication title"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                                Content
                                            </label>
                                            <textarea
                                                value={form.content}
                                                onChange={(e) => setForm({ ...form, content: e.target.value })}
                                                rows={6}
                                                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                                placeholder="Write your content here..."
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                                Status
                                            </label>
                                            <select
                                                value={form.status}
                                                onChange={(e) => setForm({ ...form, status: e.target.value })}
                                                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            >
                                                <option value="draft">Draft</option>
                                                <option value="published">Published</option>
                                            </select>
                                        </div>

                                        <div className="flex gap-3 pt-4">
                                            <button
                                                onClick={() => setShowForm(false)}
                                                className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                onClick={handleSubmit}
                                                disabled={loading}
                                                className="flex-1 px-4 py-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
                                            >
                                                {loading ? "Saving..." : editingId ? "Update" : "Create"}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {loading && publications.length === 0 ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
                    </div>
                ) : filteredPubs.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="text-gray-400 mb-4">
                            <Search size={48} className="mx-auto" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-600 mb-2">No publications found</h3>
                        <p className="text-gray-500">Try adjusting your search or filters</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredPubs.length > 0 && (
                            <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-gray-200">
                                <input
                                    type="checkbox"
                                    checked={selectedIds.size === filteredPubs.length}
                                    onChange={toggleSelectAll}
                                    className="w-4 h-4 text-blue-500 rounded"
                                />
                                <span className="text-sm text-gray-600">Select All</span>
                            </div>
                        )}

                        {filteredPubs.map((pub) => (
                            <motion.div
                                key={pub._id}
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
                                            checked={selectedIds.has(pub._id)}
                                            onChange={() => toggleSelection(pub._id)}
                                            className="mt-1 w-4 h-4 text-blue-500 rounded"
                                        />

                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-4 mb-2">
                                                <h3 className="text-lg font-semibold text-gray-900 truncate">
                                                    {pub.title}
                                                </h3>
                                                <div className="flex items-center gap-2 flex-shrink-0">
                                                    <select
                                                        value={pub.status}
                                                        onChange={(e) => handleStatusChange(pub._id, e.target.value)}
                                                        className={`px-3 py-1 rounded-full text-xs font-medium border-0 ${pub.status === "published"
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
                                                {pub.content}
                                            </p>

                                            <div className="flex items-center justify-between">
                                                <span className="text-xs text-gray-500">
                                                    {formatDate(pub.createdAt)}
                                                </span>

                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => handleEdit(pub)}
                                                        className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                    >
                                                        <Edit2 size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(pub._id)}
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
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}