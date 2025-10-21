# Hierarchical Table Application

A sophisticated React-based hierarchical table application for financial data management with automatic value calculations, proportional allocation, and professional UI design. Features both custom React implementation and AG Grid implementation for comparison.

## 🚀 Features

### Core Functionality
- **Dual Implementation**: Custom React table and AG Grid implementation
- **Hierarchical Data Structure**: Multi-level nested data with parent-child relationships
- **Automatic Value Calculation**: Parent values automatically calculated from children
- **Proportional Allocation**: When parent values change, children update proportionally
- **Dual Allocation Methods**:
  - **Percentage Allocation**: Increase values by percentage
  - **Direct Value Allocation**: Set exact values
- **Real-time Variance Tracking**: Shows percentage changes from original values
- **Professional UI**: Clean, modern design with responsive layout
- **Comparison View**: Side-by-side comparison of both implementations

### Key Capabilities
- ✅ **Smart Calculations**: Automatic parent value updates from children
- ✅ **Proportional Distribution**: Maintains child relationships when parents change
- ✅ **Variance Tracking**: Real-time percentage change indicators
- ✅ **Interactive Controls**: Intuitive input fields and allocation buttons
- ✅ **Responsive Design**: Works seamlessly on desktop and mobile
- ✅ **Professional Styling**: Enterprise-ready visual design
- ✅ **AG Grid Integration**: Enterprise-grade data grid with advanced features
- ✅ **Performance Optimized**: Both implementations optimized for speed

