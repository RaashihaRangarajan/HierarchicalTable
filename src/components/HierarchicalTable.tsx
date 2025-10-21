import React, { useState, useEffect } from 'react';
import { HierarchicalRow } from '../types';
import { initialData } from '../data';
import { updateRowValue, updateSubtotals, initializeWithCalculatedValues } from '../utils';
import TableRow from './TableRow';

const HierarchicalTable: React.FC = () => {
  const [data, setData] = useState<HierarchicalRow[]>(initializeWithCalculatedValues(initialData));

  const handleValueChange = (rowId: string, newValue: number) => {
    const updatedData = updateRowValue(data, rowId, newValue);
    const updatedWithSubtotals = updateSubtotals(updatedData);
    setData(updatedWithSubtotals);
  };

  return (
    <div className="hierarchical-table-container">
      <h1>Hierarchical Financial Table</h1>
      <div className="table-wrapper">
        <table className="hierarchical-table">
          <thead>
            <tr>
              <th className="label-header">Label</th>
              <th className="value-header">Value</th>
              <th className="input-header">Input</th>
              <th className="allocation-header">Allocation %</th>
              <th className="allocation-header">Allocation Val</th>
              <th className="variance-header">Variance %</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <TableRow
                key={row.id}
                row={row}
                onValueChange={handleValueChange}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HierarchicalTable;
