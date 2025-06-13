import React, { useState, useRef, useEffect } from "react";
import "./style.css";

export default function ChatbotForm({ onShowChatbot, chatHistory, setChatHistory }) {
  // useState
  const [messageText, setMessageText] = useState("");
  const [fileData, setFileData] = useState({ data: null, mime_type: null });
  const [isRecording, setIsRecording] = useState(false);
  const [isVisible, setIsVisible] = useState(onShowChatbot);

  // useRef
  const messageInputRef = useRef(null);
  const chatbotToggleButtonRef = useRef(null);
  const chatFormRef = useRef(null);
  const fileInputRef = useRef(null);
  const imgRef = useRef(null);
  const fileUploadWrapperRef = useRef(null);
  const recognitionRef = useRef(null);
  const chatBodyRef = useRef(null);

  //useEffect
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

  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTo({
        top: chatBodyRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [chatHistory]);

  useEffect(() => {
    setIsVisible(onShowChatbot); // chỉ update visibility, không reset state khác
  }, [onShowChatbot]);

  if (isVisible) {
    chatbotToggleButtonRef.current?.classList.add("show-chatbot");
  } else {
    chatbotToggleButtonRef.current?.classList.remove("show-chatbot");
  }

  // Global variables
  const initialInputHeight = messageInputRef.current?.scrollHeight;
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

  // Function handle
  const handleToggleChatbot = () => {
    chatbotToggleButtonRef.current?.classList.toggle("show-chatbot");
  };

  const handleSendMessage = (e) => {
    const text = messageInputRef.current?.value.trim();
    const imgSelected = !!fileInputRef.current?.files[0];
    if (text || imgSelected) {
      handleOutgoingMessage(e);
    }
  };

  const handleChangeMessageInput = (e) => {
    setMessageText(e.target.value);
    // if (messageInputRef.current) {
    messageInputRef.current.style.height = `${initialInputHeight}px`;
    messageInputRef.current.style.height = `${messageInputRef.current?.scrollHeight}px`;
    // }
    // if (chatFormRef.current) {
    chatFormRef.current.style.borderRadius =
      messageInputRef.current?.scrollHeight > initialInputHeight
        ? "15px"
        : "32px";
    // }
  };

  const handleKeyDownMessageInput = (e) => {
    const text = e.target.value.trim();
    const imgSelected = !!fileInputRef.current?.files[0];
    if (e.key === "Enter" && !e.shiftKey && window.innerWidth > 768) {
      if (text || imgSelected) {
        handleOutgoingMessage(e);
      }
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (!file || file.size > maxSize || !file.type.startsWith("image/")) {
      alert("Lỗi: File quá lớn hoặc file không tồn tại");
      handleFileCancel();
      return;
    }

    const reader = new FileReader();
    reader.onload = (ev) => {
      if (imgRef.current) {
        imgRef.current.src = ev.target.result;
      }
      fileUploadWrapperRef.current?.classList.add("file-uploaded");
      const base64String = ev.target.result.split(",")[1];
      setFileData({ data: base64String, mime_type: file.type });
    };
    reader.readAsDataURL(file);
  };

  const handleFileCancel = () => {
    setFileData({ data: null, mime_type: null });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    fileUploadWrapperRef.current?.classList.remove("file-uploaded");
    if (imgRef.current) {
      imgRef.current.src = "#";
    }
  };

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

  const processApiResponse = (status, data) => {
    const responseObject =
      typeof data.answer === "string" ? { answer: data.answer } : data.answer;
    let displayMessage = "";

    if (
      status !== 200 ||
      (responseObject && responseObject.error) ||
      data.error
    ) {
      displayMessage =
        (responseObject && responseObject.error) ||
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

    return displayMessage.replaceAll("*", "").trim();
  };

  const handleOutgoingMessage = (e) => {
    e.preventDefault();

    const text = messageText.trim();
    const imgFileExists = fileData.data !== null;

    if (!text && !imgFileExists) {
      return;
    }

    // Add message to chat history
    const newUserMsg = createMessageObj(
      "user",
      text || "",
      imgFileExists ? fileData : null
    );

    // Add bot placeholder with a unique ID
    const placeholderId = Date.now(); // Tạo một ID duy nhất cho placeholder
    const botPlaceholder = createMessageObj("bot", "", null, "thinking");
    botPlaceholder.id = placeholderId; // Gán ID vào object

    setChatHistory((prev) => [...prev, newUserMsg]);
    setTimeout(() => {
      setChatHistory((prev) => [...prev, botPlaceholder]);
    }, 600);

    // Clear input & file states
    setMessageText("");
    handleFileCancel();

    let requestPromise;

    if (imgFileExists) {
      const formData = new FormData();
      formData.append("image", fileInputRef.current?.files[0]);
      formData.append("question", text || "");

      requestPromise = fetch("/api/AI/upload", {
        method: "POST",
        body: formData,
        credentials: "include",
      });
    } else {
      requestPromise = fetch("/api/AI/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ question: text }),
      });
    }

    // Logic xử lý response chung cho cả 2 trường hợp
    requestPromise
      .then(async (res) => {
        // Dùng async/await để code gọn hơn
        const data = await res.json();
        return { status: res.status, data };
      })
      .then(({ status, data }) => {
        const displayMessage = processApiResponse(status, data);

        // Cập nhật placeholder bằng ID, không dùng index
        setChatHistory((prev) =>
          prev.map((msg) =>
            msg.id === placeholderId
              ? { ...msg, content: displayMessage, status: "normal" }
              : msg
          )
        );
      })
      .catch((err) => {
        console.error("Error in responseFromChatbot:", err);

        // Cập nhật placeholder với thông báo lỗi
        setChatHistory((prev) =>
          prev.map((msg) =>
            msg.id === placeholderId
              ? { ...msg, content: `Lỗi: ${err.message}`, status: "normal" }
              : msg
          )
        );
      });
  };

  return (
    <>
      <div id="chatbot-form" ref={chatbotToggleButtonRef}>
        {/* <button id="chatbot-toggler" onClick={handleToggleChatbot}>
          <span className="material-symbols-rounded">mode_comment</span>
          <span className="material-symbols-rounded">close</span>
        </button> */}

        <div className="chatbot-popup">
          {/* Chatbot Header */}
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
              onClick={handleToggleChatbot}
              className="material-symbols-rounded"
            >
              keyboard_arrow_down
            </button>
          </div>

          {/* Chatbot Body */}
          <div className="chat-body" ref={chatBodyRef}>
            {chatHistory.map((msg) => (
              <React.Fragment key={msg.id}>
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
                  {msg.image && (
                    <img
                      src={`data:${msg.image.mime_type};base64,${msg.image.data}`}
                      className="attachment"
                      alt="attachment"
                    />
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
                      </>
                    )}
                  </div>
                </div>
              </React.Fragment>
            ))}
          </div>

          {/* Chatbot Footer */}
          <div className="chat-footer">
            <form action="#" className="chat-form" ref={chatFormRef}>
              <textarea
                placeholder="Message..."
                name=""
                id=""
                className="message-input"
                ref={messageInputRef}
                value={messageText}
                onChange={(e) => handleChangeMessageInput(e)}
                onKeyDown={(e) => handleKeyDownMessageInput(e)}
                required
              ></textarea>
              <div className="chat-controls">
                <div className="file-upload-wrapper" ref={fileUploadWrapperRef}>
                  <input
                    type="file"
                    accept="images/*"
                    ref={fileInputRef}
                    id="file-input"
                    onChange={(e) => handleFileChange(e)}
                    hidden
                  />
                  <img src="#" ref={imgRef} />
                  <button
                    type="button"
                    id="file-upload"
                    onClick={() => fileInputRef.current?.click()}
                    className="material-symbols-rounded"
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
                  onClick={(e) => handleSendMessage(e)}
                >
                  arrow_upward
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
