import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import { BusinessPlan } from '../types';
import { Send, Bot, User, Sparkles, Loader2, Info } from 'lucide-react';

interface BrainstormingViewProps {
    plan: BusinessPlan;
}

interface Message {
    id: string;
    role: 'user' | 'model';
    text: string;
}

export const BrainstormingView: React.FC<BrainstormingViewProps> = ({ plan }) => {
    const [messages, setMessages] = useState<Message[]>([
        { id: '1', role: 'model', text: `Hi! I'm your AI co-founder for **${plan.brandIdentity.name}**. I have full context of your business plan. What should we brainstorm today?` }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const chatSessionRef = useRef<Chat | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Initialize chat session with context
    useEffect(() => {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        
        const systemInstruction = `
            You are an expert AI business co-founder and strategist for a company named "${plan.brandIdentity.name}".
            
            Here is the full context of the business plan:
            ${JSON.stringify(plan, null, 2)}
            
            Your goal is to help the user brainstorm ideas, solve problems, improve strategies, and execute on this plan.
            Be concise, actionable, and encouraging. Use the data provided to give specific advice.
            Format your responses with Markdown for readability.
        `;

        chatSessionRef.current = ai.chats.create({
            model: 'gemini-3-flash-preview',
            config: {
                systemInstruction: systemInstruction,
            },
        });
    }, [plan]); // Re-initialize if plan changes

    // Auto-scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!input.trim() || !chatSessionRef.current) return;

        const userMsg: Message = { id: Date.now().toString(), role: 'user', text: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsTyping(true);

        try {
            const result: GenerateContentResponse = await chatSessionRef.current.sendMessage({ message: userMsg.text });
            const aiMsg: Message = { 
                id: (Date.now() + 1).toString(), 
                role: 'model', 
                text: result.text || "I'm having trouble thinking right now. Please try again." 
            };
            setMessages(prev => [...prev, aiMsg]);
        } catch (error) {
            console.error("Chat Error:", error);
            setMessages(prev => [...prev, { 
                id: (Date.now() + 1).toString(), 
                role: 'model', 
                text: "Sorry, I encountered an error connecting to the AI. Please try again later." 
            }]);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <div className="flex flex-col h-[calc(100vh-140px)] md:h-[calc(100vh-160px)] bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            {/* Header */}
            <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex items-center justify-between">
                <div>
                    <h2 className="text-lg font-bold text-slate-900 flex items-center">
                        <Sparkles className="w-5 h-5 mr-2 text-primary-600" />
                        AI Co-Founder Chat
                    </h2>
                    <p className="text-sm text-slate-500">Brainstorm ideas using your workspace context.</p>
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
                {messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`flex max-w-[90%] md:max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mx-2 ${msg.role === 'user' ? 'bg-indigo-100 text-indigo-600' : 'bg-primary-100 text-primary-600'}`}>
                                {msg.role === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                            </div>
                            <div className={`p-4 rounded-2xl shadow-sm text-sm md:text-base leading-relaxed overflow-hidden ${
                                msg.role === 'user' 
                                ? 'bg-indigo-600 text-white rounded-tr-none' 
                                : 'bg-slate-100 text-slate-800 rounded-tl-none'
                            }`}>
                                <div dangerouslySetInnerHTML={{ 
                                    __html: msg.text.replace(/\n/g, '<br/>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') 
                                }} />
                            </div>
                        </div>
                    </div>
                ))}
                {isTyping && (
                    <div className="flex justify-start">
                        <div className="flex flex-row">
                             <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center mx-2">
                                <Bot className="w-5 h-5" />
                            </div>
                            <div className="bg-slate-100 p-4 rounded-2xl rounded-tl-none text-slate-500 flex items-center">
                                <Loader2 className="w-4 h-4 animate-spin mr-2" /> Thinking...
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-slate-200">
                <form onSubmit={handleSendMessage} className="relative flex items-center">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask about your marketing strategy, revenue ideas, or operational improvements..."
                        className="w-full pl-4 pr-12 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all outline-none"
                    />
                    <button 
                        type="submit" 
                        disabled={!input.trim() || isTyping}
                        className="absolute right-3 p-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:hover:bg-primary-600 transition-colors"
                    >
                        <Send className="w-5 h-5" />
                    </button>
                </form>
                <div className="text-center mt-2">
                     <p className="text-xs text-slate-400 flex items-center justify-center">
                        <Info className="w-3 h-3 mr-1" />
                        Using Platform AI. Your data is processed securely.
                    </p>
                </div>
            </div>
        </div>
    );
};