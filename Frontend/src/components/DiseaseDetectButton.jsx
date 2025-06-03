import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useMotionValue } from "framer-motion";
import { predictDisease } from "../api/AI_API";
<<<<<<< HEAD
=======
import ChatbotAI from "./ChatbotAI/ChatbotAI";
>>>>>>> a03675c (add elastic remote and AI chatbot)

function DiseaseDetectButton() {
  const [showMenu, setShowMenu] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null); // 1: Nhận diện bệnh, 2: Chat
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [result, setResult] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const dragX = useMotionValue(0);
  const dragY = useMotionValue(0);
  const [constraints, setConstraints] = useState({
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  });
  const [loading, setLoading] = useState(false);

  // Thêm ref cho modal content
  const modalRef = useRef(null);

  useEffect(() => {
    const updateConstraints = () => {
      setConstraints({
        left: 0,
        top: 0,
        right: window.innerWidth - 64,
        bottom: window.innerHeight - 64,
      });
    };
    updateConstraints();
    window.addEventListener("resize", updateConstraints);
    return () => window.removeEventListener("resize", updateConstraints);
  }, []);

  // Đóng modal khi bấm ra ngoài
  useEffect(() => {
    if (!showMenu) return;
    function handleClickOutside(event) {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setShowMenu(false);
        setSelectedOption(null);
        setImage(null);
        setPreview("");
        setResult(null);
        setMessages([]);
        setInput("");
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
    // eslint-disable-next-line
  }, [showMenu]);

<<<<<<< HEAD
=======
  // useEffect(() => {
  //   if (selectedOption === 2) {
  //     setShowMenu(false);
  //   }
  // }, [selectedOption]);

>>>>>>> a03675c (add elastic remote and AI chatbot)
  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      setPreview(URL.createObjectURL(file));
      setResult(null);
    }
  };

  const handleAnalyze = async () => {
    if (!image) return;
    try {
      setLoading(true);
      const result = await predictDisease(image);
      setResult(result);
    } catch (error) {
<<<<<<< HEAD
      setResult({ success: false, error: 'Không thể đọc dữ liệu từ server.' });
=======
      setResult({ success: false, error: "Không thể đọc dữ liệu từ server." });
>>>>>>> a03675c (add elastic remote and AI chatbot)
    } finally {
      setLoading(false);
    }
  };

  const handleSend = () => {
    if (input.trim() !== "") {
      const userMessage = { text: input, sender: "user" };
      setMessages((prev) => [...prev, userMessage]);
      setInput("");

      setTimeout(() => {
        const aiMessage = {
          text: `Bạn vừa nói: "${userMessage.text}"`,
          sender: "bot",
        };
        setMessages((prev) => [...prev, aiMessage]);
      }, 1000);
    }
  };

  // Hàm tắt modal (dùng chung cho X và click ngoài)
  const handleClose = () => {
    setShowMenu(false);
    setSelectedOption(null);
    setImage(null);
    setPreview("");
    setResult(null);
    setMessages([]);
    setInput("");
  };

  return (
    <>
      <AnimatePresence>
        {showMenu && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{ background: "rgba(0,0,0,0.3)" }}
          >
            <motion.div
              ref={modalRef}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="relative bg-white border shadow-2xl rounded-2xl w-[90%] h-[80%] max-w-xl flex flex-col p-6 space-y-4 overflow-auto"
            >
              {/* Nút X */}
              <button
                onClick={handleClose}
                className="absolute top-3 right-3 text-2xl text-gray-400 hover:text-gray-700 focus:outline-none"
                aria-label="Đóng"
                tabIndex={0}
              >
                &times;
              </button>

              {!selectedOption && (
                <div className="flex flex-col gap-4 w-full items-center justify-center flex-1">
                  <button
                    onClick={() => setSelectedOption(1)}
                    className="bg-blue-500 text-white py-3 px-6 rounded-lg hover:bg-blue-600 w-full"
                  >
                    Nhận diện bệnh qua ảnh
                  </button>
                  <button
                    onClick={() => setSelectedOption(2)}
                    className="bg-green-500 text-white py-3 px-6 rounded-lg hover:bg-green-600 w-full"
                  >
                    Chat
                  </button>
                </div>
              )}

              {/* Nhận diện bệnh */}
              {selectedOption === 1 && (
                <div className="flex flex-col gap-4 w-full items-center">
                  <h2 className="text-xl font-bold mb-2">Nhận diện bệnh</h2>

                  <label className="flex flex-col items-center justify-center w-64 h-40 border-2 border-dashed border-gray-400 rounded-lg cursor-pointer hover:border-blue-500">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <svg
                        aria-hidden="true"
                        className="w-10 h-10 mb-3 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M7 16V4m0 0L3 8m4-4l4 4M21 12v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-8m16 0l-4-4m4 4l-4 4"
                        />
                      </svg>
                      <p className="mb-2 text-sm text-gray-500">
                        <span className="font-semibold">Tải ảnh lên</span>
                      </p>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageChange}
                    />
                  </label>

                  {preview && (
                    <img
                      src={preview}
                      alt="Preview"
                      className="w-64 rounded-lg shadow"
                    />
                  )}

                  <button
                    onClick={handleAnalyze}
                    className="mt-4 bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
                  >
                    Phân tích ảnh
                  </button>

                  {loading && <p>Đang phân tích ảnh...</p>}
                  {result && result.success && (
                    <div className="mt-4 text-center">
                      <h3 className="text-lg font-semibold text-green-600">
                        Top 3 bệnh có khả năng cao:
                      </h3>
                      {result.predictions.map((item, idx) => (
                        <div key={idx}>
                          <b>{item.class}</b>: {item.probability.toFixed(2)}%
                        </div>
                      ))}
                    </div>
                  )}

                  {result && !result.success && (
                    <div className="mt-4 text-center text-red-600">
                      Lỗi: {result.error}
                    </div>
                  )}
                </div>
              )}

              {/* Chatbot */}
              {selectedOption === 2 && (
                <div className="flex flex-col flex-1">
<<<<<<< HEAD
                  <div className="p-4 font-bold text-lg border-b">AI Chatbot</div>
=======
                  {/* <div className="p-4 font-bold text-lg border-b">
                    AI Chatbot
                  </div>

>>>>>>> a03675c (add elastic remote and AI chatbot)
                  <div className="flex-1 p-4 overflow-y-auto text-sm space-y-2">
                    {messages.map((msg, index) => (
                      <div
                        key={index}
                        className={`p-2 rounded max-w-[75%] ${
                          msg.sender === "user"
                            ? "bg-blue-100 self-end text-right"
                            : "bg-gray-100 self-start text-left"
                        }`}
                      >
                        {msg.text}
                      </div>
                    ))}
                  </div>
<<<<<<< HEAD
=======

>>>>>>> a03675c (add elastic remote and AI chatbot)
                  <div className="border-t p-2 flex items-center">
                    <input
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSend()}
                      className="flex-1 p-3 border rounded-l-lg outline-none text-sm"
                      placeholder="Nhập tin nhắn..."
                    />
                    <button
                      onClick={handleSend}
                      className="bg-blue-500 text-white px-5 py-3 rounded-r-lg text-sm hover:bg-blue-600"
                    >
                      Gửi
                    </button>
<<<<<<< HEAD
                  </div>
=======
                  </div> */}

                  <ChatbotAI />
>>>>>>> a03675c (add elastic remote and AI chatbot)
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        drag
        dragConstraints={constraints}
        style={{ x: dragX, y: dragY }}
        onClick={() => {
          setShowMenu(!showMenu);
          setSelectedOption(null);
          setImage(null);
          setPreview("");
          setResult(null);
          setMessages([]);
          setInput("");
        }}
        className="fixed bottom-5 right-5 w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg z-50 cursor-pointer"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        💬
      </motion.button>
    </>
  );
}

<<<<<<< HEAD
export default DiseaseDetectButton;
=======
export default DiseaseDetectButton;
>>>>>>> a03675c (add elastic remote and AI chatbot)
