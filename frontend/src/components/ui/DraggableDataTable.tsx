'use client';

import React, { useState, useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
  ColumnDef,
  SortingState,
  PaginationState,
} from '@tanstack/react-table';
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
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ChevronUp, ChevronDown, ChevronsUpDown, GripVertical } from 'lucide-react';
import { Button } from './button';
import { Input } from './input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';
import { Skeleton } from './skeleton';

export interface DraggableDataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  loading?: boolean;
  enableSorting?: boolean;
  onSortChange?: (field: string, order: 'asc' | 'desc') => void;
  sortField?: string;
  sortOrder?: 'asc' | 'desc';
  enablePagination?: boolean;
  showPagination?: boolean;
  serverSidePagination?: boolean;
  totalRows?: number;
  currentPage?: number;
  rowsPerPage?: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  pageSizeOptions?: number[];
  emptyMessage?: string;
  onReorder?: (newOrder: TData[]) => void;
  enableDrag?: boolean;
}

// 드래그 가능한 행 컴포넌트
function DraggableRow<TData>({
  row,
  children,
  enableDrag = true,
}: {
  row: { id: string };
  children: React.ReactNode;
  enableDrag?: boolean;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: row.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: 'none', // 애니메이션 비활성화
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <tr
      ref={setNodeRef}
      style={style}
      className={`${isDragging ? 'bg-gray-50' : ''}`}
    >
      {enableDrag && (
        <td className="w-10 px-3 py-2">
          <div
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing p-1 hover:bg-gray-100 rounded"
          >
            <GripVertical className="h-4 w-4 text-gray-400" />
          </div>
        </td>
      )}
      {children}
    </tr>
  );
}

