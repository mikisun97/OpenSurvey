'use client';

import { useState, useMemo, useEffect } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  flexRender,
  ColumnDef,
  SortingState,
  ColumnFiltersState,
} from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';

interface DataTableProps<TData, TValue> {
  data: TData[];
  columns: ColumnDef<TData, TValue>[];
  loading?: boolean;
  enableSorting?: boolean;
  enablePagination?: boolean;
  onSortChange?: (field: string, order: 'ASC' | 'DESC') => void;
  sortField?: string;
  sortOrder?: 'ASC' | 'DESC';
  pageSize?: number;
  pageSizeOptions?: number[];
  showPagination?: boolean;
  emptyMessage?: string;
  className?: string;
  // 서버 사이드 페이지네이션 관련 props
  totalRows?: number;
  currentPage?: number;
  rowsPerPage?: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  serverSidePagination?: boolean;
}

export default function DataTable<TData, TValue>({
  data,
  columns,
  loading = false,
  enableSorting = true,
  enablePagination = true,
  onSortChange,
  sortField,
  sortOrder,
  pageSize = 10,
  pageSizeOptions = [10, 20, 50],
  showPagination = true,
  emptyMessage = "데이터가 없습니다.",
  className = "",
  // 서버 사이드 페이지네이션 관련 props
  totalRows,
  currentPage = 1,
  rowsPerPage = 10,
  onPageChange,
  onPageSizeChange,
  serverSidePagination = false
}: DataTableProps<TData, TValue>) {
  

  
  // sortField를 컬럼 ID로 변환하는 함수 (간단하게)
  const getColumnId = (sortField: string): string => sortField;
  
  // 초기 정렬 상태를 props로부터 직접 설정
  const initialSorting: SortingState = sortField && sortOrder ? [{
    id: getColumnId(sortField),
    desc: sortOrder === 'DESC'
  }] : [];
  
  console.log('초기 정렬 상태:', { sortField, sortOrder, initialSorting });
  
  const [sorting, setSorting] = useState<SortingState>(initialSorting);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: pageSize,
  });

  // props 변경 시 정렬 상태 업데이트
  useEffect(() => {
    if (sortField && sortOrder) {
      const newSorting = [{
        id: getColumnId(sortField),
        desc: sortOrder === 'DESC'
      }];
      console.log('정렬 상태 업데이트:', { sortField, sortOrder, newSorting });
      setSorting(newSorting);
    }
  }, [sortField, sortOrder]);

  // 정렬 변경 핸들러
  const handleSortingChange = (updater: SortingState | ((prev: SortingState) => SortingState)) => {
    const newSorting = typeof updater === 'function' ? updater(sorting) : updater;
    
    // 정렬 해제 상태를 제거하고 ASC, DESC만 순환
    if (newSorting.length === 0 && sorting.length > 0) {
      // 정렬 해제 시 ASC로 변경
      const currentSort = sorting[0];
      const newSort = {
        id: currentSort.id,
        desc: false // ASC
      };
      setSorting([newSort]);
      
      if (onSortChange) {
        onSortChange(newSort.id, 'ASC');
      }
      return;
    }
    
    setSorting(newSorting);
    
    if (newSorting.length > 0 && onSortChange) {
      const sort = newSorting[0];
      const order = sort.desc ? 'DESC' : 'ASC';
      onSortChange(sort.id, order);
    }
  };

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting: serverSidePagination ? (sortField && sortOrder ? [{
        id: getColumnId(sortField),
        desc: sortOrder === 'DESC'
      }] : []) : sorting,
      columnFilters,
      pagination: serverSidePagination ? undefined : pagination,
    },
    onSortingChange: handleSortingChange,
    onColumnFiltersChange: setColumnFilters,
    onPaginationChange: serverSidePagination ? undefined : setPagination,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: serverSidePagination ? undefined : getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    enableSorting,
    enableMultiSort: false,
    sortDescFirst: false,
  });

  const tableContent = (
    <div className="overflow-x-auto">
      <table className={`w-full min-w-[800px] group ${className}`}>
        <thead className="bg-white border-b border-gray-200">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
                          {headerGroup.headers.map((header, index) => {
              // 컬럼별 텍스트 정렬 설정 (기본값: left)
              const textAlign = (header.column.columnDef as { textAlign?: 'left' | 'right' | 'center' }).textAlign || 'left';
              const alignmentClass = `text-${textAlign}`;
              
              const isFirstColumn = index === 0;
              const isLastColumn = index === headerGroup.headers.length - 1;
              
              // 첫 번째 컬럼은 왼쪽 패딩, 마지막 컬럼은 오른쪽 패딩
              const paddingClass = isFirstColumn ? 'pl-6' : isLastColumn ? 'pr-6' : '';
              
              return (
                <th
                  key={header.id}
                  className={`px-4 py-3 ${alignmentClass} ${paddingClass} text-sm font-medium text-gray-700 uppercase tracking-wider whitespace-nowrap ${
                    header.column.getCanSort() ? 'cursor-pointer select-none hover:bg-gray-50' : ''
                  }`}
                  onClick={header.column.getToggleSortingHandler()}
                >
                  <div className={`flex items-center ${textAlign === 'right' ? 'justify-end' : textAlign === 'center' ? 'justify-center' : 'justify-start'} space-x-1`}>
                    <span>
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </span>
                    {/* 정렬 아이콘 - 정렬 가능한 컬럼에만 표시 */}
                      {header.column.getCanSort() && (
                        <div className="ml-2">
                          {(() => {
                            // 서버 사이드 정렬인 경우 props에서 직접 정렬 상태 확인
                            if (serverSidePagination && sortField && sortOrder) {
                              // sortField와 컬럼 id가 같으면 정렬 아이콘 표시 (대소문자 구분 없이)
                              const isCurrentColumn = header.id.toLowerCase() === sortField.toLowerCase();
                              
                              if (isCurrentColumn) {
                                if (sortOrder === 'DESC') {
                                  return <ChevronDown className="w-4 h-4 text-gray-900" />;
                                } else {
                                  return <ChevronUp className="w-4 h-4 text-gray-900" />;
                                }
                              } else {
                                return <ChevronsUpDown className="w-4 h-4 text-gray-400" />;
                              }
                            } else {
                              // 클라이언트 사이드 정렬인 경우 기존 방식 사용
                              const sortDirection = header.column.getIsSorted();
                              if (sortDirection === 'asc') {
                                return <ChevronUp className="w-4 h-4 text-gray-900" />;
                              } else if (sortDirection === 'desc') {
                                return <ChevronDown className="w-4 h-4 text-gray-900" />;
                              } else {
                                return <ChevronsUpDown className="w-4 h-4 text-gray-400" />;
                              }
                            }
                          })()}
                        </div>
                      )}
                  </div>
                </th>
              );
            })}
            </tr>
          ))}
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {loading ? (
            // 로딩 중일 때 스켈레톤 로딩 표시
            Array.from({ length: 5 }).map((_, index) => (
              <tr key={`loading-${index}`} className="animate-pulse">
                {Array.from({ length: columns.length }).map((_, cellIndex) => (
                  <td key={`loading-cell-${index}-${cellIndex}`} className="px-4 py-3">
                    <div className="h-4 bg-gray-200 rounded"></div>
                  </td>
                ))}
              </tr>
            ))
          ) : table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50">
                {row.getVisibleCells().map((cell, index) => {
                  // 컬럼별 텍스트 정렬 설정 (기본값: left)
                  const textAlign = (cell.column.columnDef as { textAlign?: 'left' | 'right' | 'center' }).textAlign || 'left';
                  const alignmentClass = `text-${textAlign}`;
                  
                  const isFirstColumn = index === 0;
                  const isLastColumn = index === row.getVisibleCells().length - 1;
                  
                  // 첫 번째 컬럼은 왼쪽 패딩, 마지막 컬럼은 오른쪽 패딩
                  const paddingClass = isFirstColumn ? 'pl-6' : isLastColumn ? 'pr-6' : '';
                  
                  return (
                    <td key={cell.id} className={`px-4 py-3 ${paddingClass} text-sm text-gray-900 whitespace-nowrap ${alignmentClass}`}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  );
                })}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length} className="px-4 py-8 text-center text-gray-500">
                {emptyMessage}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );

  // 클라이언트 사이드 페이지네이션 컴포넌트
  const clientPaginationComponent = showPagination && enablePagination && !serverSidePagination && (
    <div className="bg-white border-t border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-700">
          {table.getFilteredRowModel().rows.length > 0 && (
            <>
              {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} -{' '}
              {Math.min(
                (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
                table.getFilteredRowModel().rows.length
              )}{' '}
              / {table.getFilteredRowModel().rows.length}개 항목
            </>
          )}
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-700">페이지당 행:</span>
            <Select
              value={table.getState().pagination.pageSize.toString()}
              onValueChange={(value) => {
                table.setPageSize(Number(value));
              }}
            >
              <SelectTrigger className="w-20 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {pageSizeOptions.map((size) => (
                  <SelectItem key={size} value={size.toString()} className="text-sm">
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
              className="text-sm"
            >
              <ChevronsLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="text-sm"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-sm text-gray-700">
              {table.getState().pagination.pageIndex + 1} / {table.getPageCount()}
            </span>
            <Button
              variant="outline"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="text-sm"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
              className="text-sm"
            >
              <ChevronsRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  // 서버 사이드 페이지네이션 컴포넌트
  const serverPaginationComponent = showPagination && enablePagination && serverSidePagination && (
    <div className="bg-white border-t border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-700">
          {loading ? (
            <span className="text-gray-400">로딩 중...</span>
          ) : totalRows && totalRows > 0 ? (
            `${((currentPage - 1) * rowsPerPage) + 1} - ${Math.min(currentPage * rowsPerPage, totalRows)} / ${totalRows}개 항목`
          ) : (
            <span className="text-gray-400">데이터가 없습니다</span>
          )}
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-700">페이지당 행:</span>
            <Select 
              value={rowsPerPage.toString()} 
              onValueChange={(value: string) => {
                onPageSizeChange?.(Number(value));
              }}
              disabled={loading}
            >
              <SelectTrigger className="w-20 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {pageSizeOptions.map((size) => (
                  <SelectItem key={size} value={size.toString()} className="text-sm">
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              onClick={() => onPageChange?.(1)}
              disabled={currentPage === 1 || loading}
              className="text-sm"
            >
              <ChevronsLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              onClick={() => onPageChange?.(currentPage - 1)}
              disabled={currentPage === 1 || loading}
              className="text-sm"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-sm text-gray-700">
              {loading ? (
                <span className="text-gray-400">로딩 중...</span>
              ) : totalRows && totalRows > 0 ? (
                `${currentPage} / ${Math.ceil(totalRows / rowsPerPage)}`
              ) : (
                <span className="text-gray-400">-</span>
              )}
            </span>
            <Button
              variant="outline"
              onClick={() => onPageChange?.(currentPage + 1)}
              disabled={!totalRows || currentPage >= Math.ceil(totalRows / rowsPerPage) || loading}
              className="text-sm"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              onClick={() => onPageChange?.(Math.ceil((totalRows || 0) / rowsPerPage))}
              disabled={!totalRows || currentPage >= Math.ceil((totalRows || 0) / rowsPerPage) || loading}
              className="text-sm"
            >
              <ChevronsRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {tableContent}
      {clientPaginationComponent}
      {serverPaginationComponent}
    </>
  );
} 