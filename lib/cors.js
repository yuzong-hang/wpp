// 在 cors.js 檔案中 (如果有此文件)
export function cors(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*'); // 或是設置具體的來源
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
      res.status(200).end();
      return;
    }
  }
