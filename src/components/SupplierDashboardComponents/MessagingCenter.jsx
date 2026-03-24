// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import styles from "./MessagingCenter.module.css";
// import { X, Send, Search } from "lucide-react";

// const ITEMS_PER_PAGE = 5;

// const MessagingCenter = () => {
//   const [messages, setMessages] = useState([]);
//   const [showThreadModal, setShowThreadModal] = useState(false);
//   const [currentThread, setCurrentThread] = useState(null);
//   const [replyText, setReplyText] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);
//   const [showUnread, setShowUnread] = useState(false);
//   const [showCompose, setShowCompose] = useState(false);

//   const [composeData, setComposeData] = useState({
//     buyer_id: "",
//     subject: "",
//     message: "",
//   });

//   // ===============================
//   // FETCH MESSAGES
//   // ===============================
//   const fetchMessages = async () => {
//     try {
//       const res = await axios.get(
//         "http://localhost:3000/api/supplier/messages",
//         { withCredentials: true }
//       );
//       setMessages(res.data.messages || []);
//     } catch (err) {
//       console.error("Fetch messages error", err);
//     }
//   };

//   useEffect(() => {
//     fetchMessages();
//   }, []);

//   // ===============================
//   // OPEN THREAD
//   // ===============================
//   const openThread = async (msg) => {
//     try {
//       const res = await axios.get(
//         `http://localhost:3000/api/supplier/messages/${msg.id}`,
//         { withCredentials: true }
//       );
//       setCurrentThread(res.data.message);
//       setShowThreadModal(true);
//       fetchMessages(); // refresh unread
//     } catch (err) {
//       console.error("Open thread error", err);
//     }
//   };

//   // ===============================
//   // SEND REPLY
//   // ===============================
//   const sendReply = async () => {
//     if (!replyText) return;

//     try {
//       await axios.post(
//         "http://localhost:3000/api/supplier/messages",
//         {
//           buyer_id: currentThread.buyer_id,
//           subject: `Re: ${currentThread.subject}`,
//           message: replyText,
//           order_id: currentThread.order_id || null,
//         },
//         { withCredentials: true }
//       );

//       setReplyText("");
//       setShowThreadModal(false);
//       fetchMessages();
//     } catch (err) {
//       console.error("Reply error", err);
//     }
//   };

//   // ===============================
//   // COMPOSE MESSAGE
//   // ===============================
//   const handleSendCompose = async () => {
//     const { buyer_id, subject, message } = composeData;
//     if (!buyer_id || !message) {
//       alert("Buyer ID & message required");
//       return;
//     }

//     try {
//       await axios.post(
//         "http://localhost:3000/api/supplier/messages",
//         composeData,
//         { withCredentials: true }
//       );

//       setComposeData({ buyer_id: "", subject: "", message: "" });
//       setShowCompose(false);
//       fetchMessages();
//     } catch (err) {
//       console.error("Compose error", err);
//     }
//   };

//   // ===============================
//   // FILTER + PAGINATION
//   // ===============================
//   const filteredMessages = showUnread
//     ? messages.filter((m) => !m.is_read && m.sender === "buyer")
//     : messages;

//   const totalPages = Math.ceil(filteredMessages.length / ITEMS_PER_PAGE);
//   const paginatedMessages = filteredMessages.slice(
//     (currentPage - 1) * ITEMS_PER_PAGE,
//     currentPage * ITEMS_PER_PAGE
//   );

//   return (
//     <div className={styles.contentArea}>
//       <div className={styles.card}>
//         {/* HEADER */}
//         <div className={styles.header}>
//           <div>
//             <h2>Messaging Center</h2>
//             <p>Communicate with buyers directly.</p>
//           </div>
//           <button
//             className={styles.composeBtn}
//             onClick={() => setShowCompose(true)}
//           >
//             Compose
//           </button>
//         </div>

//         {/* SEARCH + FILTER */}
//         <div className={styles.searchBox}>
//           <Search size={16} />
//           <input placeholder="Search messages..." />
//           <button
//             onClick={() => setShowUnread(!showUnread)}
//             className={styles.composeBtn}
//           >
//             {showUnread ? "Show All" : "Unread Only"}
//           </button>
//         </div>

//         {/* MESSAGE LIST */}
//         <div className={styles.messagesList}>
//           {paginatedMessages.map((msg) => (
//             <div
//               key={msg.id}
//               className={`${styles.messageCard} ${!msg.is_read ? styles.unread : ""
//                 }`}
//               onClick={() => openThread(msg)}
//             >
//               <div className={styles.messageHeader}>
//                 <span>Buyer #{msg.buyer_id}</span>
//                 {!msg.is_read && <span className={styles.readIcon}>●</span>}
//               </div>
//               <div className={styles.messageSubject}>{msg.subject}</div>
//               <div className={styles.messageBody}>{msg.message}</div>
//             </div>
//           ))}
//         </div>

