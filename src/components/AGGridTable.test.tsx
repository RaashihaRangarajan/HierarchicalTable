import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import AGGridTable from './AGGridTable'

// Mock AG Grid to avoid rendering issues in tests
vi.mock('ag-grid-react', () => ({
  AgGridReact: ({ rowData, columnDefs }: any) => (
    <div data-testid="ag-grid">
      <div>AG Grid Mock</div>
      <div>Rows: {rowData?.length || 0}</div>
      <div>Columns: {columnDefs?.length || 0}</div>
    </div>
  )
}))

// Mock AG Grid styles
vi.mock('ag-grid-community/styles/ag-grid.css', () => ({}))
vi.mock('ag-grid-community/styles/ag-theme-alpine.css', () => ({}))

describe('AGGridTable', () => {
  it('should render AG Grid component', () => {
    render(<AGGridTable />)
    
    expect(screen.getByText('AG Grid Hierarchical Table')).toBeInTheDocument()
    expect(screen.getByTestId('ag-grid')).toBeInTheDocument()
  })

  it('should display mock grid content', () => {
    render(<AGGridTable />)
    
    expect(screen.getByText('AG Grid Mock')).toBeInTheDocument()
    expect(screen.getByText(/Rows: \d+/)).toBeInTheDocument()
    expect(screen.getByText(/Columns: \d+/)).toBeInTheDocument()
  })
})
