import React, { useState, useEffect, useRef } from "react";
import "./Messages.css";

const mockConversations = [
  {
    id: 1,
    avatarInitial: "R",
    avatarBg: "#a78bfa",
    name: "Lyka Arca",
    time: "2:46 PM",
    message: "Perfect! I'll take it for $275...",
    unread: true,
  },
  {
    id: 2,
    avatarInitial: "L",
    avatarBg: "#facc15",
    name: "Lichael Nuevas",
    time: "1:23 PM",
    message: "Is the handbag authentic?",
    unread: false,
  },
  {
    id: 3,
    avatarInitial: "Q",
    avatarBg: "#f87171",
    name: "Queenee Reyes",
    time: "Yesterday",
    message: "Thanks for the quick shipping!",
    unread: false,
  },
  {
    id: 4,
    avatarInitial: "S",
    avatarBg: "#fb923c",
    name: "Steph Curry",
    time: "Yesterday",
    message: "Thanks for the quick shipping!",
    unread: false,
  },
  {
    id: 5,
    avatarInitial: "S",
    avatarBg: "#34d399",
    name: "Stephany Uy",
    time: "Yesterday",
    message: "Thanks for the quick shipping!",
    unread: false,
  },
  {
    id: 6,
    avatarInitial: "R",
    avatarBg: "#60a5fa",
    name: "Raul Magsaysay",
    time: "Yesterday",
    message: "Thanks for the quick shipping!",
    unread: false,
  },
];

const mockMessages = [
  {
    id: 1,
    isSender: false,
    text: "available?",
    time: "2:36 PM",
  },
  {
    id: 2,
    isSender: true,
    text: "Hello! Yes, it's still available. It's in excellent condition, barely worn. Would you like to see more photos?",
    time: "2:38 PM",
  },
  {
    id: 3,
    isSender: false,
    text: "That would be great! Also, what's the material composition? And would you consider $250?",
    time: "2:42 PM",
  },
  {
    id: 4,
    isSender: true,
    text: "It's 100% genuine leather with cotton lining. The asking price is $299, but I could do $275 for a quick sale.",
    time: "2:45 PM",
  },
  {
    id: 5,
    isSender: false,
    text: "Perfect! I'll take it for $275. How should we proceed with payment and shipping?",
    time: "2:46 PM",
  },
];


const ConversationItem = ({
  avatarInitial,
  avatarBg,
  name,
  time,
  message,
  unread,
  active,
  onClick, 
}) => (
  <div
    className={`conversation-item ${active ? "active" : ""}`}
    onClick={onClick} 
  >
    <div className="convo-avatar" style={{ backgroundColor: avatarBg }}>
      {avatarInitial}
    </div>
    <div className="convo-details">
      <div className="convo-header">
        <span className="convo-name">{name}</span>
        <span className="convo-time">{time}</span>
      </div>
      <div className="convo-message">
        <span>{message}</span>
        {unread && <div className="convo-unread-dot"></div>}
      </div>
    </div>
  </div>
);

const MessageBubble = ({ text, time, isSender }) => (
  <div className={`message-bubble ${isSender ? "sender" : "recipient"}`}>
    <div className="message-text">{text}</div>
    <div className="message-time">{time}</div>
  </div>
);

