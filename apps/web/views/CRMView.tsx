import React, { useState } from 'react';
import { BusinessPlan } from '../types';
import { Users, GitPullRequest, Mail, MoreHorizontal, Edit2, Check, X } from 'lucide-react';

interface CRMViewProps {
    plan: BusinessPlan;
    onUpdate: (plan: BusinessPlan) => void;
    isReadOnly?: boolean;
}

export const CRMView: React.FC<CRMViewProps> = ({ plan, onUpdate, isReadOnly }) => {
  const { crm } = plan;
  const [isEditing, setIsEditing] = useState(false);
  const [editedCrm, setEditedCrm] = useState(crm);

  const handleSave = () => {
    onUpdate({ ...plan, crm: editedCrm });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedCrm(crm);
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
                <button onClick={handleSave} className="flex items-center px-3 py-1.5 rounded-lg bg-primary-600 text-white hover:bg-primary-700 text-sm">
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
                    {editedCrm.onboardingProcess.map((step, idx) => (
                        <div key={idx} className="flex items-start ml-4">
                            <div className="absolute -left-2 w-4 h-4 rounded-full bg-white border-2 border-primary-500 mt-1.5"></div>
                            <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 w-full ml-4">
                                {isEditing ? (
                                    <>
                                        <input 
                                            className="w-full font-bold text-slate-800 text-sm mb-1 bg-white border border-slate-300 rounded px-2 py-1"
                                            value={step.step}
                                            onChange={(e) => {
                                                const newProcess = [...editedCrm.onboardingProcess];
                                                newProcess[idx].step = e.target.value;
                                                setEditedCrm({...editedCrm, onboardingProcess: newProcess});
                                            }}
                                        />
                                        <textarea 
                                            className="w-full text-slate-600 text-sm bg-white border border-slate-300 rounded px-2 py-1 mt-1"
                                            rows={2}
                                            value={step.description}
                                            onChange={(e) => {
                                                const newProcess = [...editedCrm.onboardingProcess];
                                                newProcess[idx].description = e.target.value;
                                                setEditedCrm({...editedCrm, onboardingProcess: newProcess});
                                            }}
                                        />
                                    </>
                                ) : (
                                    <>
                                        <h4 className="font-bold text-slate-800 text-sm mb-1">{step.step}</h4>
                                        <p className="text-slate-600 text-sm">{step.description}</p>
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
                        {editedCrm.mockCustomers.map((customer, idx) => (
                            <tr key={idx} className="group hover:bg-slate-50">
                                <td className="py-3 pl-2 text-sm font-medium text-slate-900">
                                    {isEditing ? (
                                        <input 
                                            className="w-full bg-white border border-slate-300 rounded px-2 py-1"
                                            value={customer.name}
                                            onChange={(e) => {
                                                const newCustomers = [...editedCrm.mockCustomers];
                                                newCustomers[idx].name = e.target.value;
                                                setEditedCrm({...editedCrm, mockCustomers: newCustomers});
                                            }}
                                        />
                                    ) : customer.name}
                                </td>
                                <td className="py-3">
                                    {isEditing ? (
                                        <select 
                                            className="bg-white border border-slate-300 rounded px-2 py-1 text-xs"
                                            value={customer.status}
                                            onChange={(e) => {
                                                const newCustomers = [...editedCrm.mockCustomers];
                                                newCustomers[idx].status = e.target.value as any;
                                                setEditedCrm({...editedCrm, mockCustomers: newCustomers});
                                            }}
                                        >
                                            <option value="Active">Active</option>
                                            <option value="Lead">Lead</option>
                                            <option value="Churned">Churned</option>
                                        </select>
                                    ) : (
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                            customer.status === 'Active' ? 'bg-green-100 text-green-800' :
                                            customer.status === 'Lead' ? 'bg-blue-100 text-blue-800' :
                                            'bg-slate-100 text-slate-800'
                                        }`}>
                                            {customer.status}
                                        </span>
                                    )}
                                </td>
                                <td className="py-3 text-sm text-slate-600 flex items-center">
                                    <Mail className="w-3 h-3 mr-1.5 text-slate-400" />
                                    {isEditing ? (
                                        <input 
                                            className="w-full bg-white border border-slate-300 rounded px-2 py-1"
                                            value={customer.email}
                                            onChange={(e) => {
                                                const newCustomers = [...editedCrm.mockCustomers];
                                                newCustomers[idx].email = e.target.value;
                                                setEditedCrm({...editedCrm, mockCustomers: newCustomers});
                                            }}
                                        />
                                    ) : customer.email}
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