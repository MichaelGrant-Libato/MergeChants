import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom'; // To read URL params
import './Messages.css';

export default function Messages() {
    const [searchParams] = useSearchParams();
    
    // Who am I?
    const myId = localStorage.getItem('studentId');
    
    // Who am I talking to?
    // We check the URL first (e.g. ?user=TechStudent), otherwise null
    const [activeChatUser, setActiveChatUser] = useState(searchParams.get('user') || null);
    
    const [inbox, setInbox] = useState([]); // List of people
    const [messages, setMessages] = useState([]); // Current conversation
    const [newMessage, setNewMessage] = useState(""); // Input box text
    const messagesEndRef = useRef(null); // Auto-scroll to bottom

    // 1. LOAD INBOX (List of people I've talked to)
    useEffect(() => {
        if (!myId) return;

        fetch(`http://localhost:8080/api/messages/inbox/${myId}`)
            .then(res => res.json())
            .then(data => {
                // The backend returns ALL messages. We need to group them by unique users.
                const uniqueUsers = new Set();
                const conversations = [];

                // Sort by newest first
                data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

                data.forEach(msg => {
                    // Identify the "Other Person"
                    const otherPerson = msg.senderId === myId ? msg.receiverId : msg.senderId;
                    
                    if (!uniqueUsers.has(otherPerson)) {
                        uniqueUsers.add(otherPerson);
                        conversations.push({
                            user: otherPerson,
                            lastMessage: msg.content,
                            time: msg.timestamp
                        });
                    }
                });
                setInbox(conversations);
            })
            .catch(err => console.error("Error loading inbox:", err));
    }, [myId, messages]); // Reload inbox when messages change

    // 2. LOAD CHAT HISTORY (Polling every 3 seconds)
    useEffect(() => {
        if (!myId || !activeChatUser) return;

        const fetchChat = () => {
            fetch(`http://localhost:8080/api/messages/${myId}/${activeChatUser}`)
                .then(res => res.json())
                .then(data => setMessages(data))
                .catch(err => console.error("Error loading chat:", err));
        };

        // Initial fetch
        fetchChat();

        // Poll every 3 seconds to create "Live" effect
        const interval = setInterval(fetchChat, 3000);
        return () => clearInterval(interval); // Cleanup on unmount

    }, [myId, activeChatUser]);

    // 3. AUTO-SCROLL TO BOTTOM
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // 4. SEND MESSAGE
    const handleSend = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !activeChatUser) return;

        const payload = {
            senderId: myId,
            receiverId: activeChatUser,
            content: newMessage,
            listingId: null // Optional: Could pass listing ID later
        };

        try {
            const res = await fetch('http://localhost:8080/api/messages', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                setNewMessage("");
                // Manually trigger a fetch to update UI immediately
                const savedMsg = await res.json();
                setMessages([...messages, savedMsg]);
            }
        } catch (err) {
            console.error("Failed to send:", err);
        }
    };

    if (!myId) return <div className="chat-container">Please log in to view messages.</div>;

    return (
        <div className="chat-container">
            {/* SIDEBAR */}
            <div className="chat-sidebar">
                <div className="sidebar-header">
                    <h2>Messages</h2>
                </div>
                <div className="conversation-list">
                    {inbox.map((conv) => (
                        <div 
                            key={conv.user} 
                            className={`conversation-item ${activeChatUser === conv.user ? 'active' : ''}`}
                            onClick={() => setActiveChatUser(conv.user)}
                        >
                            <div className="avatar-circle">
                                {conv.user.charAt(0).toUpperCase()}
                            </div>
                            <div className="conversation-info">
                                <h4>{conv.user}</h4>
                                <p>{conv.lastMessage.substring(0, 30)}...</p>
                            </div>
                        </div>
                    ))}
                    {inbox.length === 0 && (
                        <p style={{padding: '20px', color:'#888'}}>No conversations yet.</p>
                    )}
                </div>
            </div>

            {/* CHAT WINDOW */}
            <div className="chat-window">
                {activeChatUser ? (
                    <>
                        <div className="chat-header">
                            <h3>{activeChatUser}</h3>
                        </div>
                        
                        <div className="chat-messages">
                            {messages.map((msg) => (
                                <div 
                                    key={msg.id} 
                                    className={`message-bubble ${msg.senderId === myId ? 'me' : 'them'}`}
                                >
                                    {msg.content}
                                    <span className="message-time">
                                        {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                    </span>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>

                        <form className="chat-input-area" onSubmit={handleSend}>
                            <input 
                                type="text" 
                                placeholder="Type a message..." 
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                            />
                            <button type="submit" className="send-btn">Send</button>
                        </form>
                    </>
                ) : (
                    <div className="no-chat-selected">
                        <p>Select a conversation to start chatting</p>
                    </div>
                )}
            </div>
        </div>
    );
}