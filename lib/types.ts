export interface SatelliteSignal {
  id: string
  satelliteName: string
  operator?: string
  frequency: number
  polarization: 'VERTICAL' | 'HORIZONTAL' | 'LEFT_CIRCULAR' | 'RIGHT_CIRCULAR'
  modulation: 'QPSK' | 'EIGHT_PSK' | 'SIXTEEN_APSK' | 'THIRTY_TWO_APSK' | 'SIXTY_FOUR_APSK' | 'DVB_S' | 'DVB_S2'
  symbolRate: number
  fec: string
  bandwidth: number
  serviceType: 'TV' | 'RADIO' | 'DATA' | 'INTERNET' | 'TELEPHONY' | 'MILITARY' | 'SCIENTIFIC'
  encryption?: boolean
  transponders?: number
  coverage?: Record<string, unknown>
  status?: 'ACTIVE' | 'INACTIVE' | 'MAINTENANCE' | 'TESTING'
  createdAt: string
  updatedAt: string
}

export type SignalFormData = Omit<SatelliteSignal, 'id' | 'createdAt' | 'updatedAt'>