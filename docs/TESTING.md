# Testing Guide

## Overview

This document provides comprehensive guidance for testing the Hierarchical Table application. The application uses Vitest as the testing framework with React Testing Library for component testing.

## Table of Contents
- [Test Setup](#test-setup)
- [Running Tests](#running-tests)
- [Test Structure](#test-structure)
- [Utility Function Tests](#utility-function-tests)
- [Component Tests](#component-tests)
- [Integration Tests](#integration-tests)
- [Best Practices](#best-practices)
- [Troubleshooting](#troubleshooting)

## Test Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Modern browser for UI tests

### Installation
```bash
# Install dependencies
npm install

# Install testing dependencies (already included)
npm install --save-dev vitest @vitest/ui @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
```

### Configuration
The test configuration is set up in `vitest.config.ts`:

```typescript
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
  },
})
```

## Running Tests

### Basic Commands
```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test -- utils.test.ts

# Run tests matching pattern
npm test -- --grep "calculateVariance"
```

### Coverage Reports
```bash
# Generate coverage report
npm run test:coverage

# Coverage with HTML report
npm run test:coverage -- --reporter=html
```

## Test Structure

### File Organization
```
src/
├── utils.test.ts                    # Utility function tests
├── components/
│   ├── TableRow.test.tsx           # TableRow component tests
│   └── HierarchicalTable.test.tsx  # Main table component tests
└── test/
    └── setup.ts                    # Test setup and configuration
```

### Test Categories

#### 1. Unit Tests
- **Utility Functions**: Pure function testing
- **Component Logic**: Individual component behavior
- **Data Transformations**: Data manipulation functions

#### 2. Integration Tests
- **Component Interactions**: How components work together
- **Data Flow**: End-to-end data processing
- **User Workflows**: Complete user scenarios

#### 3. Visual Tests
- **Rendering**: Component appearance
- **Responsive Design**: Different screen sizes
- **Accessibility**: Screen reader compatibility

## Utility Function Tests

### Example: `calculateVariance` Tests
```typescript
import { describe, it, expect } from 'vitest'
import { calculateVariance } from './utils'

describe('calculateVariance', () => {
  it('should calculate positive variance correctly', () => {
    expect(calculateVariance(1100, 1000)).toBe(10)
  })

  it('should calculate negative variance correctly', () => {
    expect(calculateVariance(900, 1000)).toBe(-10)
  })

  it('should handle zero original value', () => {
    expect(calculateVariance(100, 0)).toBe(0)
  })

  it('should handle zero variance', () => {
    expect(calculateVariance(1000, 1000)).toBe(0)
  })
})
```

### Example: `updateRowValue` Tests
```typescript
describe('updateRowValue', () => {
  it('should update leaf node value correctly', () => {
    const testData = [/* test data */]
    const result = updateRowValue(testData, 'phones', 900)
    const phonesRow = result[0].children![0]
    expect(phonesRow.value).toBe(900)
    expect(phonesRow.variance).toBe(12.5)
  })

  it('should update parent node and distribute proportionally', () => {
    const testData = [/* test data */]
    const result = updateRowValue(testData, 'electronics', 2000)
    const electronicsRow = result[0]
    const phonesRow = electronicsRow.children![0]
    const laptopsRow = electronicsRow.children![1]
    
    expect(electronicsRow.value).toBe(2000)
    expect(phonesRow.value).toBeCloseTo(1066.67, 1)
    expect(laptopsRow.value).toBeCloseTo(933.33, 1)
  })
})
```

## Component Tests

### TableRow Component Tests
```typescript
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import TableRow from './TableRow'

describe('TableRow', () => {
  const mockOnValueChange = vi.fn()
  const sampleRow = {
    id: 'electronics',
    label: 'Electronics',
    value: 1500,
    originalValue: 1500,
    level: 0,
    isSubtotal: true,
    children: [/* children data */]
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render row with correct label and value', () => {
    render(<TableRow row={sampleRow} onValueChange={mockOnValueChange} />)
    
    expect(screen.getByText('Electronics')).toBeInTheDocument()
    expect(screen.getByText('$1,500')).toBeInTheDocument()
  })

  it('should handle percentage allocation correctly', async () => {
    const user = userEvent.setup()
    render(<TableRow row={sampleRow} onValueChange={mockOnValueChange} />)
    
    const input = screen.getByPlaceholderText('Enter value')
    const percentageButton = screen.getByText('Allocation %')
    
    await user.type(input, '10')
    await user.click(percentageButton)
    
    expect(mockOnValueChange).toHaveBeenCalledWith('electronics', 1650)
  })
})
```

### HierarchicalTable Component Tests
```typescript
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import HierarchicalTable from './HierarchicalTable'

// Mock the data module
vi.mock('../data', () => ({
  initialData: [/* mock data */]
}))

describe('HierarchicalTable', () => {
  it('should render table with correct headers', () => {
    render(<HierarchicalTable />)
    
    expect(screen.getByText('Label')).toBeInTheDocument()
    expect(screen.getByText('Value')).toBeInTheDocument()
    expect(screen.getByText('Input')).toBeInTheDocument()
  })

  it('should render main categories', () => {
    render(<HierarchicalTable />)
    
    expect(screen.getByText('Electronics')).toBeInTheDocument()
    expect(screen.getByText('Furniture')).toBeInTheDocument()
  })
})
```

## Integration Tests

### Complete User Workflow
```typescript
describe('User Workflow Integration', () => {
  it('should handle complete percentage allocation workflow', async () => {
    const user = userEvent.setup()
    render(<HierarchicalTable />)
    
    // Find the Phones row
    const phonesRow = screen.getByText('Phones').closest('tr')
    const input = phonesRow?.querySelector('input')
    const percentageButton = phonesRow?.querySelector('button[class*="percentage"]')
    
    // Enter 10% increase
    await user.type(input!, '10')
    await user.click(percentageButton!)
    
    // Verify the value changed
    expect(screen.getByText('$880')).toBeInTheDocument()
    
    // Verify parent value updated
    expect(screen.getByText('$1,580')).toBeInTheDocument()
  })
})
```

### Data Flow Testing
```typescript
describe('Data Flow Integration', () => {
  it('should maintain data consistency across updates', () => {
    const { rerender } = render(<HierarchicalTable />)
    
    // Initial state
    expect(screen.getByText('$1,500')).toBeInTheDocument()
    
    // Simulate value change
    // ... test implementation
    
    // Verify all related values updated
    expect(screen.getByText('$1,600')).toBeInTheDocument()
  })
})
```

## Best Practices

### 1. Test Organization
- **Group related tests**: Use `describe` blocks for logical grouping
- **Clear test names**: Use descriptive test names that explain the scenario
- **One assertion per test**: Focus on testing one specific behavior
- **Arrange-Act-Assert**: Structure tests with clear sections

### 2. Mocking
- **Mock external dependencies**: Use `vi.mock()` for modules
- **Mock functions**: Use `vi.fn()` for callback functions
- **Clear mocks**: Use `vi.clearAllMocks()` in `beforeEach`
- **Mock data**: Create realistic test data

### 3. Async Testing
- **Use async/await**: For asynchronous operations
- **Wait for updates**: Use `waitFor` for state changes
- **User interactions**: Use `userEvent` for realistic user interactions
- **Timeouts**: Set appropriate timeouts for async operations

### 4. Accessibility Testing
- **Screen readers**: Test with screen reader tools
- **Keyboard navigation**: Test keyboard-only navigation
- **ARIA attributes**: Verify proper ARIA implementation
- **Color contrast**: Ensure sufficient color contrast

### 5. Performance Testing
- **Render performance**: Test component render times
- **Memory leaks**: Check for memory leaks in long-running tests
- **Bundle size**: Monitor test bundle size
- **Test execution time**: Keep test execution time reasonable

## Troubleshooting

### Common Issues

#### 1. Test Environment Setup
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Check Node.js version
node --version  # Should be v16 or higher
```

#### 2. Mock Issues
```typescript
// Ensure mocks are properly configured
vi.mock('./module', () => ({
  default: vi.fn(),
  namedExport: vi.fn()
}))
```

#### 3. Async Test Issues
```typescript
// Use proper async handling
it('should handle async operations', async () => {
  const user = userEvent.setup()
  await user.click(button)
  await waitFor(() => {
    expect(screen.getByText('Updated')).toBeInTheDocument()
  })
})
```

#### 4. Component Rendering Issues
```typescript
// Ensure proper component setup
const mockProps = {
  row: mockRow,
  onValueChange: vi.fn()
}

render(<TableRow {...mockProps} />)
```

### Debugging Tips

#### 1. Debug Output
```typescript
// Add debug output to tests
console.log('Current state:', screen.debug())
```

#### 2. Test Isolation
```typescript
// Ensure tests don't affect each other
beforeEach(() => {
  cleanup()
  vi.clearAllMocks()
})
```

#### 3. Coverage Analysis
```bash
# Generate detailed coverage report
npm run test:coverage -- --reporter=html
```

### Getting Help

1. **Check documentation**: Review Vitest and React Testing Library docs
2. **Search issues**: Look for similar issues in the repository
3. **Create issue**: Provide detailed reproduction steps
4. **Community support**: Ask questions in relevant forums

## Continuous Integration

### GitHub Actions Example
```yaml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm test
      - run: npm run test:coverage
```

### Pre-commit Hooks
```json
{
  "husky": {
    "hooks": {
      "pre-commit": "npm test && npm run lint"
    }
  }
}
```

---

**Remember**: Good tests are the foundation of reliable software. Invest time in writing comprehensive, maintainable tests that provide confidence in your code's behavior.
