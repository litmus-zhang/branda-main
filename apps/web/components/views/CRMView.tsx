import React, { useState } from 'react';
import { BusinessPlan } from '../../lib/types';
import { Users, GitPullRequest, Mail, MoreHorizontal, Edit2, Check, X } from 'lucide-react';
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card } from '@branda/ui/components/card';
import { Button } from '@branda/ui/components/button';

interface CRMViewProps {
    plan: BusinessPlan;
    onUpdate: (plan: BusinessPlan) => void;
    isReadOnly?: boolean;
}

const crmSchema = z.object({
    onboardingProcess: z.array(z.object({
        step: z.string().min(1, "Step name is required"),
        description: z.string().min(1, "Description is required"),
    })),
    mockCustomers: z.array(z.object({
        name: z.string().min(1, "Name is required"),
        email: z.string().email("Invalid email"),
        status: z.string(),
    })),
});

type CRMFormValues = z.infer<typeof crmSchema>;

export const CRMView: React.FC<CRMViewProps> = ({ plan, onUpdate, isReadOnly }) => {
    const { crm } = plan;
    const [isEditing, setIsEditing] = useState(false);

    const {
        control,
        register,
        watch,
        getValues,
        reset,
    } = useForm<CRMFormValues>({
        resolver: zodResolver(crmSchema),
        defaultValues: crm
    });

    const { fields: onboardingFields } = useFieldArray({
        control,
        name: "onboardingProcess"
    });

    const { fields: customerFields } = useFieldArray({
        control,
        name: "mockCustomers"
    });

    const watchedValues = watch();

    // Auto-save logic
    React.useEffect(() => {
        if (!isEditing) return;
        
        const timer = setTimeout(() => {
            const currentValues = getValues();
            onUpdate({ ...plan, crm: currentValues as any });
        }, 1500);

        return () => clearTimeout(timer);
    }, [watchedValues, isEditing]);

    const handleCancel = () => {
        reset(crm);
        setIsEditing(false);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-end mb-4 gap-2">
                {!isReadOnly && !isEditing && (
                    <button onClick={() => setIsEditing(true)} className="flex items-center px-4 py-2 bg-card border border-input rounded-lg text-[10px] font-black text-primary hover:bg-muted shadow-sm transition-all uppercase tracking-widest">
                        <Edit2 className="w-4 h-4 mr-2" /> Edit CRM
                    </button>
                )}
                {isEditing && (
                    <button onClick={() => setIsEditing(false)} className="flex items-center px-4 py-2 bg-primary text-primary-foreground border-transparent rounded-lg text-[10px] font-black hover:bg-primary/90 shadow-lg transition-all active:scale-95 uppercase tracking-widest">
                        <Check className="w-4 h-4 mr-2" /> Done
                    </button>
                )}
            </div>

            {/* Onboarding Flow */}
            <Card className="p-6 border-border">
                <h3 className="text-lg font-semibold text-foreground mb-6 flex items-center">
                    <GitPullRequest className="w-5 h-5 mr-2 text-primary" />
                    Customer Onboarding Flow
                </h3>
                <div className="relative">
                    <div className="absolute top-0 bottom-0 left-4 w-0.5 bg-border"></div>
                    <div className="space-y-8 relative">
                        {onboardingFields.map((field, idx) => (
                            <div key={field.id} className="flex items-start ml-4">
                                <div className="absolute -left-2 w-4 h-4 rounded-full bg-background border-2 border-primary mt-1.5 shadow-sm"></div>
                                <div className="bg-muted/30 p-4 rounded-lg border border-border w-full ml-4 shadow-inner">
                                    {isEditing ? (
                                        <div className="space-y-2">
                                            <input
                                                {...register(`onboardingProcess.${idx}.step`)}
                                                className="w-full font-bold text-foreground text-sm bg-background border border-input rounded px-2 py-1 focus:ring-1 focus:ring-primary outline-none"
                                            />
                                            <textarea
                                                {...register(`onboardingProcess.${idx}.description`)}
                                                className="w-full text-muted-foreground text-sm bg-background border border-input rounded px-2 py-1 mt-1 focus:ring-1 focus:ring-primary outline-none"
                                                rows={2}
                                            />
                                        </div>
                                    ) : (
                                        <>
                                            <h4 className="font-bold text-foreground text-sm mb-1">{field.step}</h4>
                                            <p className="text-muted-foreground text-sm leading-relaxed">{field.description}</p>
                                        </>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </Card>

            {/* Mock Customer Database */}
            <Card className="p-6 border-border">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-foreground flex items-center">
                        <Users className="w-5 h-5 mr-2 text-primary" />
                        Customer Database (Mock)
                    </h3>
                    {!isReadOnly && <button className="text-sm text-primary hover:text-primary/80 font-bold uppercase tracking-wider transition-colors">Add Customer</button>}
                </div>

                <div className="overflow-x-auto rounded-lg border border-border shadow-inner bg-muted/10">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-muted/50 border-b border-border text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                                <th className="py-3 pl-4">Name</th>
                                <th className="py-3">Status</th>
                                <th className="py-3">Email</th>
                                <th className="py-3 text-right pr-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {customerFields.map((field, idx) => (
                                <tr key={field.id} className="group hover:bg-muted/30 transition-colors">
                                    <td className="py-3 pl-4 text-sm font-medium text-foreground">
                                        {isEditing ? (
                                            <input
                                                {...register(`mockCustomers.${idx}.name`)}
                                                className="w-full bg-background border border-input rounded px-2 py-1 text-sm focus:ring-1 focus:ring-primary outline-none"
                                            />
                                        ) : field.name}
                                    </td>
                                    <td className="py-3">
                                        {isEditing ? (
                                            <select
                                                {...register(`mockCustomers.${idx}.status`)}
                                                className="bg-background border border-input rounded px-2 py-1 text-xs focus:ring-1 focus:ring-primary outline-none"
                                            >
                                                <option value="Active">Active</option>
                                                <option value="Lead">Lead</option>
                                                <option value="Churned">Churned</option>
                                            </select>
                                        ) : (
                                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide ${field.status === 'Active' ? 'bg-green-500/10 text-green-600 border border-green-500/20' :
                                                field.status === 'Lead' ? 'bg-blue-500/10 text-blue-600 border border-blue-500/20' :
                                                    'bg-muted text-muted-foreground border border-border'
                                                }`}>
                                                {field.status}
                                            </span>
                                        )}
                                    </td>
                                    <td className="py-3 text-sm text-muted-foreground flex items-center">
                                        <Mail className="w-3 h-3 mr-1.5 text-muted-foreground/30" />
                                        {isEditing ? (
                                            <input
                                                {...register(`mockCustomers.${idx}.email`)}
                                                className="w-full bg-background border border-input rounded px-2 py-1 text-sm focus:ring-1 focus:ring-primary outline-none"
                                            />
                                        ) : field.email}
                                    </td>
                                    <td className="py-3 text-right pr-4">
                                        <button className="text-muted-foreground hover:text-foreground transition-colors">
                                            <MoreHorizontal className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
};