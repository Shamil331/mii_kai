import { describe, expect, it } from 'vitest'
import { getMinDeliveryDate, isDeliveryDateAllowed } from './dates'

describe('delivery date rules', () => {
  it('min delivery is today + 2 calendar days', () => {
    const from = new Date(2026, 9, 15) // 15 Oct 2026 local
    expect(getMinDeliveryDate(from)).toBe('2026-10-17')
  })

  it('rejects dates earlier than min lead time', () => {
    const from = new Date(2026, 9, 15)
    expect(isDeliveryDateAllowed('2026-10-16', from)).toBe(false)
    expect(isDeliveryDateAllowed('2026-10-17', from)).toBe(true)
  })
})
