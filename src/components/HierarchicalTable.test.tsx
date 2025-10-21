import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import HierarchicalTable from './HierarchicalTable'

// Mock the data
vi.mock('../data', () => ({
  initialData: [
    {
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
    },
    {
      id: 'furniture',
      label: 'Furniture',
      value: 1000,
      originalValue: 1000,
      level: 0,
      isSubtotal: true,
      children: [
        { id: 'tables', label: 'Tables', value: 300, originalValue: 300, parentId: 'furniture', level: 1 },
        { id: 'chairs', label: 'Chairs', value: 700, originalValue: 700, parentId: 'furniture', level: 1 }
      ]
    }
  ]
}))

describe('HierarchicalTable', () => {
  it('should render table with correct headers', () => {
    render(<HierarchicalTable />)
    
    expect(screen.getByText('Label')).toBeInTheDocument()
    expect(screen.getByText('Value')).toBeInTheDocument()
    expect(screen.getByText('Input')).toBeInTheDocument()
    expect(screen.getByText('Allocation %')).toBeInTheDocument()
    expect(screen.getByText('Allocation Val')).toBeInTheDocument()
    expect(screen.getByText('Variance %')).toBeInTheDocument()
  })

  it('should render main categories', () => {
    render(<HierarchicalTable />)
    
    expect(screen.getByText('Electronics')).toBeInTheDocument()
    expect(screen.getByText('Furniture')).toBeInTheDocument()
  })

  it('should render subcategories', () => {
    render(<HierarchicalTable />)
    
    expect(screen.getByText('Phones')).toBeInTheDocument()
    expect(screen.getByText('Laptops')).toBeInTheDocument()
    expect(screen.getByText('Tables')).toBeInTheDocument()
    expect(screen.getByText('Chairs')).toBeInTheDocument()
  })

  it('should display correct values', () => {
    render(<HierarchicalTable />)
    
    expect(screen.getByText('$1,500')).toBeInTheDocument()
    expect(screen.getByText('$1,000')).toBeInTheDocument()
    expect(screen.getByText('$800')).toBeInTheDocument()
    expect(screen.getByText('$700')).toBeInTheDocument()
    expect(screen.getByText('$300')).toBeInTheDocument()
  })

  it('should render input fields for each row', () => {
    render(<HierarchicalTable />)
    
    const inputs = screen.getAllByPlaceholderText('Enter value')
    expect(inputs).toHaveLength(6) // 2 main categories + 4 subcategories
  })

  it('should render allocation buttons for each row', () => {
    render(<HierarchicalTable />)
    
    const percentageButtons = screen.getAllByText('Allocation %')
    const valueButtons = screen.getAllByText('Allocation Val')
    
    expect(percentageButtons).toHaveLength(6)
    expect(valueButtons).toHaveLength(6)
  })

  it('should display variance percentages', () => {
    render(<HierarchicalTable />)
    
    const varianceElements = screen.getAllByText('0%')
    expect(varianceElements.length).toBeGreaterThan(0)
  })

  it('should have proper table structure', () => {
    render(<HierarchicalTable />)
    
    const table = screen.getByRole('table')
    expect(table).toBeInTheDocument()
    
    const rows = screen.getAllByRole('row')
    expect(rows.length).toBeGreaterThan(0)
  })
})
