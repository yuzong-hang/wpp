const express = require("express");
const next = require("next");

const port = process.env.PORT || 3000;
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  // 解析 JSON 請求
  server.use(express.json());

  // 自定義 API 路由（如果有需要）
  server.post("/submit", (req, res) => {
    const userData = req.body;
    console.log(userData);
    res.status(200).send("數據已接收");
  });

  // 處理 Next.js 所有的請求
  server.all("*", (req, res) => {
    return handle(req, res);
  });

  // 啟動伺服器
  server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
});
