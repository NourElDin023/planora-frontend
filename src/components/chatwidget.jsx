import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import axiosInstance from '../utils/axios';

export default function ChatWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [showSuggestions, setShowSuggestions] = useState(true);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

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

    // Listen for theme changes
    useEffect(() => {
        const updateTheme = () => {
            setTheme(localStorage.getItem('theme') || 'light');
        };

        // Initial setup
        updateTheme();

        // Listen for storage events (when localStorage changes)
        window.addEventListener('storage', updateTheme);

        // Create a MutationObserver to watch for body class changes
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.attributeName === 'class') {
                    const bodyTheme = document.body.className;
                    if (bodyTheme && (bodyTheme === 'light' || bodyTheme === 'dark')) {
                        setTheme(bodyTheme);
                    }
                }
            });
        });

        observer.observe(document.body, { attributes: true });

        return () => {
            window.removeEventListener('storage', updateTheme);
            observer.disconnect();
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

            if (userMessage.includes("page") || userMessage.includes("task")) {
                apiMessage = `Here's what is on the page:\n${pageData}\n\nUser: ${message}`;
            }

            const response = await axiosInstance.post("chat/", {
                message: apiMessage
            });

            if (response.status === 200) {
                setMessages(prev => [
                    ...prev,
                    { sender: "user", text: message },
                    { sender: "ai", text: response.data.response }
                ]);
                setInput("");
                setShowSuggestions(false);
            } else {
                console.error("Error:", response.data);
            }
        } catch (error) {
            console.error("Request failed:", error);
        }
    };

    const handleSuggestionClick = (text) => {
        setInput(text);
        sendMessage(text);
        setShowSuggestions(false);
    };

    return (
        <div style={{ position: 'fixed', bottom: 20, right: 20, zIndex: 1000 }}>
            {isOpen ? (
                <div style={{
                    width: 360,
                    height: 500,
                    background: 'var(--card-bg)',
                    color: 'var(--text-color)',
                    borderRadius: 12,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',
                    border: '1px solid var(--border-color)'
                }}>
                    <div style={{
                        background: 'var(--button-bg)',
                        color: 'var(--button-text)',
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
                                    setShowSuggestions(true);
                                }}
                                style={{
                                    background: 'transparent',
                                    color: 'var(--button-text)',
                                    border: 'none',
                                    cursor: 'pointer'
                                }}
                            >
                                🔄 New Chat
                            </button>
                            <X onClick={() => setIsOpen(false)} style={{ cursor: 'pointer' }} />
                        </div>
                    </div>

                    <div style={{ flex: 1, padding: 12, overflowY: 'auto', background: 'var(--card-bg)' }}>
                        {messages.map((msg, i) => (
                            <div key={i} style={{
                                marginBottom: 12,
                                display: 'flex',
                                justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start'
                            }}>
                                <div style={{
                                    background: msg.sender === 'user' ? 'var(--button-bg)' : theme === 'dark' ? '#3a4a5e' : '#f0f0f0',
                                    color: msg.sender === 'user' ? 'var(--button-text)' : 'var(--text-color)',
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

                    {showSuggestions && (
                        <div style={{
                            marginBottom: 10,
                            padding: '10px',
                            background: theme === 'dark' ? '#3a4a5e' : '#f1f1f1',
                            borderRadius: '12px',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 10
                        }}>
                            <span style={{
                                fontSize: 14,
                                color: 'var(--text-color)',
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
                                            background: 'var(--button-bg)',
                                            color: 'var(--button-text)',
                                            border: 'none',
                                            borderRadius: 20,
                                            padding: '8px 16px',
                                            cursor: 'pointer',
                                            fontSize: 11,
                                            transition: 'background-color 0.3s',
                                        }}
                                        onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--button-hover-bg)'}
                                        onMouseLeave={(e) => e.target.style.backgroundColor = 'var(--button-bg)'}
                                    >
                                        {text}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    <div style={{
                        padding: '10px',
                        borderTop: '1px solid var(--border-color)',
                        background: theme === 'dark' ? '#212529' : '#f8f8f8'
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
                                border: '1px solid var(--border-color)',
                                outline: 'none',
                                background: 'var(--card-bg)',
                                color: 'var(--text-color)'
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
                        background: 'var(--button-bg)',
                        color: 'var(--button-text)',
                        border: 'none',
                        boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
                        cursor: 'pointer',
                        fontSize: 22
                    }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--button-hover-bg)'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = 'var(--button-bg)'}
                >
                    💬
                </button>
            )}
        </div>
    );
}
