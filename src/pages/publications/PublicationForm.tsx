interface PublicationFormProps {
    form: { title: string; content: string; status: string };
    loading: boolean;
    isEditing: boolean;
    onSubmit: () => void;
    onCancel: () => void;
    onChange: (form: { title: string; content: string; status: string }) => void;
}

export default function PublicationForm({
    form,
    loading,
    isEditing,
    onSubmit,
    onCancel,
    onChange,
}: PublicationFormProps) {
    return (
        <div className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Title
                </label>
                <input
                    type="text"
                    value={form.title}
                    onChange={(e) => onChange({ ...form, title: e.target.value })}
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
                    onChange={(e) => onChange({ ...form, content: e.target.value })}
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
                    onChange={(e) => onChange({ ...form, status: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                </select>
            </div>

            <div className="flex gap-3 pt-4">
                <button
                    onClick={onCancel}
                    className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                    Cancel
                </button>
                <button
                    onClick={onSubmit}
                    disabled={loading}
                    className="flex-1 px-4 py-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
                >
                    {loading ? "Saving..." : isEditing ? "Update" : "Create"}
                </button>
            </div>
        </div>
    );
}