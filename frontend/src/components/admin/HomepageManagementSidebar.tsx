import { 
  FileText, 
  Image,
  Layout,
  Palette,
  Globe,
  Newspaper
} from 'lucide-react';
import AdminSidebar from './AdminSidebar';

const homepageManagementMenus = [
  {
    id: 'content',
    label: '콘텐츠 관리',
    items: [
      {
        id: 'cardnews',
        label: '카드뉴스',
        href: '/admin/cms/board/BBSMSTR_000005',
        icon: Image,
      },
      {
        id: 'gongjunews',
        label: '공주뉴스',
        href: '/admin/cms/board/BBSMSTR_000006',
        icon: Newspaper,
      },
    ],
  },
  // 향후 확장 가능한 메뉴들
  // {
  //   id: 'design',
  //   label: '디자인 관리',
  //   items: [
  //     {
  //       id: 'banner',
  //       label: '배너 관리',
  //       href: '/admin/cms/banner',
  //       icon: Layout,
  //     },
  //     {
  //       id: 'theme',
  //       label: '테마 설정',
  //       href: '/admin/cms/theme',
  //       icon: Palette,
  //     },
  //   ],
  // },
  // {
  //   id: 'site',
  //   label: '사이트 관리',
  //   items: [
  //     {
  //       id: 'menu',
  //       label: '메뉴 관리',
  //       href: '/admin/cms/menu',
  //       icon: Globe,
  //     },
  //   ],
  // },
];

export default function HomepageManagementSidebar() {
  return <AdminSidebar menuGroups={homepageManagementMenus} />;
}
