import React, { useState } from 'react';
import { Integration } from '../../lib/types';
import { Plug, Plus, Search, CheckCircle2, XCircle, Filter, Webhook, Server, Code, Save, X, Cpu } from 'lucide-react';
import { MOCK_INTEGRATIONS } from '../../constants';

interface IntegrationsViewProps {
    workspaceId: string;
    integrations: Integration[]; // In a real app, this would come from the workspace data
    isReadOnly?: boolean;
}

const CATEGORIES = ['All', 'Productivity', 'Communication', 'Finance', 'HR', 'Marketing', 'CRM', 'E-commerce', 'Automation', 'Custom'];

type CustomToolType = 'api' | 'webhook' | 'mcp';

export const IntegrationsView: React.FC<IntegrationsViewProps> = ({ workspaceId, integrations: savedIntegrations, isReadOnly }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Custom Tool Form State
    const [customType, setCustomType] = useState<CustomToolType>('api');
    const [customForm, setCustomForm] = useState({
        name: '',
        description: '',
        baseUrl: '',
        apiKey: '',
        webhookUrl: '',
        webhookSecret: '',
        mcpServerUrl: ''
    });

    // Simulating local state for demo purposes as we don't have a real backend to update the workspace object deeply immediately
    const [localIntegrations, setLocalIntegrations] = useState<Integration[]>(savedIntegrations);

    const toggleIntegration = (toolId: string) => {
        if (isReadOnly) return;

        // This is a visual toggle for the demo
        const exists = localIntegrations.find(i => i.id === toolId);
        if (exists) {
            setLocalIntegrations(localIntegrations.filter(i => i.id !== toolId));
        } else {
            const tool = MOCK_INTEGRATIONS.find(t => t.id === toolId);
            if (tool) {
                setLocalIntegrations([...localIntegrations, { ...tool, status: 'connected' }]);
            }
        }
    };

    const handleAddCustomTool = (e: React.FormEvent) => {
        e.preventDefault();

        const newTool: Integration = {
            id: `custom-${Date.now()}`,
            name: customForm.name,
            category: 'Custom',
            status: 'connected',
            description: customForm.description || `${customType.toUpperCase()} Integration`,
            type: customType,
            iconUrl: '', // Will handle icon rendering based on type
            config: {
                baseUrl: customType === 'api' ? customForm.baseUrl : undefined,
                apiKey: customType === 'api' ? customForm.apiKey : undefined,
                webhookUrl: customType === 'webhook' ? customForm.webhookUrl : undefined,
                webhookSecret: customType === 'webhook' ? customForm.webhookSecret : undefined,
                mcpServerUrl: customType === 'mcp' ? customForm.mcpServerUrl : undefined,
            }
        };

        setLocalIntegrations([...localIntegrations, newTool]);
        setIsModalOpen(false);
        setCustomForm({ name: '', description: '', baseUrl: '', apiKey: '', webhookUrl: '', webhookSecret: '', mcpServerUrl: '' });
        setActiveCategory('Custom');
    };

    const filteredTools = [...MOCK_INTEGRATIONS, ...localIntegrations.filter(i => i.category === 'Custom')].filter((tool, index, self) =>
        // Remove duplicates if MOCK_INTEGRATIONS are also in localIntegrations (connected state)
        index === self.findIndex((t) => (
            t.id === tool.id
        ))
    ).filter(tool => {
        const matchesSearch = tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (tool.description || '').toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = activeCategory === 'All' || tool.category === activeCategory;
        return matchesSearch && matchesCategory;
    });

    const getIconForCustomType = (type?: string) => {
        switch (type) {
            case 'mcp': return <Cpu className="w-6 h-6" />;
            case 'webhook': return <Webhook className="w-6 h-6" />;
            case 'api': return <Code className="w-6 h-6" />;
            default: return <Plug className="w-6 h-6" />;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-6 rounded-xl shadow-sm border border-slate-200 gap-4">
                <div>
                    <h2 className="text-xl font-bold text-slate-900">Integrations</h2>
                    <p className="text-slate-500">Supercharge your workspace with third-party tools.</p>
                </div>
                {!isReadOnly && (
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium flex items-center transition-colors shrink-0"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Custom Tool
                    </button>
                )}
            </div>

            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search tools (e.g. Slack, Stripe)..."
                        className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none shadow-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Category Tabs */}
            <div className="flex overflow-x-auto pb-2 -mx-2 px-2 no-scrollbar">
                <div className="flex space-x-2">
                    {CATEGORIES.map((category) => (
                        <button
                            key={category}
                            onClick={() => setActiveCategory(category)}
                            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors border ${activeCategory === category
                                ? 'bg-slate-800 text-white border-slate-800'
                                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                                }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTools.map((tool) => {
                    const isConnected = localIntegrations.some(i => i.id === tool.id);
                    // For custom tools, they are always "localIntegrations", so check if it is in the connected list
                    // If it's a mock integration, we check if it's in localIntegrations.
                    // If it's a custom tool created by user, it's inherently "connected" when created, but we can allow removing it.

                    return (
                        <div key={tool.id} className={`bg-white p-6 rounded-xl border transition-all ${isConnected ? 'border-primary-500 ring-1 ring-primary-500' : 'border-slate-200 hover:border-primary-300'}`}>
                            <div className="flex justify-between items-start mb-4">
                                <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center text-xl text-slate-700">
                                    {/* Handle Lucide Icon vs String Emoji */}
                                    {tool.category === 'Custom' ? getIconForCustomType(tool.type) : (tool as any).icon}
                                </div>
                                <div className={`px-2 py-1 rounded-full text-xs font-medium ${isConnected ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                                    {isConnected ? 'Active' : 'Not Connected'}
                                </div>
                            </div>
                            <h3 className="font-bold text-slate-900 mb-1">{tool.name}</h3>
                            <div className="flex items-center gap-2 mb-2">
                                <p className="text-xs text-primary-600 font-medium uppercase tracking-wide">{tool.category}</p>
                                {tool.category === 'Custom' && (
                                    <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded border border-slate-200 uppercase">{tool.type}</span>
                                )}
                            </div>

                            <p className="text-sm text-slate-500 mb-4 h-10 line-clamp-2">{tool.description}</p>

                            <button
                                onClick={() => toggleIntegration(tool.id)}
                                disabled={isReadOnly}
                                className={`w-full py-2 rounded-lg font-medium text-sm transition-colors flex items-center justify-center ${isConnected
                                    ? 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50'
                                    : 'bg-slate-900 text-white hover:bg-slate-800'
                                    } ${isReadOnly ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                {isConnected ? (
                                    <>
                                        <XCircle className="w-4 h-4 mr-2" />
                                        {tool.category === 'Custom' ? 'Remove' : 'Disconnect'}
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle2 className="w-4 h-4 mr-2" />
                                        Connect
                                    </>
                                )}
                            </button>
                        </div>
                    );
                })}
                {filteredTools.length === 0 && (
                    <div className="col-span-full py-12 text-center text-slate-500">
                        <Filter className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                        <p>No tools found for this category or search term.</p>
                    </div>
                )}
            </div>

            {/* Custom Tool Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                            <h3 className="text-xl font-bold text-slate-900">Add Custom Tool</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto">
                            <div className="grid grid-cols-3 gap-2 mb-6 p-1 bg-slate-100 rounded-lg">
                                <button
                                    onClick={() => setCustomType('api')}
                                    className={`flex items-center justify-center py-2 text-sm font-medium rounded-md transition-all ${customType === 'api' ? 'bg-white text-primary-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                                >
                                    <Code className="w-4 h-4 mr-2" /> API
                                </button>
                                <button
                                    onClick={() => setCustomType('webhook')}
                                    className={`flex items-center justify-center py-2 text-sm font-medium rounded-md transition-all ${customType === 'webhook' ? 'bg-white text-primary-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                                >
                                    <Webhook className="w-4 h-4 mr-2" /> Webhook
                                </button>
                                <button
                                    onClick={() => setCustomType('mcp')}
                                    className={`flex items-center justify-center py-2 text-sm font-medium rounded-md transition-all ${customType === 'mcp' ? 'bg-white text-primary-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                                >
                                    <Cpu className="w-4 h-4 mr-2" /> MCP
                                </button>
                            </div>

                            <form id="custom-tool-form" onSubmit={handleAddCustomTool} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Integration Name</label>
                                    <input
                                        required
                                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                                        placeholder="e.g. My Internal Service"
                                        value={customForm.name}
                                        onChange={e => setCustomForm({ ...customForm, name: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                                    <input
                                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                                        placeholder="Optional description"
                                        value={customForm.description}
                                        onChange={e => setCustomForm({ ...customForm, description: e.target.value })}
                                    />
                                </div>

                                {/* API Fields */}
                                {customType === 'api' && (
                                    <>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">Base URL</label>
                                            <input
                                                required
                                                type="url"
                                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none font-mono text-sm"
                                                placeholder="https://api.example.com/v1"
                                                value={customForm.baseUrl}
                                                onChange={e => setCustomForm({ ...customForm, baseUrl: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">API Key / Token</label>
                                            <input
                                                type="password"
                                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none font-mono text-sm"
                                                placeholder="sk_..."
                                                value={customForm.apiKey}
                                                onChange={e => setCustomForm({ ...customForm, apiKey: e.target.value })}
                                            />
                                        </div>
                                    </>
                                )}

                                {/* Webhook Fields */}
                                {customType === 'webhook' && (
                                    <>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">Webhook URL</label>
                                            <input
                                                required
                                                type="url"
                                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none font-mono text-sm"
                                                placeholder="https://your-app.com/webhooks/incoming"
                                                value={customForm.webhookUrl}
                                                onChange={e => setCustomForm({ ...customForm, webhookUrl: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">Signing Secret (Optional)</label>
                                            <input
                                                type="password"
                                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none font-mono text-sm"
                                                placeholder="whsec_..."
                                                value={customForm.webhookSecret}
                                                onChange={e => setCustomForm({ ...customForm, webhookSecret: e.target.value })}
                                            />
                                        </div>
                                    </>
                                )}

                                {/* MCP Fields */}
                                {customType === 'mcp' && (
                                    <>
                                        <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 mb-2">
                                            <p className="text-xs text-blue-800">
                                                <strong>Model Context Protocol (MCP)</strong> allows AI models to interact with your data and tools safely.
                                            </p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">MCP Server URL</label>
                                            <input
                                                required
                                                type="url"
                                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none font-mono text-sm"
                                                placeholder="wss://mcp.your-server.com"
                                                value={customForm.mcpServerUrl}
                                                onChange={e => setCustomForm({ ...customForm, mcpServerUrl: e.target.value })}
                                            />
                                        </div>
                                    </>
                                )}
                            </form>
                        </div>

                        <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                form="custom-tool-form"
                                className="px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium shadow-sm flex items-center"
                            >
                                <Save className="w-4 h-4 mr-2" />
                                Save Integration
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};