export default function Messages() {
  const [conversations, setConversations] = useState(mockConversations);
  const [messages, setMessages] = useState(mockMessages);
  const [activeConversationId, setActiveConversationId] = useState(1); 
  const [newMessage, setNewMessage] = useState(""); 
  const chatBodyRef = useRef(null); 

  // --- DATA FETCHING & REAL-TIME (PLACEHOLDERS) ---

  // 1. Fetch all conversations on component load
  useEffect(() => {
    // TODO: Connect to Supabase to fetch conversations
    // const fetchConversations = async () => {
    //   const { data, error } = await supabase.from('conversations')...
    //   if (data) setConversations(data);
    // };
    // fetchConversations();
    console.log("Placeholder: Fetching conversations...");
  }, []);

  // 2. Fetch messages when a new conversation is clicked
  useEffect(() => {
    // This runs when activeConversationId changes
    // TODO: Connect to Supabase to fetch messages for the activeConversationId
    // const fetchMessages = async () => {
    //   const { data, error } = await supabase
    //     .from('messages')
    //     .select('*')
    //     .eq('conversation_id', activeConversationId);
    //   if (data) setMessages(data);
    // };
    // if (activeConversationId) fetchMessages();

    // For now, we just log. In a real app, you'd fetch.
    console.log(
      `Placeholder: Fetching messages for convo ${activeConversationId}...`
    );
    // We will just re-set the mock messages for this demo
    setMessages(mockMessages);
  }, [activeConversationId]);

  // 3. Subscribe to real-time new messages
  useEffect(() => {
    // TODO: Connect to Supabase real-time subscriptions
    // const subscription = supabase
    //   .channel('public:messages')
    //   .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, (payload) => {
    //     // Only add message if it belongs to the active chat
    //     if (payload.new.conversation_id === activeConversationId) {
    //       setMessages((currentMessages) => [...currentMessages, payload.new]);
    //     }
    //   })
    //   .subscribe();
    //
    // return () => {
    //   supabase.removeChannel(subscription);
    // };
    console.log("Placeholder: Subscribed to real-time messages.");
  }, [activeConversationId]);

  // --- AUTO-SCROLL ---
  // Scrolls to the bottom of the chat body when new messages appear
  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [messages]);

  // --- EVENT HANDLERS ---

  // Sets the active conversation
  const handleSelectConversation = (id) => {
    setActiveConversationId(id);
    // In a real app, the useEffect hook above would then fetch the new messages
  };

  // Sends a new message
  const handleSendMessage = (e) => {
    e.preventDefault(); // Prevent form from refreshing the page
    const trimmedMessage = newMessage.trim();

    if (trimmedMessage === "") return; // Don't send empty messages

    console.log(`Placeholder: Sending message: "${trimmedMessage}"`);

    // --- This is what the component does *without* Supabase ---
    // It clears the input and adds the message to the *local* state
    // To make it "feel" real for now, we can add it to our state
    const optimisticNewMessage = {
      id: messages.length + 1,
      isSender: true, // We are always the sender
      text: trimmedMessage,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    setMessages([...messages, optimisticNewMessage]);
    setNewMessage(""); // Clear the input box

    // --- This is what you'll do *with* Supabase ---
    // TODO: Connect to Supabase to insert the new message
    // const { error } = await supabase.from('messages').insert([
    //   {
    //     conversation_id: activeConversationId,
    //     sender_id: 'your-user-id', // Get this from Supabase auth
    //     text: trimmedMessage,
    //   },
    // ]);
    // if (error) console.error('Error sending message:', error);
    // else setNewMessage(''); // Clear input on successful send
    // (You wouldn't need the local `setMessages` line above if using real-time)
  };

  // Find the currently active conversation details to display in the header
  const activeConversation = conversations.find(
    (convo) => convo.id === activeConversationId
  ) || { name: "Select a chat", avatarInitial: "?" };

  return (
    <div className="messages-page">
      {/* =========================================
            LEFT SIDEBAR: CONVERSATION LIST
      ========================================= */}
      <aside className="messages-sidebar">
        <div className="sidebar-search">
          <div className="sidebar-search-bar">
            <span>🔍</span>
            <input type="text" placeholder="Search conversations..." />
          </div>
        </div>

        <div className="conversation-list">
          {/* Render conversations from state */}
          {conversations.map((convo) => (
            <ConversationItem
              key={convo.id}
              {...convo}
              active={convo.id === activeConversationId}
              onClick={() => handleSelectConversation(convo.id)}
            />
          ))}
        </div>
      </aside>

      {/* =========================================
            RIGHT SIDE: CHAT AREA
      ========================================= */}
      <section className="chat-area">
        {/* Chat Header */}
        <header className="chat-header">
          <div className="chat-user-info">
            <div
              className="chat-user-avatar"
              style={{
                backgroundColor: activeConversation.avatarBg,
                color: "white",
              }}
            >
              {activeConversation.avatarInitial}
            </div>
            <div className="chat-user-details">
              <span className="chat-user-name">
                {activeConversation.name}
              </span>
              <span className="chat-user-status">Active 5 minutes ago</span>
            </div>
          </div>
          <div className="chat-actions">
            <button className="purchase-offer-btn">Purchase Offer</button>
            <span className="chat-icon-btn">📞</span>
            <span className="chat-icon-btn">⋮</span>
          </div>
        </header>

        {/* Chat Body */}
        <div className="chat-body" ref={chatBodyRef}>
          {/* Render messages from state */}
          {messages.map((msg) => (
            <MessageBubble key={msg.id} {...msg} />
          ))}
        </div>

        {/* Chat Input - Changed to a <form> for better accessibility */}
        <form className="chat-input-area" onSubmit={handleSendMessage}>
          <span className="chat-icon-btn">📎</span>
          <textarea
            className="chat-input"
            placeholder="Write a message..."
            rows="1"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => {
              // Optional: Send on Enter, new line on Shift+Enter
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage(e);
              }
            }}
          ></textarea>
          <button type="submit" className="send-button">
            <span>➢</span>
          </button>
        </form>
      </section>
    </div>
  );
}