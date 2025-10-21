import React from 'react';
import HierarchicalTable from './HierarchicalTable';
import AGGridTable from './AGGridTable';

const ComparisonView: React.FC = () => {
  return (
    <div className="comparison-container">
      <div className="comparison-header">
        <h1>Hierarchical Table Comparison</h1>
        <p>Compare the custom React implementation with AG Grid implementation</p>
      </div>
      
      <div className="comparison-grid">
        <div className="table-section">
          <div className="table-header">
            <h2>Custom React Implementation</h2>
            <div className="features-list">
              <h3>Features:</h3>
              <ul>
                <li>✅ Custom hierarchical rendering</li>
                <li>✅ Percentage allocation</li>
                <li>✅ Direct value allocation</li>
                <li>✅ Proportional parent updates</li>
                <li>✅ Real-time variance tracking</li>
                <li>✅ Professional styling</li>
                <li>✅ Responsive design</li>
              </ul>
            </div>
          </div>
          <div className="table-wrapper">
            <HierarchicalTable />
          </div>
        </div>

        <div className="table-section">
          <div className="table-header">
            <h2>AG Grid Implementation</h2>
            <div className="features-list">
              <h3>Features:</h3>
              <ul>
                <li>✅ AG Grid framework</li>
                <li>✅ Percentage allocation</li>
                <li>✅ Direct value allocation</li>
                <li>✅ Proportional parent updates</li>
                <li>✅ Real-time variance tracking</li>
                <li>✅ AG Grid styling</li>
                <li>✅ Built-in performance</li>
              </ul>
            </div>
          </div>
          <div className="table-wrapper">
            <AGGridTable />
          </div>
        </div>
      </div>

      <div className="comparison-footer">
        <div className="comparison-stats">
          <h3>Implementation Comparison</h3>
          <div className="stats-grid">
            <div className="stat-item">
              <h4>Custom React</h4>
              <ul>
                <li><strong>Pros:</strong> Full control, custom styling, lightweight</li>
                <li><strong>Cons:</strong> More code to maintain, manual optimization</li>
                <li><strong>Bundle Size:</strong> ~50KB</li>
                <li><strong>Performance:</strong> Good for small-medium datasets</li>
              </ul>
            </div>
            <div className="stat-item">
              <h4>AG Grid</h4>
              <ul>
                <li><strong>Pros:</strong> Enterprise features, built-in performance, rich API</li>
                <li><strong>Cons:</strong> Larger bundle, learning curve</li>
                <li><strong>Bundle Size:</strong> ~200KB</li>
                <li><strong>Performance:</strong> Excellent for large datasets</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComparisonView;
