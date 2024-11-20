import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { z } from 'zod'

// Validation Schema
const SatelliteSignalSchema = z.object({
  satelliteName: z.string().min(2),
  operator: z.string().optional(),
  frequency: z.number().min(0).max(100000),
  polarization: z.enum(['VERTICAL', 'HORIZONTAL', 'LEFT_CIRCULAR', 'RIGHT_CIRCULAR']),
  modulation: z.enum(['QPSK', 'EIGHT_PSK', 'SIXTEEN_APSK', 'THIRTY_TWO_APSK', 'SIXTY_FOUR_APSK', 'DVB_S', 'DVB_S2']),
  symbolRate: z.number().min(1),
  fec: z.string(),
  bandwidth: z.number().min(0),
  serviceType: z.enum(['TV', 'RADIO', 'DATA', 'INTERNET', 'TELEPHONY', 'MILITARY', 'SCIENTIFIC']),
  encryption: z.boolean().optional(),
  transponders: z.number().optional(),
  coverage: z.record(z.unknown()).optional(),
  status: z.enum(['ACTIVE', 'INACTIVE', 'MAINTENANCE', 'TESTING']).optional()
})

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '10')
  const search = searchParams.get('search')
  
  const filters = {
    frequency: {
      gte: parseFloat(searchParams.get('minFrequency') || '0'),
      lte: parseFloat(searchParams.get('maxFrequency') || '100000')
    },
    polarization: searchParams.get('polarization') || undefined,
    modulation: searchParams.get('modulation') || undefined,
    serviceType: searchParams.get('serviceType') || undefined,
    status: searchParams.get('status') || undefined
  }

  const where = {
    AND: [
      search ? {
        OR: [
          { satelliteName: { contains: search, mode: 'insensitive' } },
          { operator: { contains: search, mode: 'insensitive' } }
        ]
      } : {},
      filters.frequency ? { frequency: filters.frequency } : {},
      filters.polarization ? { polarization: filters.polarization } : {},
      filters.modulation ? { modulation: filters.modulation } : {},
      filters.serviceType ? { serviceType: filters.serviceType } : {},
      filters.status ? { status: filters.status } : {}
    ]
  }

  const [signals, totalCount] = await Promise.all([
    prisma.satelliteSignal.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { frequency: 'asc' },
      include: {
        _count: {
          select: { signalLogs: true, performanceMetrics: true }
        }
      }
    }),
    prisma.satelliteSignal.count({ where })
  ])

  return NextResponse.json({
    signals: signals.map(signal => ({
      ...signal,
      logCount: signal._count.signalLogs,
      metricCount: signal._count.performanceMetrics
    })),
    totalPages: Math.ceil(totalCount / limit),
    currentPage: page,
    totalSignals: totalCount
  })
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const validatedData = SatelliteSignalSchema.parse(body)
    
    const signal = await prisma.satelliteSignal.create({
      data: validatedData
    })

    return NextResponse.json(signal, { status: 201 })
  } catch (error) {
    console.error('Signal Creation Error:', error)
    return NextResponse.json({ 
      error: error instanceof z.ZodError 
        ? 'Validation Failed' 
        : 'Failed to create satellite signal',
      details: error instanceof z.ZodError ? error.errors : null
    }, { status: 400 })
  }
}

export async function PUT(request: Request) {
  try {
    const { id, ...updateData } = await request.json()
    
    const validatedData = SatelliteSignalSchema.partial().parse(updateData)
    
    const updatedSignal = await prisma.satelliteSignal.update({
      where: { id },
      data: validatedData
    })

    return NextResponse.json(updatedSignal)
  } catch (error) {
    console.error('Signal Update Error:', error)
    return NextResponse.json({ error: 'Failed to update satellite signal' }, { status: 400 })
  }
}