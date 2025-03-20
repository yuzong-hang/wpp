"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function EnterdPage() {
  const [inputValue, setInputValue] = useState(""); // 儲存輸入框內容
  const [messages, setMessages] = useState([]); // 儲存對話內容

  const handleSend = async () => {
    if (inputValue.trim() === "") return; // 如果輸入為空，不執行
    
    // 更新前端訊息列表 (用戶發送的訊息)
    setMessages(prevMessages => [
      ...prevMessages,
      { text: inputValue, sender: "user" },
    ]);
    setInputValue("");
    // 將訊息發送到後端 API
    try {
      const response = await fetch("http://127.0.0.1:5000/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: inputValue, sender: "user" }),
      });

      const data = await response.json();
      console.log("後端回應:", data);

      // 假設後端回應的資料包含服務器的回應訊息，將其加入訊息
      setMessages(prevMessages => [
        ...prevMessages,
        { text: data.reply, sender: "server" },
      ]);
      
      setInputValue(""); // 清空輸入框
    } catch (error) {
      console.error("發送訊息失敗:", error);
    }
  };

  return (
    <div className="h-screen flex flex-col">
      <h1 className="bg-slate-300 p-4 text-2xl font-bold rounded-lg mb-4">
        聯合大學客服
      </h1>

      {/* 顯示訊息區域 */}
      <div className="flex-grow overflow-y-auto p-4 flex flex-col justify-start">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex mb-2 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`p-2 rounded-lg break-words text-left
                ${msg.sender === "user" ? "bg-blue-300 text-white" : "bg-gray-300 text-black"} 
                max-w-[70%]`}
            >
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      {/* 輸入區域 */}
      <div className="p-4 bg-slate-300 rounded-lg shadow">
        {/* 輸入框和按鈕 */}
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSend(); // 按 Enter 執行 handleSend
            }}
            className="p-2 bg-white border rounded-lg shadow flex-grow"
            /*border 添加一個邊框 ,框的顏色默認是 transparent（透明）。w-full 代表 width（寬度）full 表示寬度設定為 100%*/
            placeholder="輸入內容"
          />
          <Button onClick={handleSend}>發送</Button>
        </div>
      </div>
    </div>
  );
}

