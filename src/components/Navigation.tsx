import React, { useState } from 'react';
import HierarchicalTable from './HierarchicalTable';
import AGGridTable from './AGGridTable';
import ComparisonView from './ComparisonView';

type ViewType = 'custom' | 'ag-grid' | 'comparison';

const Navigation: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewType>('comparison');

  const renderView = () => {
    switch (currentView) {
      case 'custom':
        return <HierarchicalTable />;
      case 'ag-grid':
        return <AGGridTable />;
      case 'comparison':
      default:
        return <ComparisonView />;
    }
  };

  return (
    <div className="navigation-container">
      <nav className="navigation">
        <div className="nav-buttons">
          <button
            className={`nav-button ${currentView === 'custom' ? 'active' : ''}`}
            onClick={() => setCurrentView('custom')}
          >
            Custom React Table
          </button>
          <button
            className={`nav-button ${currentView === 'ag-grid' ? 'active' : ''}`}
            onClick={() => setCurrentView('ag-grid')}
          >
            AG Grid Table
          </button>
          <button
            className={`nav-button ${currentView === 'comparison' ? 'active' : ''}`}
            onClick={() => setCurrentView('comparison')}
          >
            Comparison View
          </button>
        </div>
      </nav>
      
      <div className="view-content">
        {renderView()}
      </div>
    </div>
  );
};

export default Navigation;