//         {/* PAGINATION */}
//         <div className={styles.pagination}>
//           <button
//             disabled={currentPage === 1}
//             onClick={() => setCurrentPage((p) => p - 1)}
//             className={styles.composeBtn}
//           >
//             Prev
//           </button>
//           <span>
//             Page {currentPage} / {totalPages || 1}
//           </span>
//           <button
//             disabled={currentPage === totalPages}
//             onClick={() => setCurrentPage((p) => p + 1)}
//             className={styles.composeBtn}
//           >
//             Next
//           </button>
//         </div>
//       </div>

//       {/* THREAD MODAL */}
//       {showThreadModal && currentThread && (
//         <div className={styles.overlay}>
//           <div className={styles.modal}>
//             <div className={styles.modalHeader}>
//               <h3>{currentThread.subject}</h3>
//               <X
//                 className={styles.closeIcon}
//                 onClick={() => setShowThreadModal(false)}
//               />
//             </div>
//             <div className={styles.modalBody}>
//               <div className={styles.msgBubble}>
//                 {currentThread.message}
//               </div>

//               <div className={styles.replyBox}>
//                 <textarea
//                   className={styles.input}
//                   placeholder="Type your reply..."
//                   value={replyText}
//                   onChange={(e) => setReplyText(e.target.value)}
//                 />
//                 <button className={styles.sendBtn} onClick={sendReply}>
//                   <Send size={16} /> Send
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* COMPOSE MODAL */}
//       {showCompose && (
//         <div className={styles.overlay}>
//           <div className={styles.modal}>
//             <div className={styles.modalHeader}>
//               <h3>Compose New Message</h3>
//               <X
//                 className={styles.closeIcon}
//                 onClick={() => setShowCompose(false)}
//               />
//             </div>

//             <div className={styles.modalBody}>
//               <input
//                 className={styles.input}
//                 placeholder="Buyer ID"
//                 value={composeData.buyer_id}
//                 onChange={(e) =>
//                   setComposeData({ ...composeData, buyer_id: e.target.value })
//                 }
//               />

//               <input
//                 className={styles.input}
//                 placeholder="Subject"
//                 value={composeData.subject}
//                 onChange={(e) =>
//                   setComposeData({ ...composeData, subject: e.target.value })
//                 }
//               />

//               <textarea
//                 className={styles.input}
//                 rows={5}
//                 placeholder="Message"
//                 value={composeData.message}
//                 onChange={(e) =>
//                   setComposeData({ ...composeData, message: e.target.value })
//                 }
//               />

//               <button className={styles.sendBtn} onClick={handleSendCompose}>
//                 <Send size={16} /> Send
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default MessagingCenter;
import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./MessagingCenter.module.css";
import { X, Send, Search } from "lucide-react";
import socket from "../../socket"; // ✅ tumne src/socket.js banayi hai

const ITEMS_PER_PAGE = 5;

