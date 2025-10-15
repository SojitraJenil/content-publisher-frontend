import { Search } from "lucide-react";

export default function EmptyState() {
    return (
        <div className="text-center py-20">
            <div className="text-gray-400 mb-4">
                <Search size={48} className="mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
                No publications found
            </h3>
            <p className="text-gray-500">Try adjusting your search or filters</p>
        </div>
    );
}