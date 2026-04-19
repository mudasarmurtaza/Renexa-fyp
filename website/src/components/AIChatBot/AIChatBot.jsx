import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, Calculator, Sparkles } from 'lucide-react';
import './AIChatBot.css';

const AIChatBot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { text: "Hi! I'm your Renexa AI assistant. I can help you with construction cost estimates and project queries. How can I help you today?", sender: 'ai' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async (e) => {
        if (e) e.preventDefault();
        if (!input.trim()) return;

        const userMsg = input.trim();
        setMessages(prev => [...prev, { text: userMsg, sender: 'user' }]);
        setInput('');
        setIsLoading(true);

        try {
            const response = await fetch('/ai/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: userMsg })
            });
            const data = await response.json();
            setMessages(prev => [...prev, { text: data.reply, sender: 'ai' }]);
        } catch (error) {
            setMessages(prev => [...prev, { text: "Redirecting to local AI... Please make sure the AI server is running.", sender: 'ai' }]);
        } finally {
            setIsLoading(false);
        }
    };

    const quickEstimate = () => {
        setInput("I want a construction cost estimate");
        // We can trigger handleSend manually or let the user click send
    };

    return (
        <div className="ai-chatbot-container">
            {/* Floating Action Button */}
            {!isOpen && (
                <button 
                    className="ai-fab shadow-lg" 
                    onClick={() => setIsOpen(true)}
                    title="AI Assistant"
                >
                    <Sparkles className="ai-icon-sparkle" />
                    <MessageSquare size={24} />
                </button>
            )}

            {/* Chat Window */}
            {isOpen && (
                <div className="ai-chat-window shadow-2xl">
                    <div className="ai-chat-header d-flex justify-content-between align-items-center">
                        <div className="d-flex align-items-center gap-2">
                            <div className="ai-avatar-mini">
                                <Sparkles size={14} color="white" />
                            </div>
                            <span className="fw-bold text-white">Renexa AI</span>
                        </div>
                        <button className="btn btn-link p-0 text-white" onClick={() => setIsOpen(false)}>
                            <X size={20} />
                        </button>
                    </div>

                    <div className="ai-messages-container">
                        {messages.map((msg, i) => (
                            <div key={i} className={`ai-message-wrapper ${msg.sender}`}>
                                <div className="ai-message-bubble">
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="ai-message-wrapper ai">
                                <div className="ai-message-bubble loading">
                                    <span>.</span><span>.</span><span>.</span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <div className="ai-quick-actions px-3 py-2 border-top">
                        <button className="btn btn-sm btn-outline-primary rounded-pill d-flex align-items-center gap-1" onClick={quickEstimate}>
                            <Calculator size={14} /> Cost Estimate
                        </button>
                    </div>

                    <form className="ai-chat-input p-3 border-top d-flex gap-2" onSubmit={handleSend}>
                        <input 
                            type="text" 
                            className="form-control rounded-pill border-0 bg-light px-3" 
                            placeholder="Type a message..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                        />
                        <button type="submit" className="btn btn-primary rounded-circle ai-send-btn">
                            <Send size={18} />
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default AIChatBot;
