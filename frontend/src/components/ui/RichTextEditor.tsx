'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Bold, 
  Italic, 
  Underline, 
  List, 
  ListOrdered, 
  AlignLeft, 
  AlignCenter, 
  AlignRight,
  Image as ImageIcon,
  Link as LinkIcon,
  Youtube,
  Type,
  Palette,
  Droplets
} from 'lucide-react';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  readOnly?: boolean;
}

export default function RichTextEditor({ 
  content, 
  onChange, 
  placeholder = "내용을 입력하세요...",
  readOnly = false 
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isResizing, setIsResizing] = useState(false); // 크기 조절 중 상태 추가
  const [lastResizeTime, setLastResizeTime] = useState(0); // 마지막 크기 조절 시간 추가
  
  // 드롭다운 메뉴 상태
  const [showFontSizeDropdown, setShowFontSizeDropdown] = useState(false);
  const [showColorDropdown, setShowColorDropdown] = useState(false);
  const [showBgColorDropdown, setShowBgColorDropdown] = useState(false);

  // content prop이 변경되면 에디터 내용 업데이트 (초기화 시에만)
  useEffect(() => {
    if (editorRef.current && !isInitialized) {
      editorRef.current.innerHTML = content || '';
      setIsInitialized(true);
      
      // 기존 미디어 요소들에 크기 조정 기능 추가
      setTimeout(() => {
        addResizeHandlers();
      }, 100);
    }
  }, [content, isInitialized]);

  // 드롭다운 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.rich-text-editor')) {
        setShowFontSizeDropdown(false);
        setShowColorDropdown(false);
        setShowBgColorDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // 에디터 내용 변경 처리
  const handleInput = () => {
    if (editorRef.current) {
      // 잘못 생성된 resizable-media-wrapper div들을 정리
      cleanupInvalidWrappers();
      // 새로 추가된 미디어 요소들에 이벤트 리스너 등록
      addResizeHandlers();
      onChange(editorRef.current.innerHTML);
    }
  };

  // 잘못 생성된 resizable-media-wrapper div들을 정리
  const cleanupInvalidWrappers = () => {
    if (!editorRef.current) return;
    
    const wrappers = editorRef.current.querySelectorAll('.resizable-media-wrapper');
    wrappers.forEach(wrapper => {
      const mediaElement = wrapper.querySelector('.resizable-media');
      // 미디어 요소(img, iframe)가 없는 wrapper는 잘못된 것
      if (!mediaElement) {
        // wrapper 내부의 텍스트를 추출하고 wrapper를 제거
        const textContent = wrapper.textContent;
        if (textContent && textContent.trim()) {
          // 텍스트를 일반 텍스트 노드로 변환
          const textNode = document.createTextNode(textContent);
          wrapper.parentNode?.replaceChild(textNode, wrapper);
        } else {
          // 빈 wrapper는 제거
          wrapper.remove();
        }
      }
    });
  };

  // 에디터 마우스 다운 처리 (선택 해제)
  const handleEditorMouseDown = (e: React.MouseEvent) => {
    console.log('🔍 handleEditorMouseDown called at:', new Date().toISOString());
    console.log('isResizing state:', isResizing);
    console.log('Event target:', e.target);
    console.log('Event currentTarget:', e.currentTarget);
    
    // 크기 조절 중에는 마우스 다운 이벤트 무시
    if (isResizing) {
      console.log('🔧 Resizing in progress, ignoring mouse down event');
      return;
    }
    
    // 크기 조절 완료 후 일정 시간 동안 마우스 다운 이벤트 무시
    const currentTime = Date.now();
    const timeSinceLastResize = currentTime - lastResizeTime;
    console.log('Time since last resize:', timeSinceLastResize, 'ms');
    
    if (timeSinceLastResize < 200) {
      console.log('🔧 Too soon after resize, ignoring mouse down event');
      return;
    }
    
    const target = e.target as HTMLElement;
    console.log('🔍 handleEditorMouseDown - target:', target);
    console.log('Target classList:', target.classList.toString());
    console.log('Target tagName:', target.tagName);
    
    // 미디어 wrapper나 그 내부 요소 마우스 다운 시에는 선택 해제하지 않음
    if (target.closest('.resizable-media-wrapper')) {
      console.log('✅ Mouse down on media wrapper, not deselecting');
      return;
    }
    
    // 미디어 요소 외부 마우스 다운 시에만 모든 선택된 wrapper 해제
    console.log('❌ Mouse down outside media, deselecting all');
    const selectedWrappers = editorRef.current?.querySelectorAll('.resizable-media-wrapper.selected');
    console.log('Selected wrappers to deselect:', selectedWrappers?.length || 0);
    
    if (selectedWrappers && selectedWrappers.length > 0) {
      selectedWrappers.forEach((el, index) => {
        console.log(`Deselecting wrapper ${index}:`, el);
        
        el.classList.remove('selected');
        // 인라인 스타일도 제거
        (el as HTMLElement).style.border = '';
        (el as HTMLElement).style.outline = '';
        (el as HTMLElement).style.boxShadow = '';
        
        // 핸들들도 숨기기
        const handlesContainer = el.querySelector('.resize-handles');
        if (handlesContainer) {
          console.log('Hiding handles container:', handlesContainer);
          (handlesContainer as HTMLElement).style.display = 'none';
          (handlesContainer as HTMLElement).style.visibility = 'hidden';
        }
        
        // 개별 핸들들도 숨기기
        const handles = el.querySelectorAll('.resize-handle');
        console.log(`Hiding ${handles.length} handles`);
        handles.forEach((handle, handleIndex) => {
          const handleEl = handle as HTMLElement;
          handleEl.style.display = 'none';
          handleEl.style.visibility = 'hidden';
          console.log(`Hidden handle ${handleIndex}:`, handleEl);
        });
        
        // YouTube 오버레이 복원 (선택 해제 시 iframe 클릭 방지)
        const overlay = el.querySelector('.youtube-overlay');
        if (overlay) {
          (overlay as HTMLElement).style.display = 'block';
          console.log('🔊 Restored YouTube overlay after deselection');
        }
        
        console.log(`✅ Deselected wrapper ${index}:`, el);
      });
    } else {
      console.log('No selected wrappers found');
    }
  };

  // 키보드 이벤트 처리
  const handleKeyDown = (e: React.KeyboardEvent) => {
    // 방향키 처리 (이미지 선택 해제만)
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown' || 
        e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      // 모든 선택된 이미지 해제
      const selectedWrappers = editorRef.current?.querySelectorAll('.resizable-media-wrapper.selected');
      if (selectedWrappers && selectedWrappers.length > 0) {
        console.log('🔤 Arrow key - deselecting images');
        selectedWrappers.forEach(wrapper => {
          const wrapperEl = wrapper as HTMLElement;
          wrapperEl.classList.remove('selected');
          wrapperEl.style.border = '';
          wrapperEl.style.outline = '';
          wrapperEl.style.boxShadow = '';
          
          // 핸들들도 숨기기
          const handlesContainer = wrapperEl.querySelector('.resize-handles');
          if (handlesContainer) {
            (handlesContainer as HTMLElement).style.display = 'none';
            (handlesContainer as HTMLElement).style.visibility = 'hidden';
          }
          
          const handles = wrapperEl.querySelectorAll('.resize-handle');
          handles.forEach(handle => {
            const handleEl = handle as HTMLElement;
            handleEl.style.display = 'none';
            handleEl.style.visibility = 'hidden';
          });
          
          // YouTube 오버레이 복원 (선택 해제 시 iframe 클릭 방지)
          const overlay = wrapperEl.querySelector('.youtube-overlay');
          if (overlay) {
            (overlay as HTMLElement).style.display = 'block';
            console.log('🔊 Restored YouTube overlay after arrow key deselection');
          }
        });
      }
      return; // 방향키는 여기서 종료
    }
    
    // 일반 텍스트 입력 시 선택된 이미지 해제
    if (e.key === 'Enter' || e.key.length === 1) {
      // 모든 선택된 이미지 해제
      const selectedWrappers = editorRef.current?.querySelectorAll('.resizable-media-wrapper.selected');
      if (selectedWrappers && selectedWrappers.length > 0) {
        console.log('🔤 Text input - deselecting images');
        selectedWrappers.forEach(wrapper => {
          const wrapperEl = wrapper as HTMLElement;
          wrapperEl.classList.remove('selected');
          wrapperEl.style.border = '';
          wrapperEl.style.outline = '';
          wrapperEl.style.boxShadow = '';
          
          // 핸들들도 숨기기
          const handlesContainer = wrapperEl.querySelector('.resize-handles');
          if (handlesContainer) {
            (handlesContainer as HTMLElement).style.display = 'none';
            (handlesContainer as HTMLElement).style.visibility = 'hidden';
          }
          
          const handles = wrapperEl.querySelectorAll('.resize-handle');
          handles.forEach(handle => {
            const handleEl = handle as HTMLElement;
            handleEl.style.display = 'none';
            handleEl.style.visibility = 'hidden';
          });
          
          // YouTube 오버레이 복원 (선택 해제 시 iframe 클릭 방지)
          const overlay = wrapperEl.querySelector('.youtube-overlay');
          if (overlay) {
            (overlay as HTMLElement).style.display = 'block';
            console.log('🔊 Restored YouTube overlay after text input deselection');
          }
        });
      }
      
      // 현재 커서 위치가 resizable-media-wrapper 내부에 있는지 확인
      const selection = window.getSelection();
      
      // 선택된 범위가 없거나 유효하지 않은 경우 처리하지 않음
      if (!selection || selection.rangeCount === 0) {
        return;
      }
      
      const range = selection.getRangeAt(0);
      
      if (range) {
        const container = range.commonAncestorContainer;
        const wrapper = container.nodeType === Node.ELEMENT_NODE 
          ? (container as Element).closest('.resizable-media-wrapper')
          : container.parentElement?.closest('.resizable-media-wrapper');
        
        if (wrapper) {
          // wrapper 내부에서 텍스트 입력 시 wrapper 밖으로 커서 이동
          e.preventDefault();
          
          // wrapper 다음에 새로운 텍스트 노드 생성
          const textNode = document.createTextNode(e.key === 'Enter' ? '\n' : e.key);
          wrapper.parentNode?.insertBefore(textNode, wrapper.nextSibling);
          
          // 커서를 새 텍스트 노드 다음으로 이동
          const newRange = document.createRange();
          newRange.setStartAfter(textNode);
          newRange.setEndAfter(textNode);
          selection?.removeAllRanges();
          selection?.addRange(newRange);
          
          // 내용 변경 알림
          handleInput();
        }
      }
    }
  };

  // 명령 실행 함수
  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
    handleInput();
  };

  // 폰트 크기 설정
  const setFontSize = (size: string) => {
    execCommand('fontSize', size);
    setShowFontSizeDropdown(false);
  };

  // 텍스트 색상 설정
  const setTextColor = (color: string) => {
    execCommand('foreColor', color);
    setShowColorDropdown(false);
  };

  // 배경색 설정
  const setBackgroundColor = (color: string) => {
    execCommand('hiliteColor', color);
    setShowBgColorDropdown(false);
  };

  // 이미지 삽입
  const insertImage = () => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = () => {
      const file = input.files?.[0];
      if (file) {
        // 파일 크기 제한 (5MB)
        if (file.size > 5 * 1024 * 1024) {
          alert('파일 크기는 5MB 이하여야 합니다.');
          return;
        }

        // 이미지 파일 타입 확인
        if (!file.type.startsWith('image/')) {
          alert('이미지 파일만 업로드 가능합니다.');
          return;
        }

        const reader = new FileReader();
        reader.onload = () => {
          const imageUrl = reader.result as string;
          
          // execCommand 대신 직접 DOM 조작으로 안전하게 삽입
          if (editorRef.current) {
            const selection = window.getSelection();
            
            // 선택된 범위가 없거나 유효하지 않은 경우 에디터 끝에 삽입
            let range: Range;
            if (!selection || selection.rangeCount === 0) {
              range = document.createRange();
              range.selectNodeContents(editorRef.current);
              range.collapse(false); // 끝으로 이동
            } else {
              range = selection.getRangeAt(0);
            }
            
            // 새로운 미디어 wrapper 생성 (p 태그 사용)
            const wrapper = document.createElement('p');
            wrapper.className = 'resizable-media-wrapper';
            wrapper.style.cssText = 'position: relative; margin: 0.5em 0; max-width: 100%;';
            wrapper.setAttribute('data-resize-handler', 'true');
            
            // 이미지 요소 생성
            const img = document.createElement('img');
            img.src = imageUrl;
            img.style.cssText = 'max-width: 100%; height: auto; display: block; margin: 0;';
            img.className = 'resizable-media image';
            img.alt = '';
            
            // 이미지 로드 완료 후 wrapper 크기 설정
            img.onload = () => {
              // 이미지 원본 크기 확인
              const naturalWidth = img.naturalWidth;
              const naturalHeight = img.naturalHeight;
              
              // 에디터 너비에 맞게 조정 (최대 500px)
              const maxWidth = Math.min(500, naturalWidth);
              const aspectRatio = naturalHeight / naturalWidth;
              const adjustedHeight = maxWidth * aspectRatio;
              
              wrapper.style.width = `${maxWidth}px`;
              wrapper.style.height = `${adjustedHeight}px`;
              
              console.log('Image loaded:', {
                naturalWidth,
                naturalHeight,
                maxWidth,
                adjustedHeight
              });
            };
            
            // 리사이즈 핸들 생성
            const handles = document.createElement('div');
            handles.className = 'resize-handles';
            handles.innerHTML = `
              <div class="resize-handle" data-handle="nw"></div>
              <div class="resize-handle" data-handle="n"></div>
              <div class="resize-handle" data-handle="ne"></div>
              <div class="resize-handle" data-handle="w"></div>
              <div class="resize-handle" data-handle="e"></div>
              <div class="resize-handle" data-handle="sw"></div>
              <div class="resize-handle" data-handle="s"></div>
              <div class="resize-handle" data-handle="se"></div>
            `;
            
            wrapper.appendChild(img);
            wrapper.appendChild(handles);
            
            // 디버깅: 핸들 생성 확인
            console.log('Created wrapper:', wrapper);
            console.log('Handles element:', handles);
            console.log('Number of handles:', handles.querySelectorAll('.resize-handle').length);
            
            // 현재 커서 위치에 삽입
            range.deleteContents();
            range.insertNode(wrapper);
            
            // 커서를 미디어 다음으로 이동
            range.setStartAfter(wrapper);
            range.setEndAfter(wrapper);
            selection?.removeAllRanges();
            selection?.addRange(range);
            
            // 에디터 포커스 복원
            editorRef.current.focus();
            
            // 크기 조정 기능 추가
            setTimeout(() => {
              addResizeHandlers();
            }, 100);
            
            // 내용 변경 알림
            handleInput();
          }
        };
        reader.readAsDataURL(file);
      }
    };
  };

  // 링크 삽입
  const insertLink = () => {
    const url = window.prompt('링크 URL을 입력하세요:');
    if (url) {
      execCommand('createLink', url);
    }
  };

  // YouTube 영상 삽입
  const insertYouTube = () => {
    const url = window.prompt('YouTube URL을 입력하세요:');
    if (url) {
      // YouTube URL에서 비디오 ID 추출
      const videoId = extractYouTubeId(url);
      if (videoId) {
        // execCommand 대신 직접 DOM 조작으로 안전하게 삽입
        if (editorRef.current) {
          const selection = window.getSelection();
          
          // 선택된 범위가 없거나 유효하지 않은 경우 에디터 끝에 삽입
          let range: Range;
          if (!selection || selection.rangeCount === 0) {
            range = document.createRange();
            range.selectNodeContents(editorRef.current);
            range.collapse(false); // 끝으로 이동
          } else {
            range = selection.getRangeAt(0);
          }
          
          // 새로운 미디어 wrapper 생성 (p 태그 사용)
          const wrapper = document.createElement('p');
          wrapper.className = 'resizable-media-wrapper';
          wrapper.style.cssText = 'position: relative; margin: 0.5em 0; max-width: 100%;';
          wrapper.setAttribute('data-resize-handler', 'true');
          
          // iframe 요소 생성
          const iframe = document.createElement('iframe');
          iframe.width = '560';
          iframe.height = '315';
          iframe.src = `https://www.youtube.com/embed/${videoId}`;
          iframe.frameBorder = '0';
          iframe.allowFullscreen = true;
          iframe.style.cssText = 'width: 100%; height: 100%; display: block; margin: 0;';
          iframe.className = 'resizable-media';
          
          // YouTube 크기 조정 (16:9 비율)
          const maxWidth = 500;
          const aspectRatio = 9 / 16;
          const adjustedHeight = maxWidth * aspectRatio;
          
          wrapper.style.width = `${maxWidth}px`;
          wrapper.style.height = `${adjustedHeight}px`;
          
          // iframe 위에 투명한 오버레이 추가 (클릭 이벤트를 가로채기 위해)
          const overlay = document.createElement('div');
          overlay.className = 'youtube-overlay';
          overlay.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: transparent;
            z-index: 1;
            cursor: pointer;
          `;
          
          // 리사이즈 핸들 생성
          const handles = document.createElement('div');
          handles.className = 'resize-handles';
          handles.innerHTML = `
            <div class="resize-handle" data-handle="nw"></div>
            <div class="resize-handle" data-handle="n"></div>
            <div class="resize-handle" data-handle="ne"></div>
            <div class="resize-handle" data-handle="w"></div>
            <div class="resize-handle" data-handle="e"></div>
            <div class="resize-handle" data-handle="sw"></div>
            <div class="resize-handle" data-handle="s"></div>
            <div class="resize-handle" data-handle="se"></div>
          `;
          
          wrapper.appendChild(iframe);
          wrapper.appendChild(overlay);
          wrapper.appendChild(handles);
          
          // 현재 커서 위치에 삽입
          range.deleteContents();
          range.insertNode(wrapper);
          
          // 커서를 미디어 다음으로 이동
          range.setStartAfter(wrapper);
          range.setEndAfter(wrapper);
          selection?.removeAllRanges();
          selection?.addRange(range);
          
          // 에디터 포커스 복원
          editorRef.current.focus();
          
          // 크기 조정 기능 추가
          setTimeout(() => {
            addResizeHandlers();
          }, 100);
          
          // 내용 변경 알림
          handleInput();
        }
      } else {
        alert('유효한 YouTube URL을 입력해주세요.');
      }
    }
  };

  // YouTube URL에서 비디오 ID 추출
  const extractYouTubeId = (url: string): string | null => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  // 크기 조정 핸들러 추가
  const addResizeHandlers = () => {
    if (!editorRef.current) {
      console.log('❌ No editor ref');
      return;
    }
    
    const mediaWrappers = editorRef.current.querySelectorAll('.resizable-media-wrapper');
    console.log('🔍 Found media wrappers:', mediaWrappers.length);
    
    if (mediaWrappers.length === 0) {
      console.log('❌ No media wrappers found');
      return;
    }
    
    mediaWrappers?.forEach((wrapper, index) => {
      console.log(`📦 Processing wrapper ${index}:`, wrapper);
      console.log(`Wrapper classList:`, wrapper.classList.toString());
      
      // 기존 이벤트 리스너 제거 (click과 mousedown 모두)
      wrapper.removeEventListener('click', toggleSelection);
      wrapper.removeEventListener('mousedown', toggleSelection);
      
      // 선택 상태 토글 이벤트 리스너 등록 (mousedown 사용)
      wrapper.addEventListener('mousedown', toggleSelection);
      console.log(`✅ Added mousedown listener to wrapper ${index}`);
      
      // 크기 조정 핸들러 추가 (핸들에만)
      const handles = wrapper.querySelectorAll('.resize-handle');
      console.log(`🔧 Wrapper ${index} has ${handles.length} handles`);
      
      if (handles.length === 0) {
        console.log(`❌ No handles found in wrapper ${index}`);
        // 핸들이 없다면 다시 생성
        const handlesContainer = wrapper.querySelector('.resize-handles');
        if (!handlesContainer) {
          console.log(`🔧 Creating missing handles for wrapper ${index}`);
          const newHandles = document.createElement('div');
          newHandles.className = 'resize-handles';
          newHandles.innerHTML = `
            <div class="resize-handle" data-handle="nw"></div>
            <div class="resize-handle" data-handle="n"></div>
            <div class="resize-handle" data-handle="ne"></div>
            <div class="resize-handle" data-handle="w"></div>
            <div class="resize-handle" data-handle="e"></div>
            <div class="resize-handle" data-handle="sw"></div>
            <div class="resize-handle" data-handle="s"></div>
            <div class="resize-handle" data-handle="se"></div>
          `;
          wrapper.appendChild(newHandles);
          console.log(`✅ Created handles for wrapper ${index}`);
        }
      }
      
      // 다시 핸들 찾기
      const updatedHandles = wrapper.querySelectorAll('.resize-handle');
      updatedHandles.forEach((handle, handleIndex) => {
        // 기존 이벤트 리스너 제거
        handle.removeEventListener('mousedown', startResize);
        handle.removeEventListener('touchstart', startResize);
        
        handle.addEventListener('mousedown', startResize);
        handle.addEventListener('touchstart', startResize);
        console.log(`✅ Added resize listeners to handle ${handleIndex}:`, handle);
      });
      
      // 이벤트 리스너가 등록되었음을 표시
      wrapper.setAttribute('data-event-bound', 'true');
      console.log(`✅ Completed wrapper ${index}`);
    });
    
    console.log('🎉 addResizeHandlers completed');
  };

  // 선택 상태 토글
  const toggleSelection = (e: Event) => {
    e.preventDefault();
    e.stopPropagation(); // 이벤트 전파 중단 - handleEditorMouseDown이 실행되지 않도록 함
    
    console.log('=== toggleSelection called ===');
    console.log('Event type:', e.type);
    console.log('Event target:', e.target);
    console.log('Event currentTarget:', e.currentTarget);
    console.log('Event timeStamp:', e.timeStamp);
    
    const target = e.target as HTMLElement;
    console.log('Target element:', target);
    console.log('Target tagName:', target.tagName);
    console.log('Target classList:', target.classList.toString());
    
    // 크기 조절 완료 후 일정 시간 동안 핸들 클릭 무시
    const currentTime = Date.now();
    const timeSinceLastResize = currentTime - lastResizeTime;
    console.log('Time since last resize:', timeSinceLastResize, 'ms');
    
    if (target.classList.contains('resize-handle') && timeSinceLastResize < 200) {
      console.log('🔧 Ignoring handle mousedown after resize (too soon)');
      return;
    }
    
    // 클릭된 요소의 가장 가까운 resizable-media-wrapper를 찾음
    const wrapper = target.closest('.resizable-media-wrapper') as HTMLElement;
    
    if (!wrapper) {
      console.log('❌ No wrapper found for target:', target);
      return;
    }
    
    console.log('✅ Found wrapper:', wrapper);
    console.log('Wrapper classList before:', wrapper.classList.toString());
    
    // 현재 선택 상태 확인
    const isCurrentlySelected = wrapper.classList.contains('selected');
    console.log('Is currently selected:', isCurrentlySelected);
    
    // 모든 선택된 요소들 해제
    const allSelected = editorRef.current?.querySelectorAll('.resizable-media-wrapper.selected');
    console.log('All currently selected:', allSelected?.length || 0);
    
    allSelected?.forEach(el => {
      el.classList.remove('selected');
      console.log('Deselected:', el);
    });
    
    // 토글: 선택되지 않았다면 선택, 이미 선택되었다면 해제
    if (!isCurrentlySelected) {
      wrapper.classList.add('selected');
      console.log('✅ SELECTED wrapper:', wrapper);
      console.log('Wrapper classList after:', wrapper.classList.toString());
      
      // 강제로 인라인 스타일 적용 (CSS 우선순위 문제 해결)
      wrapper.style.border = '3px solid #3b82f6';
      wrapper.style.outline = 'none';
      wrapper.style.boxShadow = '0 0 0 1px #3b82f6';
      
      // YouTube 오버레이 숨기기 (선택 상태에서는 iframe 클릭 가능)
      const overlay = wrapper.querySelector('.youtube-overlay');
      if (overlay) {
        (overlay as HTMLElement).style.display = 'none';
        console.log('🔇 Hidden YouTube overlay for selection');
      }
      
      // 리사이즈 핸들 확인
      const handles = wrapper.querySelectorAll('.resize-handle');
      console.log('Number of resize handles:', handles.length);
      
      // 핸들들의 표시 상태 확인
      const handlesContainer = wrapper.querySelector('.resize-handles');
      if (handlesContainer) {
        console.log('Handles container found:', handlesContainer);
        // 강제로 핸들 표시
        (handlesContainer as HTMLElement).style.display = 'block';
        (handlesContainer as HTMLElement).style.visibility = 'visible';
        (handlesContainer as HTMLElement).style.position = 'absolute';
        (handlesContainer as HTMLElement).style.top = '0';
        (handlesContainer as HTMLElement).style.left = '0';
        (handlesContainer as HTMLElement).style.right = '0';
        (handlesContainer as HTMLElement).style.bottom = '0';
        (handlesContainer as HTMLElement).style.zIndex = '9999';
        
        const handlesStyle = window.getComputedStyle(handlesContainer);
        console.log('Handles display:', handlesStyle.display);
        console.log('Handles visibility:', handlesStyle.visibility);
        console.log('Handles position:', handlesStyle.position);
        console.log('Handles zIndex:', handlesStyle.zIndex);
        
        // 개별 핸들들도 확인
        const handles = wrapper.querySelectorAll('.resize-handle');
        handles.forEach((handle, index) => {
          const handleEl = handle as HTMLElement;
          handleEl.style.display = 'block';
          handleEl.style.visibility = 'visible';
          handleEl.style.position = 'absolute';
          handleEl.style.zIndex = '10000';
          handleEl.style.width = '14px';
          handleEl.style.height = '14px';
          handleEl.style.background = '#3b82f6';
          handleEl.style.border = '2px solid white';
          handleEl.style.borderRadius = '50%';
          handleEl.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.3)';
          
          // 핸들 위치 설정
          const handleType = handleEl.getAttribute('data-handle');
          switch (handleType) {
            case 'nw':
              handleEl.style.top = '-7px';
              handleEl.style.left = '-7px';
              break;
            case 'n':
              handleEl.style.top = '-7px';
              handleEl.style.left = '50%';
              handleEl.style.transform = 'translateX(-50%)';
              break;
            case 'ne':
              handleEl.style.top = '-7px';
              handleEl.style.right = '-7px';
              break;
            case 'w':
              handleEl.style.top = '50%';
              handleEl.style.left = '-7px';
              handleEl.style.transform = 'translateY(-50%)';
              break;
            case 'e':
              handleEl.style.top = '50%';
              handleEl.style.right = '-7px';
              handleEl.style.transform = 'translateY(-50%)';
              break;
            case 'sw':
              handleEl.style.bottom = '-7px';
              handleEl.style.left = '-7px';
              break;
            case 's':
              handleEl.style.bottom = '-7px';
              handleEl.style.left = '50%';
              handleEl.style.transform = 'translateX(-50%)';
              break;
            case 'se':
              handleEl.style.bottom = '-7px';
              handleEl.style.right = '-7px';
              break;
          }
          
          console.log(`Handle ${index} (${handleType}) styles:`, {
            display: handleEl.style.display,
            visibility: handleEl.style.visibility,
            position: handleEl.style.position,
            zIndex: handleEl.style.zIndex,
            top: handleEl.style.top,
            left: handleEl.style.left,
            right: handleEl.style.right,
            bottom: handleEl.style.bottom,
            width: handleEl.style.width,
            height: handleEl.style.height,
            background: handleEl.style.background
          });
        });
        
        // 강제로 스타일 적용 확인
        setTimeout(() => {
          const computedStyle = window.getComputedStyle(wrapper);
          console.log('Computed border:', computedStyle.border);
          console.log('Computed boxShadow:', computedStyle.boxShadow);
        }, 10);
      }
    } else {
      console.log('❌ DESELECTED wrapper:', wrapper);
      // 선택 해제 시 인라인 스타일도 제거
      wrapper.style.border = '';
      wrapper.style.outline = '';
      wrapper.style.boxShadow = '';
      
      const handlesContainer = wrapper.querySelector('.resize-handles');
      if (handlesContainer) {
        (handlesContainer as HTMLElement).style.display = 'none';
        (handlesContainer as HTMLElement).style.visibility = 'hidden';
      }
      
      // 개별 핸들들도 숨기기
      const handles = wrapper.querySelectorAll('.resize-handle');
      handles.forEach(handle => {
        const handleEl = handle as HTMLElement;
        handleEl.style.display = 'none';
        handleEl.style.visibility = 'hidden';
      });
    }
    
    console.log('=== toggleSelection end ===');
  };

  // 크기 조정 시작
  const startResize = (e: Event) => {
    e.preventDefault();
    e.stopPropagation(); // Prevent event bubbling to editor click handler
    const target = e.target as HTMLElement;
    
    if (target.classList.contains('resize-handle')) {
      const mediaElement = target.closest('.resizable-media-wrapper') as HTMLElement;
      if (!mediaElement) return;
      
      console.log('🔧 Starting resize for:', mediaElement);
      console.log('🔧 Resize start time:', new Date().toISOString());
      setIsResizing(true); // 크기 조절 시작
      console.log('🔧 isResizing set to true');
      
      const handleType = target.getAttribute('data-handle');
      const startX = 'touches' in e ? (e as TouchEvent).touches[0].clientX : (e as MouseEvent).clientX;
      const startY = 'touches' in e ? (e as TouchEvent).touches[0].clientY : (e as MouseEvent).clientY;
      const startWidth = mediaElement.offsetWidth;
      const startHeight = mediaElement.offsetHeight;
      
      const handleMouseMove = (moveEvent: MouseEvent | TouchEvent) => {
        const currentX = 'touches' in moveEvent ? moveEvent.touches[0].clientX : moveEvent.clientX;
        const currentY = 'touches' in moveEvent ? moveEvent.touches[0].clientY : moveEvent.clientY;
        
        const deltaX = currentX - startX;
        const deltaY = currentY - startY;
        
        let newWidth = startWidth;
        let newHeight = startHeight;
        
        switch (handleType) {
          case 'nw': // 북서 (왼쪽 위)
            newWidth = Math.max(100, startWidth - deltaX);
            newHeight = Math.max(100, startHeight - deltaY);
            break;
          case 'n': // 북 (위)
            newHeight = Math.max(100, startHeight - deltaY);
            break;
          case 'ne': // 북동 (오른쪽 위)
            newWidth = Math.max(100, startWidth + deltaX);
            newHeight = Math.max(100, startHeight - deltaY);
            break;
          case 'w': // 서 (왼쪽)
            newWidth = Math.max(100, startWidth - deltaX);
            break;
          case 'e': // 동 (오른쪽)
            newWidth = Math.max(100, startWidth + deltaX);
            break;
          case 'sw': // 남서 (왼쪽 아래)
            newWidth = Math.max(100, startWidth - deltaX);
            newHeight = Math.max(100, startHeight + deltaY);
            break;
          case 's': // 남 (아래)
            newHeight = Math.max(100, startHeight + deltaY);
            break;
          case 'se': // 남동 (오른쪽 아래)
            newWidth = Math.max(100, startWidth + deltaX);
            newHeight = Math.max(100, startHeight + deltaY);
            break;
        }
        
        // 에디터 영역을 벗어나지 않도록 제한
        const editorWidth = editorRef.current?.offsetWidth || 800;
        const maxWidth = Math.min(newWidth, editorWidth - 40); // 패딩 고려
        
        mediaElement.style.width = `${maxWidth}px`;
        mediaElement.style.height = `${newHeight}px`;
        mediaElement.style.maxWidth = 'none';
        mediaElement.style.maxHeight = 'none';
        mediaElement.style.position = 'relative'; // relative 유지
        
        // 내부 이미지/비디오 크기도 함께 조정
        const mediaContent = mediaElement.querySelector('.resizable-media') as HTMLElement;
        if (mediaContent) {
          mediaContent.style.width = '100%';
          mediaContent.style.height = '100%';
          mediaContent.style.maxWidth = 'none';
          mediaContent.style.maxHeight = 'none';
        }
      };
      
      const handleMouseUp = () => {
        console.log('🔧 Resize completed for:', mediaElement);
        console.log('🔧 Resize end time:', new Date().toISOString());
        
        // 크기 조절 완료 시간 기록
        setLastResizeTime(Date.now());
        console.log('🔧 Last resize time recorded:', Date.now());
        
        // 크기 조절 완료 후에도 선택 상태 유지
        if (!mediaElement.classList.contains('selected')) {
          console.log('🔧 Restoring selection state');
          mediaElement.classList.add('selected');
          mediaElement.style.border = '3px solid #3b82f6';
          mediaElement.style.outline = 'none';
          mediaElement.style.boxShadow = '0 0 0 1px #3b82f6';
          
          // 핸들들도 다시 표시
          const handlesContainer = mediaElement.querySelector('.resize-handles');
          if (handlesContainer) {
            (handlesContainer as HTMLElement).style.display = 'block';
            (handlesContainer as HTMLElement).style.visibility = 'visible';
          }
          
          const handles = mediaElement.querySelectorAll('.resize-handle');
          handles.forEach(handle => {
            const handleEl = handle as HTMLElement;
            handleEl.style.display = 'block';
            handleEl.style.visibility = 'visible';
          });
        }
        
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.removeEventListener('touchmove', handleMouseMove);
        document.removeEventListener('touchend', handleMouseUp);
        
        // 약간의 지연 후 isResizing 상태 해제 (마우스 다운 이벤트와의 충돌 방지)
        setTimeout(() => {
          setIsResizing(false);
          console.log('🔧 isResizing set to false (delayed)');
        }, 10);
      };
      
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchmove', handleMouseMove);
      document.addEventListener('touchend', handleMouseUp);
    }
  };

  return (
    <div className="rich-text-editor border border-gray-300 rounded-md">
      {/* 툴바 */}
      {!readOnly && (
        <div className="flex items-center gap-1 p-2 bg-gray-50 border-b border-gray-300">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => execCommand('bold')}
            className="h-8 w-8 p-0"
          >
            <Bold className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => execCommand('italic')}
            className="h-8 w-8 p-0"
          >
            <Italic className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => execCommand('underline')}
            className="h-8 w-8 p-0"
          >
            <Underline className="h-4 w-4" />
          </Button>
          
          <div className="w-px h-6 bg-gray-300 mx-1" />
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowFontSizeDropdown(!showFontSizeDropdown)}
            className="h-8 w-8 p-0 relative"
            title="폰트 크기"
          >
            <Type className="h-4 w-4" />
            {showFontSizeDropdown && (
              <div className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-50 min-w-[120px]">
                <div className="p-2">
                  <div className="text-xs text-gray-500 mb-2">폰트 크기</div>
                  {['1', '2', '3', '4', '5', '6', '7'].map((size) => (
                    <button
                      key={size}
                      onClick={() => setFontSize(size)}
                      className="block w-full text-left px-2 py-1 text-sm hover:bg-gray-100 rounded"
                    >
                      {size}
                    </button>
                  ))}
                  <div className="border-t border-gray-200 mt-2 pt-2">
                    {['12px', '14px', '16px', '18px', '20px', '24px', '28px', '32px'].map((size) => (
                      <button
                        key={size}
                        onClick={() => setFontSize(size)}
                        className="block w-full text-left px-2 py-1 text-sm hover:bg-gray-100 rounded"
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowColorDropdown(!showColorDropdown)}
            className="h-8 w-8 p-0 relative"
            title="텍스트 색상"
          >
            <Palette className="h-4 w-4" />
            {showColorDropdown && (
              <div className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-50 min-w-[200px]">
                <div className="p-2">
                  <div className="text-xs text-gray-500 mb-2">텍스트 색상</div>
                  <div className="grid grid-cols-8 gap-1">
                    {[
                      '#000000', '#ffffff', '#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff',
                      '#ffa500', '#800080', '#008000', '#ffc0cb', '#a52a2a', '#808080', '#000080', '#ff6347'
                    ].map((color) => (
                      <button
                        key={color}
                        onClick={() => setTextColor(color)}
                        className="w-6 h-6 rounded border border-gray-300 hover:scale-110 transition-transform"
                        style={{ backgroundColor: color }}
                        title={color}
                      />
                    ))}
                  </div>
                  <div className="mt-2 pt-2 border-t border-gray-200">
                    <button
                      onClick={() => setTextColor('#000000')}
                      className="block w-full text-left px-2 py-1 text-sm hover:bg-gray-100 rounded"
                    >
                      검정
                    </button>
                    <button
                      onClick={() => setTextColor('#ff0000')}
                      className="block w-full text-left px-2 py-1 text-sm hover:bg-gray-100 rounded text-red-600"
                    >
                      빨강
                    </button>
                    <button
                      onClick={() => setTextColor('#0000ff')}
                      className="block w-full text-left px-2 py-1 text-sm hover:bg-gray-100 rounded text-blue-600"
                    >
                      파랑
                    </button>
                    <button
                      onClick={() => setTextColor('#008000')}
                      className="block w-full text-left px-2 py-1 text-sm hover:bg-gray-100 rounded text-green-600"
                    >
                      초록
                    </button>
                  </div>
                </div>
              </div>
            )}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowBgColorDropdown(!showBgColorDropdown)}
            className="h-8 w-8 p-0 relative"
            title="배경색"
          >
            <Droplets className="h-4 w-4" />
            {showBgColorDropdown && (
              <div className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-50 min-w-[200px]">
                <div className="p-2">
                  <div className="text-xs text-gray-500 mb-2">배경색</div>
                  <div className="grid grid-cols-8 gap-1">
                    {[
                      '#ffffff', '#ffff00', '#ffeb3b', '#fff3cd', '#ffeaa7', '#fdcb6e', '#e17055', '#d63031',
                      '#00b894', '#00cec9', '#74b9ff', '#0984e3', '#6c5ce7', '#a29bfe', '#fd79a8', '#e84393'
                    ].map((color) => (
                      <button
                        key={color}
                        onClick={() => setBackgroundColor(color)}
                        className="w-6 h-6 rounded border border-gray-300 hover:scale-110 transition-transform"
                        style={{ backgroundColor: color }}
                        title={color}
                      />
                    ))}
                  </div>
                  <div className="mt-2 pt-2 border-t border-gray-200">
                    <button
                      onClick={() => setBackgroundColor('#ffff00')}
                      className="block w-full text-left px-2 py-1 text-sm hover:bg-gray-100 rounded"
                    >
                      노랑
                    </button>
                    <button
                      onClick={() => setBackgroundColor('#ffeb3b')}
                      className="block w-full text-left px-2 py-1 text-sm hover:bg-gray-100 rounded"
                    >
                      연노랑
                    </button>
                    <button
                      onClick={() => setBackgroundColor('#74b9ff')}
                      className="block w-full text-left px-2 py-1 text-sm hover:bg-gray-100 rounded"
                    >
                      연파랑
                    </button>
                    <button
                      onClick={() => setBackgroundColor('#00b894')}
                      className="block w-full text-left px-2 py-1 text-sm hover:bg-gray-100 rounded"
                    >
                      연초록
                    </button>
                  </div>
                </div>
              </div>
            )}
          </Button>
          
          <div className="w-px h-6 bg-gray-300 mx-1" />
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => execCommand('insertUnorderedList')}
            className="h-8 w-8 p-0"
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => execCommand('insertOrderedList')}
            className="h-8 w-8 p-0"
          >
            <ListOrdered className="h-4 w-4" />
          </Button>
          
          <div className="w-px h-6 bg-gray-300 mx-1" />
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => execCommand('justifyLeft')}
            className="h-8 w-8 p-0"
          >
            <AlignLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => execCommand('justifyCenter')}
            className="h-8 w-8 p-0"
          >
            <AlignCenter className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => execCommand('justifyRight')}
            className="h-8 w-8 p-0"
          >
            <AlignRight className="h-4 w-4" />
          </Button>
          
          <div className="w-px h-6 bg-gray-300 mx-1" />
          
          <Button
            variant="ghost"
            size="sm"
            onClick={insertLink}
            className="h-8 w-8 p-0"
          >
            <LinkIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={insertImage}
            className="h-8 w-8 p-0"
          >
            <ImageIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={insertYouTube}
            className="h-8 w-8 p-0"
          >
            <Youtube className="h-4 w-4" />
          </Button>
        </div>
      )}
      
      {/* 에디터 */}
      <div 
        ref={editorRef}
        contentEditable={!readOnly}
        onInput={handleInput}
        onPaste={handleInput}
        onDrop={handleInput}
        onMouseDown={handleEditorMouseDown}
        onMouseOver={(e) => {
          // 마우스 오버 시에는 선택 해제하지 않음
          console.log('🔍 Mouse over event - ignoring');
        }}
        onKeyDown={handleKeyDown}
        className="p-4 min-h-[200px] outline-none"
        style={{
          backgroundColor: readOnly ? '#f9fafb' : '#ffffff',
          color: '#374151',
          lineHeight: '1.6',
          fontSize: '14px',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
        }}
        data-placeholder={placeholder}
      />
      
      <style jsx>{`
        [contenteditable]:empty:before {
          content: attr(data-placeholder);
          color: #9ca3af;
          font-style: italic;
          pointer-events: none;
        }
        
        [contenteditable] img {
          max-width: 100%;
          height: auto;
          margin: 0.5em 0;
          display: block;
        }
        
        [contenteditable] iframe {
          max-width: 100%;
          height: auto;
          margin: 0.5em 0;
          display: block;
        }
        
        [contenteditable] a {
          color: #2563eb;
          text-decoration: underline;
        }
        
        [contenteditable] a:hover {
          color: #1d4ed8;
        }
        
        [contenteditable] ul, [contenteditable] ol {
          margin: 0.5em 0;
          padding-left: 1.5em;
        }
        
        [contenteditable] li {
          margin: 0.25em 0;
        }
        
        [contenteditable] .resizable-media-wrapper {
          position: relative !important;
          display: block !important;
          transition: border 0.2s ease !important;
          margin: 0.5em 0 !important;
          border: none !important;
          outline: none !important;
          max-width: 100% !important;
          vertical-align: top !important;
        }
        
        [contenteditable] .resizable-media {
          display: block !important;
          max-width: 100% !important;
          height: auto !important;
          margin: 0 !important;
          border: none !important;
          vertical-align: top !important;
        }
        
        [contenteditable] .image {
          max-width: 100% !important;
          height: auto !important;
          display: block !important;
          margin: 0.5em 0 !important;
        }
        
        [contenteditable] .resizable-media-wrapper.selected {
          border: 3px solid #3b82f6 !important;
          outline: none !important;
          box-shadow: 0 0 0 1px #3b82f6 !important;
          position: relative !important;
        }
        
        /* 더 강력한 선택자로 우선순위 높이기 */
        .rich-text-editor [contenteditable] .resizable-media-wrapper.selected {
          border: 3px solid #3b82f6 !important;
          outline: none !important;
          box-shadow: 0 0 0 1px #3b82f6 !important;
        }
        
        /* 가장 강력한 선택자 */
        .rich-text-editor [contenteditable] .resizable-media-wrapper.selected,
        div[contenteditable] .resizable-media-wrapper.selected {
          border: 3px solid #3b82f6 !important;
          outline: none !important;
          box-shadow: 0 0 0 1px #3b82f6 !important;
          position: relative !important;
        }
        
        [contenteditable] .resizable-media {
          display: block !important;
          transition: border 0.2s ease !important;
          margin: 0 !important;
          border: none !important;
        }
        
        [contenteditable] .resizable-media-wrapper.selected .resizable-media {
          border: 3px solid #3b82f6 !important;
        }
        
        [contenteditable] .resize-handles {
          position: absolute !important;
          top: 0 !important;
          left: 0 !important;
          right: 0 !important;
          bottom: 0 !important;
          pointer-events: none !important;
          display: none !important;
          z-index: 9999 !important;
        }
        
        [contenteditable] .resize-handle {
          position: absolute !important;
          width: 14px !important;
          height: 14px !important;
          background: #3b82f6 !important;
          border: 2px solid white !important;
          border-radius: 50% !important;
          pointer-events: all !important;
          z-index: 10000 !important;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3) !important;
        }
        
        [contenteditable] .resizable-media-wrapper.selected .resize-handles {
          display: block !important;
        }
        
        /* 더 강력한 선택자로 핸들 표시 */
        .rich-text-editor [contenteditable] .resizable-media-wrapper.selected .resize-handles,
        div[contenteditable] .resizable-media-wrapper.selected .resize-handles {
          display: block !important;
          visibility: visible !important;
        }
        
        /* 핸들 위치 설정 */
        [contenteditable] .resize-handle[data-handle="nw"] { top: -7px !important; left: -7px !important; cursor: nw-resize !important; }
        [contenteditable] .resize-handle[data-handle="n"] { top: -7px !important; left: 50% !important; transform: translateX(-50%) !important; cursor: n-resize !important; }
        [contenteditable] .resize-handle[data-handle="ne"] { top: -7px !important; right: -7px !important; cursor: ne-resize !important; }
        [contenteditable] .resize-handle[data-handle="w"] { top: 50% !important; left: -7px !important; transform: translateY(-50%) !important; cursor: w-resize !important; }
        [contenteditable] .resize-handle[data-handle="e"] { top: 50% !important; right: -7px !important; transform: translateY(-50%) !important; cursor: e-resize !important; }
        [contenteditable] .resize-handle[data-handle="sw"] { bottom: -7px !important; left: -7px !important; cursor: sw-resize !important; }
        [contenteditable] .resize-handle[data-handle="s"] { bottom: -7px !important; left: 50% !important; transform: translateX(-50%) !important; cursor: s-resize !important; }
        [contenteditable] .resize-handle[data-handle="se"] { bottom: -7px !important; right: -7px !important; cursor: se-resize !important; }
      `}</style>
    </div>
  );
} 