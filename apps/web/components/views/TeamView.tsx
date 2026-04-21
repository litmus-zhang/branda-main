import React, { useState } from 'react';
import { Workspace, Collaborator } from '../../lib/types';
import { Users, UserPlus, Mail, Shield, Check, Trash2, Info } from 'lucide-react';

interface TeamViewProps {
    workspace: Workspace;
    onUpdateWorkspace: (workspace: Workspace) => void;
    currentUserEmail: string;
}

export const TeamView: React.FC<TeamViewProps> = ({ workspace, onUpdateWorkspace, currentUserEmail }) => {
    const [inviteEmail, setInviteEmail] = useState('');
    const [inviteRole, setInviteRole] = useState<'admin' | 'editor' | 'viewer'>('editor');
    const [notification, setNotification] = useState<{ message: string, type: 'success' | 'error' } | null>(null);

    const currentUserRole = workspace.collaborators.find(c => c.email === currentUserEmail)?.role || 'owner';
    const canInvite = currentUserRole === 'owner' || currentUserRole === 'admin';

    const handleInvite = (e: React.FormEvent) => {
        e.preventDefault();

        if (workspace.collaborators.some(c => c.email === inviteEmail)) {
            setNotification({ message: 'User is already a collaborator.', type: 'error' });
            return;
        }

        const newCollaborator: Collaborator = {
            id: crypto.randomUUID(),
            email: inviteEmail,
            role: inviteRole,
            status: 'pending',
            invitedAt: new Date().toISOString()
        };

        onUpdateWorkspace({
            ...workspace,
            collaborators: [...workspace.collaborators, newCollaborator]
        });

        setNotification({ message: `Invitation sent to ${inviteEmail}`, type: 'success' });
        setInviteEmail('');
        setTimeout(() => setNotification(null), 3000);
    };

    const handleRemove = (id: string) => {
        if (!confirm('Are you sure you want to remove this collaborator?')) return;

        onUpdateWorkspace({
            ...workspace,
            collaborators: workspace.collaborators.filter(c => c.id !== id)
        });
    };

    const RoleBadge = ({ role }: { role: string }) => {
        let colors = "bg-slate-100 text-slate-800";
        if (role === 'owner') colors = "bg-indigo-100 text-indigo-800";
        if (role === 'admin') colors = "bg-purple-100 text-purple-800";
        if (role === 'editor') colors = "bg-blue-100 text-blue-800";
        if (role === 'viewer') colors = "bg-gray-100 text-gray-800";

        return (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${colors}`}>
                {role}
            </span>
        );
    };

    return (
        <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900 flex items-center">
                            <Users className="w-6 h-6 mr-2 text-primary-600" />
                            Team & Collaborators
                        </h2>
                        <p className="text-slate-500 text-sm mt-1">Manage access to your workspace.</p>
                    </div>
                </div>

                {/* Role Description Legend */}
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 mb-6 text-sm text-slate-600">
                    <h4 className="font-semibold text-slate-800 mb-2 flex items-center"><Info className="w-4 h-4 mr-1.5" /> Access Levels</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="flex items-start"><span className="font-medium mr-2 text-indigo-700">Owner:</span> Full access, billing, and workspace deletion.</div>
                        <div className="flex items-start"><span className="font-medium mr-2 text-purple-700">Admin:</span> Can invite members and manage integrations.</div>
                        <div className="flex items-start"><span className="font-medium mr-2 text-blue-700">Editor:</span> Can edit content (Brand, Marketing, Systems).</div>
                        <div className="flex items-start"><span className="font-medium mr-2 text-gray-700">Viewer:</span> Read-only access to all data.</div>
                    </div>
                </div>

                {/* Invite Form */}
                {canInvite && (
                    <div className="bg-white p-6 rounded-lg border-2 border-dashed border-slate-200 mb-8 hover:border-slate-300 transition-colors">
                        <h3 className="font-semibold text-slate-800 mb-4 flex items-center">
                            <UserPlus className="w-5 h-5 mr-2 text-primary-600" />
                            Invite New Member
                        </h3>
                        <form onSubmit={handleInvite} className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1">
                                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                                    <input
                                        type="email"
                                        required
                                        className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                                        placeholder="colleague@example.com"
                                        value={inviteEmail}
                                        onChange={e => setInviteEmail(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="w-full md:w-48">
                                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Role</label>
                                <select
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none bg-white"
                                    value={inviteRole}
                                    onChange={(e) => setInviteRole(e.target.value as any)}
                                >
                                    <option value="admin">Admin</option>
                                    <option value="editor">Editor</option>
                                    <option value="viewer">Viewer</option>
                                </select>
                            </div>
                            <div className="flex items-end">
                                <button type="submit" className="w-full md:w-auto px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-lg transition-colors shadow-sm">
                                    Send Invite
                                </button>
                            </div>
                        </form>
                        {notification && (
                            <div className={`mt-4 p-3 rounded-lg text-sm flex items-center ${notification.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                                {notification.type === 'success' && <Check className="w-4 h-4 mr-2" />}
                                {notification.message}
                            </div>
                        )}
                    </div>
                )}

                {/* Team List */}
                <div>
                    <h3 className="font-semibold text-slate-800 mb-4">Current Team</h3>
                    <div className="overflow-hidden rounded-lg border border-slate-200">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50">
                                <tr className="text-xs font-semibold text-slate-500 uppercase">
                                    <th className="px-6 py-3">User</th>
                                    <th className="px-6 py-3">Role</th>
                                    <th className="px-6 py-3">Status</th>
                                    <th className="px-6 py-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 bg-white">
                                {workspace.collaborators.map((collaborator) => (
                                    <tr key={collaborator.id} className="hover:bg-slate-50">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold mr-3 text-xs border border-slate-200">
                                                    {collaborator.email.charAt(0).toUpperCase()}
                                                </div>
                                                <span className="text-sm font-medium text-slate-900">{collaborator.email}</span>
                                                {collaborator.email === currentUserEmail && (
                                                    <span className="ml-2 text-xs text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">(You)</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <RoleBadge role={collaborator.role} />
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${collaborator.status === 'active'
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                {collaborator.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            {canInvite && collaborator.email !== currentUserEmail && collaborator.role !== 'owner' && (
                                                <button
                                                    onClick={() => handleRemove(collaborator.id)}
                                                    className="text-slate-400 hover:text-red-600 transition-colors p-1 hover:bg-red-50 rounded"
                                                    title="Remove User"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                                {workspace.collaborators.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-8 text-center text-slate-500 text-sm">
                                            No other team members yet.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};