import React, { useState } from 'react';
import { BusinessPlan } from '../../lib/types';
import { Banknote, Landmark, ExternalLink, Edit2, Check, X, Plus, Trash2, Calendar, TrendingUp } from 'lucide-react';

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
            <div className="flex flex-col items-center justify-center h-64 bg-white rounded-xl border border-slate-200">
                <Banknote className="w-12 h-12 text-slate-300 mb-4" />
                <p className="text-slate-500 mb-4">No funding data available for this plan.</p>
                {!isReadOnly && (
                    <button
                        onClick={() => {
                            setEditedFunding({ ventureFunds: [], grants: [] });
                            setIsEditing(true);
                        }}
                        className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                    >
                        Add Funding Info
                    </button>
                )}
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-end mb-4">
                {!isReadOnly && !isEditing && (
                    <button onClick={() => setIsEditing(true)} className="flex items-center text-sm font-medium text-primary-600 hover:text-primary-700">
                        <Edit2 className="w-4 h-4 mr-2" /> Edit Info
                    </button>
                )}
                {isEditing && (
                    <div className="flex space-x-2">
                        <button onClick={handleCancel} className="flex items-center px-3 py-1.5 rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-50 text-sm">
                            <X className="w-4 h-4 mr-2" /> Cancel
                        </button>
                        <button onClick={handleSave} className="flex items-center px-3 py-1.5 rounded-lg bg-primary-600 text-white hover:bg-primary-700 text-sm">
                            <Check className="w-4 h-4 mr-2" /> Save Changes
                        </button>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Venture Funds Section */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-semibold text-slate-800 flex items-center">
                            <TrendingUp className="w-5 h-5 mr-2 text-primary-600" />
                            Venture Capital & Investors
                        </h3>
                        {isEditing && (
                            <button onClick={addVentureFund} className="text-sm flex items-center text-primary-600 hover:text-primary-700">
                                <Plus className="w-4 h-4 mr-1" /> Add
                            </button>
                        )}
                    </div>
                    <div className="space-y-4">
                        {editedFunding.ventureFunds.length === 0 && <p className="text-slate-500 text-sm italic">No venture funds listed.</p>}
                        {editedFunding.ventureFunds.map((fund, idx) => (
                            <div key={idx} className="bg-slate-50 p-4 rounded-lg border border-slate-200 relative group">
                                {isEditing && (
                                    <button
                                        onClick={() => removeVentureFund(idx)}
                                        className="absolute top-2 right-2 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                )}
                                <div className="flex-1">
                                    {isEditing ? (
                                        <div className="space-y-2">
                                            <input
                                                className="w-full font-bold text-slate-800 bg-white border border-slate-300 rounded px-2 py-1 text-sm"
                                                value={fund.name}
                                                placeholder="Fund Name"
                                                onChange={(e) => {
                                                    const newFunds = [...editedFunding.ventureFunds];
                                                    newFunds[idx].name = e.target.value;
                                                    setEditedFunding({ ...editedFunding, ventureFunds: newFunds });
                                                }}
                                            />
                                            <input
                                                className="w-full text-slate-600 bg-white border border-slate-300 rounded px-2 py-1 text-xs"
                                                value={fund.focus}
                                                placeholder="Focus Area"
                                                onChange={(e) => {
                                                    const newFunds = [...editedFunding.ventureFunds];
                                                    newFunds[idx].focus = e.target.value;
                                                    setEditedFunding({ ...editedFunding, ventureFunds: newFunds });
                                                }}
                                            />
                                            <input
                                                className="w-full text-blue-600 bg-white border border-slate-300 rounded px-2 py-1 text-xs"
                                                value={fund.website}
                                                placeholder="Website URL"
                                                onChange={(e) => {
                                                    const newFunds = [...editedFunding.ventureFunds];
                                                    newFunds[idx].website = e.target.value;
                                                    setEditedFunding({ ...editedFunding, ventureFunds: newFunds });
                                                }}
                                            />
                                        </div>
                                    ) : (
                                        <>
                                            <h4 className="font-bold text-slate-800">{fund.name}</h4>
                                            <p className="text-sm text-slate-600 mb-2">{fund.focus}</p>
                                            {fund.website && (
                                                <a
                                                    href={fund.website.startsWith('http') ? fund.website : `https://${fund.website}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-xs text-primary-600 hover:text-primary-700 flex items-center font-medium"
                                                >
                                                    Visit Website <ExternalLink className="w-3 h-3 ml-1" />
                                                </a>
                                            )}
                                        </>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Grants Section */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-semibold text-slate-800 flex items-center">
                            <Landmark className="w-5 h-5 mr-2 text-primary-600" />
                            Grants & Public Funding
                        </h3>
                        {isEditing && (
                            <button onClick={addGrant} className="text-sm flex items-center text-primary-600 hover:text-primary-700">
                                <Plus className="w-4 h-4 mr-1" /> Add
                            </button>
                        )}
                    </div>
                    <div className="space-y-4">
                        {editedFunding.grants.length === 0 && <p className="text-slate-500 text-sm italic">No grants listed.</p>}
                        {editedFunding.grants.map((grant, idx) => (
                            <div key={idx} className="bg-slate-50 p-4 rounded-lg border border-slate-200 relative group">
                                {isEditing && (
                                    <button
                                        onClick={() => removeGrant(idx)}
                                        className="absolute top-2 right-2 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                )}
                                <div className="flex-1">
                                    {isEditing ? (
                                        <div className="space-y-2">
                                            <input
                                                className="w-full font-bold text-slate-800 bg-white border border-slate-300 rounded px-2 py-1 text-sm"
                                                value={grant.name}
                                                placeholder="Grant Name"
                                                onChange={(e) => {
                                                    const newGrants = [...editedFunding.grants];
                                                    newGrants[idx].name = e.target.value;
                                                    setEditedFunding({ ...editedFunding, grants: newGrants });
                                                }}
                                            />
                                            <div className="flex gap-2">
                                                <input
                                                    className="w-1/2 text-slate-600 bg-white border border-slate-300 rounded px-2 py-1 text-xs"
                                                    value={grant.amount}
                                                    placeholder="Amount"
                                                    onChange={(e) => {
                                                        const newGrants = [...editedFunding.grants];
                                                        newGrants[idx].amount = e.target.value;
                                                        setEditedFunding({ ...editedFunding, grants: newGrants });
                                                    }}
                                                />
                                                <input
                                                    className="w-1/2 text-slate-600 bg-white border border-slate-300 rounded px-2 py-1 text-xs"
                                                    value={grant.deadline}
                                                    placeholder="Deadline"
                                                    onChange={(e) => {
                                                        const newGrants = [...editedFunding.grants];
                                                        newGrants[idx].deadline = e.target.value;
                                                        setEditedFunding({ ...editedFunding, grants: newGrants });
                                                    }}
                                                />
                                            </div>
                                            <input
                                                className="w-full text-blue-600 bg-white border border-slate-300 rounded px-2 py-1 text-xs"
                                                value={grant.website}
                                                placeholder="Website URL"
                                                onChange={(e) => {
                                                    const newGrants = [...editedFunding.grants];
                                                    newGrants[idx].website = e.target.value;
                                                    setEditedFunding({ ...editedFunding, grants: newGrants });
                                                }}
                                            />
                                        </div>
                                    ) : (
                                        <>
                                            <div className="flex justify-between items-start">
                                                <h4 className="font-bold text-slate-800">{grant.name}</h4>
                                                <span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full font-medium">{grant.amount}</span>
                                            </div>
                                            <div className="flex items-center text-xs text-slate-500 my-2">
                                                <Calendar className="w-3 h-3 mr-1" />
                                                Deadline: {grant.deadline}
                                            </div>
                                            {grant.website && (
                                                <a
                                                    href={grant.website.startsWith('http') ? grant.website : `https://${grant.website}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-xs text-primary-600 hover:text-primary-700 flex items-center font-medium"
                                                >
                                                    Apply Now <ExternalLink className="w-3 h-3 ml-1" />
                                                </a>
                                            )}
                                        </>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};