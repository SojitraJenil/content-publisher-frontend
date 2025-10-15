import { Columns, LogOut, Pipette, PipetteIcon, Rows } from "lucide-react";
import { useEffect, useState } from "react";
import API from "../../api/axiosInstance";

interface HeaderProps {
    onLogout: () => void;
}

export default function Header({ onLogout }: HeaderProps) {
    const [user, setUser] = useState<{ email?: string } | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await API.get("/auth/user");
                console.log('res1234', res)
                setUser(res.data);
            } catch (error) {
                console.error("Failed to fetch user:", error);
            }
        };

        fetchUser();
    }, []);

    return (
        <div className="bg-white shadow-sm border-b sticky top-0 z-40">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg"></div>
                        <h1 className="text-xl font-bold text-gray-900">content publisher</h1>
                    </div>

                    <div className="flex items-center gap-4">
                        {user ? (
                            <div className="text-sm text-gray-700">
                                <span className="font-medium">Email:</span> {user.email}
                            </div>
                        ) : (
                            <div className="text-sm text-gray-500">Loading user...</div>
                        )}
                        <span>|</span>
                        <button
                            onClick={onLogout}
                            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                        >
                            <LogOut size={18} />
                            <span className="hidden sm:inline">Logout</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}