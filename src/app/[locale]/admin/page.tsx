'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { User } from '@/lib/types';
import { Loader2, Trash2, CheckCircle, XCircle, Server, Database, Mail } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminPage() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [users, setUsers] = useState<User[]>([]);
    const [isLoadingUsers, setIsLoadingUsers] = useState(false);
    const [systemStatus, setSystemStatus] = useState<any>(null);

    useEffect(() => {
        if (!loading && (!user || user.role !== 'admin')) {
            router.push('/');
            return;
        }

        if (user?.role === 'admin') {
            fetchUsers();
            fetchStatus();
        }
    }, [user, loading, router]);

    const fetchUsers = async () => {
        setIsLoadingUsers(true);
        try {
            const response = await axios.get('/admin/users');
            setUsers(response.data);
        } catch (error) {
            console.error('Failed to fetch users', error);
        } finally {
            setIsLoadingUsers(false);
        }
    };

    const fetchStatus = async () => {
        try {
            const response = await axios.get('/admin/status');
            setSystemStatus(response.data);
        } catch (error) {
            console.error('Failed to fetch system status', error);
        }
    };

    const handleDeleteUser = async (id: string) => {
        if (!confirm('Are you sure you want to delete this user?')) return;
        try {
            await axios.delete(`/admin/users/${id}`);
            setUsers(users.filter(u => u.id !== id));
        } catch (error) {
            console.error('Failed to delete user', error);
            alert('Failed to delete user');
        }
    };

    const handleVerifyUser = async (id: string) => {
        // Ideally use an endpoint to just verify, but updateUser works if allowed
        try {
            // Backend update logic needs to be checked if it allows updating isEmailVerified
            // The current admin controller uses User.findByIdAndUpdate(id, req.body)
            await axios.put(`/admin/users/${id}`, { isEmailVerified: true, emailVerificationToken: undefined });
            setUsers(users.map(u => u.id === id ? { ...u, isEmailVerified: true } : u));
        } catch (error) {
            console.error('Failed to verify user', error);
            alert('Failed to verify user');
        }
    };

    if (loading || !user || user.role !== 'admin') {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    return (
        <div className="container mx-auto py-10">
            <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

            {/* System Status Tiles */}
            <div className="grid gap-4 md:grid-cols-3 mb-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Backend</CardTitle>
                        <Server className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold capitalize">{systemStatus?.backend || 'Unknown'}</div>
                        <p className="text-xs text-muted-foreground">
                            {systemStatus?.backend === 'connected' ? (
                                <span className="text-green-500 flex items-center gap-1"><CheckCircle size={12} /> Operational</span>
                            ) : (
                                <span className="text-red-500 flex items-center gap-1"><XCircle size={12} /> Issues Detected</span>
                            )}
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Database</CardTitle>
                        <Database className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold capitalize">{systemStatus?.database || 'Unknown'}</div>
                        <p className="text-xs text-muted-foreground">
                            {systemStatus?.database === 'connected' ? (
                                <span className="text-green-500 flex items-center gap-1"><CheckCircle size={12} /> Operational</span>
                            ) : (
                                <span className="text-red-500 flex items-center gap-1"><XCircle size={12} /> Disconnected</span>
                            )}
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">SMTP</CardTitle>
                        <Mail className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold capitalize">{systemStatus?.smtp || 'Unknown'}</div>
                        <p className="text-xs text-muted-foreground">
                            {systemStatus?.smtp === 'connected' ? (
                                <span className="text-green-500 flex items-center gap-1"><CheckCircle size={12} /> Operational</span>
                            ) : (
                                <span className="text-red-500 flex items-center gap-1"><XCircle size={12} /> {systemStatus?.smtpError || 'Connection Failed'}</span>
                            )}
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <div className="p-6 border-b">
                    <h2 className="text-xl font-semibold">User Management</h2>
                </div>

                {isLoadingUsers ? (
                    <div className="p-6 text-center">Loading users...</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 border-b">
                                    <th className="p-4 font-medium text-gray-500">Name</th>
                                    <th className="p-4 font-medium text-gray-500">Email</th>
                                    <th className="p-4 font-medium text-gray-500">Role</th>
                                    <th className="p-4 font-medium text-gray-500">Status</th>
                                    <th className="p-4 font-medium text-gray-500">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((u) => (
                                    <tr key={u.id} className="border-b hover:bg-gray-50">
                                        <td className="p-4 flex items-center gap-3">
                                            <img src={u.avatarUrl} alt={u.name} className="w-8 h-8 rounded-full" />
                                            {u.name}
                                        </td>
                                        <td className="p-4">{u.email}</td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded text-xs font-semibold ${u.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                                                u.role === 'teacher' ? 'bg-blue-100 text-blue-800' :
                                                    'bg-green-100 text-green-800'
                                                }`}>
                                                {u.role.toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            {u.isEmailVerified ? (
                                                <span className="flex items-center text-green-600 gap-1"><CheckCircle size={16} /> Verified</span>
                                            ) : (
                                                <span className="flex items-center text-amber-600 gap-1"><XCircle size={16} /> Pending</span>
                                            )}
                                        </td>
                                        <td className="p-4">
                                            <div className="flex gap-2">
                                                {!u.isEmailVerified && (
                                                    <button
                                                        onClick={() => handleVerifyUser(u.id)}
                                                        className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                                                    >
                                                        Verify
                                                    </button>
                                                )}
                                                {u.id !== user.id && (
                                                    <button
                                                        onClick={() => handleDeleteUser(u.id)}
                                                        className="p-2 text-red-500 hover:text-red-700"
                                                        title="Delete User"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
