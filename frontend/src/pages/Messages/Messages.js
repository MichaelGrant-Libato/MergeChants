import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import './Messages.css';
import { MessageSquare } from "lucide-react";

export default function Messages() {
  const [searchParams] = useSearchParams();

  // Who am I?
  const myId = localStorage.getItem('studentId');

  // Who am I talking to?
  const [activeChatUser, setActiveChatUser] = useState(searchParams.get('user') || null);

  // Listing connected to this chat (if any, from URL or messages)
  const [activeListingId, setActiveListingId] = useState(searchParams.get('listing') || null);
  const [activeListing, setActiveListing] = useState(null);

  const [inbox, setInbox] = useState([]);     // List of people
  const [messages, setMessages] = useState([]); // Current conversation
  const [newMessage, setNewMessage] = useState(""); // Input box text
  const messagesEndRef = useRef(null);        // Auto-scroll to bottom
  const [searchTerm, setSearchTerm] = useState(""); // Search state
  const [isMarkingSold, setIsMarkingSold] = useState(false);

  // 1. LOAD INBOX (List of people I've talked to)
  useEffect(() => {
    if (!myId) return;

    fetch(`http://localhost:8080/api/messages/inbox/${myId}`)
      .then(res => res.json())
      .then(data => {
        const uniqueUsers = new Set();
        const conversations = [];

        // sort by newest message
        data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

        data.forEach(msg => {
          const otherPerson = msg.senderId === myId ? msg.receiverId : msg.senderId;

          if (!uniqueUsers.has(otherPerson)) {
            uniqueUsers.add(otherPerson);
            conversations.push({
              user: otherPerson,
              lastMessage: msg.content,
              time: msg.timestamp,
            });
          }
        });
        setInbox(conversations);
      })
      .catch(err => console.error("Error loading inbox:", err));
  }, [myId, messages]);

  // 2. LOAD CHAT HISTORY (Polling every 3 seconds)
  useEffect(() => {
    if (!myId || !activeChatUser) return;

    const fetchChat = () => {
      fetch(`http://localhost:8080/api/messages/${myId}/${activeChatUser}`)
        .then(res => res.json())
        .then(data => setMessages(data))
        .catch(err => console.error("Error loading chat:", err));
    };

    fetchChat();
    const interval = setInterval(fetchChat, 3000);
    return () => clearInterval(interval);
  }, [myId, activeChatUser]);

  // 2b. TRY TO DETECT listingId FROM MESSAGES IF NOT SET
  useEffect(() => {
    if (activeListingId) return;
    const msgWithListing = messages.find(m => m.listingId);
    if (msgWithListing) {
      setActiveListingId(msgWithListing.listingId);
    }
  }, [messages, activeListingId]);

  // 3. LOAD LISTING DETAILS FOR HEADER + SELLER CHECK
  useEffect(() => {
    if (!activeListingId) {
      setActiveListing(null);
      return;
    }

    fetch(`http://localhost:8080/api/listings/${activeListingId}`)
      .then(res => {
        if (!res.ok) throw new Error("Failed to load listing");
        return res.json();
      })
      .then(data => setActiveListing(data))
      .catch(err => {
        console.error("Error loading listing:", err);
        setActiveListing(null);
      });
  }, [activeListingId]);

  // 4. AUTO-SCROLL TO BOTTOM
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 5. SEND MESSAGE
  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeChatUser) return;

    const payload = {
      senderId: myId,
      receiverId: activeChatUser,
      content: newMessage,
      listingId: activeListingId || null,
    };

    try {
      const res = await fetch('http://localhost:8080/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setNewMessage("");
        const savedMsg = await res.json();
        setMessages([...messages, savedMsg]);
      }
    } catch (err) {
      console.error("Failed to send:", err);
    }
  };

  // 6. MARK AS SOLD (ONLY WHEN I AM THE SELLER)
  const isSeller =
    activeListing &&
    activeListing.seller &&
    myId &&
    activeListing.seller.toString().trim() === myId.toString().trim();

  const isAlreadySold =
    activeListing &&
    activeListing.status &&
    activeListing.status.toUpperCase() === "SOLD";

  const canMarkAsSold =
    isSeller && !isAlreadySold && !!activeChatUser && !!activeListingId;

  const handleMarkAsSold = async () => {
    if (!canMarkAsSold) return;
    if (!window.confirm(`Mark "${activeListing.name}" as SOLD to ${activeChatUser}?`)) {
      return;
    }

    try {
      setIsMarkingSold(true);

      const res = await fetch('http://localhost:8080/api/transactions/complete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Student-Id': myId,  // seller id header
        },
        body: JSON.stringify({
          listingId: activeListingId,
          buyerId: activeChatUser,
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("Mark as sold (messages) failed:", res.status, text);
        alert(`Could not mark as sold.\nStatus: ${res.status}\n${text || ""}`);
        return;
      }

      await res.json();
      setActiveListing(prev => prev ? { ...prev, status: "SOLD" } : prev);
      alert("Item marked as SOLD and added to history.");
    } catch (err) {
      console.error(err);
      alert("Could not mark as sold. Check console for details.");
    } finally {
      setIsMarkingSold(false);
    }
  };

  if (!myId) return <div className="chat-container">Please log in to view messages.</div>;

  return (
    <div className="chat-container">
      {/* SIDEBAR */}
      <div className="chat-sidebar">
        <div className="sidebar-header">
          <h2>Messages</h2>
          <div className="search-wrapper">
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="sidebar-search-input"
            />
          </div>
        </div>

        <div className="conversation-list">
          {inbox
            .filter(conv =>
              conv.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
              (conv.lastMessage &&
                conv.lastMessage.toLowerCase().includes(searchTerm.toLowerCase()))
            )
            .map((conv) => (
              <div
                key={conv.user}
                className={`conversation-item ${activeChatUser === conv.user ? 'active' : ''}`}
                onClick={() => {
                  setActiveChatUser(conv.user);
                  // keep or later infer listingId from messages
                }}
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
            <p style={{ padding: '20px', color: '#888', textAlign: 'center' }}>
              No conversations yet.
            </p>
          )}
        </div>
      </div>

      {/* CHAT WINDOW */}
      <div className="chat-window">
        {activeChatUser ? (
          <>
            <div className="chat-header">
              <div>
                <h3>{activeChatUser}</h3>
                {activeListing && (
                  <p className="chat-subtitle">
                    Item: {activeListing.name} · Status: {activeListing.status}
                  </p>
                )}
              </div>

              {canMarkAsSold && (
                <button
                  className="mark-sold-btn"
                  onClick={handleMarkAsSold}
                  disabled={isMarkingSold}
                >
                  {isMarkingSold ? "Saving..." : "Mark as Sold"}
                </button>
              )}
            </div>

            <div className="chat-messages">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`message-bubble ${msg.senderId === myId ? 'me' : 'them'}`}
                >
                  {msg.content}
                  <span className="message-time">
                    {new Date(msg.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
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
              <button type="submit" className="send-btn">
                Send
              </button>
            </form>
          </>
        ) : (
          <div className="no-chat-selected">
            <div className="empty-state-content">
              <div className="empty-icon-wrapper">
                <MessageSquare size={64} color="#8D0133" />
              </div>
              <h3>Your Messages</h3>
              <p>Select a chat from the sidebar to view history.</p>
              <p className="sub-text">Negotiate prices and arrange meetups safely.</p>

              <button
                className="browse-marketplace-btn"
                onClick={() => (window.location.href = '/dashboard')}
              >
                Browse Marketplace
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
