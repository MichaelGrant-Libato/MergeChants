import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import './Messages.css';
import { MessageSquare, MoreVertical, Plus } from 'lucide-react';

/* ===== Helper functions ===== */
const capitalize = (s) =>
  s && s.length ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : '';

const formatIdentifierAsName = (identifier) => {
  if (!identifier) return '';

  const withoutDomain = identifier.split('@')[0];
  const parts = withoutDomain.split(/[.\s_]+/).filter(Boolean);

  if (parts.length >= 2) {
    return parts.map(capitalize).join(' ');
  }

  const one = parts[0] || withoutDomain;
  if (one.length <= 3) return capitalize(one);

  const mid = Math.floor(one.length / 2);
  const first = one.slice(0, mid);
  const last = one.slice(mid);
  return `${capitalize(first)} ${capitalize(last)}`.trim();
};

// unique key per conversation (myId + otherUserId + listingId)
const getConversationKey = (myId, otherUserId, listingId) =>
  `${myId || 'me'}__${otherUserId || 'other'}__${listingId || 'general'}`;

// build URL for listing image coming from backend
const buildListingImageUrl = (value) => {
  if (!value) return null;
  const trimmed = value.trim();

  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }

  if (trimmed.startsWith('/uploads/')) {
    return `http://localhost:8080${trimmed}`;
  }

  // plain file name
  return `http://localhost:8080/uploads/${trimmed}`;
};

