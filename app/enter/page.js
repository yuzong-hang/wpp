"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";

export default function EnterdPage() {
  const [inputValue, setInputValue] = useState(""); // 儲存輸入框內容
  const [messages, setMessages] = useState([]); // 儲存對話內容
  const messagesEndRef = useRef(null); // 訊息區域應該在新訊息加入時自動滾動到底部

  // 讓訊息區域自動滾動到底部
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (inputValue.trim() === "") return; // 如果輸入為空，不執行
    
    // 更新前端訊息列表 (用戶發送的訊息)
    setMessages(prevMessages => [
      ...prevMessages,
      { text: inputValue, sender: "user" },
    ]);
    setInputValue(""); // 清空輸入框

    // 將訊息發送到後端 API
    try {
      const response = await fetch("https://your-flask-api.onrender.com/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: inputValue, sender: "user" }),
      });

      const data = await response.json();
      console.log("後端回應:", data);

      // 加入後端回應到訊息列表
      setMessages(prevMessages => [
        ...prevMessages,
        { text: data.reply, sender: "server" },
      ]);
    } catch (error) {
      console.error("發送訊息失敗:", error);
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
            if (e.key === "Enter") handleSend(); // 按 Enter 發送
          }}
          className="p-2 bg-white border rounded-lg shadow flex-grow"
          placeholder="輸入內容"
        />
        <Button onClick={handleSend} className="ml-2">發送</Button>
      </div>
    </div>
  );
}