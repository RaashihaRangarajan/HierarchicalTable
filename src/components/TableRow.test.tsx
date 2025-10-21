import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import TableRow from './TableRow'
import { HierarchicalRow } from '../types'

describe('TableRow', () => {
  const mockOnValueChange = vi.fn()

  const sampleRow: HierarchicalRow = {
    id: 'electronics',
    label: 'Electronics',
    value: 1500,
    originalValue: 1500,
    level: 0,
    isSubtotal: true,
    children: [
      { id: 'phones', label: 'Phones', value: 800, originalValue: 800, parentId: 'electronics', level: 1 },
      { id: 'laptops', label: 'Laptops', value: 700, originalValue: 700, parentId: 'electronics', level: 1 }
    ]
  }

  const leafRow: HierarchicalRow = {
    id: 'phones',
    label: 'Phones',
    value: 800,
    originalValue: 800,
    parentId: 'electronics',
    level: 1
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render row with correct label and value', () => {
    render(<TableRow row={sampleRow} onValueChange={mockOnValueChange} />)
    
    expect(screen.getByText('Electronics')).toBeInTheDocument()
    expect(screen.getByText('$1,500')).toBeInTheDocument()
  })

  it('should render expand/collapse button for rows with children', () => {
    render(<TableRow row={sampleRow} onValueChange={mockOnValueChange} />)
    
    const expandButton = screen.getByRole('button', { name: /▼/ })
    expect(expandButton).toBeInTheDocument()
  })

  it('should not render expand button for leaf rows', () => {
    render(<TableRow row={leafRow} onValueChange={mockOnValueChange} />)
    
    const expandButton = screen.queryByRole('button', { name: /▼/ })
    expect(expandButton).not.toBeInTheDocument()
  })

  it('should toggle expand/collapse when button is clicked', async () => {
    const user = userEvent.setup()
    render(<TableRow row={sampleRow} onValueChange={mockOnValueChange} />)
    
    const expandButton = screen.getByRole('button', { name: /▼/ })
    await user.click(expandButton)
    
    expect(screen.getByRole('button', { name: /▶/ })).toBeInTheDocument()
  })

  it('should render children when expanded', () => {
    render(<TableRow row={sampleRow} onValueChange={mockOnValueChange} />)
    
    expect(screen.getByText('Phones')).toBeInTheDocument()
    expect(screen.getByText('Laptops')).toBeInTheDocument()
  })

  it('should handle percentage allocation correctly', async () => {
    const user = userEvent.setup()
    render(<TableRow row={leafRow} onValueChange={mockOnValueChange} />)
    
    const input = screen.getByPlaceholderText('Enter value')
    const percentageButton = screen.getByText('Allocation %')
    
    await user.type(input, '10')
    await user.click(percentageButton)
    
    expect(mockOnValueChange).toHaveBeenCalledWith('phones', 880) // 800 + 10% of 800
  })

  it('should handle direct value allocation correctly', async () => {
    const user = userEvent.setup()
    render(<TableRow row={leafRow} onValueChange={mockOnValueChange} />)
    
    const input = screen.getByPlaceholderText('Enter value')
    const valueButton = screen.getByText('Allocation Val')
    
    await user.type(input, '1000')
    await user.click(valueButton)
    
    expect(mockOnValueChange).toHaveBeenCalledWith('phones', 1000)
  })

  it('should disable buttons when input is empty', () => {
    render(<TableRow row={leafRow} onValueChange={mockOnValueChange} />)
    
    const percentageButton = screen.getByText('Allocation %')
    const valueButton = screen.getByText('Allocation Val')
    
    expect(percentageButton).toBeDisabled()
    expect(valueButton).toBeDisabled()
  })

  it('should clear input after allocation', async () => {
    const user = userEvent.setup()
    render(<TableRow row={leafRow} onValueChange={mockOnValueChange} />)
    
    const input = screen.getByPlaceholderText('Enter value') as HTMLInputElement
    const percentageButton = screen.getByText('Allocation %')
    
    await user.type(input, '10')
    await user.click(percentageButton)
    
    expect(input.value).toBe('')
  })

  it('should display variance correctly', () => {
    const rowWithVariance: HierarchicalRow = {
      ...leafRow,
      value: 880,
      variance: 10
    }
    
    render(<TableRow row={rowWithVariance} onValueChange={mockOnValueChange} />)
    
    expect(screen.getByText('+10.00%')).toBeInTheDocument()
  })

  it('should display negative variance correctly', () => {
    const rowWithNegativeVariance: HierarchicalRow = {
      ...leafRow,
      value: 720,
      variance: -10
    }
    
    render(<TableRow row={rowWithNegativeVariance} onValueChange={mockOnValueChange} />)
    
    expect(screen.getByText('-10.00%')).toBeInTheDocument()
  })
})
