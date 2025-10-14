import { useEffect, useState } from "react";
import API from "../api/axiosInstance";
import { useNavigate } from "react-router-dom";

interface Publication {
    _id: string;
    title: string;
    content: string;
    status: string;
}

export default function Publications() {
    const [publications, setPublications] = useState<Publication[]>([]);
    const [form, setForm] = useState({ title: "", content: "", status: "draft" });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const fetchPublications = async () => {
        try {
            const { data } = await API.get("/publications");
            setPublications(data);
        } catch (error: any) {
            alert(error.response?.data?.message || "Failed to load publications");
        }
    };

    useEffect(() => {
        fetchPublications();
    }, []);

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await API.post("/publications", form);
            setForm({ title: "", content: "", status: "draft" });
            fetchPublications();
        } catch (error: any) {
            alert(error.response?.data?.message || "Failed to add publication");
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/");
    };

    return (
        <div className="p-6 max-w-3xl mx-auto">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-semibold">My Publications</h1>
                <button
                    onClick={handleLogout}
                    className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
                >
                    Logout
                </button>
            </div>

            <form onSubmit={handleAdd} className="mb-6 border p-4 rounded-lg bg-white shadow">
                <input
                    name="title"
                    placeholder="Title"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    className="border p-2 w-full mb-2 rounded"
                    required
                />
                <textarea
                    name="content"
                    placeholder="Content"
                    value={form.content}
                    onChange={(e) => setForm({ ...form, content: e.target.value })}
                    className="border p-2 w-full mb-2 rounded"
                    required
                />
                <select
                    name="status"
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                    className="border p-2 w-full mb-3 rounded"
                >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                </select>
                <button
                    type="submit"
                    disabled={loading}
                    className="bg-blue-500 hover:bg-blue-600 text-white p-2 w-full rounded"
                >
                    {loading ? "Adding..." : "Add Publication"}
                </button>
            </form>

            <div className="space-y-3">
                {publications.map((p) => (
                    <div key={p._id} className="border p-3 rounded bg-gray-50">
                        <h2 className="font-semibold">{p.title}</h2>
                        <p className="text-sm">{p.content}</p>
                        <span className="text-xs text-gray-500">{p.status}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
