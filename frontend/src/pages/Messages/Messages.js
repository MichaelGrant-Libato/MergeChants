import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import './Messages.css';
import { MessageSquare, MoreVertical, Plus } from "lucide-react";

/* ===== Helper functions (outside component so no dependency issues) ===== */
const capitalize = (s) =>
  s && s.length ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : "";

const formatIdentifierAsName = (identifier) => {
  if (!identifier) return "";

  // remove domain if email
  const withoutDomain = identifier.split('@')[0];

  // split on dot, underscore, or space
  const parts = withoutDomain.split(/[.\s_]+/).filter(Boolean);

  if (parts.length >= 2) {
    return parts.map(capitalize).join(" ");
  }

  const one = parts[0] || withoutDomain;
  if (one.length <= 3) return capitalize(one);

  const mid = Math.floor(one.length / 2);
  const first = one.slice(0, mid);
  const last = one.slice(mid);
  return `${capitalize(first)} ${capitalize(last)}`.trim();
};

export default function Messages() {
  const [searchParams] = useSearchParams();

  const myId = localStorage.getItem('studentId');

  const [activeChatUser, setActiveChatUser] = useState(searchParams.get('user') || null);
  const [activeListingId, setActiveListingId] = useState(searchParams.get('listing') || null);
  const [activeListing, setActiveListing] = useState(null);

  const [inbox, setInbox] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isMarkingSold, setIsMarkingSold] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  const [blockedBy, setBlockedBy] = useState(null);
  const [showOptions, setShowOptions] = useState(false);

  useEffect(() => {
    if (!myId) return;

    fetch(`http://localhost:8080/api/messages/inbox/${myId}`)
      .then(res => res.json())
      .then(data => {
        // Backend now returns List<InboxDTO> sorted by time
        if (Array.isArray(data)) {
          setInbox(data);
        } else {
          console.error("Inbox data is not an array:", data);
          setInbox([]);
        }
      })
      .catch(err => console.error("Error loading inbox:", err));
  }, [myId, messages]);

  useEffect(() => {
    if (!myId || !activeChatUser) return;

    const fetchChat = () => {
      // Append listingId to separate logs
      let url = `http://localhost:8080/api/messages/${myId}/${activeChatUser}`;
      if (activeListingId) {
        url += `?listingId=${activeListingId}`;
      }

      fetch(url)
        .then(res => res.json())
        .then(data => {
          if (data.messages) {
            setMessages(data.messages);
            setIsBlocked(data.isBlocked);
            setBlockedBy(data.blockedBy);
          } else {
            setMessages(Array.isArray(data) ? data : []);
          }
        })
        .catch(err => console.error("Error loading chat:", err));
    };

    fetchChat();
    const interval = setInterval(fetchChat, 3000);
    return () => clearInterval(interval);
  }, [myId, activeChatUser, activeListingId]);

  useEffect(() => {
    if (activeListingId) return;
    const msgWithListing = messages.find(m => m.listingId);
    if (msgWithListing) {
      setActiveListingId(msgWithListing.listingId);
    }
  }, [messages, activeListingId]);

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

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeChatUser) return;

    if (isBlocked) {
      alert("Person inaccessible");
      return;
    }

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
      } else {
        // Handle blocked error from backend
        const text = await res.text();
        if (text.includes("blocked")) {
          alert("Person inaccessible");
          setIsBlocked(true);
        }
      }
    } catch (err) {
      console.error("Failed to send:", err);
    }
  };

  const handleDeleteChat = async () => {
    if (!window.confirm("Are you sure you want to delete this chat? This cannot be undone.")) {
      return;
    }

    try {
      const res = await fetch(`http://localhost:8080/api/messages/${myId}/${activeChatUser}`, {
        method: 'DELETE'
      });

      if (res.ok) {
        setMessages([]);
        setIsBlocked(true);
        setBlockedBy(myId);
        setShowOptions(false);
        alert("Chat deleted.");
      } else {
        alert("Failed to delete chat.");
      }
    } catch (e) {
      console.error(e);
    }
  };

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
    if (!window.confirm(`Mark "${activeListing.name}" as SOLD to this buyer?`)) {
      return;
    }

    try {
      setIsMarkingSold(true);

      const res = await fetch('http://localhost:8080/api/transactions/complete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Student-Id': myId,
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

  const activeChatDisplayName =
    inbox.find(item => item.otherUserId === activeChatUser)?.otherUserName
    || formatIdentifierAsName(activeChatUser);

  return (
    <div className="chat-container">
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
            .filter(item => {
              const term = searchTerm.toLowerCase();
              return (
                (item.listingName && item.listingName.toLowerCase().includes(term)) ||
                (item.otherUserName && item.otherUserName.toLowerCase().includes(term)) ||
                (item.otherUserId && item.otherUserId.toLowerCase().includes(term)) ||
                (item.lastMessage && item.lastMessage.toLowerCase().includes(term))
              );
            })
            .map((item, idx) => {
              // Determine if active: match user AND listing
              const isActive =
                activeChatUser === item.otherUserId &&
                ((!activeListingId && !item.listingId) || (String(activeListingId) === String(item.listingId)));

              // Resolve image
              let imageUrl = null;
              if (item.listingImage) {
                if (item.listingImage.startsWith("http")) imageUrl = item.listingImage;
                else imageUrl = `http://localhost:8080/uploads/${item.listingImage}`;
              }

              return (
                <div
                  key={`${item.otherUserId}_${item.listingId || 'general'}_${idx}`}
                  className={`conversation-item ${isActive ? 'active' : ''}`}
                  onClick={() => {
                    setActiveChatUser(item.otherUserId);
                    setActiveListingId(item.listingId);
                    setMessages([]);
                    setIsBlocked(false);
                    setBlockedBy(null);
                    setShowOptions(false);
                  }}
                >
                  <div className="conv-visual">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt="item"
                        style={{ width: '48px', height: '48px', borderRadius: '8px', objectFit: 'cover' }}
                      />
                    ) : (
                      <div className="avatar-circle">
                        {/* Use first char of formatted name or ID */}
                        {item.otherUserName ? item.otherUserName.charAt(0).toUpperCase() : item.otherUserId.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>

                  <div className="conv-text">
                    <div className="conv-header-row">
                      <h4 title={item.listingName || item.otherUserName}>
                        {item.listingName || item.otherUserName}
                      </h4>
                      <span className="conv-time">
                        {new Date(item.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#888', marginBottom: '2px' }}>
                      {item.otherUserName}
                    </div>
                    <p className="conv-preview">
                      {item.lastMessage ? item.lastMessage.substring(0, 40) : ""}...
                    </p>
                  </div>
                </div>
              )
            })}

          {inbox.length === 0 && (
            <p style={{ padding: '20px', color: '#888', textAlign: 'center' }}>
              No conversations yet.
            </p>
          )}
        </div>
      </div>

      <div className="chat-window">
        {activeChatUser ? (
          <>
            <div className="chat-header">
              <div>
                <h3>{activeChatDisplayName}</h3>
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

              <div style={{ position: 'relative' }}>
                <button
                  className="more-options-btn"
                  onClick={() => setShowOptions(!showOptions)}
                >
                  <MoreVertical size={20} />
                </button>
                {showOptions && (
                  <div className="dropdown-menu">
                    <button onClick={handleDeleteChat} className="dropdown-item danger">
                      Delete Chat
                    </button>
                  </div>
                )}
              </div>
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
              {!isBlocked && (
                <button type="button" className="attach-btn">
                  <Plus size={24} />
                </button>
              )}

              <textarea
                placeholder={isBlocked ? "Person inaccessible" : "Type a message..."}
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                rows={1}
                disabled={isBlocked}
                onInput={(e) => {
                  e.target.style.height = 'auto';
                  e.target.style.height = Math.min(e.target.scrollHeight, 100) + 'px';
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend(e);
                  }
                }}
              />

              <button type="submit" className="send-btn" disabled={!newMessage.trim() || isBlocked}>
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
