import React, { useState } from 'react';
import { BusinessPlan } from '../../lib/types';
import { Banknote, Landmark, ExternalLink, Edit2, Check, X, Plus, Trash2, Calendar, TrendingUp } from 'lucide-react';
import { Card } from '@branda/ui/components/card';
import { Button } from '@branda/ui/components/button';

interface FundingViewProps {
    plan: BusinessPlan;
    onUpdate: (plan: BusinessPlan) => void;
    isReadOnly?: boolean;
}

export const FundingView: React.FC<FundingViewProps> = ({ plan, onUpdate, isReadOnly }) => {
    const funding = plan.funding || { ventureFunds: [], grants: [] };
    const [isEditing, setIsEditing] = useState(false);
    const [editedFunding, setEditedFunding] = useState(funding);

    const handleSave = () => {
        onUpdate({ ...plan, funding: editedFunding });
        setIsEditing(false);
    };

    const handleCancel = () => {
        setEditedFunding(funding);
        setIsEditing(false);
    };

    const addVentureFund = () => {
        setEditedFunding({
            ...editedFunding,
            ventureFunds: [...editedFunding.ventureFunds, { name: 'New Fund', focus: 'Focus Area', website: '' }]
        });
    };

    const removeVentureFund = (index: number) => {
        const newFunds = editedFunding.ventureFunds.filter((_, i) => i !== index);
        setEditedFunding({ ...editedFunding, ventureFunds: newFunds });
    };

    const addGrant = () => {
        setEditedFunding({
            ...editedFunding,
            grants: [...editedFunding.grants, { name: 'New Grant', amount: '$10,000', deadline: 'Rolling', website: '' }]
        });
    };

    const removeGrant = (index: number) => {
        const newGrants = editedFunding.grants.filter((_, i) => i !== index);
        setEditedFunding({ ...editedFunding, grants: newGrants });
    };

    if (!plan.funding && !isEditing) {
        return (
            <Card className="flex flex-col items-center justify-center h-64 border-border">
                <Banknote className="w-12 h-12 text-muted-foreground/30 mb-4" />
                <p className="text-muted-foreground mb-4">No funding data available for this plan.</p>
                {!isReadOnly && (
                    <Button
                        onClick={() => {
                            setEditedFunding({ ventureFunds: [], grants: [] });
                            setIsEditing(true);
                        }}
                        className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                    >
                        Add Funding Info
                    </Button>
                )}
            </Card>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-end mb-4 gap-2">
                {!isReadOnly && !isEditing && (
                    <button onClick={() => setIsEditing(true)} className="flex items-center text-sm font-medium text-primary hover:text-primary/80 transition-colors">
                        <Edit2 className="w-4 h-4 mr-2" /> Edit Funding
                    </button>
                )}
                {isEditing && (
                    <div className="flex space-x-2">
                        <button onClick={handleCancel} className="flex items-center px-4 py-2 rounded-lg border border-input text-muted-foreground hover:bg-muted text-sm transition-colors shadow-sm">
                            <X className="w-4 h-4 mr-2" /> Cancel
                        </button>
                        <button onClick={handleSave} className="flex items-center px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 text-sm font-bold transition-colors shadow-sm active:scale-95">
                            <Check className="w-4 h-4 mr-2" /> Save Changes
                        </button>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Venture Funds Section */}
                <Card className="p-8 border-border">
                    <div className="flex justify-between items-center mb-8">
                        <h3 className="text-xl font-black text-foreground flex items-center tracking-tight">
                            <TrendingUp className="w-6 h-6 mr-3 text-primary" />
                            Venture Capital
                        </h3>
                        {isEditing && (
                            <button onClick={addVentureFund} className="text-[10px] font-black uppercase tracking-widest flex items-center text-primary bg-primary/10 px-3 py-1.5 rounded-full border border-primary/20 hover:bg-primary/20 transition-all">
                                <Plus className="w-4 h-4 mr-1" /> Add Provider
                            </button>
                        )}
                    </div>
                    <div className="space-y-6">
                        {editedFunding.ventureFunds.length === 0 && <p className="text-muted-foreground text-xs font-bold uppercase tracking-widest opacity-30 text-center py-12 border-2 border-dashed border-border rounded-xl">No venture leads identified</p>}
                        {editedFunding.ventureFunds.map((fund, idx) => (
                            <div key={idx} className="bg-muted/30 p-5 rounded-xl border border-border relative group transition-all hover:bg-muted/50 hover:shadow-md">
                                {isEditing && (
                                    <button
                                        onClick={() => removeVentureFund(idx)}
                                        className="absolute top-3 right-3 text-muted-foreground/30 hover:text-destructive opacity-0 group-hover:opacity-100 transition-all"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                )}
                                <div className="flex-1">
                                    {isEditing ? (
                                        <div className="space-y-3">
                                            <input
                                                className="w-full font-bold text-foreground bg-background border border-input rounded px-3 py-2 text-sm focus:ring-1 focus:ring-primary outline-none"
                                                value={fund.name}
                                                placeholder="Fund Name"
                                                onChange={(e) => {
                                                    const newFunds = [...editedFunding.ventureFunds];
                                                    newFunds[idx]!.name = e.target.value;
                                                    setEditedFunding({ ...editedFunding, ventureFunds: newFunds });
                                                }}
                                            />
                                            <input
                                                className="w-full text-muted-foreground bg-background border border-input rounded px-3 py-2 text-xs focus:ring-1 focus:ring-primary outline-none"
                                                value={fund.focus}
                                                placeholder="Strategic Focus (e.g., B2B SaaS, Seed)"
                                                onChange={(e) => {
                                                    const newFunds = [...editedFunding.ventureFunds];
                                                    newFunds[idx]!.focus = e.target.value;
                                                    setEditedFunding({ ...editedFunding, ventureFunds: newFunds });
                                                }}
                                            />
                                            <input
                                                className="w-full text-primary font-bold bg-background border border-input rounded px-3 py-2 text-xs focus:ring-1 focus:ring-primary outline-none"
                                                value={fund.website}
                                                placeholder="Digital Presence (URL)"
                                                onChange={(e) => {
                                                    const newFunds = [...editedFunding.ventureFunds];
                                                    newFunds[idx]!.website = e.target.value;
                                                    setEditedFunding({ ...editedFunding, ventureFunds: newFunds });
                                                }}
                                            />
                                        </div>
                                    ) : (
                                        <>
                                            <h4 className="font-bold text-foreground tracking-tight text-lg mb-1">{fund.name}</h4>
                                            <div className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest bg-primary/10 text-primary mb-3">
                                                {fund.focus}
                                            </div>
                                            {fund.website && (
                                                <a
                                                    href={fund.website.startsWith('http') ? fund.website : `https://${fund.website}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-xs text-muted-foreground hover:text-primary flex items-center font-bold tracking-tight mt-2 transition-colors group/link"
                                                >
                                                    <span className="border-b border-transparent group-hover/link:border-primary">Digital Profile</span>
                                                    <ExternalLink className="w-3 h-3 ml-1.5 opacity-40 group-hover/link:opacity-100 group-hover/link:translate-x-0.5 transition-all" />
                                                </a>
                                            )}
                                        </>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>

                {/* Grants Section */}
                <Card className="p-8 border-border">
                    <div className="flex justify-between items-center mb-8">
                        <h3 className="text-xl font-black text-foreground flex items-center tracking-tight">
                            <Landmark className="w-6 h-6 mr-3 text-primary" />
                            Grants & Public
                        </h3>
                        {isEditing && (
                            <button onClick={addGrant} className="text-[10px] font-black uppercase tracking-widest flex items-center text-primary bg-primary/10 px-3 py-1.5 rounded-full border border-primary/20 hover:bg-primary/20 transition-all">
                                <Plus className="w-4 h-4 mr-1" /> Add Grant
                            </button>
                        )}
                    </div>
                    <div className="space-y-6">
                        {editedFunding.grants.length === 0 && <p className="text-muted-foreground text-xs font-bold uppercase tracking-widest opacity-30 text-center py-12 border-2 border-dashed border-border rounded-xl">No public opportunities tracked</p>}
                        {editedFunding.grants.map((grant, idx) => (
                            <div key={idx} className="bg-muted/30 p-5 rounded-xl border border-border relative group transition-all hover:bg-muted/50 hover:shadow-md">
                                {isEditing && (
                                    <button
                                        onClick={() => removeGrant(idx)}
                                        className="absolute top-3 right-3 text-muted-foreground/30 hover:text-destructive opacity-0 group-hover:opacity-100 transition-all"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                )}
                                <div className="flex-1">
                                    {isEditing ? (
                                        <div className="space-y-3">
                                            <input
                                                className="w-full font-bold text-foreground bg-background border border-input rounded px-3 py-2 text-sm focus:ring-1 focus:ring-primary outline-none"
                                                value={grant.name}
                                                placeholder="Grant Name"
                                                onChange={(e) => {
                                                    const newGrants = [...editedFunding.grants];
                                                    newGrants[idx]!.name = e.target.value;
                                                    setEditedFunding({ ...editedFunding, grants: newGrants });
                                                }}
                                            />
                                            <div className="flex gap-3">
                                                <input
                                                    className="w-1/2 text-muted-foreground bg-background border border-input rounded px-3 py-2 text-xs focus:ring-1 focus:ring-primary outline-none font-bold"
                                                    value={grant.amount}
                                                    placeholder="Quantum ($10k)"
                                                    onChange={(e) => {
                                                        const newGrants = [...editedFunding.grants];
                                                        newGrants[idx]!.amount = e.target.value;
                                                        setEditedFunding({ ...editedFunding, grants: newGrants });
                                                    }}
                                                />
                                                <input
                                                    className="w-1/2 text-muted-foreground bg-background border border-input rounded px-3 py-2 text-xs focus:ring-1 focus:ring-primary outline-none font-bold"
                                                    value={grant.deadline}
                                                    placeholder="Submission Deadline"
                                                    onChange={(e) => {
                                                        const newGrants = [...editedFunding.grants];
                                                        newGrants[idx]!.deadline = e.target.value;
                                                        setEditedFunding({ ...editedFunding, grants: newGrants });
                                                    }}
                                                />
                                            </div>
                                            <input
                                                className="w-full text-primary font-bold bg-background border border-input rounded px-3 py-2 text-xs focus:ring-1 focus:ring-primary outline-none"
                                                value={grant.website}
                                                placeholder="Application Portal (URL)"
                                                onChange={(e) => {
                                                    const newGrants = [...editedFunding.grants];
                                                    newGrants[idx]!.website = e.target.value;
                                                    setEditedFunding({ ...editedFunding, grants: newGrants });
                                                }}
                                            />
                                        </div>
                                    ) : (
                                        <>
                                            <div className="flex justify-between items-start mb-2">
                                                <h4 className="font-bold text-foreground tracking-tight text-lg">{grant.name}</h4>
                                                <span className="bg-green-500/10 text-green-600 text-[10px] px-2 py-1 rounded font-black uppercase tracking-widest border border-green-500/20">{grant.amount}</span>
                                            </div>
                                            <div className="flex items-center text-xs font-bold text-muted-foreground mb-4 uppercase tracking-tighter opacity-60">
                                                <Calendar className="w-3 h-3 mr-2 text-primary" />
                                                Deadline: <span className="text-foreground ml-1">{grant.deadline}</span>
                                            </div>
                                            {grant.website && (
                                                <a
                                                    href={grant.website.startsWith('http') ? grant.website : `https://${grant.website}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-xs text-primary hover:text-primary/80 flex items-center font-black uppercase tracking-[0.2em] mt-3 group/apply"
                                                >
                                                    <span className="border-b-2 border-primary/20 group-hover:border-primary transition-all">Submit Application</span> 
                                                    <ExternalLink className="w-3 h-3 ml-2 group-hover:translate-x-0.5 transition-all" />
                                                </a>
                                            )}
                                        </>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        </div>
    );
};