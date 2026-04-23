import React, { useState } from 'react';
import { BusinessPlan } from '../../lib/types';
import { Megaphone, Users, Lightbulb, Share2, Edit2, Check, X, ExternalLink, Link as LinkIcon } from 'lucide-react';
import { Button } from "@branda/ui/components/button";
import { Input } from "@branda/ui/components/input";
import { Textarea } from "@branda/ui/components/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "@branda/ui/components/card";

interface MarketingViewProps {
  plan: BusinessPlan;
  onUpdate: (plan: BusinessPlan) => void;
  isReadOnly?: boolean;
}

export const MarketingView: React.FC<MarketingViewProps> = ({ plan, onUpdate, isReadOnly }) => {
  const { marketing } = plan;
  const [isEditing, setIsEditing] = useState(false);
  const [editedMarketing, setEditedMarketing] = useState(marketing);

  // Auto-save logic
  React.useEffect(() => {
    if (!isEditing) return;

    const timer = setTimeout(() => {
      onUpdate({ ...plan, marketing: editedMarketing });
    }, 1000);

    return () => clearTimeout(timer);
  }, [editedMarketing, isEditing]);

  const handleCancel = () => {
    setEditedMarketing(marketing);
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end mb-4 gap-2">
        {!isReadOnly && !isEditing && (
          <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)} className="text-primary hover:text-primary/80 transition-colors uppercase tracking-widest text-[10px] font-black">
            <Edit2 className="w-4 h-4 mr-2" /> Edit Strategy
          </Button>
        )}
        {isEditing && (
          <Button size="sm" onClick={() => setIsEditing(false)} className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg transition-all active:scale-95 uppercase tracking-widest text-[10px] font-black">
            <Check className="w-4 h-4 mr-2" /> Done
          </Button>
        )}
      </div>

      {/* Strategy Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 border-border">
          <CardHeader>
            <CardTitle className="flex items-center text-lg font-semibold text-foreground">
              <Megaphone className="w-5 h-5 mr-2 text-primary" />
              Core Strategy
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isEditing ? (
              <Textarea
                rows={10}
                value={editedMarketing.strategy}
                onChange={e => setEditedMarketing({ ...editedMarketing, strategy: e.target.value })}
                className="bg-background border-input focus:ring-primary shadow-inner"
              />
            ) : (
              <p className="text-foreground leading-relaxed whitespace-pre-wrap">{marketing.strategy}</p>
            )}
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader>
            <CardTitle className="flex items-center text-lg font-semibold text-foreground">
              <Users className="w-5 h-5 mr-2 text-primary" />
              Target Audience
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isEditing ? (
              <Textarea
                rows={8}
                value={editedMarketing.targetAudience}
                onChange={e => setEditedMarketing({ ...editedMarketing, targetAudience: e.target.value })}
                className="bg-background border-input focus:ring-primary shadow-inner"
              />
            ) : (
              <p className="text-muted-foreground text-sm leading-relaxed">{marketing.targetAudience}</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Channels */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="flex items-center text-lg font-semibold text-foreground">
            <Share2 className="w-5 h-5 mr-2 text-primary" />
            Key Marketing Channels
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {editedMarketing.keyChannels.map((channel, idx) => (
              <div key={idx} className="bg-muted/30 p-4 rounded-lg border border-border flex flex-col h-full relative group shadow-sm transition-all hover:bg-muted/50">
                {isEditing ? (
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Channel</label>
                    <Input
                      value={channel.name}
                      onChange={(e) => {
                        const newChannels = [...editedMarketing.keyChannels];
                        const currentChannel = newChannels[idx];
                        if (currentChannel) {
                          newChannels[idx] = { ...currentChannel, name: e.target.value };
                          setEditedMarketing({ ...editedMarketing, keyChannels: newChannels });
                        }
                      }}
                      className="bg-background border-input focus:ring-primary h-8 text-sm"
                    />
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center mt-1">
                      <LinkIcon className="w-3 h-3 mr-1" /> Link
                    </label>
                    <Input
                      placeholder="https://..."
                      value={channel.url}
                      onChange={(e) => {
                        const newChannels = [...editedMarketing.keyChannels];
                        const currentChannel = newChannels[idx];
                        if (currentChannel) {
                          newChannels[idx] = { ...currentChannel, url: e.target.value };
                          setEditedMarketing({ ...editedMarketing, keyChannels: newChannels });
                        }
                      }}
                      className="bg-background border-input focus:ring-primary h-8 text-sm"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const newChannels = editedMarketing.keyChannels.filter((_, i) => i !== idx);
                        setEditedMarketing({ ...editedMarketing, keyChannels: newChannels });
                      }}
                      className="mt-2 text-[10px] font-bold text-destructive hover:text-destructive hover:bg-destructive/10 h-6 p-0 uppercase tracking-widest"
                    >
                      Remove
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col h-full justify-center text-center">
                    <span className="font-bold text-foreground block mb-1 text-sm tracking-tight">{channel.name}</span>
                    {channel.url ? (
                      <a
                        href={channel.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] font-bold text-primary hover:text-primary/80 flex items-center justify-center mt-1 uppercase tracking-widest transition-colors"
                      >
                        Visit Tool <ExternalLink className="w-3 h-3 ml-1" />
                      </a>
                    ) : (
                      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-40">Not linked</span>
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
                className="bg-muted/30 border-2 border-dashed border-border rounded-lg p-4 flex flex-col items-center justify-center text-muted-foreground hover:border-primary/50 hover:text-primary transition-all duration-300 group shadow-sm hover:shadow-md"
              >
                <span className="text-2xl font-light mb-1 group-hover:scale-125 transition-transform">+</span>
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Add Channel</span>
              </button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Content Ideas */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="flex items-center text-lg font-semibold text-foreground">
            <Lightbulb className="w-5 h-5 mr-2 text-primary" />
            First Content Series
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {editedMarketing.contentIdeas.map((idea, idx) => (
              <div key={idx} className="p-5 border border-border rounded-lg hover:bg-muted/30 transition-all flex flex-col md:flex-row items-start group shadow-sm">
                {isEditing ? (
                  <div className="w-full space-y-3">
                    <Input
                      className="w-full md:w-32 mr-4 font-black uppercase text-[10px] tracking-[0.2em] text-primary border-primary/20 bg-primary/5 h-7"
                      value={idea.type}
                      onChange={(e) => {
                        const newIdeas = [...editedMarketing.contentIdeas];
                        newIdeas[idx]!.type = e.target.value;
                        setEditedMarketing({ ...editedMarketing, contentIdeas: newIdeas });
                      }}
                    />
                    <Input
                      className="w-full font-bold text-foreground bg-background border-input h-9"
                      value={idea.title}
                      onChange={(e) => {
                        const newIdeas = [...editedMarketing.contentIdeas];
                        newIdeas[idx]!.title = e.target.value;
                        setEditedMarketing({ ...editedMarketing, contentIdeas: newIdeas });
                      }}
                    />
                    <Textarea
                      className="bg-background border-input focus:ring-primary shadow-inner"
                      rows={2}
                      value={idea.description}
                      onChange={(e) => {
                        const newIdeas = [...editedMarketing.contentIdeas];
                        newIdeas[idx]!.description = e.target.value;
                        setEditedMarketing({ ...editedMarketing, contentIdeas: newIdeas });
                      }}
                    />
                  </div>
                ) : (
                  <>
                    <div className="bg-primary/10 text-primary border border-primary/20 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mr-6 shrink-0 mt-1 shadow-sm">
                      {idea.type}
                    </div>
                    <div className="flex-1 mt-3 md:mt-0">
                      <h4 className="font-bold text-foreground text-base tracking-tight mb-1">{idea.title}</h4>
                      <p className="text-muted-foreground text-sm leading-relaxed">{idea.description}</p>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};