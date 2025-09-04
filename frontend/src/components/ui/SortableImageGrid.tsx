'use client';

import React from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { X } from 'lucide-react';

// 이미지 아이템 인터페이스
export interface ImageItem {
  id: string;
  name: string;
  url: string;
  size: number;
  type: 'existing' | 'new';
  file?: File;
  atchFileId?: string;
  fileSn?: number;
  order: number;
}

// 정렬 가능한 이미지 아이템 컴포넌트
function SortableImageItem({ 
  image, 
  index, 
  onDelete 
}: {
  image: ImageItem;
  index: number;
  onDelete: (id: string) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: image.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="relative group cursor-move"
    >
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <img 
          src={image.url} 
          alt={image.name}
          className="w-full h-24 object-cover"
        />
      </div>
      
      {/* 순서 번호 표시 */}
      <div className="absolute top-1 left-1 bg-gray-800 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
        {index + 1}
      </div>
      
      {/* 기존/새 이미지 구분 표시 */}
      {image.type === 'existing' && (
        <div className="absolute top-1 right-8 bg-green-500 text-white text-xs px-1 rounded">
          기존
        </div>
      )}
      {image.type === 'new' && (
        <div className="absolute top-1 right-8 bg-blue-500 text-white text-xs px-1 rounded">
          새로추가
        </div>
      )}
      
      {/* 삭제 버튼 */}
      <button
        onMouseDown={(e) => {
          console.log("SortableImageGrid 삭제 버튼 클릭:", image.id);
          e.stopPropagation();
          e.preventDefault();
          onDelete(image.id);
        }}
        onClick={(e) => {
          console.log("SortableImageGrid 삭제 버튼 클릭 (onClick):", image.id);
          e.stopPropagation();
          e.preventDefault();
          onDelete(image.id);
        }}
        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow-sm opacity-0 group-hover:opacity-100"
        title="이미지 삭제"
      >
        <X className="w-3 h-3" />
      </button>
    </div>
  );
}

// 메인 SortableImageGrid 컴포넌트
interface SortableImageGridProps {
  images: ImageItem[];
  onReorder: (images: ImageItem[]) => void;
  onDelete: (id: string) => void;
  maxCount?: number;
}

export default function SortableImageGrid({
  images,
  onReorder,
  onDelete,
  maxCount = 10
}: SortableImageGridProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = images.findIndex(item => item.id === active.id);
      const newIndex = images.findIndex(item => item.id === over?.id);
      
      const newImages = arrayMove(images, oldIndex, newIndex);
      
      // order 값 재계산
      const reorderedImages = newImages.map((item, index) => ({
        ...item,
        order: index + 1
      }));
      
      onReorder(reorderedImages);
    }
  };

  if (images.length === 0) {
    return (
      <div className="text-center py-6 text-gray-500 bg-gray-50 rounded-lg border border-gray-200">
        <p className="text-sm">등록된 이미지가 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={images.map(img => img.id)}
          strategy={rectSortingStrategy}
        >
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((image, index) => (
              <SortableImageItem
                key={image.id}
                image={image}
                index={index}
                onDelete={onDelete}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
      
      {/* 현재 개수 표시 */}
      <div className="text-sm text-gray-600">
        현재 {images.length}개 / 최대 {maxCount}개
      </div>
    </div>
  );
}
