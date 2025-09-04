'use client';

import { useState, useRef, useEffect } from 'react';
import { useEditor, EditorContent, Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import YouTube from '@tiptap/extension-youtube';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { 
  Bold, 
  Italic, 
  Underline, 
  Strikethrough,
  List,
  ListOrdered,
  Link as LinkIcon,
  Image as ImageIcon,
  Youtube,
  Heading1,
  Heading2,
  Heading3,
  Quote,
  Code,
  Undo,
  Redo,
  Maximize2,
  Minimize2
} from 'lucide-react';

// TipTap 에디터 툴바 컴포넌트
function EditorToolbar({ editor, showImageSizeDialog }: { editor: Editor | null; showImageSizeDialog: (imageSrc: string, editor: Editor) => void }) {
  if (!editor) {
    return null;
  }

  const addLink = () => {
    const url = window.prompt('URL을 입력하세요:');
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  const addImage = () => {
    // 파일 입력 요소 생성
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.style.display = 'none';
    
    input.onchange = (event) => {
      const target = event.target as HTMLInputElement;
      const file = target.files?.[0];
      
      if (file) {
        // 파일 크기 검증 (5MB 제한)
        const maxSize = 5 * 1024 * 1024;
        if (file.size > maxSize) {
          toast.error('파일 크기가 너무 큽니다. 5MB 이하의 파일을 선택해주세요.');
          return;
        }
        
        // 파일 타입 검증
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
        if (!allowedTypes.includes(file.type)) {
          toast.error('지원하지 않는 파일 형식입니다. JPG, PNG, GIF, WebP, SVG 파일만 업로드 가능합니다.');
          return;
        }
        
        // 파일을 base64로 변환
        const reader = new FileReader();
        reader.onload = function () {
          if (reader.result && editor) {
            // 이미지 크기 조절 다이얼로그 표시
            showImageSizeDialog(reader.result as string, editor);
          }
        };
        
        reader.onerror = function () {
          toast.error('파일 읽기 오류가 발생했습니다.');
        };
        
        reader.readAsDataURL(file);
      }
    };
    
    // 파일 선택 다이얼로그 열기
    document.body.appendChild(input);
    input.click();
    document.body.removeChild(input);
  };



  const addYouTube = () => {
    const url = window.prompt('YouTube URL을 입력하세요:');
    if (url) {
      // YouTube URL에서 비디오 ID 추출
      const videoId = extractYouTubeId(url);
      if (videoId) {
        editor.chain().focus().setYoutubeVideo({ src: videoId }).run();
      } else {
        toast.error('유효한 YouTube URL을 입력해주세요.');
      }
    }
  };

  return (
    <div className="border-b border-gray-200 p-2 bg-white flex flex-wrap gap-1">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={editor.isActive('bold') ? 'bg-orange-100 text-orange-600' : ''}
      >
        <Bold className="w-4 h-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={editor.isActive('italic') ? 'bg-orange-100 text-orange-600' : ''}
      >
        <Italic className="w-4 h-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={editor.isActive('underline') ? 'bg-orange-100 text-orange-600' : ''}
      >
        <Underline className="w-4 h-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={editor.isActive('strike') ? 'bg-orange-100 text-orange-600' : ''}
      >
        <Strikethrough className="w-4 h-4" />
      </Button>

      <div className="w-px h-6 bg-gray-300 mx-1" />

      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={editor.isActive('heading', { level: 1 }) ? 'bg-orange-100 text-orange-600' : ''}
      >
        <Heading1 className="w-4 h-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={editor.isActive('heading', { level: 2 }) ? 'bg-orange-100 text-orange-600' : ''}
      >
        <Heading2 className="w-4 h-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={editor.isActive('heading', { level: 3 }) ? 'bg-orange-100 text-orange-600' : ''}
      >
        <Heading3 className="w-4 h-4" />
      </Button>

      <div className="w-px h-6 bg-gray-300 mx-1" />

      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={editor.isActive('bulletList') ? 'bg-orange-100 text-orange-600' : ''}
      >
        <List className="w-4 h-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={editor.isActive('orderedList') ? 'bg-orange-100 text-orange-600' : ''}
      >
        <ListOrdered className="w-4 h-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={editor.isActive('blockquote') ? 'bg-orange-100 text-orange-600' : ''}
      >
        <Quote className="w-4 h-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        className={editor.isActive('codeBlock') ? 'bg-orange-100 text-orange-600' : ''}
      >
        <Code className="w-4 h-4" />
      </Button>

      <div className="w-px h-6 bg-gray-300 mx-1" />

      <Button
        variant="ghost"
        size="sm"
        onClick={addLink}
        className={editor.isActive('link') ? 'bg-orange-100 text-orange-600' : ''}
      >
        <LinkIcon className="w-4 h-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={addImage}
        title="이미지 업로드 (크기 조절 가능)"
      >
        <ImageIcon className="w-4 h-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={addYouTube}
      >
        <Youtube className="w-4 h-4" />
      </Button>

      <div className="w-px h-6 bg-gray-300 mx-1" />

      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().undo()}
      >
        <Undo className="w-4 h-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().redo()}
      >
        <Redo className="w-4 h-4" />
      </Button>
    </div>
  );
}

// YouTube URL에서 비디오 ID 추출
function extractYouTubeId(url: string): string | null {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}

export default function TipTapTestPage() {
  const [readOnly, setReadOnly] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-orange-600 underline cursor-pointer',
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'max-w-full h-auto rounded',
        },
        allowBase64: true,
      }),
      YouTube.configure({
        HTMLAttributes: {
          class: 'w-full max-w-full',
        },
      }),
    ],
    content: '',
    editable: !readOnly,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      // 내용이 변경될 때마다 호출
      console.log('내용 변경:', editor.getHTML());
    },
  });

  // 이미지 크기 조절 다이얼로그 함수
  const showImageSizeDialog = (imageSrc: string, editor: Editor) => {
    // 이미지 크기 조절 다이얼로그 생성
    const dialog = document.createElement('div');
    dialog.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;
    `;

    const content = document.createElement('div');
    content.style.cssText = `
      background: white;
      padding: 20px;
      border-radius: 8px;
      min-width: 300px;
      max-width: 500px;
    `;

    content.innerHTML = `
      <h3 style="margin: 0 0 15px 0; font-weight: bold;">이미지 크기 설정</h3>
      <div style="margin-bottom: 15px;">
        <img src="${imageSrc}" style="max-width: 100%; height: auto; border-radius: 4px;" />
      </div>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 15px;">
        <div>
          <label style="display: block; margin-bottom: 5px; font-size: 14px;">너비 (px)</label>
          <input type="number" id="imageWidth" value="300" min="50" max="800" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
        </div>
        <div>
          <label style="display: block; margin-bottom: 5px; font-size: 14px;">높이 (px)</label>
          <input type="number" id="imageHeight" value="200" min="50" max="600" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
        </div>
      </div>
      <div style="display: flex; gap: 10px; margin-bottom: 15px;">
        <button id="btnSmall" style="flex: 1; padding: 8px; background: #f3f4f6; border: 1px solid #ddd; border-radius: 4px; cursor: pointer;">작게 (150px)</button>
        <button id="btnMedium" style="flex: 1; padding: 8px; background: #f3f4f6; border: 1px solid #ddd; border-radius: 4px; cursor: pointer;">보통 (300px)</button>
        <button id="btnLarge" style="flex: 1; padding: 8px; background: #f3f4f6; border: 1px solid #ddd; border-radius: 4px; cursor: pointer;">크게 (500px)</button>
      </div>
      <div style="display: flex; gap: 10px;">
        <button id="btnCancel" style="flex: 1; padding: 10px; background: #f3f4f6; border: 1px solid #ddd; border-radius: 4px; cursor: pointer;">취소</button>
        <button id="btnInsert" style="flex: 1; padding: 10px; background: #f97316; color: white; border: none; border-radius: 4px; cursor: pointer;">삽입</button>
      </div>
    `;

    dialog.appendChild(content);
    document.body.appendChild(dialog);

    // 이벤트 리스너 추가
    const widthInput = content.querySelector('#imageWidth') as HTMLInputElement;
    const heightInput = content.querySelector('#imageHeight') as HTMLInputElement;
    const btnSmall = content.querySelector('#btnSmall') as HTMLButtonElement;
    const btnMedium = content.querySelector('#btnMedium') as HTMLButtonElement;
    const btnLarge = content.querySelector('#btnLarge') as HTMLButtonElement;
    const btnCancel = content.querySelector('#btnCancel') as HTMLButtonElement;
    const btnInsert = content.querySelector('#btnInsert') as HTMLButtonElement;

    // 기본 크기 버튼들
    btnSmall.onclick = () => {
      widthInput.value = '150';
      heightInput.value = '100';
    };

    btnMedium.onclick = () => {
      widthInput.value = '300';
      heightInput.value = '200';
    };

    btnLarge.onclick = () => {
      widthInput.value = '500';
      heightInput.value = '333';
    };

    // 취소
    btnCancel.onclick = () => {
      document.body.removeChild(dialog);
    };

    // 삽입
    btnInsert.onclick = () => {
      const width = parseInt(widthInput.value) || 300;
      const height = parseInt(heightInput.value) || 200;
      
      editor.chain().focus().setImage({ 
        src: imageSrc, 
        width: width, 
        height: height 
      }).run();
      
      toast.success('이미지가 성공적으로 삽입되었습니다.');
      document.body.removeChild(dialog);
    };

    // 다이얼로그 외부 클릭 시 닫기
    dialog.onclick = (e) => {
      if (e.target === dialog) {
        document.body.removeChild(dialog);
      }
    };
  };

  // 이미지 파일 처리 함수
  const handleImageFile = (file: File) => {
    // 파일 크기 검증 (5MB 제한)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error('파일 크기가 너무 큽니다. 5MB 이하의 파일을 선택해주세요.');
      return;
    }
    
    // 파일 타입 검증
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('지원하지 않는 파일 형식입니다. JPG, PNG, GIF, WebP, SVG 파일만 업로드 가능합니다.');
      return;
    }
    
    // 파일을 base64로 변환
    const reader = new FileReader();
    reader.onload = function () {
      if (reader.result && editor) {
        // 이미지 크기 조절 다이얼로그 표시
        showImageSizeDialog(reader.result as string, editor);
      }
    };
    
    reader.onerror = function () {
      toast.error('파일 읽기 오류가 발생했습니다.');
    };
    
    reader.readAsDataURL(file);
  };

  // 드래그 앤 드롭 이벤트 처리
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const files = Array.from(e.dataTransfer.files);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length > 0) {
      handleImageFile(imageFiles[0]);
    } else {
      toast.error('이미지 파일만 업로드 가능합니다.');
    }
  };

  const handleSave = () => {
    if (editor) {
      const content = editor.getHTML();
      toast.success('내용이 저장되었습니다!');
      console.log('저장된 내용:', content);
    }
  };

  const handleClear = () => {
    if (editor) {
      editor.commands.clearContent();
      toast.info('내용이 초기화되었습니다.');
    }
  };

  const handleToggleReadOnly = () => {
    setReadOnly(!readOnly);
    if (editor) {
      editor.setEditable(!readOnly);
    }
    toast.info(readOnly ? '편집 모드로 변경되었습니다.' : '읽기 전용 모드로 변경되었습니다.');
  };

  const getContent = () => {
    return editor ? editor.getHTML() : '';
  };

  // 이미지 리사이징 기능 초기화
  useEffect(() => {
    if (!editor) return;

    const initImageResizing = () => {
      const images = document.querySelectorAll('.ProseMirror img');
      
      images.forEach((img) => {
        const imageElement = img as HTMLImageElement;
        
        // 이미지 클릭 시 선택 상태 토글
        imageElement.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          
          // 다른 이미지들의 선택 상태 제거
          document.querySelectorAll('.ProseMirror img.selected').forEach(selectedImg => {
            selectedImg.classList.remove('selected');
            // 기존 핸들 제거
            const container = selectedImg.closest('.image-container');
            container?.querySelectorAll('.resize-handle').forEach(handle => handle.remove());
          });
          
          // 현재 이미지 선택 상태 토글
          imageElement.classList.toggle('selected');
          
          if (imageElement.classList.contains('selected')) {
            // 리사이징 핸들 추가
            addResizeHandles(imageElement);
          } else {
            // 핸들 제거
            const container = imageElement.closest('.image-container');
            container?.querySelectorAll('.resize-handle').forEach(handle => handle.remove());
          }
        });
      });
    };

    const addResizeHandles = (imageElement: HTMLImageElement) => {
      // 이미지가 이미 컨테이너에 감싸져 있는지 확인
      let container = imageElement.parentElement;
      
      // 컨테이너가 없거나 이미지 컨테이너가 아닌 경우 새로 생성
      if (!container || !container.classList.contains('image-container')) {
        // 이미지를 감싸는 컨테이너 생성
        container = document.createElement('div');
        container.className = 'image-container';
        container.style.position = 'relative';
        container.style.display = 'inline-block';
        
        // 이미지를 컨테이너로 이동
        imageElement.parentNode?.insertBefore(container, imageElement);
        container.appendChild(imageElement);
      }

      // 기존 핸들 제거
      const existingHandles = container.querySelectorAll('.resize-handle');
      existingHandles.forEach(handle => handle.remove());

      // 핸들 생성
      const handles = ['nw', 'ne', 'sw', 'se', 'n', 's', 'w', 'e'];
      
      handles.forEach(direction => {
        const handle = document.createElement('div');
        handle.className = `resize-handle ${direction}`;
        handle.style.position = 'absolute';
        handle.style.width = '16px';
        handle.style.height = '16px';
        handle.style.background = '#f97316';
        handle.style.border = '2px solid white';
        handle.style.borderRadius = '50%';
        handle.style.zIndex = '1000';
        handle.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.2)';
        
        // 핸들 위치 설정
        switch (direction) {
          case 'nw':
            handle.style.top = '-8px';
            handle.style.left = '-8px';
            handle.style.cursor = 'nw-resize';
            break;
          case 'ne':
            handle.style.top = '-8px';
            handle.style.right = '-8px';
            handle.style.cursor = 'ne-resize';
            break;
          case 'sw':
            handle.style.bottom = '-8px';
            handle.style.left = '-8px';
            handle.style.cursor = 'sw-resize';
            break;
          case 'se':
            handle.style.bottom = '-8px';
            handle.style.right = '-8px';
            handle.style.cursor = 'se-resize';
            break;
          case 'n':
            handle.style.top = '-8px';
            handle.style.left = '50%';
            handle.style.transform = 'translateX(-50%)';
            handle.style.cursor = 'n-resize';
            break;
          case 's':
            handle.style.bottom = '-8px';
            handle.style.left = '50%';
            handle.style.transform = 'translateX(-50%)';
            handle.style.cursor = 's-resize';
            break;
          case 'w':
            handle.style.left = '-8px';
            handle.style.top = '50%';
            handle.style.transform = 'translateY(-50%)';
            handle.style.cursor = 'w-resize';
            break;
          case 'e':
            handle.style.right = '-8px';
            handle.style.top = '50%';
            handle.style.transform = 'translateY(-50%)';
            handle.style.cursor = 'e-resize';
            break;
        }
        
        handle.addEventListener('mousedown', (e) => {
          e.preventDefault();
          e.stopPropagation();
          
          const startX = e.clientX;
          const startY = e.clientY;
          const startWidth = imageElement.offsetWidth;
          const startHeight = imageElement.offsetHeight;
          
          const handleMouseMove = (moveEvent: MouseEvent) => {
            const deltaX = moveEvent.clientX - startX;
            const deltaY = moveEvent.clientY - startY;
            
            let newWidth = startWidth;
            let newHeight = startHeight;
            
            switch (direction) {
              case 'se':
                newWidth = Math.max(50, startWidth + deltaX);
                newHeight = Math.max(50, startHeight + deltaY);
                break;
              case 'sw':
                newWidth = Math.max(50, startWidth - deltaX);
                newHeight = Math.max(50, startHeight + deltaY);
                break;
              case 'ne':
                newWidth = Math.max(50, startWidth + deltaX);
                newHeight = Math.max(50, startHeight - deltaY);
                break;
              case 'nw':
                newWidth = Math.max(50, startWidth - deltaX);
                newHeight = Math.max(50, startHeight - deltaY);
                break;
              case 'e':
                newWidth = Math.max(50, startWidth + deltaX);
                break;
              case 'w':
                newWidth = Math.max(50, startWidth - deltaX);
                break;
              case 's':
                newHeight = Math.max(50, startHeight + deltaY);
                break;
              case 'n':
                newHeight = Math.max(50, startHeight - deltaY);
                break;
            }
            
            imageElement.style.width = `${newWidth}px`;
            imageElement.style.height = `${newHeight}px`;
          };
          
          const handleMouseUp = () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
          };
          
          document.addEventListener('mousemove', handleMouseMove);
          document.addEventListener('mouseup', handleMouseUp);
        });
        
        // 컨테이너에 핸들 추가
        container.appendChild(handle);
      });
    };

    // 에디터 내용 변경 시 이미지 리사이징 초기화
    const handleUpdate = () => {
      setTimeout(initImageResizing, 100);
    };

    editor.on('update', handleUpdate);
    
    // 초기 설정
    setTimeout(initImageResizing, 100);

    return () => {
      editor.off('update', handleUpdate);
    };
  }, [editor]);

  // 문서 클릭 시 이미지 선택 해제
  useEffect(() => {
    const handleDocumentClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.ProseMirror img')) {
        document.querySelectorAll('.ProseMirror img.selected').forEach(img => {
          img.classList.remove('selected');
          const container = img.closest('.image-container');
          container?.querySelectorAll('.resize-handle').forEach(handle => handle.remove());
        });
      }
    };

    document.addEventListener('click', handleDocumentClick);
    return () => document.removeEventListener('click', handleDocumentClick);
  }, []);

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">TipTap 에디터 테스트</h1>
        <p className="text-gray-600">React 19와 완전 호환되는 TipTap 에디터 테스트 페이지입니다.</p>
      </div>

      <div className="grid gap-6">
        {/* 에디터 카드 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>TipTap 에디터</span>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleToggleReadOnly}
                >
                  {readOnly ? '편집 모드' : '읽기 전용'}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClear}
                >
                  초기화
                </Button>
                <Button
                  size="sm"
                  onClick={handleSave}
                >
                  저장
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border border-gray-300 rounded-md overflow-hidden">
              <EditorToolbar editor={editor} showImageSizeDialog={showImageSizeDialog} />
              <div 
                className="p-4 min-h-[300px] bg-white"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                <EditorContent editor={editor} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 미리보기 카드 */}
        <Card>
          <CardHeader>
            <CardTitle>미리보기</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border border-gray-300 rounded-md p-4 min-h-[200px] bg-white">
              {getContent() ? (
                <div 
                  className="prose max-w-none"
                  dangerouslySetInnerHTML={{ __html: getContent() }}
                />
              ) : (
                <p className="text-gray-500 italic">내용을 입력하면 여기에 미리보기가 표시됩니다.</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* HTML 출력 카드 */}
        <Card>
          <CardHeader>
            <CardTitle>HTML 출력</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border border-gray-300 rounded-md p-4 bg-gray-50">
              <pre className="text-sm text-gray-700 whitespace-pre-wrap break-all">
                {getContent() || '내용이 없습니다.'}
              </pre>
            </div>
          </CardContent>
        </Card>

        {/* 기능 비교 카드 */}
        <Card>
          <CardHeader>
            <CardTitle>TipTap vs TinyMCE 비교</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold text-green-600 mb-2">TipTap 장점</h4>
                <ul className="text-sm space-y-1">
                  <li>• React 19 완전 지원</li>
                  <li>• 모던한 아키텍처</li>
                  <li>• TypeScript 우선 설계</li>
                  <li>• 확장성과 커스터마이징</li>
                  <li>• 가벼운 번들 크기</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-orange-600 mb-2">TinyMCE 장점</h4>
                <ul className="text-sm space-y-1">
                  <li>• React 19 완전 지원</li>
                  <li>• 풍부한 기능</li>
                  <li>• 성숙한 생태계</li>
                  <li>• 안정성 검증됨</li>
                  <li>• 현재 프로젝트에 최적화됨</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 