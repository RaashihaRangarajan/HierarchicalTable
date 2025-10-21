import React, { useState } from 'react';
import { HierarchicalRow } from '../types';
import { calculateVariance } from '../utils';

interface TableRowProps {
  row: HierarchicalRow;
  onValueChange: (rowId: string, newValue: number) => void;
}

const TableRow: React.FC<TableRowProps> = ({ row, onValueChange }) => {
  const [inputValue, setInputValue] = useState('');
  const [isExpanded, setIsExpanded] = useState(true);

  const handlePercentageAllocation = () => {
    const percentage = parseFloat(inputValue);
    if (!isNaN(percentage)) {
      const increaseAmount = (row.value * percentage) / 100;
      const newValue = row.value + increaseAmount;
      onValueChange(row.id, newValue);
    }
    setInputValue('');
  };

  const handleValueAllocation = () => {
    const value = parseFloat(inputValue);
    if (!isNaN(value)) {
      onValueChange(row.id, value);
    }
    setInputValue('');
  };

  const hasChildren = row.children && row.children.length > 0;
  const variance = calculateVariance(row.value, row.originalValue);

  return (
    <>
      <tr className={`table-row level-${row.level} ${row.isSubtotal ? 'subtotal-row' : ''}`}>
        <td className="label-cell">
          <div style={{ paddingLeft: `${row.level * 20}px` }}>
            {hasChildren && (
              <button
                className="expand-button"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                {isExpanded ? '▼' : '▶'}
              </button>
            )}
            <span className={`label ${row.isSubtotal ? 'subtotal-label' : ''}`}>
              {row.label}
            </span>
          </div>
        </td>
        <td className="value-cell">
          <span className="value">${row.value.toLocaleString()}</span>
        </td>
        <td className="input-cell">
          <input
            type="number"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Enter value"
            className="value-input"
          />
        </td>
        <td className="allocation-cell">
          <button
            onClick={handlePercentageAllocation}
            className="allocation-button percentage"
            disabled={!inputValue}
          >
            Allocation %
          </button>
        </td>
        <td className="allocation-cell">
          <button
            onClick={handleValueAllocation}
            className="allocation-button value"
            disabled={!inputValue}
          >
            Allocation Val
          </button>
        </td>
        <td className="variance-cell">
          <span className={`variance ${variance > 0 ? 'positive' : variance < 0 ? 'negative' : ''}`}>
            {variance !== 0 ? `${variance > 0 ? '+' : ''}${variance.toFixed(2)}%` : '0%'}
          </span>
        </td>
      </tr>
      {hasChildren && isExpanded && row.children?.map((child) => (
        <TableRow
          key={child.id}
          row={child}
          onValueChange={onValueChange}
        />
      ))}
    </>
  );
};

export default TableRow;
