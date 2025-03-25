// app/enter/page.js
"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button"; // 假設 Button 是你自己的組件

const BACKEND_URL = "http://192.168.1.107:8000";  // ⚠️ 這裡改成你的後端 API

export default function EnterdPage() {
  const [inputValue, setInputValue] = useState(""); // 儲存輸入框內容
  const [messages, setMessages] = useState([]); // 儲存對話內容
  const [sessionId, setSessionId] = useState(null); // 存 session ID
  const messagesEndRef = useRef(null); // 訊息區域應該在新訊息加入時自動滾動到底部

  // 讓訊息區域自動滾動到底部
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // 🚀 **首次載入時，向後端請求 session_id**
  useEffect(() => {
    async function fetchSessionId() {
      try {
        const response = await fetch(`${BACKEND_URL}/new_session/`);
        const data = await response.json();
        setSessionId(data.session_id);
      } catch (error) {
        console.error("無法獲取 session_id:", error);
      }
    }
    fetchSessionId();
  }, []);

  const handleSend = async () => {
    if (inputValue.trim() === "") return; // 如果輸入為空，不執行
    if (!sessionId) return alert("尚未獲取 session ID，請稍後再試！");

    // 更新前端訊息列表 (用戶發送的訊息)
    setMessages((prevMessages) => [
      ...prevMessages,
      { text: inputValue, sender: "user" },
    ]);
    setInputValue(""); // 清空輸入框

    try {
      const response = await fetch(`${BACKEND_URL}/chat/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ session_id: sessionId, message: inputValue }), // 傳送 session_id 和訊息
      });
    
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
    
      const data = await response.json();
      console.log("成功回應:", data);
    
      // 加入後端回應
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: data.content, sender: "server" },
      ]);
    } catch (error) {
      console.error("發送訊息失敗:", error.message);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* 標題 */}
      <h1 className="bg-slate-300 p-4 text-2xl font-bold rounded-lg mb-4 text-center shadow-md">
        聯合大學客服
      </h1>

      {/* 訊息顯示區域 */}
      <div className="flex-grow overflow-y-auto p-4 flex flex-col">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex mb-2 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`p-3 rounded-lg break-words text-left
                ${msg.sender === "user" ? "bg-blue-500 text-white" : "bg-gray-300 text-black"} 
                max-w-[80%] sm:max-w-[60%] lg:max-w-[50%] shadow-md`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {/* 讓訊息區域自動滾動到底部 */}
        <div ref={messagesEndRef} />
      </div>

      {/* 輸入區域 */}
      <div className="p-4 bg-slate-300 rounded-lg shadow flex items-center">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleSend(); // 按下 Enter 鍵時觸發 handleSend
            }
          }}
          className="p-2 bg-white border rounded-lg shadow flex-grow"
          placeholder="輸入內容"
        />
        <Button
          onClick={handleSend} // 使用相同的 handleSend 函數
          className="ml-2"
        >
          發送
        </Button>
      </div>
    </div>
  );
}