export default function Messages() {
  const [searchParams] = useSearchParams();
  const myId = localStorage.getItem('studentId');

  const [activeChatUser, setActiveChatUser] = useState(searchParams.get('user') || null);
  const [activeListingId, setActiveListingId] = useState(searchParams.get('listing') || null);
  const [activeListing, setActiveListing] = useState(null);

  const [inbox, setInbox] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isMarkingSold, setIsMarkingSold] = useState(false);

  // per-conversation block info
  const [blockMap, setBlockMap] = useState({});
  const [isBlocked, setIsBlocked] = useState(false);
  const [blockedBy, setBlockedBy] = useState(null);

  const [showOptions, setShowOptions] = useState(false);
  const messagesEndRef = useRef(null);

  // header display: "FirstName LastName (xx-xxxx-xx)"
  const [activeHeaderName, setActiveHeaderName] = useState('');

  // confirmation modal state
  const [confirmState, setConfirmState] = useState({
    open: false,
    type: null, // 'delete' | 'block' | 'unblock' | 'markSold'
  });

  /* ==================== LOAD INBOX ==================== */
  useEffect(() => {
    if (!myId) return;

    fetch(`http://localhost:8080/api/messages/inbox/${myId}`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setInbox(data);
        } else {
          console.error('Inbox data is not an array:', data);
          setInbox([]);
        }
      })
      .catch((err) => console.error('Error loading inbox:', err));
  }, [myId, messages]);

  /* ==================== LOAD CHAT ==================== */
  useEffect(() => {
    if (!myId || !activeChatUser) return;

    const fetchChat = () => {
      let url = `http://localhost:8080/api/messages/${myId}/${activeChatUser}`;
      if (activeListingId) {
        url += `?listingId=${activeListingId}`;
      }

      fetch(url)
        .then((res) => res.json())
        .then((data) => {
          const key = getConversationKey(myId, activeChatUser, activeListingId);

          if (data && Array.isArray(data.messages)) {
            // ChatDTO shape: { messages, blockedBy, (optional) isBlocked }
            setMessages(data.messages);

            const serverBlockedBy = data.blockedBy || null;
            // treat as blocked whenever there is a blockedBy,
            // even if data.isBlocked is missing
            const serverIsBlocked =
              typeof data.isBlocked === 'boolean'
                ? !!data.isBlocked
                : !!serverBlockedBy;

            setBlockMap((prev) => ({
              ...prev,
              [key]: { isBlocked: serverIsBlocked, blockedBy: serverBlockedBy },
            }));
            setIsBlocked(serverIsBlocked);
            setBlockedBy(serverBlockedBy);
          } else if (Array.isArray(data)) {
            // legacy: backend returns only messages array
            setMessages(data);
            setBlockMap((prev) => ({
              ...prev,
              [key]: prev[key] || { isBlocked: false, blockedBy: null },
            }));
          } else {
            console.error('Unexpected chat data:', data);
          }
        })
        .catch((err) => console.error('Error loading chat:', err));
    };

    fetchChat();
    const interval = setInterval(fetchChat, 3000);
    return () => clearInterval(interval);
  }, [myId, activeChatUser, activeListingId]);

  /* ==================== AUTO-SET LISTING FROM MESSAGES ==================== */
  useEffect(() => {
    if (activeListingId) return;
    const msgWithListing = messages.find((m) => m.listingId);
    if (msgWithListing) {
      setActiveListingId(msgWithListing.listingId);
    }
  }, [messages, activeListingId]);

  /* ==================== LOAD ACTIVE LISTING DETAILS ==================== */
  useEffect(() => {
    if (!activeListingId) {
      setActiveListing(null);
      return;
    }

    fetch(`http://localhost:8080/api/listings/${activeListingId}`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load listing');
        return res.json();
      })
      .then((data) => setActiveListing(data))
      .catch((err) => {
        console.error('Error loading listing:', err);
        setActiveListing(null);
      });
  }, [activeListingId]);

  /* ==================== LOAD HEADER NAME (FIRST LAST (ID)) ==================== */
  useEffect(() => {
    if (!activeChatUser) {
      setActiveHeaderName('');
      return;
    }

    fetch(`http://localhost:8080/api/students/${encodeURIComponent(activeChatUser)}`)
      .then((res) => {
        if (!res.ok) throw new Error('Student not found');
        return res.json();
      })
      .then((student) => {
        const first = student.firstName || '';
        const last = student.lastName || '';
        const id = student.studentNumber || activeChatUser;
        const full = `${first} ${last}`.trim();
        if (full) {
          setActiveHeaderName(`${full} (${id})`);
        } else {
          setActiveHeaderName(`(${id})`);
        }
      })
      .catch(() => {
        setActiveHeaderName('');
      });
  }, [activeChatUser]);

  /* ==================== SCROLL TO BOTTOM ==================== */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  /* ==================== SEND MESSAGE ==================== */
  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeChatUser) return;

    if (isBlocked) {
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
        setNewMessage('');
        const savedMsg = await res.json();
        setMessages((prev) => [...prev, savedMsg]);
      } else {
        const text = await res.text();
        const key = getConversationKey(myId, activeChatUser, activeListingId);

        if (text.includes('You blocked this conversation')) {
          setIsBlocked(true);
          setBlockedBy(myId);
          setBlockMap((prev) => ({
            ...prev,
            [key]: { isBlocked: true, blockedBy: myId },
          }));
        } else if (text.includes("You can't reply to this conversation")) {
          setIsBlocked(true);
          setBlockedBy(activeChatUser);
          setBlockMap((prev) => ({
            ...prev,
            [key]: { isBlocked: true, blockedBy: activeChatUser },
          }));
        } else if (text.includes('blocked')) {
          setIsBlocked(true);
          setBlockMap((prev) => ({
            ...prev,
            [key]: { isBlocked: true, blockedBy: blockedBy || null },
          }));
        } else {
          console.error('Send failed:', text);
        }
      }
    } catch (err) {
      console.error('Failed to send:', err);
    }
  };

  /* ==================== DELETE CHAT (ONLY THIS CONVO) ==================== */
  const handleDeleteChat = async () => {
    try {
      let url = `http://localhost:8080/api/messages/${myId}/${activeChatUser}`;
      if (activeListingId) {
        url += `?listingId=${encodeURIComponent(activeListingId)}`;
      }

      const res = await fetch(url, {
        method: 'DELETE',
      });

      if (res.ok) {
        const convKey = getConversationKey(myId, activeChatUser, activeListingId);

        // remove only this specific conversation from sidebar
        setInbox((prev) =>
          prev.filter((item) => {
            const sameUser = item.otherUserId === activeChatUser;
            const bothGeneral =
              !activeListingId &&
              (item.listingId === null || item.listingId === undefined);
            const sameListing =
              activeListingId &&
              item.listingId !== null &&
              String(item.listingId) === String(activeListingId);

            const isSameConversation = sameUser && (bothGeneral || sameListing);
            return !isSameConversation;
          }),
        );

        // clear messages & active convo
        setMessages([]);
        setActiveChatUser(null);
        setActiveListingId(null);
        setActiveListing(null);
        setIsBlocked(false);
        setBlockedBy(null);
        setShowOptions(false);

        // clear block info cache for that conversation
        setBlockMap((prev) => {
          const { [convKey]: _, ...rest } = prev;
          return rest;
        });
      } else {
        console.error('Failed to delete chat.');
      }
    } catch (e) {
      console.error('Failed to delete chat.', e);
    }
  };

  /* ==================== BLOCK / UNBLOCK ==================== */
  const handleBlockUser = async () => {
    try {
      const res = await fetch(
        `http://localhost:8080/api/messages/block?blockerId=${encodeURIComponent(
          myId,
        )}&blockedId=${encodeURIComponent(activeChatUser)}`,
        { method: 'POST' },
      );

      if (res.ok) {
        const key = getConversationKey(myId, activeChatUser, activeListingId);
        setIsBlocked(true);
        setBlockedBy(myId);
        setBlockMap((prev) => ({
          ...prev,
          [key]: { isBlocked: true, blockedBy: myId },
        }));
      } else {
        console.error('Failed to block user');
      }
    } catch (err) {
      console.error('Error blocking user:', err);
    }
  };

  const handleUnblockUser = async () => {
    try {
      const res = await fetch(
        `http://localhost:8080/api/messages/unblock?blockerId=${encodeURIComponent(
          myId,
        )}&blockedId=${encodeURIComponent(activeChatUser)}`,
        { method: 'POST' },
      );

      if (res.ok) {
        const key = getConversationKey(myId, activeChatUser, activeListingId);
        setIsBlocked(false);
        setBlockedBy(null);
        setBlockMap((prev) => ({
          ...prev,
          [key]: { isBlocked: false, blockedBy: null },
        }));
      } else {
        console.error('Failed to unblock user');
      }
    } catch (err) {
      console.error('Error unblocking user:', err);
    }
  };

  /* ====== Mark as Sold (core, no confirm here) ====== */
  const handleMarkAsSoldCore = async () => {
    if (!activeListing || !activeListingId || !activeChatUser) return;

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
        console.error('Mark as sold (messages) failed:', res.status, text);
        return;
      }

      await res.json();
      setActiveListing((prev) => (prev ? { ...prev, status: 'SOLD' } : prev));
    } catch (err) {
      console.error('Could not mark as sold.', err);
    } finally {
      setIsMarkingSold(false);
    }
  };

  /* ====== confirmation modal helpers ====== */
  const openConfirm = (type) => {
    if (!activeChatUser && type !== 'markSold') return;
    setConfirmState({ open: true, type });
  };

  const closeConfirm = () => {
    setConfirmState({ open: false, type: null });
  };

  const handleConfirmAction = () => {
    if (confirmState.type === 'delete') {
      handleDeleteChat();
    } else if (confirmState.type === 'block') {
      handleBlockUser();
    } else if (confirmState.type === 'unblock') {
      handleUnblockUser();
    } else if (confirmState.type === 'markSold') {
      handleMarkAsSoldCore();
    }
    closeConfirm();
  };

  const getConfirmTitle = () => {
    if (confirmState.type === 'delete') return 'Delete Conversation';
    if (confirmState.type === 'block') return 'Block User';
    if (confirmState.type === 'unblock') return 'Unblock User';
    if (confirmState.type === 'markSold') return 'Mark as Sold';
    return '';
  };

  const getConfirmMessage = () => {
    if (confirmState.type === 'delete') {
      return 'Are you sure you want to delete this chat on your side only? This cannot be undone.';
    }
    if (confirmState.type === 'block') {
      return 'Block this user? You will both be unable to chat with each other.';
    }
    if (confirmState.type === 'unblock') {
      return 'Are you sure you want to unblock this user and allow messages again?';
    }
    if (confirmState.type === 'markSold') {
      return `Mark "${activeListing?.name || 'this item'}" as SOLD to this buyer? This will create a completed transaction.`;
    }
    return '';
  };

  /* ==================== SOLD BUTTON LOGIC ==================== */
  const isSeller =
    activeListing &&
    activeListing.seller &&
    myId &&
    activeListing.seller.toString().trim() === myId.toString().trim();

  const isAlreadySold =
    activeListing &&
    activeListing.status &&
    activeListing.status.toUpperCase() === 'SOLD';

  const canMarkAsSold =
    isSeller && !isAlreadySold && !!activeChatUser && !!activeListingId;

  if (!myId) return <div className="chat-container">Please log in to view messages.</div>;

  const defaultHeader =
    inbox.find((item) => item.otherUserId === activeChatUser)?.otherUserName ||
    formatIdentifierAsName(activeChatUser);

  const activeChatDisplayName = activeHeaderName || defaultHeader;

  const iAmBlocker = isBlocked && blockedBy === myId;

  return (
    <>
      <div className="chat-container">
        {/* ==================== SIDEBAR ==================== */}
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
              .filter((item) => {
                const term = searchTerm.toLowerCase();
                return (
                  (item.listingName && item.listingName.toLowerCase().includes(term)) ||
                  (item.otherUserName && item.otherUserName.toLowerCase().includes(term)) ||
                  (item.otherUserId && item.otherUserId.toLowerCase().includes(term)) ||
                  (item.lastMessage && item.lastMessage.toLowerCase().includes(term))
                );
              })
              .map((item, idx) => {
                const isActive =
                  activeChatUser === item.otherUserId &&
                  ((!activeListingId && !item.listingId) ||
                    String(activeListingId) === String(item.listingId));

                const imageUrl = buildListingImageUrl(item.listingImage);

                return (
                  <div
                    key={`${item.otherUserId}_${item.listingId || 'general'}_${idx}`}
                    className={`conversation-item ${isActive ? 'active' : ''}`}
                    onClick={() => {
                      setActiveChatUser(item.otherUserId);
                      setActiveListingId(item.listingId);
                      setMessages([]);
                      setShowOptions(false);

                      const key = getConversationKey(myId, item.otherUserId, item.listingId);
                      const info = blockMap[key] || { isBlocked: false, blockedBy: null };
                      setIsBlocked(info.isBlocked);
                      setBlockedBy(info.blockedBy);
                    }}
                  >
                    <div className="conv-visual">
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt="item"
                          style={{
                            width: '48px',
                            height: '48px',
                            borderRadius: '8px',
                            objectFit: 'cover',
                          }}
                        />
                      ) : (
                        <div className="avatar-circle">
                          {item.otherUserName
                            ? item.otherUserName.charAt(0).toUpperCase()
                            : item.otherUserId.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>

                    <div className="conv-text">
                      <div className="conv-header-row">
                        <h4 title={item.listingName || item.otherUserName}>
                          {item.listingName || item.otherUserName}
                        </h4>
                        <span className="conv-time">
                          {new Date(item.time).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                      <div
                        style={{
                          fontSize: '0.8rem',
                          color: '#888',
                          marginBottom: '2px',
                        }}
                      >
                        {item.otherUserName}
                      </div>
                      <p className="conv-preview">
                        {item.lastMessage ? item.lastMessage.substring(0, 40) : ''}...
                      </p>
                    </div>
                  </div>
                );
              })}

            {inbox.length === 0 && (
              <p style={{ padding: '20px', color: '#888', textAlign: 'center' }}>
                No conversations yet.
              </p>
            )}
          </div>
        </div>

        {/* ==================== CHAT WINDOW ==================== */}
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
                    onClick={() => openConfirm('markSold')}
                    disabled={isMarkingSold}
                  >
                    {isMarkingSold ? 'Saving...' : 'Mark as Sold'}
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
                      <button
                        onClick={() => openConfirm('delete')}
                        className="dropdown-item"
                      >
                        Delete Chat
                      </button>

                      {!isBlocked && (
                        <button
                          onClick={() => openConfirm('block')}
                          className="dropdown-item danger"
                        >
                          Block User
                        </button>
                      )}

                      {iAmBlocker && (
                        <button
                          onClick={() => openConfirm('unblock')}
                          className="dropdown-item"
                        >
                          Unblock User
                        </button>
                      )}
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

              {/* ==================== INPUT AREA / SYSTEM MESSAGE ==================== */}
              {!isBlocked ? (
                <form className="chat-input-area" onSubmit={handleSend}>
                  <button type="button" className="attach-btn">
                    <Plus size={24} />
                  </button>

                  <textarea
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    rows={1}
                    onInput={(e) => {
                      e.target.style.height = 'auto';
                      e.target.style.height =
                        Math.min(e.target.scrollHeight, 100) + 'px';
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSend(e);
                      }
                    }}
                  />

                  <button
                    type="submit"
                    className="send-btn"
                    disabled={!newMessage.trim()}
                  >
                    Send
                  </button>
                </form>
              ) : iAmBlocker ? (
                <div className="system-message">
                  You blocked this person. You can&apos;t send messages.
                  <br />
                  <button
                    className="unblock-btn"
                    onClick={() => openConfirm('unblock')}
                  >
                    Unblock
                  </button>
                </div>
              ) : (
                <div className="system-message">
                  You can&apos;t reply to this conversation.
                </div>
              )}
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

      {/* ==================== CONFIRMATION MODAL ==================== */}
      {confirmState.open && (
        <div className="mc-modal-backdrop">
          <div className="mc-modal">
            <h3 className="mc-modal-title">{getConfirmTitle()}</h3>
            <p className="mc-modal-message">{getConfirmMessage()}</p>
            <div className="mc-modal-actions">
              <button
                type="button"
                className="mc-btn mc-btn--secondary"
                onClick={closeConfirm}
              >
                Cancel
              </button>
              <button
                type="button"
                className="mc-btn mc-btn--danger"
                onClick={handleConfirmAction}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
