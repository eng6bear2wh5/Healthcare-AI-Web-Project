import React, { useState, useEffect, useRef } from "react";
import "./style.css";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";


const Chatbot = () => {
  // Refs for DOM elements
  const messageInputRef = useRef(null);
  const chatBodyRef = useRef(null);
  const fileInputRef = useRef(null);

  // State
  const [messages, setMessages] = useState([
    {
      id: Date.now(),
      type: "bot",
      content: "Hey there 👋\nHow can I help you today?",
      image: null,
      status: "normal", // "thinking" or "normal"
    },
  ]);
  const [messageText, setMessageText] = useState("");
  const [fileData, setFileData] = useState({ data: null, mime_type: null });
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showChatbot, setShowChatbot] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef(null);
  const [sessionUserId, setSessionUserId] = useState("");

  // Generate or retrieve session user ID
  useEffect(() => {
    let userId = sessionStorage.getItem("chatbotUserId");
    if (!userId) {
      userId =
        "session_" +
        Date.now() +
        "_" +
        Math.random().toString(36).substring(2, 10);
      sessionStorage.setItem("chatbotUserId", userId);
      console.log("Generated new session UserId:", userId);
    }
    setSessionUserId(userId);
  }, []);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTo({
        top: chatBodyRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.warn("Speech Recognition API not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.lang = "vi-VN";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      console.log("Voice recognition service has started.");
      setIsRecording(true);
    };

    recognition.onresult = (event) => {
      const transcript =
        event.results[event.results.length - 1][0].transcript.trim();
      console.log("Transcript: ", transcript);
      setMessageText((prev) => (prev ? prev + " " + transcript : transcript));
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      let userMessage = `Speech recognition error: ${event.error}.`;
      if (
        event.error === "not-allowed" ||
        event.error === "service-not-allowed"
      ) {
        userMessage =
          "Microphone access was denied. Please allow microphone access in your browser settings to use voice input.";
      } else if (event.error === "no-speech") {
        userMessage = "No speech was detected. Please try speaking again.";
      } else if (event.error === "network") {
        userMessage =
          "A network error occurred during speech recognition. Please check your connection.";
      } else if (event.error === "audio-capture") {
        userMessage =
          "Failed to capture audio. Please ensure your microphone is working correctly.";
      }
      alert(userMessage);
      setIsRecording(false);
    };

    recognition.onend = () => {
      console.log("Speech recognition service has ended.");
      setIsRecording(false);
    };

    recognitionRef.current = recognition;
    return () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      console.log("Cleaned up SpeechRecognition on unmount");
    }
  };
  }, []);

  // Toggle chat widget visibility by adding/removing class on body
  useEffect(() => {
    if (showChatbot) {
      document.body.classList.add("show-chatbot");
    } else {
      document.body.classList.remove("show-chatbot");
    }
  }, [showChatbot]);

  // Handle voice button click
  const handleVoiceClick = () => {
    if (!recognitionRef.current) return;
    if (!isRecording) {
      try {
        recognitionRef.current.start();
      } catch (error) {
        console.error("Error starting recognition:", error);
        setIsRecording(false);
      }
    } else {
      recognitionRef.current.stop();
    }
  };

  // Handle file selection & preview
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) {
      setFileData({ data: null, mime_type: null });
      return;
    }
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      alert("File quá lớn. Vui lòng chọn file nhỏ hơn 5MB.");
      fileInputRef.current.value = "";
      setFileData({ data: null, mime_type: null });
      return;
    }
    if (!file.type.startsWith("image/")) {
      alert("Vui lòng chỉ chọn file ảnh.");
      fileInputRef.current.value = "";
      setFileData({ data: null, mime_type: null });
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      const base64String = ev.target.result.split(",")[1];
      setFileData({ data: base64String, mime_type: file.type });
    };
    reader.readAsDataURL(file);
  };

  // Cancel selected file
  const handleFileCancel = () => {
    setFileData({ data: null, mime_type: null });
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Handle selecting emoji
  const handleEmojiSelect = (emoji) => {
    const nativeEmoji = emoji.native;
    const input = messageInputRef.current;
    if (!input) return;
    const { selectionStart: start, selectionEnd: end } = input;
    const newText =
      messageText.slice(0, start) + nativeEmoji + messageText.slice(end);
    setMessageText(newText);
    setTimeout(() => {
      input.focus();
      input.setSelectionRange(
        start + nativeEmoji.length,
        start + nativeEmoji.length
      );
    }, 0);
  };

  // Utility to create a new message object
  const createMessageObj = (
    type,
    content,
    image = null,
    status = "normal"
  ) => ({
    id: Date.now() + Math.random(),
    type,
    content,
    image,
    status,
  });

  // Send message handler
  const handleSendMessage = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    const text = messageText.trim();
    console.log(text);
    const imgFileExists = fileData.data !== null;

    if (!text && !imgFileExists) {
      return;
    }

    // Add user message
    const newUserMsg = createMessageObj(
      "user",
      text || "",
      imgFileExists ? fileData : null
    );
    setMessages((prev) => [...prev, newUserMsg]);

    // Clear input & file states
    setMessageText("");
    setFileData({ data: null, mime_type: null });
    if (fileInputRef.current) fileInputRef.current.value = "";

    // Add bot placeholder
    const botPlaceholder = createMessageObj("bot", "", null, "thinking");
    setMessages((prev) => [...prev, botPlaceholder]);

    // Prepare payload
    const userIdToSend = sessionUserId;
    const sendIndex = messages.length + 1; // index of the placeholder in the new array

    setTimeout(() => {
      if (imgFileExists) {
        const formData = new FormData();
        formData.append("image", fileInputRef.current.files[0]);
        formData.append("question", text || "");
        formData.append("userId", userIdToSend);

        fetch("/api/AI/upload", {
          method: "POST",
          body: formData,
          credentials: "include"
        })
          .then((res) =>
            res.json().then((data) => ({ status: res.status, data }))
          )
          .then(({ status, data }) => {
            setMessages((prev) => {
              const updated = [...prev];
              // const responseObject = data.answer;
              const responseObject = typeof data.answer === "string" ? { answer: data.answer } : data.answer;
              let displayMessage = "";

              if (status !== 200 || responseObject.error) {
                displayMessage =
                  responseObject.error ||
                  data.error ||
                  `Server responded with status ${status}`;
              } else if (typeof responseObject.answer === "string") {
                displayMessage = responseObject.answer;
              } else if (responseObject.info) {
                displayMessage = responseObject.info;
              } else {
                const actualInfoString = responseObject.answer || "";
                const keywordsArray = responseObject.keywords || [];
                displayMessage = `Kết quả phân tích:\nThông tin: ${actualInfoString}\nTừ khóa: ${
                  keywordsArray.length > 0
                    ? keywordsArray.join(", ")
                    : "Không có từ khóa."
                }`;
              }
              updated[sendIndex] = {
                ...updated[sendIndex],
                content: displayMessage.replaceAll("*", "").trim(),
                status: "normal",
              };
              return updated;
            });
          })
          .catch((err) => {
            console.error("Error in responseFromChatbot:", err);
            setMessages((prev) => {
              const updated = [...prev];
              updated[sendIndex] = {
                ...updated[sendIndex],
                content: `Lỗi: ${err.message}`,
                status: "normal",
              };
              return updated;
            });
          });
      } else {
        fetch("/api/AI/ask", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ question: text, userId: userIdToSend }),
        })
          .then((res) =>
            res.json().then((data) => ({ status: res.status, data }))
          )
          .then(({ status, data }) => {
            console.log(data)
            setMessages((prev) => {
              const updated = [...prev];
              // const responseObject = data.answer;
              const responseObject = typeof data.answer === "string" ? { answer: data.answer } : data.answer;
              let displayMessage = "";

              if (status !== 200 || responseObject.error) {
                displayMessage =
                  responseObject.error ||
                  data.error ||
                  `Server responded with status ${status}`;
              } else if (typeof responseObject.answer === "string") {
                displayMessage = responseObject.answer;
              } else if (responseObject.info) {
                displayMessage = responseObject.info;
              } else {
                const actualInfoString = responseObject.answer || "";
                const keywordsArray = responseObject.keywords || [];
                displayMessage = `Kết quả phân tích:\nThông tin: ${actualInfoString}\nTừ khóa: ${
                  keywordsArray.length > 0
                    ? keywordsArray.join(", ")
                    : "Không có từ khóa."
                }`;
              }
              updated[sendIndex] = {
                ...updated[sendIndex],
                content: displayMessage.replaceAll("*", "").trim(),
                status: "normal",
              };
              return updated;
            });
          })
          .catch((err) => {
            console.error("Error in responseFromChatbot:", err);
            setMessages((prev) => {
              const updated = [...prev];
              updated[sendIndex] = {
                ...updated[sendIndex],
                content: `Lỗi: ${err.message}`,
                status: "normal",
              };
              return updated;
            });
          });
      }
    }, 600);
  };

  // Handle Enter key to send (but allow shift+Enter for newline)
  const handleKeyDown = (e) => {
    const text = e.target.value.trim();
    const imgSelected = fileData.data !== null;
    if (e.key === "Enter" && !e.shiftKey && window.innerWidth > 768) {
      e.preventDefault();
      if (text || imgSelected) {
        handleSendMessage(e);
      }
    }
  };

  return (
    <>
      {/* Chatbot Toggler Button */}
      {/* <button
        id="chatbot-toggler"
        onClick={() => setShowChatbot((prev) => !prev)}
      >
        <span className="material-symbols-rounded">mode_comment</span>
        <span className="material-symbols-rounded">close</span>
      </button> */}

      {/* Chatbot Popup */}
      <div className="chatbot-popup">
        {/* Chat Header */}
        <div className="chat-header">
          <div className="header-info">
            <svg
              className="chatbot-logo"
              xmlns="http://www.w3.org/2000/svg"
              width="50"
              height="50"
              viewBox="0 0 1024 1024"
            >
              <path d="M738.3 287.6H285.7c-59 0-106.8 47.8-106.8 106.8v303.1c0 59 47.8 106.8 106.8 106.8h81.5v111.1c0 .7.8 1.1 1.4.7l166.9-110.6 41.8-.8h117.4l43.6-.4c59 0 106.8-47.8 106.8-106.8V394.5c0-59-47.8-106.9-106.8-106.9zM351.7 448.2c0-29.5 23.9-53.5 53.5-53.5s53.5 23.9 53.5 53.5-23.9 53.5-53.5 53.5-53.5-23.9-53.5-53.5zm157.9 267.1c-67.8 0-123.8-47.5-132.3-109h264.6c-8.6 61.5-64.5 109-132.3 109zm110-213.7c-29.5 0-53.5-23.9-53.5-53.5s23.9-53.5 53.5-53.5 53.5 23.9 53.5 53.5-23.9 53.5-53.5 53.5zM867.2 644.5V453.1h26.5c19.4 0 35.1 15.7 35.1 35.1v121.1c0 19.4-15.7 35.1-35.1 35.1h-26.5zM95.2 609.4V488.2c0-19.4 15.7-35.1 35.1-35.1h26.5v191.3h-26.5c-19.4 0-35.1-15.7-35.1-35.1zM561.5 149.6c0 23.4-15.6 43.3-36.9 49.7v44.9h-30v-44.9c-21.4-6.5-36.9-26.3-36.9-49.7 0-28.6 23.3-51.9 51.9-51.9s51.9 23.3 51.9 51.9z"></path>
            </svg>
            <h2 className="logo-text">Chatbot</h2>
          </div>
          <button
            id="close-chatbot"
            className="material-symbols-rounded"
            onClick={() => setShowChatbot(false)}
          >
            keyboard_arrow_down
          </button>
        </div>

        {/* Chat Body */}
        <div className="chat-body" ref={chatBodyRef}>
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`message ${msg.type}-message${
                msg.status === "thinking" ? " thinking" : ""
              }`}
            >
              {msg.type === "bot" && (
                <svg
                  className="bot-avatar"
                  xmlns="http://www.w3.org/2000/svg"
                  width="50"
                  height="50"
                  viewBox="0 0 1024 1024"
                >
                  <path d="M738.3 287.6H285.7c-59 0-106.8 47.8-106.8 106.8v303.1c0 59 47.8 106.8 106.8 106.8h81.5v111.1c0 .7.8 1.1 1.4.7l166.9-110.6 41.8-.8h117.4l43.6-.4c59 0 106.8-47.8 106.8-106.8V394.5c0-59-47.8-106.9-106.8-106.9zM351.7 448.2c0-29.5 23.9-53.5 53.5-53.5s53.5 23.9 53.5 53.5-23.9 53.5-53.5 53.5-53.5-23.9-53.5-53.5zm157.9 267.1c-67.8 0-123.8-47.5-132.3-109h264.6c-8.6 61.5-64.5 109-132.3 109zm110-213.7c-29.5 0-53.5-23.9-53.5-53.5s23.9-53.5 53.5-53.5 53.5 23.9 53.5 53.5-23.9 53.5-53.5 53.5zM867.2 644.5V453.1h26.5c19.4 0 35.1 15.7 35.1 35.1v121.1c0 19.4-15.7 35.1-35.1 35.1h-26.5zM95.2 609.4V488.2c0-19.4 15.7-35.1 35.1-35.1h26.5v191.3h-26.5c-19.4 0-35.1-15.7-35.1-35.1zM561.5 149.6c0 23.4-15.6 43.3-36.9 49.7v44.9h-30v-44.9c-21.4-6.5-36.9-26.3-36.9-49.7 0-28.6 23.3-51.9 51.9-51.9s51.9 23.3 51.9 51.9z"></path>
                </svg>
              )}
              <div className="message-text">
                {msg.status === "thinking" ? (
                  <div className="thinking-indicator">
                    <div className="dot"></div>
                    <div className="dot"></div>
                    <div className="dot"></div>
                  </div>
                ) : (
                  <>
                    {msg.content.split("\n").map((line, idx) => (
                      <React.Fragment key={idx}>
                        {line}
                        <br />
                      </React.Fragment>
                    ))}
                    {msg.image && (
                      <img
                        src={`data:${msg.image.mime_type};base64,${msg.image.data}`}
                        className="attachment"
                        alt="attachment"
                      />
                    )}
                  </>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Chat Footer */}
        <div className="chat-footer">
          <form className="chat-form" onSubmit={handleSendMessage}>
            <textarea
              placeholder="Message..."
              className="message-input"
              ref={messageInputRef}
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              onKeyDown={handleKeyDown}
              style={{ height: "auto", resize: "none" }}
            ></textarea>
            <div className="chat-controls">
              {/* <button
                type="button"
                id="emoji-picker"
                className="material-symbols-outlined"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowEmojiPicker((prev) => !prev);
                }}
              >
                sentiment_satisfied
              </button> */}

              {showEmojiPicker && (
                <div
                  style={{
                    position: "absolute",
                    bottom: "60px",
                    right: "20px",
                    zIndex: 1000,
                  }}
                >
                  <Picker
                    data={data}
                    onEmojiSelect={handleEmojiSelect}
                    previewPosition="none"
                    theme="light" // hoặc "dark"
                    locale="vi"
                  />
                </div>
              )}

              <div className="file-upload-wrapper">
                <input
                  type="file"
                  accept="images/*"
                  ref={fileInputRef}
                  hidden
                  onChange={handleFileChange}
                />
                {fileData.data && (
                  <img
                    src={`data:${fileData.mime_type};base64,${fileData.data}`}
                    alt="preview"
                    style={{
                      width: "24px",
                      height: "24px",
                      marginRight: "8px",
                    }}
                  />
                )}
                <button
                  type="button"
                  id="file-upload"
                  className="material-symbols-rounded"
                  onClick={() =>
                    fileInputRef.current && fileInputRef.current.click()
                  }
                >
                  attach_file
                </button>
                <button
                  type="button"
                  id="file-cancel"
                  className="material-symbols-rounded"
                  onClick={handleFileCancel}
                >
                  close
                </button>
              </div>

              {/* Voice Input Button */}
              <button
                type="button"
                id="voice-input-button"
                className={`material-symbols-rounded${
                  isRecording ? " is-recording" : ""
                }`}
                onClick={handleVoiceClick}
              >
                {isRecording ? "settings_voice" : "mic"}
              </button>

              <button
                type="button"
                className="material-symbols-rounded"
                id="send-message"
                onClick={handleSendMessage}
              >
                arrow_upward
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Chatbot;
