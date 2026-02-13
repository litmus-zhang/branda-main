import React, { useState } from 'react';
import { BusinessPlan } from '../types';
import { Megaphone, Users, Lightbulb, Share2, Edit2, Check, X, ExternalLink, Link as LinkIcon } from 'lucide-react';

interface MarketingViewProps {
    plan: BusinessPlan;
    onUpdate: (plan: BusinessPlan) => void;
    isReadOnly?: boolean;
}

export const MarketingView: React.FC<MarketingViewProps> = ({ plan, onUpdate, isReadOnly }) => {
  const { marketing } = plan;
  const [isEditing, setIsEditing] = useState(false);
  const [editedMarketing, setEditedMarketing] = useState(marketing);

  const handleSave = () => {
    onUpdate({ ...plan, marketing: editedMarketing });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedMarketing(marketing);
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end mb-4">
        {!isReadOnly && !isEditing && (
            <button onClick={() => setIsEditing(true)} className="flex items-center text-sm font-medium text-primary-600 hover:text-primary-700">
                <Edit2 className="w-4 h-4 mr-2" /> Edit Strategy
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

      {/* Strategy Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 p-6">
           <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
            <Megaphone className="w-5 h-5 mr-2 text-primary-600" />
            Core Strategy
          </h3>
          {isEditing ? (
              <textarea 
                className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-primary-500"
                rows={10}
                value={editedMarketing.strategy}
                onChange={e => setEditedMarketing({...editedMarketing, strategy: e.target.value})}
              />
          ) : (
            <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">{marketing.strategy}</p>
          )}
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
           <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
            <Users className="w-5 h-5 mr-2 text-primary-600" />
            Target Audience
          </h3>
          {isEditing ? (
              <textarea 
                className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-primary-500"
                rows={8}
                value={editedMarketing.targetAudience}
                onChange={e => setEditedMarketing({...editedMarketing, targetAudience: e.target.value})}
              />
          ) : (
            <p className="text-slate-600 text-sm leading-relaxed">{marketing.targetAudience}</p>
          )}
        </div>
      </div>

      {/* Channels */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
          <Share2 className="w-5 h-5 mr-2 text-primary-600" />
          Key Marketing Channels
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {editedMarketing.keyChannels.map((channel, idx) => (
                <div key={idx} className="bg-slate-50 p-4 rounded-lg border border-slate-100 flex flex-col h-full relative group">
                    {isEditing ? (
                        <div className="flex flex-col gap-2">
                             <label className="text-xs font-semibold text-slate-500 uppercase">Channel</label>
                             <input 
                                className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-sm font-semibold text-slate-700"
                                value={channel.name}
                                onChange={(e) => {
                                    const newChannels = [...editedMarketing.keyChannels];
                                    newChannels[idx] = { ...newChannels[idx], name: e.target.value };
                                    setEditedMarketing({...editedMarketing, keyChannels: newChannels});
                                }}
                            />
                            <label className="text-xs font-semibold text-slate-500 uppercase flex items-center">
                                <LinkIcon className="w-3 h-3 mr-1" /> Link
                            </label>
                            <input 
                                className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-sm text-slate-600"
                                placeholder="https://..."
                                value={channel.url}
                                onChange={(e) => {
                                    const newChannels = [...editedMarketing.keyChannels];
                                    newChannels[idx] = { ...newChannels[idx], url: e.target.value };
                                    setEditedMarketing({...editedMarketing, keyChannels: newChannels});
                                }}
                            />
                            <button 
                                onClick={() => {
                                    const newChannels = editedMarketing.keyChannels.filter((_, i) => i !== idx);
                                    setEditedMarketing({...editedMarketing, keyChannels: newChannels});
                                }}
                                className="mt-2 text-xs text-red-500 hover:underline"
                            >
                                Remove Channel
                            </button>
                        </div>
                    ) : (
                        <div className="flex flex-col h-full justify-center text-center">
                            <span className="font-semibold text-slate-700 block mb-1">{channel.name}</span>
                            {channel.url ? (
                                <a 
                                    href={channel.url} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-xs text-primary-600 hover:text-primary-700 flex items-center justify-center mt-1"
                                >
                                    Visit Channel <ExternalLink className="w-3 h-3 ml-1" />
                                </a>
                            ) : (
                                <span className="text-xs text-slate-400">No link added</span>
                            )}
                        </div>
                    )}
                </div>
            ))}
            {isEditing && (
                <button 
                    onClick={() => {
                        setEditedMarketing({
                            ...editedMarketing, 
                            keyChannels: [...editedMarketing.keyChannels, { name: 'New Channel', url: '' }]
                        });
                    }}
                    className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-lg p-4 flex flex-col items-center justify-center text-slate-400 hover:border-primary-300 hover:text-primary-500 transition-colors"
                >
                    <span className="text-2xl font-light mb-1">+</span>
                    <span className="text-sm font-medium">Add Channel</span>
                </button>
            )}
        </div>
      </div>

      {/* Content Ideas */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
          <Lightbulb className="w-5 h-5 mr-2 text-primary-600" />
          Content Ideas to Start
        </h3>
        <div className="grid gap-4">
            {editedMarketing.contentIdeas.map((idea, idx) => (
                <div key={idx} className="p-4 border border-slate-100 rounded-lg hover:bg-slate-50 transition-colors flex flex-col md:flex-row items-start">
                     {isEditing ? (
                        <div className="w-full space-y-2">
                            <input 
                                className="w-full md:w-32 mr-4 border border-slate-300 rounded px-2 py-1 text-xs font-bold uppercase text-primary-700 bg-primary-50"
                                value={idea.type}
                                onChange={(e) => {
                                    const newIdeas = [...editedMarketing.contentIdeas];
                                    newIdeas[idx].type = e.target.value;
                                    setEditedMarketing({...editedMarketing, contentIdeas: newIdeas});
                                }}
                            />
                             <input 
                                className="w-full border border-slate-300 rounded px-2 py-1 font-semibold text-slate-800"
                                value={idea.title}
                                onChange={(e) => {
                                    const newIdeas = [...editedMarketing.contentIdeas];
                                    newIdeas[idx].title = e.target.value;
                                    setEditedMarketing({...editedMarketing, contentIdeas: newIdeas});
                                }}
                            />
                             <textarea 
                                className="w-full border border-slate-300 rounded px-2 py-1 text-sm text-slate-600"
                                rows={2}
                                value={idea.description}
                                onChange={(e) => {
                                    const newIdeas = [...editedMarketing.contentIdeas];
                                    newIdeas[idx].description = e.target.value;
                                    setEditedMarketing({...editedMarketing, contentIdeas: newIdeas});
                                }}
                            />
                        </div>
                     ) : (
                        <>
                            <div className="bg-primary-100 text-primary-700 px-2 py-1 rounded text-xs font-bold uppercase mr-4 shrink-0 mt-1">
                                {idea.type}
                            </div>
                            <div>
                                <h4 className="font-semibold text-slate-800">{idea.title}</h4>
                                <p className="text-sm text-slate-600 mt-1">{idea.description}</p>
                            </div>
                        </>
                     )}
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};