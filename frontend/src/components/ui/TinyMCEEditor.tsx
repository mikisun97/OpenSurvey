'use client';

import { useState, useEffect } from 'react';
import { Editor } from '@tinymce/tinymce-react';

interface TinyMCEEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  readOnly?: boolean;
  className?: string;
}

export default function TinyMCEEditor({ 
  content: initialContent, 
  onChange, 
  placeholder = "내용을 입력하세요...",
  readOnly = false,
  className = ""
}: TinyMCEEditorProps) {
  const [isClient, setIsClient] = useState(false);
  const [content, setContent] = useState(initialContent);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleEditorChange = (content: string, editor: unknown) => {
    setContent(content);
    if (onChange) {
      onChange(content);
    }
  };



  if (!isClient) {
    return (
      <div className="tinymce-editor border border-gray-300 rounded-md">
        <div className="h-[300px] p-4 bg-gray-50 flex items-center justify-center">
          에디터 로딩 중...
        </div>
      </div>
    );
  }

  return (
    <div className="tinymce-editor border border-gray-300 rounded-md">
      <Editor
        apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY || "ef7twyh1x628k9nq5dym8twzit0bzy5c4uu3nbdnilv85p34"}
        value={content}
        onEditorChange={handleEditorChange}
        init={{
          height: 300,
          menubar: false,
          plugins: [
            'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
            'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
            'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
          ],
          toolbar: 'undo redo | blocks | ' +
            'bold italic forecolor | alignleft aligncenter ' +
            'alignright alignjustify | bullist numlist outdent indent | ' +
            'removeformat | youtube upload-image | help',
          content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:12pt } .tox-tinymce { border-color: #f97316 !important; } .tox-tinymce:focus-within { border-color: #f97316 !important; box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.1) !important; } .tox-toolbar__primary { background-color: #f97316 !important; }',
          placeholder: placeholder,
          // 커스텀 YouTube 버튼 추가
          setup: function (editor: { 
            ui: { 
              registry: { 
                addButton: (name: string, config: { 
                  text?: string; 
                  icon?: string; 
                  tooltip?: string;
                  onAction: () => void 
                }) => void;
              } 
            }; 
            insertContent: (content: string) => void;
            windowManager: {
              open: (config: {
                title: string;
                            body: unknown;
            buttons: unknown[];
            initialData: unknown;
            onSubmit: (api: unknown) => void;
              }) => void;
              alert: (message: string) => void;
            };
          }) {
            // YouTube 버튼 등록
            editor.ui.registry.addButton('youtube', {
              icon: 'embed',
              tooltip: 'YouTube 영상 삽입',
              onAction: function () {
                // TinyMCE의 내장 다이얼로그 사용
                editor.windowManager.open({
                  title: 'YouTube 영상 삽입',
                  body: {
                    type: 'panel',
                    items: [
                      {
                        type: 'input',
                        name: 'url',
                        label: 'YouTube URL',
                        placeholder: 'https://www.youtube.com/watch?v=... 또는 https://youtu.be/...'
                      },
                      {
                        type: 'grid',
                        columns: 2,
                        items: [
                          {
                            type: 'input',
                            name: 'width',
                            label: '너비',
                            value: '560'
                          },
                          {
                            type: 'input',
                            name: 'height',
                            label: '높이',
                            value: '315'
                          }
                        ]
                      }
                    ]
                  },
                  buttons: [
                    {
                      type: 'cancel',
                      text: '취소'
                    },
                    {
                      type: 'submit',
                      text: '삽입',
                      primary: true
                    }
                  ],
                  initialData: {
                    url: '',
                    width: '560',
                    height: '315'
                  },
                  onSubmit: function (api: { 
                    getData: () => { url: string; width: string; height: string };
                    close: () => void;
                  }) {
                    const data = api.getData();
                    const videoId = extractYouTubeId(data.url);
                    
                    if (videoId) {
                      const iframe = `<iframe width="${data.width}" height="${data.height}" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen></iframe>`;
                      editor.insertContent(iframe);
                      api.close();
                    } else {
                      editor.windowManager.alert('유효한 YouTube URL을 입력해주세요.');
                    }
                  }
                });
              }
            });

            // 이미지 업로드 버튼 등록
            editor.ui.registry.addButton('upload-image', {
              icon: 'image',
              tooltip: '이미지 업로드',
              onAction: function () {
                // 이미지 업로드 다이얼로그 열기
                editor.windowManager.open({
                  title: '이미지 업로드',
                  body: {
                    type: 'panel',
                    items: [
                      {
                        type: 'htmlpanel',
                        html: `
                          <div style="margin-bottom: 15px;">
                            <label class="tox-label" style="display: block; margin-bottom: 8px;">
                              이미지 파일 선택
                            </label>
                            <div style="position: relative; display: inline-block; width: 100%;">
                              <input type="file" id="imageFileInput" accept="image/*" 
                                style="
                                  position: absolute;
                                  left: -9999px;
                                  opacity: 0;
                                  width: 1px;
                                  height: 1px;
                                "
                              />
                              <button type="button" 
                                onclick="document.getElementById('imageFileInput').click()"
                                style="
                                  width: 100%;
                                  padding: 12px;
                                  border: 1px solid #ddd;
                                  border-radius: 6px;
                                  background: #fff;
                                  cursor: pointer;
                                  font-size: 14px;
                                  color: #333;
                                  text-align: left;
                                "
                                onmouseover="this.style.borderColor='#007cba';"
                                onmouseout="this.style.borderColor='#ddd';"
                              >
                                📁 파일을 선택하세요
                              </button>
                            </div>
                            <div style="margin-top: 5px; font-size: 12px; color: #666;">
                              지원 형식: JPG, PNG, GIF, WebP, SVG (최대 5MB)
                            </div>
                          </div>
                        `
                      },
                      {
                        type: 'grid',
                        columns: 2,
                        items: [
                          {
                            type: 'input',
                            name: 'width',
                            label: '너비',
                            value: ''
                          },
                          {
                            type: 'input',
                            name: 'height',
                            label: '높이',
                            value: ''
                          }
                        ]
                      },
                      {
                        type: 'input',
                        name: 'alt',
                        label: '대체 텍스트',
                        placeholder: '이미지 설명을 입력하세요'
                      }
                    ]
                  },
                  buttons: [
                    {
                      type: 'cancel',
                      text: '취소'
                    },
                    {
                      type: 'submit',
                      text: '삽입',
                      primary: true
                    }
                  ],
                  initialData: {
                    width: '',
                    height: '',
                    alt: ''
                  },
                  onSubmit: function (api: { 
                    getData: () => { width: string; height: string; alt: string };
                    close: () => void;
                  }) {
                    const data = api.getData();
                    
                    // 파일 입력 요소에서 파일 가져오기
                    const fileInput = document.getElementById('imageFileInput') as HTMLInputElement;
                    const file = fileInput?.files?.[0];
                    
                    if (!file) {
                      editor.windowManager.alert('이미지 파일을 선택해주세요.');
                      return;
                    }
                    
                    // 파일 크기 검증 (5MB 제한)
                    const maxSize = 5 * 1024 * 1024;
                    if (file.size > maxSize) {
                      editor.windowManager.alert('파일 크기가 너무 큽니다. 5MB 이하의 파일을 선택해주세요.');
                      return;
                    }
                    
                    // 파일 타입 검증
                    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
                    if (!allowedTypes.includes(file.type)) {
                      editor.windowManager.alert('지원하지 않는 파일 형식입니다. JPG, PNG, GIF, WebP, SVG 파일만 업로드 가능합니다.');
                      return;
                    }
                    
                    // 파일을 base64로 변환하여 에디터에 삽입
                    const reader = new FileReader();
                    reader.onload = function () {
                      if (reader.result) {
                        const width = data.width ? `width="${data.width}"` : '';
                        const height = data.height ? `height="${data.height}"` : '';
                        const alt = data.alt ? `alt="${data.alt}"` : 'alt=""';
                        
                        const imgTag = `<img src="${reader.result}" ${width} ${height} ${alt} style="max-width: 100%; height: auto;" />`;
                        editor.insertContent(imgTag);
                        api.close();
                        
                        // 성공 메시지 표시
                        editor.windowManager.alert('이미지가 성공적으로 삽입되었습니다.');
                      } else {
                        editor.windowManager.alert('파일을 읽을 수 없습니다.');
                      }
                    };
                    
                    reader.onerror = function () {
                      editor.windowManager.alert('파일 읽기 오류가 발생했습니다.');
                    };
                    
                    reader.readAsDataURL(file);
                  }
                });

                // 파일 선택 시 이미지 크기 자동 설정
                setTimeout(() => {
                  const fileInput = document.getElementById('imageFileInput') as HTMLInputElement;
                  if (fileInput) {
                    fileInput.addEventListener('change', function(event: Event) {
                      const target = event.target as HTMLInputElement;
                      const file = target.files?.[0];
                      
                      if (file) {
                        // 파일 선택 후 버튼 텍스트 변경
                        const button = document.querySelector('button[onclick*="imageFileInput"]') as HTMLButtonElement;
                        if (button) {
                          button.textContent = `📁 ${file.name}`;
                          button.style.color = '#007cba';
                          button.style.fontWeight = '500';
                        }
                        
                        const img = new Image();
                        const reader = new FileReader();
                        
                        reader.onload = function() {
                          if (reader.result) {
                            img.onload = function() {
                              // 다이얼로그 내의 입력 필드들을 찾아서 값 설정
                              const inputs = document.querySelectorAll('.tox-dialog input[type="text"]');
                              if (inputs.length >= 2) {
                                const widthInput = inputs[0] as HTMLInputElement;
                                const heightInput = inputs[1] as HTMLInputElement;
                                
                                widthInput.value = img.width.toString();
                                heightInput.value = img.height.toString();
                                
                                // 값 변경 이벤트 발생
                                widthInput.dispatchEvent(new Event('input', { bubbles: true }));
                                heightInput.dispatchEvent(new Event('input', { bubbles: true }));
                              }
                            };
                            img.src = reader.result as string;
                          }
                        };
                        
                        reader.readAsDataURL(file);
                      }
                    });
                  }
                }, 100);
              }
            });
          },
          // YouTube 비디오 삽입 설정
          media_live_embeds: true,
          media_url_resolver: function (data: { url: string }, resolve: (data: { html: string }) => void, reject: (error: string) => void) {
            try {
              if (data.url.indexOf('youtube.com') !== -1 || data.url.indexOf('youtu.be') !== -1) {
                const videoId = extractYouTubeId(data.url);
                if (videoId) {
                  resolve({
                    html: `<iframe width="560" height="315" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen></iframe>`
                  });
                } else {
                  reject('Invalid YouTube URL');
                }
              } else {
                reject('Unsupported media URL');
              }
            } catch (error) {
              reject('Error processing media URL');
            }
          },
          // 미디어 플러그인 설정
          media_alt_source: false,
          media_poster: false,
          media_dimensions: false,
          
          // 이미지 업로드 핸들러 - 첨부파일 시스템 활용
          images_upload_handler: async (blobInfo: unknown, progress: unknown, failure: unknown) => {
            try {
              const formData = new FormData();
              formData.append('files', blobInfo.blob(), blobInfo.filename());
              formData.append('usageType', 'CONTENT_IMAGE'); // 이미지 용도 표시
              
              // 기존 bbsAPI.uploadFiles 활용 (안전한 방법)
              const { bbsAPI } = await import('@/lib/api');
              const response = await bbsAPI.uploadFiles(formData);
              
              if (response.data.resultCode === 'SUCCESS') {
                // 첨부파일 ID와 순번으로 이미지 URL 생성
                const atchFileId = response.data.data.atchFileId;
                const fileSn = response.data.data.uploadedFiles[0].fileSn;
                
                // 공개 이미지 표시 URL 반환 (인증 불필요)
                return `/api/sym/bbs/images/${atchFileId}/${fileSn}`;
              } else {
                throw new Error(response.data.resultMessage || '이미지 업로드 실패');
              }
            } catch (error: unknown) {
              const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류';
              throw new Error('이미지 업로드 실패: ' + errorMessage);
            }
          },
        }}
      />
    </div>
  );
}

// YouTube URL에서 비디오 ID 추출
function extractYouTubeId(url: string): string | null {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
} 