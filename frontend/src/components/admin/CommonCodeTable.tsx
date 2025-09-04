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
import { Badge } from '@/components/ui/badge';
import { CommonCodeVO } from '@/types';
import { Eye, Edit, Trash2, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, ChevronUp, ChevronDown, ChevronsUpDown, Settings } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface CommonCodeTableProps {
  data: CommonCodeVO[];
  onEdit: (code: CommonCodeVO) => void;
  onDelete: (codeId: string) => void;
  loading?: boolean;
  sortField?: string;
  sortOrder?: 'ASC' | 'DESC';
  onSortChange?: (field: string, order: 'ASC' | 'DESC') => void;
}

export default function CommonCodeTable({ data, onEdit, onDelete, loading = false, sortField, sortOrder, onSortChange }: CommonCodeTableProps) {
  const router = useRouter();
  
  // 필드 매핑 정의
  const fieldMap: { [key: string]: string } = {
    'CODE_ID': 'codeId',
    'CODEIDNM': 'codeIdNm',
    'CLCODE': 'clCode',
    'CODEIDDC': 'codeIdDc',
    'SORTORDR': 'sortOrdr',
    'USEAT': 'useAt',
    'REGISTDATE': 'registDate',
    'UPDATEDATE': 'updateDate'
  };
  
  // sortField를 컬럼 ID로 변환하는 함수
  const getColumnId = (sortField: string): string => {
    return fieldMap[sortField] || sortField.toLowerCase();
  };
  
  // 초기 정렬 상태를 props로부터 직접 설정
  const initialSorting: SortingState = sortField && sortOrder ? [{
    id: getColumnId(sortField),
    desc: sortOrder === 'DESC'
  }] : [];
  
  const [sorting, setSorting] = useState<SortingState>(initialSorting);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

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

  const columns = useMemo<ColumnDef<CommonCodeVO>[]>(
    () => [
      {
        id: 'no',
        header: 'NO',
        cell: ({ row }) => <span>{data.length - row.index}</span>,
        enableSorting: false,
      },
      {
        id: 'codeId',
        header: '코드',
        accessorKey: 'codeId',
        cell: ({ row }) => (
          <button 
            className="text-orange-600 hover:text-orange-800 underline font-medium"
            onClick={() => router.push(`/admin/cms/common-code/edit/${row.original.codeId}`)}
          >
            {row.original.codeId}
          </button>
        ),
      },
      {
        accessorKey: 'codeIdNm',
        header: '코드명',
      },
      {
        accessorKey: 'clCode',
        header: '상위코드',
        cell: ({ row }) => row.original.clCode || 'SYSTEM_CODE',
      },
      {
        accessorKey: 'codeIdDc',
        header: '코드설명',
        cell: ({ row }) => row.original.codeIdDc || '-',
      },
      {
        accessorKey: 'sortOrdr',
        header: '순서',
        cell: () => '0',
      },
      {
        accessorKey: 'useAt',
        header: '사용',
        cell: ({ row }) => (
          <Badge 
            variant={row.original.useAt === 'Y' ? 'default' : 'secondary'} 
            className={`px-2 py-1 text-sm ${
              row.original.useAt === 'Y' 
                ? 'bg-green-100 text-green-800 hover:bg-green-100' 
                : 'bg-red-100 text-red-800 hover:bg-red-100'
            }`}
          >
            {row.original.useAt === 'Y' ? '사용' : '미사용'}
          </Badge>
        ),
      },
      {
        accessorKey: 'registDate',
        header: '등록',
        cell: ({ row }) => {
          const date = row.original.registDate ? new Date(row.original.registDate).toLocaleDateString() : '-';
          const user = row.original.registUser ? `(${row.original.registUser})` : '';
          return `${date} ${user}`;
        },
      },
      {
        accessorKey: 'updateDate',
        header: '수정',
        cell: ({ row }) => {
          const date = row.original.updateDate ? new Date(row.original.updateDate).toLocaleDateString() : '-';
          const user = row.original.updateUser ? `(${row.original.updateUser})` : '';
          return `${date} ${user}`;
        },
      },
      {
        id: 'actions',
        header: '관리',
        cell: ({ row }) => (
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => router.push(`/admin/cms/common-code/edit/${row.original.codeId}`)}
              title="상세보기"
            >
              <Eye className="w-4 h-4" />
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => router.push(`/admin/cms/common-code/${row.original.codeId}/details`)}
              title="하위코드 관리"
            >
              <Settings className="w-4 h-4" />
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onEdit(row.original)}
              title="수정"
            >
              <Edit className="w-4 h-4" />
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onDelete(row.original.codeId)}
              title="삭제"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ),
        enableSorting: false,
      },
    ],
    [data, router, onEdit, onDelete]
  );

  // 디버깅: 현재 정렬 상태 출력
  console.log('CommonCodeTable 렌더링:', { 
    sortField, 
    sortOrder, 
    sorting: sorting.map(s => ({ id: s.id, desc: s.desc })),
    initialSorting: initialSorting.map(s => ({ id: s.id, desc: s.desc })),
    dataLength: data.length 
  });

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
    },
    initialState: {
      sorting: initialSorting,
    },
    onSortingChange: (updater) => {
      const newSorting = typeof updater === 'function' ? updater(sorting) : updater;
      console.log('정렬 변경 상세:', { 
        oldSorting: sorting.map(s => ({ id: s.id, desc: s.desc })), 
        newSorting: newSorting.map(s => ({ id: s.id, desc: s.desc })),
        newSortingLength: newSorting.length,
        sortingLength: sorting.length
      });
      
      // 정렬이 해제된 경우 (빈 배열), 이전 정렬 상태를 유지하되 방향만 토글
      if (newSorting.length === 0 && sorting.length > 0) {
        const currentSort = sorting[0];
        const toggledSorting = [{
          id: currentSort.id,
          desc: !currentSort.desc
        }];
        console.log('정렬 토글 (해제됨):', { currentSort, toggledSorting });
        setSorting(toggledSorting);
        
                  // 백엔드 정렬 요청
          if (onSortChange) {
            const field = Object.keys(fieldMap).find(key => fieldMap[key] === currentSort.id) || currentSort.id.toUpperCase();
            const order = !currentSort.desc ? 'DESC' : 'ASC';
            onSortChange(field, order);
          }
      } else if (newSorting.length > 0 && sorting.length > 0) {
        // 정렬 상태가 있는 경우
        console.log('ID 비교:', { 
          newSortingId: newSorting[0].id, 
          sortingId: sorting[0].id, 
          isEqual: newSorting[0].id === sorting[0].id 
        });
        
        if (newSorting[0].id === sorting[0].id) {
          // 같은 컬럼을 클릭한 경우, 방향만 토글
          const currentSort = sorting[0];
          const toggledSorting = [{
            id: currentSort.id,
            desc: !currentSort.desc
          }];
          console.log('정렬 토글 (같은 컬럼):', { currentSort, toggledSorting });
          setSorting(toggledSorting);
          
          // 백엔드 정렬 요청
          if (onSortChange) {
            const field = Object.keys(fieldMap).find(key => fieldMap[key] === currentSort.id) || currentSort.id.toUpperCase();
            const order = !currentSort.desc ? 'DESC' : 'ASC';
            onSortChange(field, order);
          }
        } else {
          // 다른 컬럼을 클릭한 경우, 새로운 정렬 적용 (항상 ASC로 시작)
          const newSort = {
            id: newSorting[0].id,
            desc: false // 항상 ASC로 시작
          };
          console.log('새로운 정렬 (다른 컬럼):', newSort);
          setSorting([newSort]);
          
          // 백엔드 정렬 요청
          if (onSortChange) {
            const field = Object.keys(fieldMap).find(key => fieldMap[key] === newSort.id) || newSort.id.toUpperCase();
            const order = 'ASC';
            onSortChange(field, order);
          }
        }
      } else {
        // 새로운 정렬 (처음 정렬하는 경우)
        console.log('새로운 정렬 (처음):', newSorting);
        setSorting(newSorting);
        
        // 백엔드 정렬 요청
        if (newSorting.length > 0 && onSortChange) {
          const sort = newSorting[0];
          const field = Object.keys(fieldMap).find(key => fieldMap[key] === sort.id) || sort.id.toUpperCase();
          const order = sort.desc ? 'DESC' : 'ASC';
          onSortChange(field, order);
        }
      }
    },
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    enableSorting: true,
    enableMultiSort: false, // 단일 컬럼 정렬만 허용
    sortDescFirst: false, // ASC -> DESC 순서
  });

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[1200px] group">
        <thead className="bg-white border-b border-gray-200">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className={`px-4 py-3 text-left text-sm font-medium text-gray-700 uppercase tracking-wider whitespace-nowrap ${
                    header.column.getCanSort() ? 'cursor-pointer select-none hover:bg-gray-50' : ''
                  }`}
                  onClick={header.column.getToggleSortingHandler()}
                >
                  <div className="flex items-center justify-between">
                    <span>
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </span>
                    {header.column.getCanSort() && (
                      <div className="ml-2">
                        {{
                          asc: <ChevronUp className="h-4 w-4 text-gray-600" />,
                          desc: <ChevronDown className="h-4 w-4 text-gray-600" />,
                        }[header.column.getIsSorted() as string] ?? (
                          <ChevronsUpDown className="h-4 w-4 text-gray-400 opacity-50 group-hover:opacity-100" />
                        )}
                      </div>
                    )}
                  </div>
                </th>
              ))}
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
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-4 py-3 text-base text-gray-900 whitespace-nowrap">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length} className="px-4 py-8 text-center text-gray-500">
                등록된 공통코드가 없습니다.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
} 