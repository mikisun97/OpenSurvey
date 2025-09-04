import { 
  Database, 
  FileText, 
  Users, 
  BarChart3,
  Shield,
  Activity,
  TestTube,
  Code,
  MessageSquare
} from 'lucide-react';
import AdminSidebar from './AdminSidebar';

const systemManagementMenus = [
  {
    id: 'system',
    label: '시스템 관리',
    items: [
      // {
      //   id: 'admin-registration',
      //   label: '관리자등록',
      //   href: '/admin/cms/admin-registration',
      //   icon: Users,
      // },
      // {
      //   id: 'access-ip-management',
      //   label: '접근 아이피 관리',
      //   href: '/admin/cms/access-ip-management',
      //   icon: Shield,
      // },
      // {
      //   id: 'visitor-status',
      //   label: '방문자현황',
      //   href: '/admin/cms/visitor-status',
      //   icon: BarChart3,
      // },
      // {
      //   id: 'personal-info-log',
      //   label: '개인정보 열람로그',
      //   href: '/admin/cms/personal-info-log',
      //   icon: Activity,
      // },
      // {
      //   id: 'personal-info-status',
      //   label: '개인정보 열람현황',
      //   href: '/admin/cms/personal-info-status',
      //   icon: BarChart3,
      // },
      {
        id: 'announcements',
        label: '공지사항',
        href: '/admin/cms/board/BBSMSTR_000001',
        icon: FileText,
      },
      {
        id: 'common-code',
        label: '시스템코드',
        href: '/admin/cms/common-code',
        icon: Code,
      },
      {
        id: 'board-master',
        label: '게시판 관리',
        href: '/admin/cms/board-master',
        icon: MessageSquare,
      },
    ],
  },
  // {
  //   id: 'test',
  //   label: '테스트',
  //   items: [
  //     {
  //       id: 'react-quill-test',
  //       label: 'TipTap 에디터 테스트',
  //       href: '/admin/test/react-quill',
  //       icon: TestTube,
  //     },
  //   ],
  // },
];

export default function SystemManagementSidebar() {
  return <AdminSidebar menuGroups={systemManagementMenus} />;
} 