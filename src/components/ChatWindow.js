import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:4000');

const ChatWindow = ({ chat, onSendMessage, onNewChat }) => {
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([]);
    const [isTyping, setIsTyping] = useState(false);
    const [newMessage, setNewMessage] = useState(false);
    const textareaRef = useRef(null);

    useEffect(() => {
        if (chat?.messages) {
            setMessages(chat.messages);
            setNewMessage(true);
            setIsTyping(true);

            const timer = setTimeout(() => {
                setNewMessage(false);
                setIsTyping(false);
            }, 1800);

            return () => clearTimeout(timer);
        } else {
            setMessages([]);
            setInput('');
            setIsTyping(false);
            setNewMessage(false);
        }
    }, [chat]);

    const handleSend = () => {
        if (input.trim()) {
            onSendMessage(input);
            socket.emit('response_of_query', { message: input });
            setInput('');
        }
    };

    const autoGrow = () => {
        const element = textareaRef.current;
        element.style.height = '2px';
        element.style.height = `${element.scrollHeight}px`;
    };

    return (
        <div className="chat-window">
            <div className='header' style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div className='logo-div'>
                    <img width={22} height={22} src='https://cdn-icons-png.flaticon.com/128/11865/11865326.png' alt="Logo" />
                    <p style={{ fontWeight: "bold" }} >EximGPT</p>
                </div>
                <img width={25} height={25} src='https://cdn-icons-png.flaticon.com/128/25/25694.png' alt="GitHub" />
            </div>

            <div className="messages">
                {messages.length > 0 ? messages.map((msg, index) => (
                    <div
                        key={index}
                        className={`message ${msg?.type} ${newMessage ? 'fade-in' : ''}`}
                    >
                        {msg?.message}
                    </div>
                )) :
                    <div style={{ flexDirection: "column" }} className='logo-div'>
                        <img width={22} height={22} src='https://cdn-icons-png.flaticon.com/128/11865/11865326.png' alt="Logo" />
                        <h2>Hello, May I Help You?</h2>
                    </div>
                }
                {isTyping && messages.length === 0 && <div className="typing-animation">Hi there, I'm Exim AI. How can I assist you?</div>}
                {!isTyping && messages.length === 0 && <div>Hi there, I'm Exim AI. How can I help you?</div>}
            </div>

            <div className="input-area">
                <textarea
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="What do you want to ask?"
                    ref={textareaRef}
                    onInput={autoGrow}
                    style={{
                        resize: 'none',
                        overflow: 'hidden',
                        minHeight: '32px',
                        width: '100%',
                        borderRadius: '10px',
                        textAlign: 'left',
                        display: 'flex',
                        justifyContent: 'center'
                    }}
                />
                <div className="icon">
                    <img width={20} src='https://cdn-icons-png.flaticon.com/128/4673/4673184.png' alt="Attach" />
                    <div className='enter-btn'>
                        <svg onClick={handleSend} xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="none" viewBox="0 0 32 32" className="icon-2xl">
                            <path fill="currentColor" fillRule="evenodd" d="M15.192 8.906a1.143 1.143 0 0 1 1.616 0l5.143 5.143a1.143 1.143 0 0 1-1.616 1.616l-3.192-3.192v9.813a1.143 1.143 0 0 1-2.286 0v-9.813l-3.192 3.192a1.143 1.143 0 1 1-1.616-1.616z" clipRule="evenodd"></path>
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatWindow;
