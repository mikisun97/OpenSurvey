import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  
  // ESLint 설정 - 빌드 시 경고를 에러로 취급하지 않음
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // TypeScript 설정 - 빌드 시 타입 에러 임시 무시 (Vercel 배포용)
  typescript: {
    ignoreBuildErrors: true,
  },
  
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
