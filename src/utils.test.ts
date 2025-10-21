import { describe, it, expect } from 'vitest'
import { 
  calculateVariance, 
  calculateSubtotal, 
  updateRowValue, 
  updateSubtotals, 
  initializeWithCalculatedValues 
} from './utils'
import { HierarchicalRow } from './types'

describe('Utils', () => {
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

  describe('calculateSubtotal', () => {
    it('should sum children values correctly', () => {
      const children: HierarchicalRow[] = [
        { id: '1', label: 'Item 1', value: 100, originalValue: 100, level: 1 },
        { id: '2', label: 'Item 2', value: 200, originalValue: 200, level: 1 },
        { id: '3', label: 'Item 3', value: 300, originalValue: 300, level: 1 }
      ]
      expect(calculateSubtotal(children)).toBe(600)
    })

    it('should handle empty children array', () => {
      expect(calculateSubtotal([])).toBe(0)
    })
  })

  describe('updateRowValue', () => {
    const testData: HierarchicalRow[] = [
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
      }
    ]

    it('should update leaf node value correctly', () => {
      const result = updateRowValue(testData, 'phones', 900)
      const phonesRow = result[0].children![0]
      expect(phonesRow.value).toBe(900)
      expect(phonesRow.variance).toBe(12.5) // (900-800)/800 * 100
    })

    it('should update parent node and distribute proportionally to children', () => {
      const result = updateRowValue(testData, 'electronics', 2000)
      const electronicsRow = result[0]
      const phonesRow = electronicsRow.children![0]
      const laptopsRow = electronicsRow.children![1]
      
      expect(electronicsRow.value).toBe(2000)
      expect(electronicsRow.variance).toBe(33.33) // (2000-1500)/1500 * 100
      
      // Phones should be 800/1500 * 2000 = 1066.67
      expect(phonesRow.value).toBeCloseTo(1066.67, 1)
      // Laptops should be 700/1500 * 2000 = 933.33
      expect(laptopsRow.value).toBeCloseTo(933.33, 1)
    })
  })

  describe('updateSubtotals', () => {
    it('should recalculate parent values from children', () => {
      const testData: HierarchicalRow[] = [
        {
          id: 'electronics',
          label: 'Electronics',
          value: 1500,
          originalValue: 1500,
          level: 0,
          isSubtotal: true,
          children: [
            { id: 'phones', label: 'Phones', value: 900, originalValue: 800, parentId: 'electronics', level: 1 },
            { id: 'laptops', label: 'Laptops', value: 700, originalValue: 700, parentId: 'electronics', level: 1 }
          ]
        }
      ]

      const result = updateSubtotals(testData)
      expect(result[0].value).toBe(1600) // 900 + 700
      expect(result[0].variance).toBe(6.67) // (1600-1500)/1500 * 100
    })
  })

  describe('initializeWithCalculatedValues', () => {
    it('should calculate parent values from children on initialization', () => {
      const testData: HierarchicalRow[] = [
        {
          id: 'electronics',
          label: 'Electronics',
          value: 0, // Should be calculated
          originalValue: 1500,
          level: 0,
          isSubtotal: true,
          children: [
            { id: 'phones', label: 'Phones', value: 800, originalValue: 800, parentId: 'electronics', level: 1 },
            { id: 'laptops', label: 'Laptops', value: 700, originalValue: 700, parentId: 'electronics', level: 1 }
          ]
        }
      ]

      const result = initializeWithCalculatedValues(testData)
      expect(result[0].value).toBe(1500) // 800 + 700
    })
  })
})
