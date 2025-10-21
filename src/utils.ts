import { HierarchicalRow } from './types';

export const calculateVariance = (currentValue: number, originalValue: number): number => {
  if (originalValue === 0) return 0;
  return ((currentValue - originalValue) / originalValue) * 100;
};

export const calculateSubtotal = (children: HierarchicalRow[]): number => {
  return children.reduce((sum, child) => sum + child.value, 0);
};

export const flattenHierarchy = (rows: HierarchicalRow[]): HierarchicalRow[] => {
  const flattened: HierarchicalRow[] = [];
  
  const flatten = (items: HierarchicalRow[], level: number = 0) => {
    items.forEach(item => {
      const flatItem = { ...item, level };
      flattened.push(flatItem);
      if (item.children && item.children.length > 0) {
        flatten(item.children, level + 1);
      }
    });
  };
  
  flatten(rows);
  return flattened;
};

export const updateRowValue = (
  rows: HierarchicalRow[],
  rowId: string,
  newValue: number
): HierarchicalRow[] => {
  const updateRow = (items: HierarchicalRow[]): HierarchicalRow[] => {
    return items.map(item => {
      if (item.id === rowId) {
        const updatedItem = {
          ...item,
          value: newValue,
          variance: calculateVariance(newValue, item.originalValue)
        };
        
        // If this is a parent row, update its children proportionally
        if (item.children && item.children.length > 0) {
          const totalChildValue = item.children.reduce((sum, child) => sum + child.value, 0);
          if (totalChildValue > 0) {
            const ratio = newValue / totalChildValue;
            updatedItem.children = item.children.map(child => ({
              ...child,
              value: Math.round(child.value * ratio * 100) / 100, // Round to 2 decimal places
              variance: calculateVariance(Math.round(child.value * ratio * 100) / 100, child.originalValue)
            }));
          }
        }
        
        return updatedItem;
      }
      
      if (item.children && item.children.length > 0) {
        return {
          ...item,
          children: updateRow(item.children)
        };
      }
      
      return item;
    });
  };
  
  return updateRow(rows);
};

export const updateSubtotals = (rows: HierarchicalRow[]): HierarchicalRow[] => {
  const updateSubtotalsRecursive = (items: HierarchicalRow[]): HierarchicalRow[] => {
    return items.map(item => {
      if (item.children && item.children.length > 0) {
        const updatedChildren = updateSubtotalsRecursive(item.children);
        const subtotal = calculateSubtotal(updatedChildren);
        return {
          ...item,
          value: subtotal,
          variance: calculateVariance(subtotal, item.originalValue),
          children: updatedChildren
        };
      }
      return item;
    });
  };
  
  return updateSubtotalsRecursive(rows);
};

export const calculateGrandTotal = (rows: HierarchicalRow[]): number => {
  return rows.reduce((sum, row) => sum + row.value, 0);
};

export const initializeWithCalculatedValues = (rows: HierarchicalRow[]): HierarchicalRow[] => {
  const calculateValuesRecursive = (items: HierarchicalRow[]): HierarchicalRow[] => {
    return items.map(item => {
      if (item.children && item.children.length > 0) {
        const updatedChildren = calculateValuesRecursive(item.children);
        const calculatedValue = calculateSubtotal(updatedChildren);
        return {
          ...item,
          value: calculatedValue,
          children: updatedChildren
        };
      }
      return item;
    });
  };
  
  return calculateValuesRecursive(rows);
};
