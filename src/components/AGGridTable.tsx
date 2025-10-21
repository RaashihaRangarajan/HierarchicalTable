import React, { useState, useCallback, useMemo, useRef } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { ColDef, GridReadyEvent, ICellRendererParams } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { HierarchicalRow } from '../types';
import { initialData } from '../data';
import { updateRowValue, updateSubtotals, initializeWithCalculatedValues } from '../utils';
import '../ag-grid-setup';

// Custom cell renderer for allocation buttons
const AllocationCellRenderer: React.FC<ICellRendererParams> = (params) => {
  const [inputValue, setInputValue] = useState('');
  const rowId = params.data.id;

  const handlePercentageClick = () => {
    const percentage = parseFloat(inputValue);
    if (!isNaN(percentage)) {
      // Get the parent component's handler from the grid context
      const gridApi = params.api;
      const context = gridApi.getGridOption('context');
      if (context?.handlePercentageAllocation) {
        context.handlePercentageAllocation(rowId, percentage);
        setInputValue('');
      }
    }
  };

  const handleValueClick = () => {
    const value = parseFloat(inputValue);
    if (!isNaN(value)) {
      const gridApi = params.api;
      const context = gridApi.getGridOption('context');
      if (context?.handleDirectValueAllocation) {
        context.handleDirectValueAllocation(rowId, value);
        setInputValue('');
      }
    }
  };

  return (
    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
      <input
        type="number"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Enter value"
        style={{
          padding: '4px 8px',
          border: '1px solid #ddd',
          borderRadius: '4px',
          width: '80px',
          fontSize: '12px'
        }}
      />
      <button
        onClick={handlePercentageClick}
        disabled={!inputValue}
        style={{
          padding: '4px 8px',
          backgroundColor: '#3b82f6',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          fontSize: '10px',
          cursor: inputValue ? 'pointer' : 'not-allowed',
          opacity: inputValue ? 1 : 0.5
        }}
      >
        %
      </button>
      <button
        onClick={handleValueClick}
        disabled={!inputValue}
        style={{
          padding: '4px 8px',
          backgroundColor: '#10b981',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          fontSize: '10px',
          cursor: inputValue ? 'pointer' : 'not-allowed',
          opacity: inputValue ? 1 : 0.5
        }}
      >
        $
      </button>
    </div>
  );
};

// Custom cell renderer for variance
const VarianceCellRenderer: React.FC<ICellRendererParams> = (params) => {
  const variance = params.data.variance || 0;
  const isPositive = variance > 0;
  const isNegative = variance < 0;

  return (
    <span
      style={{
        padding: '2px 6px',
        borderRadius: '4px',
        fontSize: '12px',
        fontWeight: '600',
        backgroundColor: isPositive ? '#dcfce7' : isNegative ? '#fef2f2' : '#f3f4f6',
        color: isPositive ? '#166534' : isNegative ? '#dc2626' : '#6b7280'
      }}
    >
      {variance !== 0 ? `${variance > 0 ? '+' : ''}${variance.toFixed(2)}%` : '0%'}
    </span>
  );
};

// Custom cell renderer for label with hierarchy
const LabelCellRenderer: React.FC<ICellRendererParams> = (params) => {
  const level = params.data.level || 0;
  const hasChildren = params.data.children && params.data.children.length > 0;

  return (
    <div style={{ paddingLeft: `${level * 20}px`, display: 'flex', alignItems: 'center' }}>
      {hasChildren && (
        <span style={{ marginRight: '8px', cursor: 'pointer' }}>
          ▼
        </span>
      )}
      <span style={{
        fontWeight: params.data.isSubtotal ? '600' : '500',
        color: params.data.isSubtotal ? '#7c2d12' : '#374151'
      }}>
        {params.value}
      </span>
    </div>
  );
};

// Custom cell renderer for value
const ValueCellRenderer: React.FC<ICellRendererParams> = (params) => (
  <span style={{
    fontWeight: '600',
    fontVariantNumeric: 'tabular-nums'
  }}>
    ${params.value.toLocaleString()}
  </span>
);

