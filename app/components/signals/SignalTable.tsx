'use client'

import { useState } from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { DataTable } from '@/components/ui/data-table'
import type { SatelliteSignal } from '@/lib/types'

const columns: ColumnDef<SatelliteSignal>[] = [
  {
    accessorKey: 'satelliteName',
    header: 'Satellite Name'
  },
  {
    accessorKey: 'frequency',
    header: 'Frequency (MHz)'
  },
  {
    accessorKey: 'polarization',
    header: 'Polarization'
  },
  {
    accessorKey: 'modulation',
    header: 'Modulation'
  },
  {
    accessorKey: 'status',
    header: 'Status'
  }
]

interface SignalTableProps {
  signals: SatelliteSignal[]
  totalPages: number
  currentPage: number
  onPageChange: (page: number) => void
}

export function SignalTable({ 
  signals, 
  totalPages, 
  currentPage, 
  onPageChange 
}: SignalTableProps) {
  return (
    <DataTable
      columns={columns}
      data={signals}
      pagination={{
        totalPages,
        currentPage,
        onPageChange
      }}
    />
  )
}