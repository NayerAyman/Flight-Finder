// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import About from './pages/About';
// import About from './pages/About';     // ← add later
// import NotFound from './pages/NotFound';

function App() {
  return (
    <Router>
      <div className="App min-h-screen  flex flex-col">
        <Navbar />
        
        <main className="grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </main>
        
        {/* Optional: Footer later */}
        <footer className="bg-gray-800 text-white py-6 text-center">
          © 2026 FlightBook
        </footer>
      </div>
    </Router>
  );
}

export default App;