import { z } from 'zod'

export const SignalSchema = z.object({
  satelliteName: z.string().min(2, "Name must be at least 2 characters"),
  operator: z.string().optional(),
  frequency: z.coerce.number().min(0).max(100000),
  polarization: z.enum(['VERTICAL', 'HORIZONTAL', 'LEFT_CIRCULAR', 'RIGHT_CIRCULAR']),
  modulation: z.enum(['QPSK', 'EIGHT_PSK', 'SIXTEEN_APSK', 'THIRTY_TWO_APSK', 'SIXTY_FOUR_APSK', 'DVB_S', 'DVB_S2']),
  symbolRate: z.coerce.number().min(1),
  fec: z.string(),
  bandwidth: z.coerce.number().min(0),
  serviceType: z.enum(['TV', 'RADIO', 'DATA', 'INTERNET', 'TELEPHONY', 'MILITARY', 'SCIENTIFIC']),
  encryption: z.boolean().optional(),
  transponders: z.number().optional(),
  coverage: z.record(z.unknown()).optional(),
  status: z.enum(['ACTIVE', 'INACTIVE', 'MAINTENANCE', 'TESTING']).optional()
})