export function DraggableDataTable<TData, TValue>({
  columns,
  data,
  loading = false,
  enableSorting = false,
  onSortChange,
  sortField,
  sortOrder,
  enablePagination = true,
  showPagination = true,
  serverSidePagination = false,
  totalRows = 0,
  currentPage = 1,
  rowsPerPage = 10,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 20, 50, 100],
  emptyMessage = '데이터가 없습니다.',
  onReorder,
  enableDrag = true,
}: DraggableDataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: currentPage - 1,
    pageSize: rowsPerPage,
  });

  // 드래그 센서 설정
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // 정렬 필드 매핑
  const fieldMap: Record<string, string> = {
    'code': 'CODE',
    'codeName': 'CODE_NM',
    'codeDescription': 'CODE_DC',
    'useAt': 'USE_AT',
    'registDate': 'REGIST_DT',
    'codeOrder': 'CODE_ORDER',
    'detailCode': 'DETAIL_CODE',
    'detailCodeName': 'DETAIL_CODE_NM',
    'detailCodeDescription': 'DETAIL_CODE_DC',
    'detailUseAt': 'DETAIL_USE_AT',
    'detailRegistDate': 'DETAIL_REGIST_DT',
  };

  const getColumnId = (columnId: string) => {
    return fieldMap[columnId] || columnId;
  };

  // 초기 정렬 상태 설정
  React.useEffect(() => {
    if (sortField && sortOrder) {
      setSorting([{ id: sortField, desc: sortOrder === 'desc' }]);
    }
  }, [sortField, sortOrder]);

  // 페이지네이션 상태 동기화
  React.useEffect(() => {
    setPagination({
      pageIndex: currentPage - 1,
      pageSize: rowsPerPage,
    });
  }, [currentPage, rowsPerPage]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: serverSidePagination ? undefined : getPaginationRowModel(),
    onSortingChange: (updater) => {
      const newSorting = typeof updater === 'function' ? updater(sorting) : updater;
      setSorting(newSorting);
      
      if (newSorting.length > 0 && onSortChange) {
        const { id, desc } = newSorting[0];
        onSortChange(getColumnId(id), desc ? 'desc' : 'asc');
      }
    },
    onPaginationChange: (updater) => {
      const newPagination = typeof updater === 'function' ? updater(pagination) : updater;
      setPagination(newPagination);
      
      if (onPageChange && newPagination.pageIndex !== pagination.pageIndex) {
        onPageChange(newPagination.pageIndex + 1);
      }
      if (onPageSizeChange && newPagination.pageSize !== pagination.pageSize) {
        onPageSizeChange(newPagination.pageSize);
      }
    },
    manualSorting: enableSorting && !!onSortChange,
    manualPagination: serverSidePagination,
    pageCount: serverSidePagination ? Math.ceil(totalRows / rowsPerPage) : undefined,
    state: {
      sorting,
      pagination,
    },
  });

  // 드래그 종료 핸들러
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    console.log('드래그 종료 이벤트:', { active, over });

    if (active.id !== over?.id && onReorder) {
      // React Table의 row.id를 사용하여 인덱스 찾기
      const oldIndex = table.getRowModel().rows.findIndex(row => row.id === active.id);
      const newIndex = table.getRowModel().rows.findIndex(row => row.id === over?.id);
      
      console.log('인덱스 정보:', { oldIndex, newIndex, activeId: active.id, overId: over?.id });
      
      if (oldIndex !== -1 && newIndex !== -1) {
        const newOrder = arrayMove(data, oldIndex, newIndex);
        console.log('새로운 순서:', newOrder);
        
        onReorder(newOrder);
      } else {
        console.log('인덱스를 찾을 수 없음');
      }
    }
  };

  // 정렬 아이콘 렌더링
  const renderSortIcon = (column: { getCanSort: () => boolean; getIsSorted: () => false | 'asc' | 'desc' }) => {
    if (!enableSorting || !column.getCanSort()) return null;

    const isSorted = column.getIsSorted();
    const isSortedDesc = column.getIsSorted() === 'desc';

    if (isSorted) {
      return isSortedDesc ? (
        <ChevronDown className="h-4 w-4" />
      ) : (
        <ChevronUp className="h-4 w-4" />
      );
    }

    return <ChevronsUpDown className="h-4 w-4 text-gray-400" />;
  };

  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex space-x-4">
            {enableDrag && <Skeleton className="h-4 w-4" />}
            {Array.from({ length: 4 }).map((_, j) => (
              <Skeleton key={j} className="h-4 flex-1" />
            ))}
          </div>
        ))}
      </div>
    );
  }

  const tableContent = (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[800px]">
      <thead>
        {table.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id} className="border-b border-gray-200">
            {enableDrag && <th className="w-10 px-3 py-3 text-left"></th>}
            {headerGroup.headers.map((header, index) => {
              // 컬럼별 텍스트 정렬 설정 (기본값: left)
              const textAlign = (header.column.columnDef as { textAlign?: 'left' | 'right' | 'center' }).textAlign || 'left';
              
              // Tailwind CSS 클래스명을 직접 매핑
              const getAlignmentClass = (align: string) => {
                switch (align) {
                  case 'right': return 'text-right';
                  case 'center': return 'text-center';
                  case 'left': 
                  default: return 'text-left';
                }
              };
              
              const alignmentClass = getAlignmentClass(textAlign);
              
              const isFirstColumn = index === 0;
              const isLastColumn = index === headerGroup.headers.length - 1;
              
              // 첫 번째 컬럼은 왼쪽 패딩, 마지막 컬럼은 오른쪽 패딩
              const paddingClass = isFirstColumn ? 'pl-6' : isLastColumn ? 'pr-6' : '';
              
              return (
                <th
                  key={header.id}
                  className={`px-3 py-3 ${alignmentClass} ${paddingClass} text-sm font-medium text-gray-900 ${
                    enableSorting && header.column.getCanSort()
                      ? 'cursor-pointer select-none hover:bg-gray-50'
                      : ''
                  }`}
                  onClick={header.column.getToggleSortingHandler()}
                >
                  <div className={`flex items-center ${textAlign === 'right' ? 'justify-end' : textAlign === 'center' ? 'justify-center' : 'justify-start'} space-x-1`}>
                    {flexRender(header.column.columnDef.header, header.getContext())}
                    {renderSortIcon(header.column)}
                  </div>
                </th>
              );
            })}
          </tr>
        ))}
      </thead>
      <tbody>
        {table.getRowModel().rows.length === 0 ? (
          <tr>
            <td
              colSpan={enableDrag ? columns.length + 1 : columns.length}
              className="px-3 py-8 text-center text-sm text-gray-500"
            >
              {emptyMessage}
            </td>
          </tr>
        ) : (
          table.getRowModel().rows.map((row) => (
            <DraggableRow
              key={row.id}
              row={row}
              enableDrag={enableDrag}
            >
              {row.getVisibleCells().map((cell, index) => {
                // 컬럼별 텍스트 정렬 설정 (기본값: left)
                const textAlign = (cell.column.columnDef as { textAlign?: 'left' | 'right' | 'center' }).textAlign || 'left';
                const alignmentClass = `text-${textAlign}`;
                
                const isFirstColumn = index === 0;
                const isLastColumn = index === row.getVisibleCells().length - 1;
                
                // 첫 번째 컬럼은 왼쪽 패딩, 마지막 컬럼은 오른쪽 패딩
                const paddingClass = isFirstColumn ? 'pl-6' : isLastColumn ? 'pr-6' : '';
                
                return (
                  <td key={cell.id} className={`px-3 py-2 ${paddingClass} text-sm text-gray-900 ${alignmentClass}`}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                );
              })}
            </DraggableRow>
          ))
        )}
      </tbody>
    </table>
    </div>
  );

  return (
    <div className="space-y-4">
      {enableDrag ? (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={table.getRowModel().rows.map((row) => row.id)}
            strategy={verticalListSortingStrategy}
          >
            {tableContent}
          </SortableContext>
        </DndContext>
      ) : (
        tableContent
      )}

      {/* 페이지네이션 */}
      {showPagination && enablePagination && (
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-700">
              페이지당 행 수:
            </span>
            <Select
              value={pagination.pageSize.toString()}
              onValueChange={(value) => {
                const newPageSize = parseInt(value);
                table.setPageSize(newPageSize);
                if (onPageSizeChange) {
                  onPageSizeChange(newPageSize);
                }
              }}
            >
              <SelectTrigger className="w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {pageSizeOptions.map((size) => (
                  <SelectItem key={size} value={size.toString()}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              처음
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              이전
            </Button>
            <span className="text-sm text-gray-700">
              {serverSidePagination
                ? `${currentPage} / ${Math.ceil(totalRows / rowsPerPage)}`
                : `${table.getState().pagination.pageIndex + 1} / ${table.getPageCount()}`}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              다음
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              마지막
            </Button>
          </div>
        </div>
      )}
    </div>
  );
} 