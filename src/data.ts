import { HierarchicalRow } from './types';

export const initialData: HierarchicalRow[] = [
  {
    id: 'electronics',
    label: 'Electronics',
    value: 1500, // This will be calculated from children (800 + 700)
    originalValue: 1500,
    level: 0,
    isSubtotal: true,
    children: [
      {
        id: 'phones',
        label: 'Phones',
        value: 800,
        originalValue: 800,
        parentId: 'electronics',
        level: 1,
      },
      {
        id: 'laptops',
        label: 'Laptops',
        value: 700,
        originalValue: 700,
        parentId: 'electronics',
        level: 1,
      }
    ]
  },
  {
    id: 'furniture',
    label: 'Furniture',
    value: 1000, // This will be calculated from children (300 + 700)
    originalValue: 1000,
    level: 0,
    isSubtotal: true,
    children: [
      {
        id: 'tables',
        label: 'Tables',
        value: 300,
        originalValue: 300,
        parentId: 'furniture',
        level: 1,
      },
      {
        id: 'chairs',
        label: 'Chairs',
        value: 700,
        originalValue: 700,
        parentId: 'furniture',
        level: 1,
      }
    ]
  }
];
