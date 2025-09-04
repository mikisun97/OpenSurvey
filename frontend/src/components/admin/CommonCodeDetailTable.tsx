'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ColumnDef, 
  flexRender, 
  getCoreRowModel, 
  useReactTable,
  SortingState,
  ColumnFiltersState,
  getFilteredRowModel,
  getPaginationRowModel
} from '@tanstack/react-table';
import { CommonCodeDetailVO } from '@/types';
import { Eye, Edit } from 'lucide-react';

interface CommonCodeDetailTableProps {
  data: CommonCodeDetailVO[];
  onEdit: (detail: CommonCodeDetailVO) => void;
  loading?: boolean;
}

export default function CommonCodeDetailTable({ data, onEdit, loading = false }: CommonCodeDetailTableProps) {
  const router = useRouter();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const columns = useMemo<ColumnDef<CommonCodeDetailVO>[]>(
    () => [
      {
        id: 'no',
        header: 'NO',
        cell: ({ row }) => <span>{data.length - row.index}</span>,
        enableSorting: false,
      },
      {
        id: 'code',
        header: '코드',
        accessorKey: 'code',
        cell: ({ row }) => (
          <span className="text-gray-900">{row.original.code}</span>
        ),
      },
      {
        accessorKey: 'codeNm',
        header: '코드명',
        cell: ({ row }) => (
          <span className="text-gray-900">{row.original.codeNm}</span>
        ),
      },
      {
        accessorKey: 'codeId',
        header: '상위코드',
        cell: ({ row }) => (
          <span className="text-gray-900">{row.original.codeId}</span>
        ),
      },
      {
        accessorKey: 'codeDc',
        header: '코드설명',
        cell: ({ row }) => (
          <span className="text-gray-900">{row.original.codeDc || '-'}</span>
        ),
      },
      {
        accessorKey: 'codeOrder',
        header: '순서',
        cell: ({ row }) => (
          <span className="text-gray-900">{row.original.codeOrder}</span>
        ),
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
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onEdit(row.original)}
          >
            <Edit className="w-4 h-4" />
          </Button>
        ),
        enableSorting: false,
      },
    ],
    [data, onEdit]
  );

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    enableSorting: true,
    enableMultiSort: false,
    sortDescFirst: false,
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
                등록된 하위코드가 없습니다.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
} 