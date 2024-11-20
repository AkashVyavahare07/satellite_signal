'use client'

import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui'
import { SignalForm } from '@/components/signals/SignalForm'
import { SignalTable } from '@/components/signals/SignalTable'
import type { SatelliteSignal, SignalFormData } from '@/lib/types'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui'

export default function SatelliteSignalManager() {
  const [signals, setSignals] = useState<SatelliteSignal[]>([])
  const [totalPages, setTotalPages] = useState(1)
  const [currentPage, setCurrentPage] = useState(1)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const fetchSignals = async () => {
    try {
      const response = await fetch(`/api/satellite-signals?page=${currentPage}`)
      const data = await response.json()
      setSignals(data.signals)
      setTotalPages(data.totalPages)
    } catch (error) {
      toast.error('Failed to fetch signals')
    }
  }

  const handleSubmit = async (data: SignalFormData) => {
    try {
      const response = await fetch('/api/satellite-signals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      
      if (response.ok) {
        toast.success('Signal Added Successfully')
        fetchSignals()
        setIsDialogOpen(false)
      } else {
        toast.error('Failed to Add Signal')
      }
    } catch (error) {
      toast.error('Network Error')
    }
  }

  useEffect(() => {
    fetchSignals()
  }, [currentPage])

  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Satellite Signal Database</h1>
        <Button onClick={() => setIsDialogOpen(true)}>
          Add New Signal
        </Button>
      </div>

      <SignalTable 
        signals={signals}
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Satellite Signal</DialogTitle>
          </DialogHeader>
          <SignalForm onSubmit={handleSubmit} />
        </DialogContent>
      </Dialog>
    </div>
  )
}