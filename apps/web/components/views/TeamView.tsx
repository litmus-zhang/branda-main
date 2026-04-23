import React, { useState } from 'react';
import { Workspace, Collaborator } from '../../lib/types';
import { Users, UserPlus, Mail, Check, Trash2, Info } from 'lucide-react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { cn } from "@branda/ui/lib/utils";
import { Card } from '@branda/ui/components/card';

interface TeamViewProps {
    workspace: Workspace;
    onUpdateWorkspace: (workspace: Workspace) => void;
    currentUserEmail: string;
}

const inviteSchema = z.object({
    email: z.string().email("Please enter a valid email address"),
    role: z.enum(["admin", "editor", "viewer"]),
});

type InviteFormValues = z.infer<typeof inviteSchema>;

export const TeamView: React.FC<TeamViewProps> = ({ workspace, onUpdateWorkspace, currentUserEmail }) => {
    const [notification, setNotification] = useState<{ message: string, type: 'success' | 'error' } | null>(null);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm<InviteFormValues>({
        resolver: zodResolver(inviteSchema),
        defaultValues: {
            role: 'editor'
        }
    });

    const currentUserRole = workspace.collaborators.find(c => c.email === currentUserEmail)?.role || 'owner';
    const canInvite = currentUserRole === 'owner' || currentUserRole === 'admin';

    const onInviteSubmit = (data: InviteFormValues) => {
        if (workspace.collaborators.some(c => c.email === data.email)) {
            setNotification({ message: 'User is already a collaborator.', type: 'error' });
            return;
        }

        const newCollaborator: Collaborator = {
            id: crypto.randomUUID(),
            email: data.email,
            role: data.role,
            status: 'pending',
            invitedAt: new Date().toISOString()
        };

        onUpdateWorkspace({
            ...workspace,
            collaborators: [...workspace.collaborators, newCollaborator]
        });

        setNotification({ message: `Invitation sent to ${data.email}`, type: 'success' });
        reset();
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
        let colors = "bg-muted text-muted-foreground border-border";
        if (role === 'owner') colors = "bg-indigo-500/10 text-indigo-600 border-indigo-500/20";
        if (role === 'admin') colors = "bg-purple-500/10 text-purple-600 border-purple-500/20";
        if (role === 'editor') colors = "bg-blue-500/10 text-blue-600 border-blue-500/20";
        if (role === 'viewer') colors = "bg-muted text-muted-foreground border-border";

        return (
            <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${colors}`}>
                {role}
            </span>
        );
    };

    return (
        <div className="space-y-6">
            <Card className="p-8 border-border">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h2 className="text-2xl font-black text-foreground flex items-center tracking-tight">
                            <Users className="w-6 h-6 mr-3 text-primary" />
                            Team Management
                        </h2>
                        <p className="text-muted-foreground text-sm mt-1 font-medium italic opacity-70">Govern access and collaboration settings for this workspace.</p>
                    </div>
                </div>

                {/* Role Description Legend */}
                <div className="bg-muted/30 p-6 rounded-xl border border-border mb-10 shadow-inner">
                    <h4 className="font-bold text-foreground mb-4 text-sm flex items-center tracking-wide uppercase">
                        <Info className="w-4 h-4 mr-2 opacity-50" /> 
                        Permission Hierarchy
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex items-start">
                            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 mr-3 shrink-0" />
                            <p className="text-xs leading-relaxed text-muted-foreground"><span className="font-black text-foreground uppercase tracking-widest mr-2">Owner</span> Unrestricted access, billing control, and workspace deletion.</p>
                        </div>
                        <div className="flex items-start">
                            <div className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-1.5 mr-3 shrink-0" />
                            <p className="text-xs leading-relaxed text-muted-foreground"><span className="font-black text-foreground uppercase tracking-widest mr-2">Admin</span> Can manage members, integrations, and workspace settings.</p>
                        </div>
                        <div className="flex items-start">
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 mr-3 shrink-0" />
                            <p className="text-xs leading-relaxed text-muted-foreground"><span className="font-black text-foreground uppercase tracking-widest mr-2">Editor</span> Full write access to Brand, Marketing, and Systems engine.</p>
                        </div>
                        <div className="flex items-start">
                            <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50 mt-1.5 mr-3 shrink-0" />
                            <p className="text-xs leading-relaxed text-muted-foreground"><span className="font-black text-foreground uppercase tracking-widest mr-2">Viewer</span> Zero-edit access. Ideal for external stakeholders or mentors.</p>
                        </div>
                    </div>
                </div>

                {/* Invite Form */}
                {canInvite && (
                    <div className="bg-muted/10 p-8 rounded-xl border-2 border-dashed border-border mb-12 hover:border-primary/40 transition-all duration-300 group">
                        <h3 className="font-bold text-foreground mb-6 flex items-center uppercase tracking-[0.2em] text-xs">
                            <UserPlus className="w-5 h-5 mr-3 text-primary opacity-60" />
                            Invite Operator
                        </h3>
                        <form onSubmit={handleSubmit(onInviteSubmit)} className="flex flex-col lg:flex-row gap-6">
                            <div className="flex-1">
                                <label className="block text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-2 opacity-60">Identity / Email</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground/30" />
                                    <input
                                        {...register("email")}
                                        className={cn(
                                            "w-full pl-10 pr-4 py-2.5 bg-background border border-input rounded shadow-sm focus:ring-1 focus:ring-primary outline-none transition-all font-medium text-sm",
                                            errors.email ? "border-destructive ring-destructive/20" : "hover:border-border"
                                        )}
                                        placeholder="operator@company.com"
                                    />
                                </div>
                                {errors.email && <p className="text-xs font-bold text-destructive mt-2 uppercase tracking-wide">{errors.email.message}</p>}
                            </div>
                            <div className="w-full lg:w-48">
                                <label className="block text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-2 opacity-60">Initial Role</label>
                                <select
                                    {...register("role")}
                                    className="w-full px-4 py-2.5 border border-input rounded bg-background text-foreground text-sm font-bold focus:ring-1 focus:ring-primary outline-none cursor-pointer shadow-sm"
                                >
                                    <option value="admin">Admin</option>
                                    <option value="editor">Editor</option>
                                    <option value="viewer">Viewer</option>
                                </select>
                            </div>
                            <div className="flex items-end">
                                <button type="submit" className="w-full lg:w-auto px-8 py-2.5 bg-primary text-primary-foreground font-black text-xs uppercase tracking-widest rounded shadow-lg shadow-primary/20 hover:bg-primary/90 hover:scale-[1.02] active:scale-95 transition-all">
                                    Transmit Invitation
                                </button>
                            </div>
                        </form>
                        {notification && (
                            <div className={`mt-6 p-4 rounded border text-xs font-bold uppercase tracking-wider flex items-center animate-in fade-in slide-in-from-top-2 duration-300 ${notification.type === 'success' ? 'bg-green-500/10 text-green-600 border-green-500/20' : 'bg-destructive/10 text-destructive border-destructive/20'}`}>
                                {notification.type === 'success' && <Check className="w-4 h-4 mr-3" />}
                                {notification.message}
                            </div>
                        )}
                    </div>
                )}

                {/* Team List */}
                <div>
                    <h3 className="font-bold text-foreground mb-6 uppercase tracking-[0.2em] text-xs opacity-60">Active Task Force</h3>
                    <div className="overflow-hidden rounded-xl border border-border shadow-inner bg-card">
                        <table className="w-full text-left">
                            <thead className="bg-muted/50">
                                <tr className="text-[10px] font-black text-muted-foreground uppercase tracking-widest border-b border-border">
                                    <th className="px-6 py-4">Collaborator</th>
                                    <th className="px-6 py-4">Security Clearence</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Operations</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {workspace.collaborators.map((collaborator) => (
                                    <tr key={collaborator.id} className="hover:bg-muted/30 transition-colors group">
                                        <td className="px-6 py-5">
                                            <div className="flex items-center">
                                                <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-black mr-4 text-xs border border-primary/20 shadow-sm group-hover:scale-110 transition-transform">
                                                    {collaborator.email.charAt(0).toUpperCase()}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-bold text-foreground tracking-tight">{collaborator.email}</span>
                                                    {collaborator.email === currentUserEmail && (
                                                        <span className="text-[10px] font-black text-primary uppercase tracking-tighter mt-0.5">Primary Key (Self)</span>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <RoleBadge role={collaborator.role} />
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest border ${collaborator.status === 'active'
                                                ? 'bg-green-500/10 text-green-600 border-green-500/10'
                                                : 'bg-yellow-500/10 text-yellow-600 border-yellow-500/10'
                                                }`}>
                                                {collaborator.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5 text-right">
                                            {canInvite && collaborator.email !== currentUserEmail && collaborator.role !== 'owner' && (
                                                <button
                                                    onClick={() => handleRemove(collaborator.id)}
                                                    className="text-muted-foreground hover:text-destructive transition-all p-2 hover:bg-destructive/10 rounded-lg group/trash"
                                                    title="Decommission User"
                                                >
                                                    <Trash2 className="w-4 h-4 group-hover/trash:scale-110" />
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                                {workspace.collaborators.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-12 text-center text-muted-foreground/40 text-xs font-bold uppercase tracking-[0.2em] italic">
                                            No auxiliary units detected.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </Card>
        </div>
    );
};