import React, { useState, useRef } from 'react';
import { BusinessPlan } from '../../lib/types';
import { Palette, Type, Target, Mic, Download, Edit2, Check, X, Upload, ExternalLink, Trash2, Plus, FileText, Image as ImageIcon, Layout, BookOpen, Printer } from 'lucide-react';

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

    const handleSave = () => {
        let updatedPlan = { ...plan, brandIdentity: editedBrand };

        if (plan.brandIdentity.name !== editedBrand.name && plan.brandIdentity.name.trim() !== '') {
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
        setIsEditing(false);
    };

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
                <button onClick={() => setShowGuideModal(true)} className="flex items-center px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 shadow-sm transition-colors">
                    <BookOpen className="w-4 h-4 mr-2" />
                    View Brand Guide
                </button>
                {!isReadOnly && !isEditing && (
                    <button onClick={() => setIsEditing(true)} className="flex items-center px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium text-primary-600 hover:bg-slate-50 hover:text-primary-700 shadow-sm transition-colors">
                        <Edit2 className="w-4 h-4 mr-2" /> Edit Assets
                    </button>
                )}
                {isEditing && (
                    <>
                        <button onClick={handleCancel} className="flex items-center px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50">
                            <X className="w-4 h-4 mr-2" /> Cancel
                        </button>
                        <button onClick={handleSave} className="flex items-center px-4 py-2 bg-primary-600 border border-transparent rounded-lg text-sm font-medium text-white hover:bg-primary-700 shadow-sm">
                            <Check className="w-4 h-4 mr-2" /> Save Changes
                        </button>
                    </>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Identity Card */}
                <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                    <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
                        <Target className="w-5 h-5 mr-2 text-primary-600" />
                        Core Identity
                    </h3>
                    <div className="space-y-6">
                        <div>
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Brand Name</span>
                            {isEditing ? (
                                <input
                                    className="w-full mt-1 p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-primary-500 font-bold text-lg"
                                    value={editedBrand.name}
                                    onChange={e => setEditedBrand({ ...editedBrand, name: e.target.value })}
                                />
                            ) : (
                                <h1 className="mt-1 text-2xl font-bold text-slate-900">{brandIdentity.name}</h1>
                            )}
                        </div>
                        <div>
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Mission</span>
                            {isEditing ? (
                                <textarea
                                    className="w-full mt-1 p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-primary-500"
                                    rows={3}
                                    value={editedBrand.mission}
                                    onChange={e => setEditedBrand({ ...editedBrand, mission: e.target.value })}
                                />
                            ) : (
                                <p className="mt-1 text-slate-700 leading-relaxed">{brandIdentity.mission}</p>
                            )}
                        </div>
                        <div>
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Vision</span>
                            {isEditing ? (
                                <textarea
                                    className="w-full mt-1 p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-primary-500"
                                    rows={3}
                                    value={editedBrand.vision}
                                    onChange={e => setEditedBrand({ ...editedBrand, vision: e.target.value })}
                                />
                            ) : (
                                <p className="mt-1 text-slate-700 leading-relaxed">{brandIdentity.vision}</p>
                            )}
                        </div>
                        <div>
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Slogan</span>
                            {isEditing ? (
                                <input
                                    className="w-full mt-1 p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-primary-500 font-medium italic"
                                    value={editedBrand.slogan}
                                    onChange={e => setEditedBrand({ ...editedBrand, slogan: e.target.value })}
                                />
                            ) : (
                                <p className="mt-1 text-xl font-medium text-primary-700 italic">"{brandIdentity.slogan}"</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Tone & Voice */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                    <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
                        <Mic className="w-5 h-5 mr-2 text-primary-600" />
                        Tone of Voice
                    </h3>
                    {isEditing ? (
                        <textarea
                            className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-primary-500"
                            rows={6}
                            value={editedBrand.toneOfVoice}
                            onChange={e => setEditedBrand({ ...editedBrand, toneOfVoice: e.target.value })}
                        />
                    ) : (
                        <p className="text-slate-600 leading-relaxed">
                            {brandIdentity.toneOfVoice}
                        </p>
                    )}
                </div>
            </div>

            {/* Visual Identity */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                    <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
                        <Palette className="w-5 h-5 mr-2 text-primary-600" />
                        Color Palette
                    </h3>
                    <div className="flex flex-wrap gap-4">
                        {editedBrand.colors.map((color, idx) => (
                            <div key={idx} className="group relative">
                                <div
                                    className="w-16 h-16 rounded-xl shadow-inner border border-slate-100 transition-transform transform group-hover:scale-110"
                                    style={{ backgroundColor: color }}
                                />
                                <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs font-mono text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">
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
                        <p className="text-xs text-slate-400 mt-4">Click on a color to change it.</p>
                    )}
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                    <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
                        <Type className="w-5 h-5 mr-2 text-primary-600" />
                        Logo & Typography
                    </h3>

                    <div className="mb-6 flex flex-col items-center p-6 bg-slate-50 rounded-lg border border-slate-200 relative group">
                        {editedBrand.logoSvg ? (
                            isSvg(editedBrand.logoSvg) ? (
                                <div className="w-32 h-32 mb-4" dangerouslySetInnerHTML={{ __html: editedBrand.logoSvg }} />
                            ) : (
                                <img src={editedBrand.logoSvg} alt="Brand Logo" className="w-32 h-32 mb-4 object-contain" />
                            )
                        ) : (
                            <div className="w-32 h-32 bg-slate-200 rounded-full flex items-center justify-center mb-4 text-slate-400 text-xs text-center p-2">
                                No Logo
                            </div>
                        )}

                        <div className="flex gap-2">
                            <button onClick={() => handleDownloadLogo('svg')} className="flex items-center px-3 py-1.5 bg-white border border-slate-300 rounded-md text-xs font-medium text-slate-700 hover:bg-slate-50 shadow-sm transition-colors">
                                <Download className="w-3 h-3 mr-1.5" /> SVG
                            </button>
                            <button onClick={() => handleDownloadLogo('png')} className="flex items-center px-3 py-1.5 bg-white border border-slate-300 rounded-md text-xs font-medium text-slate-700 hover:bg-slate-50 shadow-sm transition-colors">
                                <Download className="w-3 h-3 mr-1.5" /> PNG
                            </button>
                        </div>

                        {isEditing && (
                            <div className="absolute inset-0 bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
                                <button
                                    onClick={() => logoInputRef.current?.click()}
                                    className="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center hover:bg-primary-700"
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
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Concept</span>
                            {isEditing ? (
                                <textarea
                                    className="w-full mt-1 p-2 text-sm border border-slate-300 rounded-md focus:ring-2 focus:ring-primary-500"
                                    rows={2}
                                    value={editedBrand.logoConcept}
                                    onChange={e => setEditedBrand({ ...editedBrand, logoConcept: e.target.value })}
                                />
                            ) : (
                                <p className="mt-1 text-slate-700 text-sm">{brandIdentity.logoConcept}</p>
                            )}
                        </div>
                        <div>
                            <div className="flex justify-between items-center">
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Fonts</span>
                                {isEditing && (
                                    <button
                                        onClick={() => setEditedBrand({ ...editedBrand, fonts: [...editedBrand.fonts, 'New Font'] })}
                                        className="text-primary-600 hover:text-primary-700 text-xs flex items-center"
                                    >
                                        <Plus className="w-3 h-3 mr-1" /> Add
                                    </button>
                                )}
                            </div>

                            <div className="mt-2 space-y-4">
                                {editedBrand.fonts.map((font, idx) => (
                                    <div key={idx} className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                                        <div className="flex justify-between items-start mb-2">
                                            {isEditing ? (
                                                <input
                                                    className="w-full p-1 text-sm border border-slate-300 rounded bg-white mr-2"
                                                    value={font}
                                                    onChange={(e) => {
                                                        const newFonts = [...editedBrand.fonts];
                                                        newFonts[idx] = e.target.value;
                                                        setEditedBrand({ ...editedBrand, fonts: newFonts });
                                                    }}
                                                />
                                            ) : (
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm font-semibold text-slate-800">{font}</span>
                                                    <a
                                                        href={`https://fonts.google.com/?query=${encodeURIComponent(font)}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex items-center px-2 py-1 rounded-md bg-white border border-slate-200 text-xs font-medium text-slate-600 hover:text-primary-600 hover:border-primary-200 transition-all shadow-sm"
                                                        title="Download from Google Fonts"
                                                    >
                                                        <Download className="w-3 h-3 mr-1.5" />
                                                        Download
                                                    </a>
                                                </div>
                                            )}

                                            {isEditing && (
                                                <button
                                                    onClick={() => {
                                                        const newFonts = editedBrand.fonts.filter((_, i) => i !== idx);
                                                        setEditedBrand({ ...editedBrand, fonts: newFonts });
                                                    }}
                                                    className="text-slate-400 hover:text-red-500"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            )}
                                        </div>
                                        <p className="text-2xl text-slate-700" style={{ fontFamily: font, fontStyle: 'normal' }}>
                                            The quick brown fox jumps over the lazy dog.
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Social Media Assets Section */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <h3 className="text-lg font-semibold text-slate-800 mb-6 flex items-center">
                    <ImageIcon className="w-5 h-5 mr-2 text-primary-600" />
                    Social Media Assets
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Profile Picture */}
                    <div className="flex flex-col items-center">
                        <div className="mb-2 text-sm font-semibold text-slate-600">Profile Picture (400x400)</div>
                        <div className="relative group">
                            <div
                                className="w-32 h-32 rounded-full shadow-md flex items-center justify-center mb-4 relative overflow-hidden bg-cover bg-center"
                                style={{
                                    backgroundColor: primaryColor,
                                    backgroundImage: editedBrand.socialAssets?.profileImage ? `url(${editedBrand.socialAssets.profileImage})` : undefined
                                }}
                            >
                                {!editedBrand.socialAssets?.profileImage && (
                                    brandIdentity.logoSvg && isSvg(brandIdentity.logoSvg) ? (
                                        <div className="w-20 h-20 text-white fill-current" dangerouslySetInnerHTML={{ __html: brandIdentity.logoSvg }} />
                                    ) : (
                                        <img src={brandIdentity.logoSvg} className="w-20 h-20 object-contain" alt="logo" />
                                    )
                                )}
                            </div>
                            {isEditing && (
                                <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer" onClick={() => profileInputRef.current?.click()}>
                                    <Upload className="w-6 h-6 text-white" />
                                </div>
                            )}
                            <input type="file" ref={profileInputRef} className="hidden" accept="image/*" onChange={(e) => handleSocialAssetUpload(e, 'profile')} />
                        </div>
                        <button
                            onClick={() => downloadAsset(400, 400, primaryColor, `${brandIdentity.name}_profile.png`, editedBrand.socialAssets?.profileImage)}
                            className="flex items-center text-xs text-primary-600 hover:text-primary-700 font-medium"
                        >
                            <Download className="w-3 h-3 mr-1" /> Download
                        </button>
                    </div>

                    {/* Banner */}
                    <div className="flex flex-col items-center">
                        <div className="mb-2 text-sm font-semibold text-slate-600">Banner (1500x500)</div>
                        <div className="relative group w-full">
                            <div
                                className="w-full h-32 rounded-lg shadow-md flex items-center justify-center mb-4 relative overflow-hidden bg-cover bg-center"
                                style={{
                                    backgroundColor: secondaryColor,
                                    backgroundImage: editedBrand.socialAssets?.bannerImage ? `url(${editedBrand.socialAssets.bannerImage})` : undefined
                                }}
                            >
                                {!editedBrand.socialAssets?.bannerImage && (
                                    brandIdentity.logoSvg && isSvg(brandIdentity.logoSvg) ? (
                                        <div className="w-16 h-16" dangerouslySetInnerHTML={{ __html: brandIdentity.logoSvg }} />
                                    ) : (
                                        <img src={brandIdentity.logoSvg} className="w-16 h-16 object-contain" alt="logo" />
                                    )
                                )}
                            </div>
                            {isEditing && (
                                <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer" onClick={() => bannerInputRef.current?.click()}>
                                    <Upload className="w-6 h-6 text-white" />
                                </div>
                            )}
                            <input type="file" ref={bannerInputRef} className="hidden" accept="image/*" onChange={(e) => handleSocialAssetUpload(e, 'banner')} />
                        </div>
                        <button
                            onClick={() => downloadAsset(1500, 500, secondaryColor, `${brandIdentity.name}_banner.png`, editedBrand.socialAssets?.bannerImage)}
                            className="flex items-center text-xs text-primary-600 hover:text-primary-700 font-medium"
                        >
                            <Download className="w-3 h-3 mr-1" /> Download
                        </button>
                    </div>

                    {/* Thumbnail */}
                    <div className="flex flex-col items-center">
                        <div className="mb-2 text-sm font-semibold text-slate-600">Thumbnail (1280x720)</div>
                        <div className="relative group w-full">
                            <div
                                className="w-full aspect-video h-32 rounded-lg shadow-md flex items-center justify-center mb-4 relative overflow-hidden bg-white border border-slate-200 bg-cover bg-center"
                                style={{
                                    backgroundImage: editedBrand.socialAssets?.thumbnailImage ? `url(${editedBrand.socialAssets.thumbnailImage})` : undefined
                                }}
                            >
                                {!editedBrand.socialAssets?.thumbnailImage && (
                                    brandIdentity.logoSvg && isSvg(brandIdentity.logoSvg) ? (
                                        <div className="w-16 h-16" dangerouslySetInnerHTML={{ __html: brandIdentity.logoSvg }} />
                                    ) : (
                                        <img src={brandIdentity.logoSvg} className="w-16 h-16 object-contain" alt="logo" />
                                    )
                                )}
                            </div>
                            {isEditing && (
                                <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer" onClick={() => thumbnailInputRef.current?.click()}>
                                    <Upload className="w-6 h-6 text-white" />
                                </div>
                            )}
                            <input type="file" ref={thumbnailInputRef} className="hidden" accept="image/*" onChange={(e) => handleSocialAssetUpload(e, 'thumbnail')} />
                        </div>
                        <button
                            onClick={() => downloadAsset(1280, 720, '#ffffff', `${brandIdentity.name}_thumbnail.png`, editedBrand.socialAssets?.thumbnailImage)}
                            className="flex items-center text-xs text-primary-600 hover:text-primary-700 font-medium"
                        >
                            <Download className="w-3 h-3 mr-1" /> Download
                        </button>
                    </div>
                </div>
            </div>

            {/* Brand Guide Modal */}
            {showGuideModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
                        <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-slate-50 no-print">
                            <div>
                                <h2 className="text-2xl font-bold text-slate-900">Brand Style Guide</h2>
                                <p className="text-slate-500 text-sm">Official usage guidelines for {brandIdentity.name}</p>
                            </div>
                            <div className="flex items-center space-x-2">
                                <button
                                    onClick={() => window.print()}
                                    className="flex items-center px-4 py-2 bg-primary-600 text-white hover:bg-primary-700 rounded-lg transition-all shadow-sm font-medium"
                                    title="Print / Save as PDF"
                                >
                                    <Download className="w-4 h-4 mr-2" />
                                    Download PDF
                                </button>
                                <button onClick={() => setShowGuideModal(false)} className="p-2 text-slate-400 hover:text-slate-600">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>
                        </div>

                        <div className="overflow-y-auto p-8 bg-white printable-content">
                            {/* Guide Content */}
                            <div className="max-w-3xl mx-auto space-y-12">

                                {/* Header */}
                                <div className="text-center pb-12 border-b border-slate-100">
                                    {brandIdentity.logoSvg && isSvg(brandIdentity.logoSvg) ? (
                                        <div className="w-32 h-32 mx-auto mb-6" dangerouslySetInnerHTML={{ __html: brandIdentity.logoSvg }} />
                                    ) : (
                                        <img src={brandIdentity.logoSvg} className="w-32 h-32 mx-auto mb-6 object-contain" alt="logo" />
                                    )}
                                    <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-2">{brandIdentity.name}</h1>
                                    <p className="text-xl text-slate-500 font-medium italic">{brandIdentity.slogan}</p>
                                </div>

                                {/* Strategy */}
                                <div className="grid md:grid-cols-2 gap-8">
                                    <div>
                                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Our Mission</h3>
                                        <p className="text-lg text-slate-800 leading-relaxed">{brandIdentity.mission}</p>
                                    </div>
                                    <div>
                                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Our Vision</h3>
                                        <p className="text-lg text-slate-800 leading-relaxed">{brandIdentity.vision}</p>
                                    </div>
                                </div>

                                {/* Voice */}
                                <div>
                                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Tone of Voice</h3>
                                    <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
                                        <p className="text-slate-700 whitespace-pre-line">{brandIdentity.toneOfVoice}</p>
                                    </div>
                                </div>

                                {/* Guidelines Text */}
                                <div>
                                    <div className="flex justify-between items-center mb-3">
                                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Usage Guidelines</h3>
                                        {!isReadOnly && !isEditing && (
                                            <button
                                                onClick={() => setIsEditing(true)}
                                                className="text-xs text-primary-600 hover:underline no-print"
                                            >
                                                Edit
                                            </button>
                                        )}
                                    </div>
                                    {isEditing ? (
                                        <textarea
                                            className="w-full p-4 border border-slate-300 rounded-lg text-sm"
                                            rows={5}
                                            placeholder="Add specific do's and don'ts for using the brand assets..."
                                            value={editedBrand.usageGuidelines || ''}
                                            onChange={(e) => setEditedBrand({ ...editedBrand, usageGuidelines: e.target.value })}
                                        />
                                    ) : (
                                        <div className="prose prose-slate text-slate-700">
                                            {brandIdentity.usageGuidelines ? (
                                                <p className="whitespace-pre-line">{brandIdentity.usageGuidelines}</p>
                                            ) : (
                                                <p className="text-slate-400 italic">No specific usage guidelines added yet.</p>
                                            )}
                                        </div>
                                    )}
                                </div>


                                {/* Colors */}
                                <div>
                                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Color Palette</h3>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        {brandIdentity.colors.map((color, idx) => (
                                            <div key={idx} className="flex flex-col">
                                                <div
                                                    className="h-24 rounded-lg shadow-sm border border-slate-100 mb-2"
                                                    style={{ backgroundColor: color }}
                                                ></div>
                                                <span className="font-mono text-sm font-medium text-slate-600">{color}</span>
                                                <span className="text-xs text-slate-400">Primary {idx + 1}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Typography */}
                                <div>
                                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Typography</h3>
                                    <div className="space-y-6">
                                        {brandIdentity.fonts.map((font, idx) => (
                                            <div key={idx} className="border-b border-slate-100 pb-6 last:border-0">
                                                <span className="text-sm text-slate-500 mb-1 block">Font Family</span>
                                                <h4 className="text-2xl font-bold text-slate-900 mb-2">{font}</h4>
                                                <p className="text-3xl text-slate-800" style={{ fontFamily: font }}>
                                                    Aa Bb Cc Dd Ee Ff Gg
                                                </p>
                                                <p className="text-lg text-slate-600 mt-2" style={{ fontFamily: font }}>
                                                    The quick brown fox jumps over the lazy dog. 1234567890
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};