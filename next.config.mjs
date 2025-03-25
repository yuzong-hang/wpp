/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
      return [
        {
          source: "/api/chat", // 前端請求的路徑
          destination: "http://125.224.96.183:8000/chat", // 轉發到後端 FastAPI
        },
      ];
    },
  };
  
  export default nextConfig;