'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, Edit, Trash2 } from 'lucide-react';

interface AnnouncementVO {
  id: number;
  category: string;
  title: string;
  content: string;
  isPublic: string;
  isNew: string;
  viewCount: number;
  registDate: string;
  registUser: string;
  updateDate: string;
  updateUser: string;
}

interface AnnouncementTableProps {
  data: AnnouncementVO[];
  onEdit: (announcement: AnnouncementVO) => void;
  onDelete: (id: number) => void;
  onView: (announcement: AnnouncementVO) => void;
  onEditPage?: (announcement: AnnouncementVO) => void;
}

export default function AnnouncementTable({ 
  data, 
  onEdit, 
  onDelete, 
  onView,
  onEditPage
}: AnnouncementTableProps) {
  if (data.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-300 overflow-hidden">
        <div className="px-4 py-8 text-center text-gray-500">
          등록된 공지사항이 없습니다.
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-300 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1000px]">
          <thead className="bg-white border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider whitespace-nowrap">NO</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider whitespace-nowrap">구분</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider whitespace-nowrap">제목</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider whitespace-nowrap">공개</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider whitespace-nowrap">NEW</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider whitespace-nowrap">조회수</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider whitespace-nowrap">등록↑</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider whitespace-nowrap">수정</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider whitespace-nowrap">관리</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((announcement, index) => (
              <tr key={announcement.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">
                  {data.length - index}
                </td>
                <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">
                  {announcement.category}
                </td>
                <td className="px-4 py-3 text-sm text-gray-900">
                  <button 
                    className="text-orange-600 hover:text-orange-800 underline font-medium text-left"
                    onClick={() => onEdit(announcement)}
                  >
                    {announcement.title}
                  </button>
                </td>
                <td className="px-4 py-3 text-sm whitespace-nowrap">
                  <Badge 
                    variant={announcement.isPublic === 'Y' ? 'default' : 'secondary'} 
                    className={announcement.isPublic === 'Y' ? 'bg-green-100 text-green-800 hover:bg-green-100' : 'bg-red-100 text-red-800 hover:bg-red-100'}
                  >
                    {announcement.isPublic === 'Y' ? 'Y' : 'N'}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-sm whitespace-nowrap">
                  <Badge 
                    variant={announcement.isNew === 'Y' ? 'default' : 'secondary'} 
                    className={announcement.isNew === 'Y' ? 'bg-orange-100 text-orange-800 hover:bg-orange-100' : 'bg-gray-100 text-gray-800 hover:bg-gray-100'}
                  >
                    {announcement.isNew === 'Y' ? 'Y' : 'N'}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">
                  {announcement.viewCount}
                </td>
                <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">
                  {announcement.registDate} ({announcement.registUser})
                </td>
                <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">
                  {announcement.updateDate} ({announcement.updateUser})
                </td>
                                            <td className="px-4 py-3 text-sm whitespace-nowrap">
                              <div className="flex space-x-2">
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => onView(announcement)}
                                >
                                  <Eye className="w-4 h-4" />
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => onEdit(announcement)}
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                                {onEditPage && (
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => onEditPage(announcement)}
                                    className="bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100"
                                  >
                                    페이지수정
                                  </Button>
                                )}
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => onDelete(announcement.id)}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 