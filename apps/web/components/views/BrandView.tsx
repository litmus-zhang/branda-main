import React, { useState, useRef, useEffect } from 'react';
import { BusinessPlan } from '../../lib/types';
import { Palette, Type, Target, Mic, Download, Edit2, Check, X, Upload, ExternalLink, Trash2, Plus, FileText, Image as ImageIcon, Layout, BookOpen, Printer } from 'lucide-react';
import { Card } from '@branda/ui/components/card';

interface BrandViewProps {
    plan: BusinessPlan;
    onUpdate: (plan: BusinessPlan) => void;
    isReadOnly?: boolean;
}

function escapeRegExp(string: string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export const BrandView: React.FC<BrandViewProps> = ({ plan, onUpdate, isReadOnly }) => {
    const { brandIdentity } = plan;
    const [isEditing, setIsEditing] = useState(false);
    const [editedBrand, setEditedBrand] = useState(brandIdentity);
    const [showGuideModal, setShowGuideModal] = useState(false);

    const logoInputRef = useRef<HTMLInputElement>(null);
    const profileInputRef = useRef<HTMLInputElement>(null);
    const bannerInputRef = useRef<HTMLInputElement>(null);
    const thumbnailInputRef = useRef<HTMLInputElement>(null);

    // Auto-save logic
    useEffect(() => {
        // Don't auto-save if we're not in editing mode or if nothing has changed
        if (!isEditing) return;

        const timer = setTimeout(() => {
            let updatedPlan = { ...plan, brandIdentity: editedBrand };

            // Intelligent replacement logic (if name changed)
            if (plan.brandIdentity.name !== editedBrand.name && editedBrand.name.trim() !== '') {
                const oldName = plan.brandIdentity.name;
                const newName = editedBrand.name;
                const regex = new RegExp(escapeRegExp(oldName), 'g');
                const replaceInString = (str: string) => str ? str.replace(regex, newName) : str;

                updatedPlan.brandIdentity = {
                    ...updatedPlan.brandIdentity,
                    mission: replaceInString(updatedPlan.brandIdentity.mission),
                    vision: replaceInString(updatedPlan.brandIdentity.vision),
                    slogan: replaceInString(updatedPlan.brandIdentity.slogan),
                    logoConcept: replaceInString(updatedPlan.brandIdentity.logoConcept),
                    toneOfVoice: replaceInString(updatedPlan.brandIdentity.toneOfVoice)
                };
                updatedPlan.marketing = {
                    ...updatedPlan.marketing,
                    strategy: replaceInString(updatedPlan.marketing.strategy),
                    targetAudience: replaceInString(updatedPlan.marketing.targetAudience),
                    contentIdeas: updatedPlan.marketing.contentIdeas.map(idea => ({
                        ...idea,
                        title: replaceInString(idea.title),
                        description: replaceInString(idea.description)
                    }))
                };
                updatedPlan.systems = {
                    ...updatedPlan.systems,
                    sops: updatedPlan.systems.sops.map(sop => ({
                        ...sop,
                        title: replaceInString(sop.title),
                        steps: sop.steps.map(step => replaceInString(step))
                    })),
                    techStackRecommendation: updatedPlan.systems.techStackRecommendation.map(tech => ({
                        ...tech,
                        reason: replaceInString(tech.reason)
                    }))
                };
                updatedPlan.crm = {
                    ...updatedPlan.crm,
                    onboardingProcess: updatedPlan.crm.onboardingProcess.map(step => ({
                        ...step,
                        step: replaceInString(step.step),
                        description: replaceInString(step.description)
                    }))
                };
            }

            onUpdate(updatedPlan);
        }, 1000); // 1 second debounce

        return () => clearTimeout(timer);
    }, [editedBrand, isEditing]);

    const handleCancel = () => {
        setEditedBrand(brandIdentity);
        setIsEditing(false);
    };

    const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setEditedBrand({ ...editedBrand, logoSvg: reader.result as string });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSocialAssetUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'profile' | 'banner' | 'thumbnail') => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const result = reader.result as string;
                setEditedBrand(prev => ({
                    ...prev,
                    socialAssets: {
                        ...prev.socialAssets,
                        [`${type}Image`]: result
                    }
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const isSvg = (str: string) => str.trim().toLowerCase().startsWith('<svg');

    const downloadAsset = (width: number, height: number, bgColor: string, filename: string, customImage?: string) => {
        // If we have a custom image, download it directly
        if (customImage) {
            const a = document.createElement('a');
            a.href = customImage;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            return;
        }

        const content = brandIdentity.logoSvg;
        if (!content) return;

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Fill background
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, width, height);

        const drawImage = (url: string) => {
            const img = new Image();
            img.onload = () => {
                // Calculate scaling to fit logo in center with padding
                const padding = Math.min(width, height) * 0.2;
                const availWidth = width - padding * 2;
                const availHeight = height - padding * 2;

                const scale = Math.min(availWidth / img.width, availHeight / img.height);
                const drawWidth = img.width * scale;
                const drawHeight = img.height * scale;
                const x = (width - drawWidth) / 2;
                const y = (height - drawHeight) / 2;

                ctx.drawImage(img, x, y, drawWidth, drawHeight);

                const link = document.createElement('a');
                link.download = filename;
                link.href = canvas.toDataURL('image/png');
                link.click();
            };
            img.src = url;
        };

        if (isSvg(content)) {
            const blob = new Blob([content], { type: 'image/svg+xml;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            drawImage(url);
            // Revoke after load in real usage, but inside callback usually better
        } else {
            drawImage(content);
        }
    };

    const handleDownloadLogo = (format: 'svg' | 'png') => {
        const content = brandIdentity.logoSvg;
        if (!content) return;

        if (isSvg(content)) {
            if (format === 'svg') {
                const blob = new Blob([content], { type: 'image/svg+xml' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${brandIdentity.name.replace(/\s+/g, '_')}_logo.svg`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            } else {
                downloadAsset(1000, 1000, 'transparent', `${brandIdentity.name.replace(/\s+/g, '_')}_logo.png`, undefined);
            }
        } else {
            const a = document.createElement('a');
            a.href = content;
            a.download = `${brandIdentity.name.replace(/\s+/g, '_')}_logo.png`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        }
    };

    const primaryColor = brandIdentity.colors[0] || '#ffffff';
    const secondaryColor = brandIdentity.colors[1] || '#f3f4f6';

    return (
        <div className="space-y-6">
            <div className="flex justify-end mb-4 gap-2">
                <button onClick={() => setShowGuideModal(true)} className="flex items-center px-4 py-2 bg-card border border-input rounded-lg text-sm font-medium text-foreground hover:bg-muted shadow-sm transition-colors">
                    <BookOpen className="w-4 h-4 mr-2" />
                    View Brand Guide
                </button>
                {!isReadOnly && !isEditing && (
                    <button onClick={() => setIsEditing(true)} className="flex items-center px-4 py-2 bg-card border border-input rounded-lg text-sm font-medium text-primary hover:bg-muted shadow-sm transition-colors uppercase tracking-widest text-[10px] font-black">
                        <Edit2 className="w-4 h-4 mr-2" /> Edit Assets
                    </button>
                )}
                {isEditing && (
                    <>
                        <button onClick={() => setIsEditing(false)} className="flex items-center px-4 py-2 bg-primary text-primary-foreground border-transparent rounded-lg text-sm font-black hover:bg-primary/90 shadow-lg transition-all active:scale-95 uppercase tracking-widest text-[10px]">
                            <Check className="w-4 h-4 mr-2" /> Done
                        </button>
                    </>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Identity Card */}
                <Card className="lg:col-span-2 p-6 border-border">
                    <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
                        <Target className="w-5 h-5 mr-2 text-primary" />
                        Core Identity
                    </h3>
                    <div className="space-y-6">
                        <div>
                            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Brand Name</span>
                            {isEditing ? (
                                <input
                                    className="w-full mt-1 p-2 bg-background border border-input rounded-md focus:ring-2 focus:ring-primary font-bold text-lg text-foreground shadow-inner"
                                    value={editedBrand.name}
                                    onChange={e => setEditedBrand({ ...editedBrand, name: e.target.value })}
                                />
                            ) : (
                                <h1 className="mt-1 text-2xl font-bold text-foreground">{brandIdentity.name}</h1>
                            )}
                        </div>
                        <div>
                            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Mission</span>
                            {isEditing ? (
                                <textarea
                                    className="w-full mt-1 p-2 bg-background border border-input rounded-md focus:ring-2 focus:ring-primary text-foreground shadow-inner"
                                    rows={3}
                                    value={editedBrand.mission}
                                    onChange={e => setEditedBrand({ ...editedBrand, mission: e.target.value })}
                                />
                            ) : (
                                <p className="mt-1 text-muted-foreground leading-relaxed">{brandIdentity.mission}</p>
                            )}
                        </div>
                        <div>
                            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Vision</span>
                            {isEditing ? (
                                <textarea
                                    className="w-full mt-1 p-2 bg-background border border-input rounded-md focus:ring-2 focus:ring-primary text-foreground shadow-inner"
                                    rows={3}
                                    value={editedBrand.vision}
                                    onChange={e => setEditedBrand({ ...editedBrand, vision: e.target.value })}
                                />
                            ) : (
                                <p className="mt-1 text-muted-foreground leading-relaxed">{brandIdentity.vision}</p>
                            )}
                        </div>
                        <div>
                            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Slogan</span>
                            {isEditing ? (
                                <input
                                    className="w-full mt-1 p-2 bg-background border border-input rounded-md focus:ring-2 focus:ring-primary font-medium italic text-foreground shadow-inner"
                                    value={editedBrand.slogan}
                                    onChange={e => setEditedBrand({ ...editedBrand, slogan: e.target.value })}
                                />
                            ) : (
                                <p className="mt-1 text-xl font-medium text-primary italic">"{brandIdentity.slogan}"</p>
                            )}
                        </div>
                    </div>
                </Card>

                {/* Tone & Voice */}
                <Card className="p-6 border-border">
                    <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
                        <Mic className="w-5 h-5 mr-2 text-primary" />
                        Tone of Voice
                    </h3>
                    {isEditing ? (
                        <textarea
                            className="w-full p-2 bg-background border border-input rounded-md focus:ring-2 focus:ring-primary text-foreground shadow-inner"
                            rows={6}
                            value={editedBrand.toneOfVoice}
                            onChange={e => setEditedBrand({ ...editedBrand, toneOfVoice: e.target.value })}
                        />
                    ) : (
                        <p className="text-muted-foreground leading-relaxed">
                            {brandIdentity.toneOfVoice}
                        </p>
                    )}
                </Card>
            </div>

            {/* Visual Identity */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="p-6 border-border">
                    <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
                        <Palette className="w-5 h-5 mr-2 text-primary" />
                        Color Palette
                    </h3>
                    <div className="flex flex-wrap gap-4">
                        {editedBrand.colors.map((color, idx) => (
                            <div key={idx} className="group relative">
                                <div
                                    className="w-16 h-16 rounded-xl shadow-md border border-border transition-transform transform group-hover:scale-110"
                                    style={{ backgroundColor: color }}
                                />
                                <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-mono text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity bg-background px-1 border border-border rounded whitespace-nowrap">
                                    {color}
                                </span>
                                {isEditing && (
                                    <input
                                        type="color"
                                        value={color}
                                        onChange={(e) => {
                                            const newColors = [...editedBrand.colors];
                                            newColors[idx] = e.target.value;
                                            setEditedBrand({ ...editedBrand, colors: newColors });
                                        }}
                                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                    {isEditing && (
                        <p className="text-xs text-muted-foreground mt-8">Click on a color to change it.</p>
                    )}
                </Card>

                <Card className="p-6 border-border">
                    <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
                        <Type className="w-5 h-5 mr-2 text-primary" />
                        Logo & Typography
                    </h3>

                    <div className="mb-6 flex flex-col items-center p-6 bg-muted rounded-lg border border-border relative group shadow-inner">
                        {editedBrand.logoSvg ? (
                            isSvg(editedBrand.logoSvg) ? (
                                <div className="w-32 h-32 mb-4 drop-shadow-md" dangerouslySetInnerHTML={{ __html: editedBrand.logoSvg }} />
                            ) : (
                                <img src={editedBrand.logoSvg} alt="Brand Logo" className="w-32 h-32 mb-4 object-contain drop-shadow-md" />
                            )
                        ) : (
                            <div className="w-32 h-32 bg-muted rounded-full flex items-center justify-center mb-4 text-muted-foreground text-xs text-center p-2 border border-border border-dashed">
                                No Logo
                            </div>
                        )}

                        <div className="flex gap-2">
                            <button onClick={() => handleDownloadLogo('svg')} className="flex items-center px-3 py-1.5 bg-background border border-input rounded-md text-xs font-bold text-foreground hover:bg-muted shadow-sm transition-colors uppercase tracking-widest">
                                <Download className="w-3 h-3 mr-1.5 text-primary" /> SVG
                            </button>
                            <button onClick={() => handleDownloadLogo('png')} className="flex items-center px-3 py-1.5 bg-background border border-input rounded-md text-xs font-bold text-foreground hover:bg-muted shadow-sm transition-colors uppercase tracking-widest">
                                <Download className="w-3 h-3 mr-1.5 text-primary" /> PNG
                            </button>
                        </div>

                        {isEditing && (
                            <div className="absolute inset-0 bg-background/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-lg backdrop-blur-sm">
                                <button
                                    onClick={() => logoInputRef.current?.click()}
                                    className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-bold flex items-center hover:bg-primary/90 shadow-lg active:scale-95 transition-transform"
                                >
                                    <Upload className="w-4 h-4 mr-2" />
                                    Replace Logo
                                </button>
                                <input
                                    type="file"
                                    ref={logoInputRef}
                                    className="hidden"
                                    accept="image/*,.svg"
                                    onChange={handleLogoUpload}
                                />
                            </div>
                        )}
                    </div>

                    <div className="space-y-4">
                        <div>
                            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Concept</span>
                            {isEditing ? (
                                <textarea
                                    className="w-full mt-1 p-2 text-sm bg-background border border-input rounded-md focus:ring-2 focus:ring-primary text-foreground shadow-inner"
                                    rows={2}
                                    value={editedBrand.logoConcept}
                                    onChange={e => setEditedBrand({ ...editedBrand, logoConcept: e.target.value })}
                                />
                            ) : (
                                <p className="mt-1 text-muted-foreground text-sm leading-relaxed">{brandIdentity.logoConcept}</p>
                            )}
                        </div>
                        <div>
                            <div className="flex justify-between items-center">
                                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Fonts</span>
                                {isEditing && (
                                    <button
                                        onClick={() => setEditedBrand({ ...editedBrand, fonts: [...editedBrand.fonts, 'New Font'] })}
                                        className="text-primary hover:text-primary/80 text-xs font-bold flex items-center uppercase tracking-wide"
                                    >
                                        <Plus className="w-3 h-3 mr-1" /> Add
                                    </button>
                                )}
                            </div>

                            <div className="mt-2 space-y-4">
                                {editedBrand.fonts.map((font, idx) => (
                                    <div key={idx} className="bg-muted/50 p-4 rounded-lg border border-border shadow-inner">
                                        <div className="flex justify-between items-start mb-2">
                                            {isEditing ? (
                                                <input
                                                    className="w-full p-1 text-sm bg-background border border-input rounded text-foreground mr-2 shadow-inner"
                                                    value={font}
                                                    onChange={(e) => {
                                                        const newFonts = [...editedBrand.fonts];
                                                        newFonts[idx] = e.target.value;
                                                        setEditedBrand({ ...editedBrand, fonts: newFonts });
                                                    }}
                                                />
                                            ) : (
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm font-bold text-foreground">{font}</span>
                                                    <a
                                                        href={`https://fonts.google.com/?query=${encodeURIComponent(font)}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex items-center px-2 py-1 rounded-md bg-background border border-input text-[10px] font-bold text-muted-foreground hover:text-primary hover:border-primary transition-all shadow-sm uppercase tracking-widest"
                                                        title="Download from Google Fonts"
                                                    >
                                                        <Download className="w-3 h-3 mr-1.5" />
                                                        Google Fonts
                                                    </a>
                                                </div>
                                            )}

                                            {isEditing && (
                                                <button
                                                    onClick={() => {
                                                        const newFonts = editedBrand.fonts.filter((_, i) => i !== idx);
                                                        setEditedBrand({ ...editedBrand, fonts: newFonts });
                                                    }}
                                                    className="text-muted-foreground hover:text-destructive transition-colors"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            )}
                                        </div>
                                        <p className="text-2xl text-foreground" style={{ fontFamily: font, fontStyle: 'normal' }}>
                                            The quick brown fox jumps over the lazy dog.
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Social Media Assets Section */}
            <Card className="p-6 border-border">
                <h3 className="text-lg font-semibold text-foreground mb-6 flex items-center">
                    <ImageIcon className="w-5 h-5 mr-2 text-primary" />
                    Social Media Assets
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Profile Picture */}
                    <div className="flex flex-col items-center">
                        <div className="mb-2 text-xs font-bold text-muted-foreground uppercase tracking-widest">Profile Photo</div>
                        <div className="relative group">
                            <div
                                className="w-32 h-32 rounded-full shadow-lg flex items-center justify-center mb-4 relative overflow-hidden bg-cover bg-center border-2 border-border"
                                style={{
                                    backgroundColor: primaryColor,
                                    backgroundImage: editedBrand.socialAssets?.profileImage ? `url(${editedBrand.socialAssets.profileImage})` : undefined
                                }}
                            >
                                {!editedBrand.socialAssets?.profileImage && (
                                    brandIdentity.logoSvg && isSvg(brandIdentity.logoSvg) ? (
                                        <div className="w-20 h-20 text-white fill-current drop-shadow-md" dangerouslySetInnerHTML={{ __html: brandIdentity.logoSvg }} />
                                    ) : (
                                        <img src={brandIdentity.logoSvg} className="w-20 h-20 object-contain drop-shadow-md" alt="logo" />
                                    )
                                )}
                            </div>
                            {isEditing && (
                                <div className="absolute inset-0 bg-background/60 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shadow-inner" onClick={() => profileInputRef.current?.click()}>
                                    <Upload className="w-6 h-6 text-foreground" />
                                </div>
                            )}
                            <input type="file" ref={profileInputRef} className="hidden" accept="image/*" onChange={(e) => handleSocialAssetUpload(e, 'profile')} />
                        </div>
                        <button
                            onClick={() => downloadAsset(400, 400, primaryColor, `${brandIdentity.name}_profile.png`, editedBrand.socialAssets?.profileImage)}
                            className="flex items-center text-[10px] font-bold text-primary hover:text-primary/80 uppercase tracking-widest transition-colors"
                        >
                            <Download className="w-3 h-3 mr-1" /> Download
                        </button>
                    </div>

                    {/* Banner */}
                    <div className="flex flex-col items-center">
                        <div className="mb-2 text-xs font-bold text-muted-foreground uppercase tracking-widest">Social Banner</div>
                        <div className="relative group w-full">
                            <div
                                className="w-full h-32 rounded-lg shadow-lg flex items-center justify-center mb-4 relative overflow-hidden bg-cover bg-center border-2 border-border"
                                style={{
                                    backgroundColor: secondaryColor,
                                    backgroundImage: editedBrand.socialAssets?.bannerImage ? `url(${editedBrand.socialAssets.bannerImage})` : undefined
                                }}
                            >
                                {!editedBrand.socialAssets?.bannerImage && (
                                    brandIdentity.logoSvg && isSvg(brandIdentity.logoSvg) ? (
                                        <div className="w-16 h-16 drop-shadow-md" dangerouslySetInnerHTML={{ __html: brandIdentity.logoSvg }} />
                                    ) : (
                                        <img src={brandIdentity.logoSvg} className="w-16 h-16 object-contain drop-shadow-md" alt="logo" />
                                    )
                                )}
                            </div>
                            {isEditing && (
                                <div className="absolute inset-0 bg-background/60 backdrop-blur-sm rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shadow-inner" onClick={() => bannerInputRef.current?.click()}>
                                    <Upload className="w-6 h-6 text-foreground" />
                                </div>
                            )}
                            <input type="file" ref={bannerInputRef} className="hidden" accept="image/*" onChange={(e) => handleSocialAssetUpload(e, 'banner')} />
                        </div>
                        <button
                            onClick={() => downloadAsset(1500, 500, secondaryColor, `${brandIdentity.name}_banner.png`, editedBrand.socialAssets?.bannerImage)}
                            className="flex items-center text-[10px] font-bold text-primary hover:text-primary/80 uppercase tracking-widest transition-colors"
                        >
                            <Download className="w-3 h-3 mr-1" /> Download
                        </button>
                    </div>

                    {/* Thumbnail */}
                    <div className="flex flex-col items-center">
                        <div className="mb-2 text-xs font-bold text-muted-foreground uppercase tracking-widest">Video Thumbnail</div>
                        <div className="relative group w-full">
                            <div
                                className="w-full aspect-video h-32 rounded-lg shadow-lg flex items-center justify-center mb-4 relative overflow-hidden bg-background border-2 border-border bg-cover bg-center"
                                style={{
                                    backgroundImage: editedBrand.socialAssets?.thumbnailImage ? `url(${editedBrand.socialAssets.thumbnailImage})` : undefined
                                }}
                            >
                                {!editedBrand.socialAssets?.thumbnailImage && (
                                    brandIdentity.logoSvg && isSvg(brandIdentity.logoSvg) ? (
                                        <div className="w-16 h-16 drop-shadow-md" dangerouslySetInnerHTML={{ __html: brandIdentity.logoSvg }} />
                                    ) : (
                                        <img src={brandIdentity.logoSvg} className="w-16 h-16 object-contain drop-shadow-md" alt="logo" />
                                    )
                                )}
                            </div>
                            {isEditing && (
                                <div className="absolute inset-0 bg-background/60 backdrop-blur-sm rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shadow-inner" onClick={() => thumbnailInputRef.current?.click()}>
                                    <Upload className="w-6 h-6 text-foreground" />
                                </div>
                            )}
                            <input type="file" ref={thumbnailInputRef} className="hidden" accept="image/*" onChange={(e) => handleSocialAssetUpload(e, 'thumbnail')} />
                        </div>
                        <button
                            onClick={() => downloadAsset(1280, 720, '#ffffff', `${brandIdentity.name}_thumbnail.png`, editedBrand.socialAssets?.thumbnailImage)}
                            className="flex items-center text-[10px] font-bold text-primary hover:text-primary/80 uppercase tracking-widest transition-colors"
                        >
                            <Download className="w-3 h-3 mr-1" /> Download
                        </button>
                    </div>
                </div>
            </Card>

            {/* Brand Guide Modal */}
            {showGuideModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
                    <Card className="rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col bg-card border-border">
                        <div className="p-6 border-b border-border flex justify-between items-center bg-muted/30 no-print">
                            <div>
                                <h2 className="text-2xl font-extrabold text-foreground tracking-tight">Brand Style Guide</h2>
                                <p className="text-muted-foreground text-sm font-medium">Official usage guidelines for {brandIdentity.name}</p>
                            </div>
                            <div className="flex items-center space-x-2">
                                <button
                                    onClick={() => window.print()}
                                    className="flex items-center px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg transition-all shadow-lg font-bold text-sm uppercase tracking-widest active:scale-95"
                                    title="Print / Save as PDF"
                                >
                                    <Download className="w-4 h-4 mr-2" />
                                    Export PDF
                                </button>
                                <button onClick={() => setShowGuideModal(false)} className="p-2 text-muted-foreground hover:text-foreground transition-colors group">
                                    <X className="w-6 h-6 group-hover:rotate-90 transition-transform duration-200" />
                                </button>
                            </div>
                        </div>

                        <div className="overflow-y-auto p-12 bg-card printable-content">
                            {/* Guide Content */}
                            <div className="max-w-3xl mx-auto space-y-16">

                                {/* Header */}
                                <div className="text-center pb-16 border-b border-border">
                                    {brandIdentity.logoSvg && isSvg(brandIdentity.logoSvg) ? (
                                        <div className="w-40 h-40 mx-auto mb-8 drop-shadow-xl" dangerouslySetInnerHTML={{ __html: brandIdentity.logoSvg }} />
                                    ) : (
                                        <img src={brandIdentity.logoSvg} className="w-40 h-40 mx-auto mb-8 object-contain drop-shadow-xl" alt="logo" />
                                    )}
                                    <h1 className="text-5xl font-black text-foreground tracking-tighter mb-4">{brandIdentity.name}</h1>
                                    <p className="text-2xl text-primary font-serif italic opacity-80">"{brandIdentity.slogan}"</p>
                                </div>

                                {/* Strategy */}
                                <div className="grid md:grid-cols-2 gap-12">
                                    <div className="space-y-4">
                                        <h3 className="text-xs font-black text-muted-foreground uppercase tracking-[0.2em] border-b border-border pb-2">Mission</h3>
                                        <p className="text-xl text-foreground font-medium leading-relaxed">{brandIdentity.mission}</p>
                                    </div>
                                    <div className="space-y-4">
                                        <h3 className="text-xs font-black text-muted-foreground uppercase tracking-[0.2em] border-b border-border pb-2">Vision</h3>
                                        <p className="text-xl text-foreground font-medium leading-relaxed">{brandIdentity.vision}</p>
                                    </div>
                                </div>

                                {/* Voice */}
                                <div className="space-y-6">
                                    <h3 className="text-xs font-black text-muted-foreground uppercase tracking-[0.2em] border-b border-border pb-2">Tone of Voice</h3>
                                    <div className="bg-muted/50 p-8 rounded-2xl border border-border shadow-inner">
                                        <p className="text-foreground text-lg whitespace-pre-line leading-relaxed font-medium">{brandIdentity.toneOfVoice}</p>
                                    </div>
                                </div>

                                {/* Guidelines Text */}
                                <div className="space-y-6">
                                    <div className="flex justify-between items-center border-b border-border pb-2">
                                        <h3 className="text-xs font-black text-muted-foreground uppercase tracking-[0.2em]">Usage Guidelines</h3>
                                        {!isReadOnly && !isEditing && (
                                            <button
                                                onClick={() => { setShowGuideModal(false); setIsEditing(true); }}
                                                className="text-[10px] font-black text-primary hover:underline no-print uppercase tracking-widest"
                                            >
                                                Edit Guidelines
                                            </button>
                                        )}
                                    </div>
                                    <div className="prose prose-lg dark:prose-invert max-w-none text-muted-foreground italic">
                                        {brandIdentity.usageGuidelines ? (
                                            <p className="whitespace-pre-line leading-relaxed font-medium">{brandIdentity.usageGuidelines}</p>
                                        ) : (
                                            <p className="text-muted-foreground/50 opacity-60">No specific usage guidelines added yet.</p>
                                        )}
                                    </div>
                                </div>


                                {/* Colors */}
                                <div className="space-y-8">
                                    <h3 className="text-xs font-black text-muted-foreground uppercase tracking-[0.2em] border-b border-border pb-2">Color Palette</h3>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                                        {brandIdentity.colors.map((color, idx) => (
                                            <div key={idx} className="flex flex-col group">
                                                <div
                                                    className="h-32 rounded-2xl shadow-inner border border-border mb-4 transition-transform group-hover:scale-105 duration-300"
                                                    style={{ backgroundColor: color }}
                                                ></div>
                                                <span className="font-mono text-sm font-black text-foreground uppercase tracking-widest mb-1">{color}</span>
                                                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.1em] opacity-60">Accent {idx + 1}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Typography */}
                                <div className="space-y-12">
                                    <h3 className="text-xs font-black text-muted-foreground uppercase tracking-[0.2em] border-b border-border pb-2">Typography</h3>
                                    <div className="space-y-12">
                                        {brandIdentity.fonts.map((font, idx) => (
                                            <div key={idx} className="pb-12 border-b border-border last:border-0">
                                                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-4 block opacity-60">Typeface {idx + 1}</span>
                                                <h4 className="text-3xl font-black text-foreground mb-6">{font}</h4>
                                                <div className="space-y-4">
                                                    <p className="text-5xl text-foreground leading-tight tracking-tight overflow-hidden text-ellipsis" style={{ fontFamily: font }}>
                                                        Aa Bb Cc Dd Ee Ff Gg Hh Ii Jj Kk Ll Mm Nn Oo Pp Qq Rr Ss Tt Uu Vv Ww Xx Yy Zz
                                                    </p>
                                                    <p className="text-2xl text-muted-foreground leading-relaxed italic" style={{ fontFamily: font }}>
                                                        The quick brown fox jumps over the lazy dog. 1234567890 !@#$%^&*()
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            )}
        </div>
    );
};