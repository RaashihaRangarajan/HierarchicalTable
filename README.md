# Hierarchical Table Application

A sophisticated React-based hierarchical table application for financial data management with automatic value calculations, proportional allocation, and professional UI design.

## 🚀 Features

### Core Functionality
- **Hierarchical Data Structure**: Multi-level nested data with parent-child relationships
- **Automatic Value Calculation**: Parent values automatically calculated from children
- **Proportional Allocation**: When parent values change, children update proportionally
- **Dual Allocation Methods**:
  - **Percentage Allocation**: Increase values by percentage
  - **Direct Value Allocation**: Set exact values
- **Real-time Variance Tracking**: Shows percentage changes from original values
- **Professional UI**: Clean, modern design with responsive layout

### Key Capabilities
- ✅ **Smart Calculations**: Automatic parent value updates from children
- ✅ **Proportional Distribution**: Maintains child relationships when parents change
- ✅ **Variance Tracking**: Real-time percentage change indicators
- ✅ **Interactive Controls**: Intuitive input fields and allocation buttons
- ✅ **Responsive Design**: Works seamlessly on desktop and mobile
- ✅ **Professional Styling**: Enterprise-ready visual design

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
Main table component that manages the hierarchical data structure.

**Props**: None (uses internal state)

**Features**:
- Renders the complete table with headers
- Manages data state and value changes
- Handles automatic calculations

#### `TableRow`
Individual row component for each data item.

**Props**:
- `row: HierarchicalRow` - The data for this row
- `onValueChange: (rowId: string, newValue: number) => void` - Callback for value changes

**Features**:
- Expandable/collapsible for parent rows
- Input field for value changes
- Allocation buttons for different update methods
- Variance display

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
│   ├── HierarchicalTable.tsx    # Main table component
│   ├── TableRow.tsx             # Individual row component
│   └── *.test.tsx              # Component tests
├── data.ts                      # Sample data
├── types.ts                     # TypeScript interfaces
├── utils.ts                      # Utility functions
├── utils.test.ts                # Utility tests
├── App.css                      # Styling
└── test/
    └── setup.ts                 # Test setup
```

### Key Design Patterns

#### 1. Hierarchical Data Management
- Recursive data structure with parent-child relationships
- Automatic value propagation from children to parents
- Proportional allocation when parent values change

#### 2. State Management
- React hooks for local state management
- Immutable updates for data integrity
- Real-time recalculation on value changes

#### 3. Component Architecture
- Reusable TableRow component for individual rows
- Props-based communication between components
- Clean separation of concerns

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

## 🚀 Performance

### Optimizations
- **Efficient Calculations**: Optimized algorithms for proportional allocation
- **Minimal Re-renders**: React best practices for performance
- **Responsive Design**: Optimized for all screen sizes
- **Clean Code**: Well-structured, maintainable codebase

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