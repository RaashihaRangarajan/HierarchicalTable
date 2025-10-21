export interface HierarchicalRow {
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

export interface TableData {
  rows: HierarchicalRow[];
  grandTotal: number;
}
