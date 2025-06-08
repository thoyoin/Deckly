import { Routes, Route } from 'react-router-dom';
import './index.css';
import Home from './components/Home';
import Presentation from './components/Presentation';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import PresentMode from './components/PresentMode';

function App() {
  return (
    <div className="App">
        <Routes>
            <Route path='/' element={<Home />} />
            <Route path="/presentation/:id" element={<Presentation />} />
            <Route path="/present/:id" element={<PresentMode />} />
        </Routes>
    </div>
  );
}

export default App;
