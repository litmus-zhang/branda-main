import React, { useState } from 'react';
import { BusinessPlan } from '../../lib/types';
import { Settings, CheckSquare, Server, Edit2, Check, X, Plus, Trash2 } from 'lucide-react';
import { Card } from '@branda/ui/components/card';

interface SystemsViewProps {
    plan: BusinessPlan;
    onUpdate: (plan: BusinessPlan) => void;
    isReadOnly?: boolean;
}

export const SystemsView: React.FC<SystemsViewProps> = ({ plan, onUpdate, isReadOnly }) => {
    const { systems } = plan;
    const [isEditing, setIsEditing] = useState(false);
    const [editedSystems, setEditedSystems] = useState(systems);

    const handleSave = () => {
        onUpdate({ ...plan, systems: editedSystems });
        setIsEditing(false);
    };

    const handleCancel = () => {
        setEditedSystems(systems);
        setIsEditing(false);
    };

    const addSOP = () => {
        setEditedSystems({
            ...editedSystems,
            sops: [...editedSystems.sops, { title: 'New Procedure', steps: ['Step 1'] }]
        });
    };

    const removeSOP = (index: number) => {
        const newSops = editedSystems.sops.filter((_, i) => i !== index);
        setEditedSystems({ ...editedSystems, sops: newSops });
    };

    const addStep = (sopIndex: number) => {
        const newSops = [...editedSystems.sops];
        newSops[sopIndex]!.steps.push('New step');
        setEditedSystems({ ...editedSystems, sops: newSops });
    };

    const removeStep = (sopIndex: number, stepIndex: number) => {
        const newSops = [...editedSystems.sops];
        newSops[sopIndex]!.steps = newSops[sopIndex]!.steps.filter((_, i) => i !== stepIndex);
        setEditedSystems({ ...editedSystems, sops: newSops });
    };

    const addTech = () => {
        setEditedSystems({
            ...editedSystems,
            techStackRecommendation: [
                ...editedSystems.techStackRecommendation,
                { category: 'New Category', tool: 'New Tool', reason: 'Reason' }
            ]
        });
    };

    const removeTech = (index: number) => {
        const newStack = editedSystems.techStackRecommendation.filter((_, i) => i !== index);
        setEditedSystems({ ...editedSystems, techStackRecommendation: newStack });
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-end mb-4 gap-2">
                {!isReadOnly && !isEditing && (
                    <button onClick={() => setIsEditing(true)} className="flex items-center text-sm font-medium text-primary hover:text-primary/80 transition-colors">
                        <Edit2 className="w-4 h-4 mr-2" /> Edit Systems
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

            <Card className="p-6 border-border">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-foreground flex items-center">
                        <Settings className="w-5 h-5 mr-2 text-primary" />
                        Standard Operating Procedures
                    </h3>
                    {isEditing && (
                        <button onClick={addSOP} className="text-xs font-bold uppercase tracking-widest flex items-center text-primary hover:text-primary/80 transition-colors bg-primary/10 px-3 py-1.5 rounded-full border border-primary/20">
                            <Plus className="w-4 h-4 mr-1" /> Add SOP
                        </button>
                    )}
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {editedSystems.sops.map((sop, idx) => (
                        <div key={idx} className="bg-muted/30 rounded-xl p-6 border border-border h-full flex flex-col relative group shadow-sm transition-all hover:bg-muted/50">
                            {isEditing && (
                                <button
                                    onClick={() => removeSOP(idx)}
                                    className="absolute top-3 right-3 text-muted-foreground/30 hover:text-destructive opacity-0 group-hover:opacity-100 transition-all"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            )}
                            {isEditing ? (
                                <input
                                    className="w-full font-bold text-foreground mb-4 pb-2 border-b border-border bg-transparent focus:bg-background rounded-t focus:ring-primary focus:border-primary px-1 mr-6 shadow-neutral-100 dark:shadow-neutral-900"
                                    value={sop.title}
                                    onChange={(e) => {
                                        const newSops = [...editedSystems.sops];
                                        newSops[idx]!.title = e.target.value;
                                        setEditedSystems({ ...editedSystems, sops: newSops });
                                    }}
                                />
                            ) : (
                                <h4 className="font-bold text-foreground mb-4 pb-2 border-b border-border pr-6 tracking-tight">{sop.title}</h4>
                            )}

                            <ul className="space-y-3 flex-1">
                                {sop.steps.map((step, sIdx) => (
                                    <li key={sIdx} className="flex items-start text-sm text-muted-foreground">
                                        <CheckSquare className="w-4 h-4 mr-3 text-primary/60 shrink-0 mt-0.5" />
                                        {isEditing ? (
                                            <div className="flex-1 flex items-center group/step">
                                                <input
                                                    className="w-full bg-transparent border border-transparent border-dashed hover:border-border focus:bg-background focus:border-primary rounded px-2 py-0.5 text-sm transition-colors"
                                                    value={step}
                                                    onChange={(e) => {
                                                        const newSops = [...editedSystems.sops];
                                                        newSops[idx]!.steps[sIdx] = e.target.value;
                                                        setEditedSystems({ ...editedSystems, sops: newSops });
                                                    }}
                                                />
                                                <button onClick={() => removeStep(idx, sIdx)} className="ml-1 text-muted-foreground/30 hover:text-destructive transition-colors">
                                                    <X className="w-3 h-3" />
                                                </button>
                                            </div>
                                        ) : (
                                            <span className="leading-relaxed">{step}</span>
                                        )}
                                    </li>
                                ))}
                            </ul>
                            {isEditing && (
                                <button onClick={() => addStep(idx)} className="mt-4 text-[10px] font-bold uppercase tracking-widest text-primary/60 hover:text-primary flex items-center transition-colors">
                                    <Plus className="w-3 h-3 mr-1" /> Add Step
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            </Card>

            <Card className="p-6 border-border">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-foreground flex items-center">
                        <Server className="w-5 h-5 mr-2 text-primary" />
                        Infrastructure & Tools
                    </h3>
                    {isEditing && (
                        <button onClick={addTech} className="text-xs font-bold uppercase tracking-widest flex items-center text-primary hover:text-primary/80 transition-colors bg-primary/10 px-3 py-1.5 rounded-full border border-primary/20">
                            <Plus className="w-4 h-4 mr-1" /> Add Tool
                        </button>
                    )}
                </div>
                <div className="overflow-x-auto rounded-xl border border-border shadow-inner bg-muted/10">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-muted/50 border-b border-border text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                                <th className="px-6 py-4">Domain</th>
                                <th className="px-6 py-4">Recommended Tool</th>
                                <th className="px-6 py-4">Rationale</th>
                                {isEditing && <th className="px-6 py-4 w-12 text-center"></th>}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {editedSystems.techStackRecommendation.map((tech, idx) => (
                                <tr key={idx} className="hover:bg-muted/30 transition-colors group">
                                    <td className="px-6 py-4 text-sm font-bold text-foreground uppercase tracking-wider">
                                        {isEditing ? (
                                            <input
                                                className="w-full bg-background border border-input rounded px-3 py-1.5 focus:ring-1 focus:ring-primary outline-none text-xs"
                                                value={tech.category}
                                                onChange={(e) => {
                                                    const newStack = [...editedSystems.techStackRecommendation];
                                                    newStack[idx]!.category = e.target.value;
                                                    setEditedSystems({ ...editedSystems, techStackRecommendation: newStack });
                                                }}
                                            />
                                        ) : tech.category}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-primary font-black italic">
                                        {isEditing ? (
                                            <input
                                                className="w-full bg-background border border-input rounded px-3 py-1.5 focus:ring-1 focus:ring-primary outline-none"
                                                value={tech.tool}
                                                onChange={(e) => {
                                                    const newStack = [...editedSystems.techStackRecommendation];
                                                    newStack[idx]!.tool = e.target.value;
                                                    setEditedSystems({ ...editedSystems, techStackRecommendation: newStack });
                                                }}
                                            />
                                        ) : tech.tool}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-muted-foreground">
                                        {isEditing ? (
                                            <input
                                                className="w-full bg-background border border-input rounded px-3 py-1.5 focus:ring-1 focus:ring-primary outline-none"
                                                value={tech.reason}
                                                onChange={(e) => {
                                                    const newStack = [...editedSystems.techStackRecommendation];
                                                    newStack[idx]!.reason = e.target.value;
                                                    setEditedSystems({ ...editedSystems, techStackRecommendation: newStack });
                                                }}
                                            />
                                        ) : tech.reason}
                                    </td>
                                    {isEditing && (
                                        <td className="px-6 py-4 text-center">
                                            <button
                                                onClick={() => removeTech(idx)}
                                                className="text-muted-foreground/30 hover:text-destructive transition-all"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
};