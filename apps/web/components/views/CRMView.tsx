import React, { useState } from 'react';
import { BusinessPlan } from '../../lib/types';
import { Users, GitPullRequest, Mail, MoreHorizontal, Edit2, Check, X } from 'lucide-react';
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

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
        handleSubmit,
        reset,
        formState: { errors }
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

    const onSave = (data: CRMFormValues) => {
        onUpdate({ ...plan, crm: data as any });
        setIsEditing(false);
    };

    const handleCancel = () => {
        reset(crm);
        setIsEditing(false);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-end mb-4">
                {!isReadOnly && !isEditing && (
                    <button onClick={() => setIsEditing(true)} className="flex items-center text-sm font-medium text-primary-600 hover:text-primary-700">
                        <Edit2 className="w-4 h-4 mr-2" /> Edit CRM
                    </button>
                )}
                {isEditing && (
                    <div className="flex space-x-2">
                        <button onClick={handleCancel} className="flex items-center px-3 py-1.5 rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-50 text-sm">
                            <X className="w-4 h-4 mr-2" /> Cancel
                        </button>
                        <button onClick={handleSubmit(onSave)} className="flex items-center px-3 py-1.5 rounded-lg bg-primary-600 text-white hover:bg-primary-700 text-sm">
                            <Check className="w-4 h-4 mr-2" /> Save Changes
                        </button>
                    </div>
                )}
            </div>

            {/* Onboarding Flow */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <h3 className="text-lg font-semibold text-slate-800 mb-6 flex items-center">
                    <GitPullRequest className="w-5 h-5 mr-2 text-primary-600" />
                    Customer Onboarding Flow
                </h3>
                <div className="relative">
                    <div className="absolute top-0 bottom-0 left-4 w-0.5 bg-slate-200"></div>
                    <div className="space-y-8 relative">
                        {onboardingFields.map((field, idx) => (
                            <div key={field.id} className="flex items-start ml-4">
                                <div className="absolute -left-2 w-4 h-4 rounded-full bg-white border-2 border-primary-500 mt-1.5"></div>
                                <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 w-full ml-4">
                                    {isEditing ? (
                                        <>
                                            <input
                                                {...register(`onboardingProcess.${idx}.step`)}
                                                className="w-full font-bold text-slate-800 text-sm mb-1 bg-white border border-slate-300 rounded px-2 py-1"
                                            />
                                            <textarea
                                                {...register(`onboardingProcess.${idx}.description`)}
                                                className="w-full text-slate-600 text-sm bg-white border border-slate-300 rounded px-2 py-1 mt-1"
                                                rows={2}
                                            />
                                        </>
                                    ) : (
                                        <>
                                            <h4 className="font-bold text-slate-800 text-sm mb-1">{field.step}</h4>
                                            <p className="text-slate-600 text-sm">{field.description}</p>
                                        </>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Mock Customer Database */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-slate-800 flex items-center">
                        <Users className="w-5 h-5 mr-2 text-primary-600" />
                        Customer Database (Mock)
                    </h3>
                    {!isReadOnly && <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">Add Customer</button>}
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase">
                                <th className="pb-3 pl-2">Name</th>
                                <th className="pb-3">Status</th>
                                <th className="pb-3">Email</th>
                                <th className="pb-3 text-right pr-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {customerFields.map((field, idx) => (
                                <tr key={field.id} className="group hover:bg-slate-50">
                                    <td className="py-3 pl-2 text-sm font-medium text-slate-900">
                                        {isEditing ? (
                                            <input
                                                {...register(`mockCustomers.${idx}.name`)}
                                                className="w-full bg-white border border-slate-300 rounded px-2 py-1"
                                            />
                                        ) : field.name}
                                    </td>
                                    <td className="py-3">
                                        {isEditing ? (
                                            <select
                                                {...register(`mockCustomers.${idx}.status`)}
                                                className="bg-white border border-slate-300 rounded px-2 py-1 text-xs"
                                            >
                                                <option value="Active">Active</option>
                                                <option value="Lead">Lead</option>
                                                <option value="Churned">Churned</option>
                                            </select>
                                        ) : (
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${field.status === 'Active' ? 'bg-green-100 text-green-800' :
                                                field.status === 'Lead' ? 'bg-blue-100 text-blue-800' :
                                                    'bg-slate-100 text-slate-800'
                                                }`}>
                                                {field.status}
                                            </span>
                                        )}
                                    </td>
                                    <td className="py-3 text-sm text-slate-600 flex items-center">
                                        <Mail className="w-3 h-3 mr-1.5 text-slate-400" />
                                        {isEditing ? (
                                            <input
                                                {...register(`mockCustomers.${idx}.email`)}
                                                className="w-full bg-white border border-slate-300 rounded px-2 py-1"
                                            />
                                        ) : field.email}
                                    </td>
                                    <td className="py-3 text-right pr-2">
                                        <button className="text-slate-400 hover:text-slate-600">
                                            <MoreHorizontal className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};