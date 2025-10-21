import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';

// Register AG Grid modules
console.log('Registering AG Grid modules...');
try {
  ModuleRegistry.registerModules([AllCommunityModule]);
  console.log('AG Grid modules registered successfully');
  console.log('Available modules:', ModuleRegistry.getRegisteredModules());
} catch (error) {
  console.error('Error registering AG Grid modules:', error);
}

// Also try registering individual modules if needed
try {
  // This is a fallback approach
  if (!ModuleRegistry.getRegisteredModules().length) {
    console.log('No modules registered, trying alternative approach...');
    ModuleRegistry.registerModules([AllCommunityModule]);
  }
} catch (error) {
  console.error('Error in fallback module registration:', error);
}

export default ModuleRegistry;
