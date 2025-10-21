import Navigation from './components/Navigation'
import './App.css'
import './ag-grid-setup'

console.log('App component loading...');

function App() {
  console.log('App component rendering...');
  return (
    <div className="app">
      <Navigation />
    </div>
  )
}

export default App
