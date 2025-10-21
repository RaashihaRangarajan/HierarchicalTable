# API Documentation

## Table of Contents
- [Types](#types)
- [Components](#components)
- [Utility Functions](#utility-functions)
- [Data Flow](#data-flow)
- [Examples](#examples)

## Types

### `HierarchicalRow`
Represents a single row in the hierarchical table.

```typescript
interface HierarchicalRow {
  id: string;                    // Unique identifier
  label: string;                  // Display name
  value: number;                  // Current value
  originalValue: number;          // Initial value for variance calculation
  parentId?: string;              // Parent row ID (if child)
  children?: HierarchicalRow[];   // Child rows (if parent)
  level: number;                  // Hierarchy level (0 = root)
  isSubtotal?: boolean;           // Whether this is a subtotal row
  variance?: number;              // Percentage change from original
}
```

### `TableData`
Container for hierarchical data.

```typescript
interface TableData {
  rows: HierarchicalRow[];
  grandTotal: number;
}
```

## Components

### `HierarchicalTable`

Main table component that renders the complete hierarchical table.

#### Props
None - uses internal state management

#### State
- `data: HierarchicalRow[]` - Current table data
- `grandTotal: number` - Total of all root-level values

#### Methods
- `handleValueChange(rowId: string, newValue: number)` - Handles value updates

#### Features
- Renders table headers
- Manages hierarchical data structure
- Handles automatic calculations
- Updates subtotals when values change

#### Example
```tsx
import HierarchicalTable from './components/HierarchicalTable';

function App() {
  return <HierarchicalTable />;
}
```

### `TableRow`

Individual row component for displaying and editing hierarchical data.

#### Props
```typescript
interface TableRowProps {
  row: HierarchicalRow;                                    // Row data
  onValueChange: (rowId: string, newValue: number) => void; // Change handler
}
```

#### Features
- Expandable/collapsible for parent rows
- Input field for value changes
- Allocation buttons (percentage and direct value)
- Variance display
- Recursive rendering of children

#### Example
```tsx
import TableRow from './components/TableRow';

<TableRow 
  row={rowData} 
  onValueChange={handleValueChange} 
/>
```

## Utility Functions

### `calculateVariance(currentValue: number, originalValue: number): number`

Calculates the percentage variance between current and original values.

#### Parameters
- `currentValue: number` - Current value
- `originalValue: number` - Original value

#### Returns
- `number` - Percentage variance (positive for increase, negative for decrease)

#### Example
```typescript
const variance = calculateVariance(1100, 1000); // Returns 10
const negativeVariance = calculateVariance(900, 1000); // Returns -10
```

### `calculateSubtotal(children: HierarchicalRow[]): number`

Sums the values of all children in an array.

#### Parameters
- `children: HierarchicalRow[]` - Array of child rows

#### Returns
- `number` - Sum of all child values

#### Example
```typescript
const children = [
  { value: 100, ... },
  { value: 200, ... },
  { value: 300, ... }
];
const subtotal = calculateSubtotal(children); // Returns 600
```

### `updateRowValue(rows: HierarchicalRow[], rowId: string, newValue: number): HierarchicalRow[]`

Updates a specific row's value and handles proportional allocation for parent rows.

#### Parameters
- `rows: HierarchicalRow[]` - Array of rows to update
- `rowId: string` - ID of the row to update
- `newValue: number` - New value for the row

#### Returns
- `HierarchicalRow[]` - Updated array of rows

#### Behavior
- Updates the specified row's value
- Calculates variance for the updated row
- If updating a parent row, distributes the new value proportionally among children
- Maintains the proportional relationship between children

#### Example
```typescript
const updatedRows = updateRowValue(rows, 'electronics', 2000);
// Electronics value becomes 2000, children updated proportionally
```

### `updateSubtotals(rows: HierarchicalRow[]): HierarchicalRow[]`

Recalculates all parent values based on their children.

#### Parameters
- `rows: HierarchicalRow[]` - Array of rows to update

#### Returns
- `HierarchicalRow[]` - Updated array with recalculated subtotals

#### Behavior
- Recursively processes all rows
- For rows with children, calculates subtotal from children
- Updates variance based on original values

#### Example
```typescript
const updatedRows = updateSubtotals(rows);
// All parent values recalculated from their children
```

### `initializeWithCalculatedValues(rows: HierarchicalRow[]): HierarchicalRow[]`

Initializes data with calculated parent values from children.

#### Parameters
- `rows: HierarchicalRow[]` - Array of rows to initialize

#### Returns
- `HierarchicalRow[]` - Initialized array with calculated parent values

#### Behavior
- Recursively processes all rows
- For rows with children, calculates value from children
- Preserves original values for variance calculation

#### Example
```typescript
const initializedRows = initializeWithCalculatedValues(rows);
// Parent values calculated from children on initialization
```

## Data Flow

### 1. Initialization
```typescript
// Data loaded with calculated parent values
const data = initializeWithCalculatedValues(initialData);
```

### 2. Value Update Process
```typescript
// User input triggers value change
const handleValueChange = (rowId: string, newValue: number) => {
  // Update the specific row
  const updatedData = updateRowValue(data, rowId, newValue);
  
  // Recalculate all subtotals
  const updatedWithSubtotals = updateSubtotals(updatedData);
  
  // Update state
  setData(updatedWithSubtotals);
};
```

### 3. Proportional Allocation
When a parent value changes:
1. Calculate the ratio: `newValue / totalChildValue`
2. Apply ratio to each child: `childValue * ratio`
3. Update child variances
4. Recalculate parent subtotals

## Examples

### Basic Usage
```typescript
import { HierarchicalTable } from './components/HierarchicalTable';

function App() {
  return (
    <div className="app">
      <HierarchicalTable />
    </div>
  );
}
```

### Custom Data Structure
```typescript
const customData: HierarchicalRow[] = [
  {
    id: 'revenue',
    label: 'Revenue',
    value: 0, // Will be calculated
    originalValue: 100000,
    level: 0,
    isSubtotal: true,
    children: [
      {
        id: 'product-sales',
        label: 'Product Sales',
        value: 60000,
        originalValue: 60000,
        parentId: 'revenue',
        level: 1
      },
      {
        id: 'service-revenue',
        label: 'Service Revenue',
        value: 40000,
        originalValue: 40000,
        parentId: 'revenue',
        level: 1
      }
    ]
  }
];
```

### Testing Utility Functions
```typescript
import { calculateVariance, updateRowValue } from './utils';

// Test variance calculation
const variance = calculateVariance(1100, 1000); // 10%

// Test value update
const updatedRows = updateRowValue(rows, 'electronics', 2000);
```

### Component Testing
```typescript
import { render, screen } from '@testing-library/react';
import TableRow from './TableRow';

test('renders row with correct value', () => {
  const mockRow = {
    id: 'test',
    label: 'Test Item',
    value: 1000,
    originalValue: 1000,
    level: 0
  };
  
  render(<TableRow row={mockRow} onValueChange={jest.fn()} />);
  
  expect(screen.getByText('Test Item')).toBeInTheDocument();
  expect(screen.getByText('$1,000')).toBeInTheDocument();
});
```

## Error Handling

### Common Scenarios
- **Zero Division**: Handled gracefully in variance calculations
- **Empty Children**: Subtotals default to 0
- **Invalid Input**: Input validation prevents invalid values
- **Missing Data**: Graceful fallbacks for missing properties

### Best Practices
- Always validate input before processing
- Handle edge cases in calculations
- Provide meaningful error messages
- Test with various data scenarios
- Use TypeScript for type safety

## Performance Considerations

### Optimization Strategies
- **Memoization**: Use React.memo for expensive components
- **Efficient Calculations**: Optimized algorithms for proportional allocation
- **Minimal Re-renders**: Careful state management
- **Lazy Loading**: Load data as needed

### Best Practices
- Keep calculations pure and predictable
- Minimize state updates
- Use appropriate data structures
- Profile performance regularly
- Optimize for common use cases
