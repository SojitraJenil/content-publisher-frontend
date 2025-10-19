import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// Import all separated components
import SearchFilterBar from "./SearchFilterBar";
import BulkActionBar from "./BulkActionBar";
import PublicationForm from "./PublicationForm";
import PublicationCard from "./PublicationCard";
import API from "../../api/axiosInstance";
import Header from "../../components/common/Header";
import EmptyState from "../../components/common/EmptyState";
import Modal from "../../components/common/Modal";
import Notification from "../../components/common/Notification";
import Loader from "../../components/common/Loader";

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

export default function Publications({ setToken }: { setToken: (token: string | null) => void }) {
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
    const navigate = useNavigate();

    const fetchPublications = async () => {
        setLoading(true);
        try {
            const { data } = await API.get("/publications");
            setPublications(data);
            setFilteredPubs(data);
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
            result = result.filter(
                (p) =>
                    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    p.content.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        if (statusFilter !== "all") {
            result = result.filter((p) => p.status === statusFilter);
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
            if (editingId) {
                await API.put(`/publications/${editingId}`, form);
                showNotification("success", "Publication updated successfully");
                setEditingId(null);
                fetchPublications();
            } else {
                await API.post("/publications", form);
                showNotification("success", "Publication added successfully");
                fetchPublications();
            }

            setForm({ title: "", content: "", status: "draft" });
            setShowForm(false);
        } catch (error: any) {
            showNotification("error", error.response?.data?.message || "Operation failed");
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
        const pub = publications.find((p) => p._id === id);
        if (!pub) return;

        try {
            await API.delete(`/publications/${id}`);
            setPublications((prev) => prev.filter((p) => p._id !== id));
            setDeleteHistory((prev) => [...prev, pub]);
            showNotification("success", "Publication deleted successfully");
        } catch (error: any) {
            showNotification("error", error.response?.data?.message || "Failed to delete publication");
        }
    };

    const handleBulkDelete = async () => {
        const toDelete = publications.filter((p) => selectedIds.has(p._id));

        try {
            await Promise.all(Array.from(selectedIds).map((id) => API.delete(`/publications/${id}`)));

            setPublications((prev) => prev.filter((p) => !selectedIds.has(p._id)));
            setDeleteHistory((prev) => [...prev, ...toDelete]);
            setSelectedIds(new Set());
            showNotification("success", `${toDelete.length} publications deleted successfully`);
        } catch (error: any) {
            showNotification("error", error.response?.data?.message || "Failed to delete publications");
        }
    };

    const handleUndo = async () => {
        if (deleteHistory.length === 0) return;
        const restored = deleteHistory[deleteHistory.length - 1];

        try {
            const { data } = await API.post("/publications", {
                title: restored.title,
                content: restored.content,
                status: restored.status,
            });

            setPublications((prev) => [data, ...prev]);
            setDeleteHistory((prev) => prev.slice(0, -1));
            showNotification("success", "Publication restored");
        } catch (error: any) {
            showNotification("error", "Failed to restore publication");
        }
    };

    const toggleSelection = (id: string) => {
        setSelectedIds((prev) => {
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
            setSelectedIds(new Set(filteredPubs.map((p) => p._id)));
        }
    };

    const handleStatusChange = async (id: string, newStatus: string) => {
        try {
            const publication = publications.find((p) => p._id === id);
            if (!publication) return;

            await API.put(`/publications/${id}`, {
                title: publication.title,
                content: publication.content,
                status: newStatus,
            });

            setPublications((prev) =>
                prev.map((p) =>
                    p._id === id ? { ...p, status: newStatus, updatedAt: new Date().toISOString() } : p
                )
            );
            showNotification("success", `Status updated to ${newStatus}`);
        } catch (error: any) {
            showNotification("error", error.response?.data?.message || "Failed to update status");
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        setToken(null);
        navigate("/");
    };

    const handleNewPublication = () => {
        setShowForm(true);
        setEditingId(null);
        setForm({ title: "", content: "", status: "draft" });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <Header onLogout={handleLogout} />

            <Notification
                notification={notification}
                showUndo={deleteHistory.length > 0 && notification?.message.includes("deleted")}
                onUndo={handleUndo}
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <SearchFilterBar
                    searchQuery={searchQuery}
                    statusFilter={statusFilter}
                    sortBy={sortBy}
                    filterDisable={publications.length === 0}
                    showFilters={showFilters}
                    onSearchChange={setSearchQuery}
                    onStatusChange={setStatusFilter}
                    onSortChange={setSortBy}
                    onToggleFilters={() => setShowFilters(!showFilters)}
                    onNewPublication={handleNewPublication}
                />

                <BulkActionBar
                    selectedCount={selectedIds.size}
                    onClear={() => setSelectedIds(new Set())}
                    onDelete={handleBulkDelete}
                />

                <Modal
                    isOpen={showForm}
                    onClose={() => setShowForm(false)}
                    title={editingId ? "Edit Publication" : "New Publication"}
                >
                    <PublicationForm
                        form={form}
                        loading={loading}
                        isEditing={!!editingId}
                        onSubmit={handleSubmit}
                        onCancel={() => setShowForm(false)}
                        onChange={setForm}
                    />
                </Modal>

                {loading && publications.length === 0 ? (
                    <Loader size="md" />
                ) : filteredPubs.length === 0 ? (
                    <EmptyState />
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
                            <PublicationCard
                                key={pub._id}
                                publication={pub}
                                isSelected={selectedIds.has(pub._id)}
                                onToggleSelect={toggleSelection}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                                onStatusChange={handleStatusChange}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}