const AGGridTable: React.FC = () => {
  const [data, setData] = useState<HierarchicalRow[]>(initializeWithCalculatedValues(initialData));
  const gridRef = useRef<AgGridReact>(null);

  // Flatten the hierarchical data for AG Grid
  const flatData = useMemo(() => {
    const flatten = (items: HierarchicalRow[], level: number = 0): any[] => {
      const result: any[] = [];
      items.forEach(item => {
        result.push({
          ...item,
          level,
          isExpanded: true,
        });
        if (item.children && item.children.length > 0) {
          result.push(...flatten(item.children, level + 1));
        }
      });
      return result;
    };
    return flatten(data);
  }, [data]);

  const handleValueChange = useCallback((rowId: string, newValue: number) => {
    const updatedData = updateRowValue(data, rowId, newValue);
    const updatedWithSubtotals = updateSubtotals(updatedData);
    setData(updatedWithSubtotals);
  }, [data]);

  const handlePercentageAllocation = useCallback((rowId: string, percentage: number) => {
    const row = flatData.find(item => item.id === rowId);
    if (row) {
      const increaseAmount = (row.value * percentage) / 100;
      const newValue = row.value + increaseAmount;
      handleValueChange(rowId, newValue);
    }
  }, [flatData, handleValueChange]);

  const handleDirectValueAllocation = useCallback((rowId: string, newValue: number) => {
    handleValueChange(rowId, newValue);
  }, [handleValueChange]);

  const columnDefs: ColDef[] = useMemo(() => [
    {
      field: 'label',
      headerName: 'Label',
      flex: 2,
      minWidth: 200,
      cellRenderer: LabelCellRenderer
    },
    {
      field: 'value',
      headerName: 'Value',
      flex: 1,
      minWidth: 120,
      cellRenderer: ValueCellRenderer
    },
    {
      field: 'input',
      headerName: 'Allocation',
      flex: 2,
      minWidth: 200,
      cellRenderer: AllocationCellRenderer
    },
    {
      field: 'variance',
      headerName: 'Variance %',
      flex: 1,
      minWidth: 100,
      cellRenderer: VarianceCellRenderer
    }
  ], []);

  const defaultColDef: ColDef = useMemo(() => ({
    resizable: true,
    sortable: false,
    filter: false
  }), []);

  const onGridReady = (params: GridReadyEvent) => {
    // Auto-size columns to fit the available width
    params.api.sizeColumnsToFit();

    // Add resize listener to handle window resize
    const handleResize = () => {
      params.api.sizeColumnsToFit();
    };

    window.addEventListener('resize', handleResize);

    // Cleanup listener on component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  };

  // Grid context to pass handlers to cell renderers
  const gridContext = useMemo(() => ({
    handlePercentageAllocation,
    handleDirectValueAllocation
  }), [handlePercentageAllocation, handleDirectValueAllocation]);

  return (
    <div className="ag-grid-container">
      <h2>AG Grid Hierarchical Table</h2>
      <div
        className="ag-theme-alpine"
        style={{
          height: '500px',
          width: '100%',
          border: '1px solid #e2e8f0',
          borderRadius: '8px'
        }}
      >
        <AgGridReact
          ref={gridRef}
          rowData={flatData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          onGridReady={onGridReady}
          suppressRowClickSelection={true}
          rowSelection={undefined}
          context={gridContext}
          suppressColumnVirtualisation={true}
          suppressRowVirtualisation={true}
          suppressAnimationFrame={true}
          suppressBrowserResizeObserver={true}
          getRowStyle={(params) => {
            const level = params.data.level || 0;
            const isSubtotal = params.data.isSubtotal;

            if (isSubtotal) {
              return { backgroundColor: '#ffffff', borderLeft: '3px solid #6b7280' };
            }

            const colors = ['#fef7ff', '#f0f9ff', '#f0fdf4'];
            return {
              backgroundColor: colors[level] || '#ffffff',
              borderLeft: level === 0 ? '3px solid #8b5cf6' :
                level === 1 ? '3px solid #0ea5e9' :
                  level === 2 ? '3px solid #10b981' : 'none'
            };
          }}
        />
      </div>
    </div>
  );
};

export default AGGridTable;
