'use client';

import { useState } from 'react';
import TinyMCEEditor from '@/components/ui/TinyMCEEditor';

export default function TinyMCETestPage() {
  const [content, setContent] = useState('');

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">TinyMCE 에디터 테스트</h1>
      
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">에디터</h2>
        <TinyMCEEditor
          content={content}
          onChange={setContent}
          placeholder="내용을 입력하세요..."
        />
      </div>
      
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">HTML 출력</h2>
        <div className="border border-gray-300 rounded-md p-4 bg-gray-50">
          <pre className="whitespace-pre-wrap text-sm">{content}</pre>
        </div>
      </div>
      
      <div>
        <h2 className="text-lg font-semibold mb-2">미리보기</h2>
        <div 
          className="border border-gray-300 rounded-md p-4"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>
    </div>
  );
} 