## 📋 Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [API Reference](#api-reference)
- [Testing](#testing)
- [Architecture](#architecture)
- [Contributing](#contributing)

## 🛠 Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Dependencies
- **React 18.2.0**: Modern React with hooks
- **TypeScript 5.2.2**: Type safety and better development experience
- **AG Grid Community 34.2.0**: Enterprise-grade data grid
- **AG Grid React 34.2.0**: React integration for AG Grid
- **Vite 5.0.8**: Fast build tool and development server
- **Vitest 1.0.0**: Modern testing framework
- **Testing Library**: React component testing utilities

### Setup
```bash
# Clone the repository
git clone <repository-url>
cd HierarchicalTable

# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Build for production
npm run build
```

## 🎯 Usage

### Navigation

The application features three main views accessible via navigation buttons:

1. **Custom React Table**: Pure React implementation with custom components
2. **AG Grid Table**: Enterprise-grade AG Grid implementation
3. **Comparison View**: Side-by-side comparison of both implementations

### Basic Usage

The application automatically loads with sample data showing Electronics and Furniture categories with their respective subcategories.

### Allocation Methods

#### 1. Percentage Allocation
- Enter a percentage value (e.g., `10`)
- Click **"Allocation %"** button
- Value increases by the specified percentage
- Example: Phones 800 → 880 (+10%)

#### 2. Direct Value Allocation
- Enter an exact value (e.g., `1000`)
- Click **"Allocation Val"** button
- Value is set to the specified amount
- Example: Tables 300 → 1000

#### 3. Parent Value Changes
- When you change a parent value, children update proportionally
- Example: Furniture 1000 → 2000
  - Tables: 300 → 600 (maintains 30% contribution)
  - Chairs: 700 → 1400 (maintains 70% contribution)

### Data Structure

```typescript
interface HierarchicalRow {
  id: string;
  label: string;
  value: number;
  originalValue: number;
  parentId?: string;
  children?: HierarchicalRow[];
  level: number;
  isSubtotal?: boolean;
  variance?: number;
}
```

## 🔧 API Reference

### Components

#### `HierarchicalTable`
Custom React table component that manages the hierarchical data structure.

**Props**: None (uses internal state)

**Features**:
- Renders the complete table with headers
- Manages data state and value changes
- Handles automatic calculations
- Custom cell renderers for allocation controls

#### `AGGridTable`
AG Grid implementation of the hierarchical table.

**Props**: None (uses internal state)

**Features**:
- Enterprise-grade data grid
- Custom cell renderers for allocation controls
- Optimized performance with virtualization
- Professional AG Grid styling

#### `ComparisonView`
Side-by-side comparison of both table implementations.

**Props**: None

**Features**:
- Displays both implementations simultaneously
- Feature comparison lists
- Performance statistics
- Implementation pros/cons

#### `TableRow`
Individual row component for the custom React table.

**Props**:
- `row: HierarchicalRow` - The data for this row
- `onValueChange: (rowId: string, newValue: number) => void` - Callback for value changes

**Features**:
- Expandable/collapsible for parent rows
- Input field for value changes
- Allocation buttons for different update methods
- Variance display

#### `Navigation`
Main navigation component for switching between views.

**Props**: None

**Features**:
- Tab-based navigation
- Active state management
- Responsive design

### Utility Functions

#### `calculateVariance(currentValue: number, originalValue: number): number`
Calculates the percentage variance between current and original values.

#### `calculateSubtotal(children: HierarchicalRow[]): number`
Sums the values of all children in an array.

#### `updateRowValue(rows: HierarchicalRow[], rowId: string, newValue: number): HierarchicalRow[]`
Updates a specific row's value and handles proportional allocation for parent rows.

#### `updateSubtotals(rows: HierarchicalRow[]): HierarchicalRow[]`
Recalculates all parent values based on their children.

#### `initializeWithCalculatedValues(rows: HierarchicalRow[]): HierarchicalRow[]`
Initializes data with calculated parent values from children.

## 🧪 Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage
```

### Test Coverage

The application includes comprehensive test coverage for:

- **Utility Functions**: All calculation and data manipulation functions
- **Components**: TableRow and HierarchicalTable components
- **User Interactions**: Input handling, button clicks, value changes
- **Edge Cases**: Zero values, empty data, proportional calculations

### Test Files
- `src/utils.test.ts` - Utility function tests
- `src/components/TableRow.test.tsx` - TableRow component tests
- `src/components/HierarchicalTable.test.tsx` - Main table component tests

## 🏗 Architecture

### Project Structure
```
src/
├── components/
│   ├── HierarchicalTable.tsx    # Custom React table component
│   ├── AGGridTable.tsx          # AG Grid table component
│   ├── ComparisonView.tsx       # Side-by-side comparison
│   ├── Navigation.tsx           # Main navigation component
│   ├── TableRow.tsx             # Individual row component
│   └── *.test.tsx              # Component tests
├── data.ts                      # Sample data
├── types.ts                     # TypeScript interfaces
├── utils.ts                      # Utility functions
├── utils.test.ts                # Utility tests
├── ag-grid-setup.ts             # AG Grid module registration
├── App.css                      # Styling
└── test/
    └── setup.ts                 # Test setup
```

### Key Design Patterns

#### 1. Dual Implementation Architecture
- Custom React implementation for full control
- AG Grid implementation for enterprise features
- Shared data models and utility functions
- Consistent user experience across both implementations

#### 2. Hierarchical Data Management
- Recursive data structure with parent-child relationships
- Automatic value propagation from children to parents
- Proportional allocation when parent values change

#### 3. State Management
- React hooks for local state management
- Immutable updates for data integrity
- Real-time recalculation on value changes

#### 4. Component Architecture
- Reusable TableRow component for custom implementation
- Custom cell renderers for AG Grid implementation
- Props-based communication between components
- Clean separation of concerns

#### 5. Performance Optimization
- Memoized calculations and components
- Optimized AG Grid configuration
- Efficient data processing algorithms

### Data Flow

1. **Initialization**: Data loaded with calculated parent values
2. **User Input**: User enters value and selects allocation method
3. **Value Update**: Row value updated with variance calculation
4. **Propagation**: Parent values recalculated if needed
5. **Proportional Allocation**: Children updated proportionally if parent changed
6. **UI Update**: All changes reflected in the interface

## 🎨 Styling

### Design System
- **Colors**: Professional color palette with subtle gradients
- **Typography**: System fonts for cross-platform consistency
- **Spacing**: Consistent padding and margins throughout
- **Interactions**: Smooth hover and focus effects
- **Responsive**: Mobile-first design approach

### Visual Hierarchy
- **Level 0 (Root)**: Purple accent with light background
- **Level 1 (Children)**: Blue accent with light background
- **Level 2 (Grandchildren)**: Green accent with light background
- **Subtotals**: Gray accent with white background
- **Variance Indicators**: Color-coded positive/negative changes

## ⚖️ Implementation Comparison

### Custom React Table
**Pros:**
- Full control over styling and behavior
- Lightweight bundle size (~50KB)
- Custom animations and interactions
- Easy to customize and extend
- No external dependencies for table functionality

**Cons:**
- More code to maintain
- Manual performance optimization
- Limited built-in features
- Custom implementation of all functionality

### AG Grid Table
**Pros:**
- Enterprise-grade features out of the box
- Built-in performance optimizations
- Rich API and extensive documentation
- Professional styling and theming
- Advanced features like sorting, filtering, etc.

**Cons:**
- Larger bundle size (~200KB)
- Learning curve for customization
- External dependency
- Less control over internal behavior

### Performance Comparison
- **Small Datasets**: Custom React performs better due to lower overhead
- **Large Datasets**: AG Grid excels with built-in virtualization
- **Memory Usage**: Custom React uses less memory
- **Development Speed**: AG Grid faster for complex table features

## 🚀 Performance

### Optimizations

#### Custom React Implementation
- **Efficient Calculations**: Optimized algorithms for proportional allocation
- **Minimal Re-renders**: React best practices for performance
- **Memoized Components**: useMemo and useCallback for optimization
- **Clean Code**: Well-structured, maintainable codebase

#### AG Grid Implementation
- **Virtualization**: Disabled for small datasets to improve performance
- **Memoized Column Definitions**: Prevents unnecessary re-creation
- **Optimized Configuration**: Disabled unnecessary features for better speed
- **Custom Cell Renderers**: Efficient custom components for allocation controls

#### General Optimizations
- **Responsive Design**: Optimized for all screen sizes
- **Shared Utilities**: Common functions used by both implementations
- **Type Safety**: TypeScript for better performance and maintainability

### Browser Support
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile)
- Responsive design for all screen sizes

## 🤝 Contributing

### Development Setup
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

### Code Standards
- TypeScript for type safety
- ESLint for code quality
- Prettier for code formatting
- Comprehensive test coverage
- Clear documentation

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For questions, issues, or contributions, please:
1. Check the existing issues
2. Create a new issue with detailed description
3. Follow the contributing guidelines
4. Provide test cases for bug reports

---

**Built with ❤️ using React, TypeScript, and modern web technologies.**