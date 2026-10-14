import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { MealCard } from './MealCard'
import type { MealSet } from '@/types/meal'

const meal: MealSet = {
  id: 'day-balance',
  name: 'День в балансе',
  dietType: 'balanced',
  duration: 'day',
  priceRub: 1490,
  description: 'Пять блюд',
  dishes: ['Обед'],
  imageGradient: 'from-emerald-800/80 to-stone-400/60',
}

describe('MealCard', () => {
  it('renders meal and calls onAdd', async () => {
    const user = userEvent.setup()
    const onAdd = vi.fn()
    const onSelect = vi.fn()
    render(
      <MealCard meal={meal} onAdd={onAdd} onSelect={onSelect} />,
    )
    expect(screen.getByText('День в балансе')).toBeInTheDocument()
    expect(screen.getByText(/1 день/)).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'В корзину' }))
    expect(onAdd).toHaveBeenCalledWith('day-balance')
  })
})