const MessagingCenter = () => {
  const [messages, setMessages] = useState([]);
  const [showThreadModal, setShowThreadModal] = useState(false);
  const [currentThread, setCurrentThread] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showUnread, setShowUnread] = useState(false);
  const [showCompose, setShowCompose] = useState(false);

  const [composeData, setComposeData] = useState({
    buyer_id: "",
    subject: "",
    message: "",
  });

  // ===============================
  // FETCH MESSAGES (REST)
  // ===============================
  const fetchMessages = async () => {
    try {
      const res = await axios.get(
        "http://localhost:3000/api/supplier/messages",
        { withCredentials: true }
      );
      setMessages(res.data.messages || []);
    } catch (err) {
      console.error("Fetch messages error", err);
    }
  };

  // ===============================
  // SOCKET CONNECT
  // ===============================
  useEffect(() => {
    fetchMessages();

    socket.connect();

    // supplier joins own room (backend auth se id lega)
    socket.emit("join_supplier");

    // real-time incoming message
    socket.on("new_message", (msg) => {
      setMessages((prev) => [msg, ...prev]);
    });

    return () => {
      socket.off("new_message");
      socket.disconnect();
    };
  }, []);

  // ===============================
  // OPEN THREAD
  // ===============================
  const openThread = async (msg) => {
    try {
      const res = await axios.get(
        `http://localhost:3000/api/supplier/messages/${msg.id}`,
        { withCredentials: true }
      );
      setCurrentThread(res.data.message);
      setShowThreadModal(true);
      fetchMessages(); // unread refresh
    } catch (err) {
      console.error("Open thread error", err);
    }
  };

  // ===============================
  // SEND REPLY
  // ===============================
  const sendReply = async () => {
    if (!replyText) return;

    try {
      await axios.post(
        "http://localhost:3000/api/supplier/messages",
        {
          buyer_id: currentThread.buyer_id,
          subject: `Re: ${currentThread.subject}`,
          message: replyText,
          order_id: currentThread.order_id || null,
        },
        { withCredentials: true }
      );

      // ⚡ real-time notify buyer
      socket.emit("supplier_message_sent", {
        buyer_id: currentThread.buyer_id,
      });

      setReplyText("");
      setShowThreadModal(false);
      fetchMessages();
    } catch (err) {
      console.error("Reply error", err);
    }
  };

  // ===============================
  // COMPOSE MESSAGE
  // ===============================
  const handleSendCompose = async () => {
    const { buyer_id, subject, message } = composeData;
    if (!buyer_id || !message) {
      alert("Buyer ID & message required");
      return;
    }

    try {
      await axios.post(
        "http://localhost:3000/api/supplier/messages",
        composeData,
        { withCredentials: true }
      );

      socket.emit("supplier_message_sent", {
        buyer_id,
      });

      setComposeData({ buyer_id: "", subject: "", message: "" });
      setShowCompose(false);
      fetchMessages();
    } catch (err) {
      console.error("Compose error", err);
    }
  };

  // ===============================
  // FILTER + PAGINATION
  // ===============================
  const filteredMessages = showUnread
    ? messages.filter((m) => !m.is_read && m.sender === "buyer")
    : messages;

  const totalPages = Math.ceil(filteredMessages.length / ITEMS_PER_PAGE);
  const paginatedMessages = filteredMessages.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className={styles.contentArea}>
      <div className={styles.card}>
        {/* HEADER */}
        <div className={styles.header}>
          <div>
            <h2>Messaging Center</h2>
            <p>Communicate with buyers directly.</p>
          </div>
          <button
            className={styles.composeBtn}
            onClick={() => setShowCompose(true)}
          >
            Compose
          </button>
        </div>

        {/* SEARCH + FILTER */}
        <div className={styles.searchBox}>
          <Search size={16} />
          <input placeholder="Search messages..." />
          <button
            onClick={() => setShowUnread(!showUnread)}
            className={styles.composeBtn}
          >
            {showUnread ? "Show All" : "Unread Only"}
          </button>
        </div>

        {/* MESSAGE LIST */}
        <div className={styles.messagesList}>
          {paginatedMessages.map((msg) => (
            <div
              key={msg.id}
              className={`${styles.messageCard} ${!msg.is_read ? styles.unread : ""
                }`}
              onClick={() => openThread(msg)}
            >
              <div className={styles.messageHeader}>
                <span>Buyer #{msg.buyer_id}</span>
                {!msg.is_read && <span className={styles.readIcon}>●</span>}
              </div>
              <div className={styles.messageSubject}>{msg.subject}</div>
              <div className={styles.messageBody}>{msg.message}</div>
            </div>
          ))}
        </div>

        {/* PAGINATION */}
        <div className={styles.pagination}>
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
            className={styles.composeBtn}
          >
            Prev
          </button>
          <span>
            Page {currentPage} / {totalPages || 1}
          </span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
            className={styles.composeBtn}
          >
            Next
          </button>
        </div>
      </div>

      {/* THREAD MODAL */}
      {showThreadModal && currentThread && (
        <div className={styles.overlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h3>{currentThread.subject}</h3>
              <X
                className={styles.closeIcon}
                onClick={() => setShowThreadModal(false)}
              />
            </div>
            <div className={styles.modalBody}>
              <div className={styles.msgBubble}>
                {currentThread.message}
              </div>

              <div className={styles.replyBox}>
                <textarea
                  className={styles.input}
                  placeholder="Type your reply..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                />
                <button className={styles.sendBtn} onClick={sendReply}>
                  <Send size={16} /> Send
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* COMPOSE MODAL */}
      {showCompose && (
        <div className={styles.overlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h3>Compose New Message</h3>
              <X
                className={styles.closeIcon}
                onClick={() => setShowCompose(false)}
              />
            </div>

            <div className={styles.modalBody}>
              <input
                className={styles.input}
                placeholder="Buyer ID"
                value={composeData.buyer_id}
                onChange={(e) =>
                  setComposeData({ ...composeData, buyer_id: e.target.value })
                }
              />

              <input
                className={styles.input}
                placeholder="Subject"
                value={composeData.subject}
                onChange={(e) =>
                  setComposeData({ ...composeData, subject: e.target.value })
                }
              />

              <textarea
                className={styles.input}
                rows={5}
                placeholder="Message"
                value={composeData.message}
                onChange={(e) =>
                  setComposeData({ ...composeData, message: e.target.value })
                }
              />

              <button className={styles.sendBtn} onClick={handleSendCompose}>
                <Send size={16} /> Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessagingCenter;
