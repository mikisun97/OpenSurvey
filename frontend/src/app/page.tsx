import { redirect } from 'next/navigation';

export default function HomePage() {
  // 루트 페이지 접속 시 로그인 페이지로 리다이렉트
  redirect('/login');
}
