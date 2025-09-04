import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  
  // 개발 환경에서 백엔드 API 프록시 설정
  async rewrites() {
    return [
      {
        source: '/api/sym/bbs/:path*',
        destination: 'http://192.168.0.100:8080/api/sym/bbs/:path*',
      },
      {
        source: '/sym/bbs/:path*',
        destination: 'http://192.168.0.100:8080/sym/bbs/:path*',
      },
    ];
  },
};

export default nextConfig;
