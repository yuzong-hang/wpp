// pages/api/chat.js
import { cors } from "@/lib/cors";

export default async function handler(req, res) {
  try {
  cors(req, res);

    if (req.method === 'POST') {
      const { message } = req.body;

      if (!message) {
        return res.status(400).json({ error: "No message provided" });
      }

      const reply = `後端回應：${message}`;
      console.log("收到消息:", message); // 顯示收到的訊息
      console.log("回應消息:", reply);

      res.status(200).json({ reply });
    } else {
      res.status(405).json({ error: 'Method Not Allowed' });
    }
  } catch (error) {
    console.error("伺服器錯誤:", error); // 顯示具體錯誤
    res.status(500).json({ error: 'Internal Server Error' });
  }  
}
