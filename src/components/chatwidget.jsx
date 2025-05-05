import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export default function ChatWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [showSuggestions, setShowSuggestions] = useState(true);
    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
        // Listen for dark mode toggle changes
        const darkModeToggle = document.querySelector('#dark-mode-toggle');
        const handleDarkModeChange = () => {
            setIsDarkMode(darkModeToggle?.checked || false);
        };

        darkModeToggle?.addEventListener('change', handleDarkModeChange);

        return () => {
            darkModeToggle?.removeEventListener('change', handleDarkModeChange);
        };
    }, []);

    const extractPageData = () => {
        const titles = Array.from(document.querySelectorAll('h1, h2')).map(el => el.innerText);
        const paragraphs = Array.from(document.querySelectorAll('p')).map(el => el.innerText);
        return [...titles, ...paragraphs].join("\n");
    };

    const suggestions = [
        "Summarize this page",
        "What is this page about?",
        "Suggest tasks for that collection",
    ];

    const sendMessage = async (customInput) => {
        const message = customInput || input;
        if (!message.trim()) return;

        const pageData = extractPageData();
        const userMessage = message.toLowerCase();

        try {
            let apiMessage = `User: ${message}`;

            // If the user asks for page data or task suggestions, include the page data
            if (userMessage.includes("page") || userMessage.includes("task")) {
                apiMessage = `Here's what is on the page:\n${pageData}\n\nUser: ${message}`;
            }

            const response = await fetch("http://localhost:8000/api/chat/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    message: apiMessage,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setMessages(prev => [
                    ...prev,
                    { sender: "user", text: message },
                    { sender: "ai", text: data.response }
                ]);
                setInput("");
                setShowSuggestions(false); // Hide suggestions after sending the message
            } else {
                console.error("Error:", data);
            }
        } catch (error) {
            console.error("Request failed:", error);
        }
    };

    const handleSuggestionClick = (text) => {
        setInput(text);
        sendMessage(text);
        setShowSuggestions(false); // Hide suggestions after choosing a suggestion
    };

    return (
        <div style={{ position: 'fixed', bottom: 20, right: 20, zIndex: 1000 }}>
            {isOpen ? (
                <div style={{
                    width: 360,
                    height: 500,
                    background: '#f9f9f9',
                    borderRadius: 12,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden'
                }}>
                    <div style={{
                        background: '#007bff',
                        color: '#fff',
                        padding: '12px 16px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
                        <strong>💬 Gemini Assistant</strong>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button
                                onClick={() => {
                                    setMessages([]);
                                    setInput("");
                                    setShowSuggestions(true); // Reset suggestions when starting a new chat
                                }}
                                style={{
                                    background: 'transparent',
                                    color: '#fff',
                                    border: 'none',
                                    cursor: 'pointer'
                                }}
                            >
                                🔄 New Chat
                            </button>
                            <X onClick={() => setIsOpen(false)} style={{ cursor: 'pointer' }} />
                        </div>
                    </div>

                    <div style={{ flex: 1, padding: 12, overflowY: 'auto', background: '#fff' }}>
                        {messages.map((msg, i) => (
                            <div key={i} style={{
                                marginBottom: 12,
                                display: 'flex',
                                justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start'
                            }}>
                                <div style={{
                                    background: msg.sender === 'user' ? '#d1e7dd' : '#f0f0f0',
                                    color: '#333',
                                    padding: '10px 14px',
                                    borderRadius: '16px',
                                    maxWidth: '75%',
                                    whiteSpace: 'pre-wrap',
                                    boxShadow: '0 1px 4px rgba(0,0,0,0.1)'
                                }}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Suggestions section */}
                    {showSuggestions && (
                        <div style={{
                            marginBottom: 10,
                            padding: '10px',
                            background: '#f1f1f1',
                            borderRadius: '12px',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 10
                        }}>
                            <span style={{
                                fontSize: 14,
                                color: '#555',
                                fontWeight: 'bold'
                            }}>How can I help you?</span>
                            <div style={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                gap: '10px'
                            }}>
                                {suggestions.map((text, i) => (
                                    <button
                                        key={i}
                                        onClick={() => handleSuggestionClick(text)}
                                        style={{
                                            background: '#007bff',
                                            color: '#fff',
                                            border: 'none',
                                            borderRadius: 20,
                                            padding: '8px 16px',
                                            cursor: 'pointer',
                                            fontSize: 11,
                                            transition: 'background-color 0.3s',
                                        }}
                                        onMouseEnter={(e) => e.target.style.backgroundColor = '#0056b3'}
                                        onMouseLeave={(e) => e.target.style.backgroundColor = '#007bff'}
                                    >
                                        {text}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    <div style={{
                        padding: '10px',
                        borderTop: '1px solid #ccc',
                        background: '#f8f8f8'
                    }}>
                        <input
                            type="text"
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            onKeyDown={e => {
                                if (e.key === 'Enter') sendMessage();
                            }}
                            style={{
                                width: '100%',
                                padding: '10px 12px',
                                borderRadius: 20,
                                border: '1px solid #ddd',
                                outline: 'none'
                            }}
                            placeholder="Ask me anything..."
                        />
                    </div>
                </div>
            ) : (
                <button
                    onClick={() => setIsOpen(true)}
                    style={{
                        width: 60,
                        height: 60,
                        borderRadius: '50%',
                        background: '#007bff',
                        color: '#fff',
                        border: 'none',
                        boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
                        cursor: 'pointer',
                        fontSize: 22
                    }}
                >
                    💬
                </button>
            )}
        </div>
    );
}
