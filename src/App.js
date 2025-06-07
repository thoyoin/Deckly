import { Routes, Route } from 'react-router-dom';
import './index.css';
import Home from './components/Home';
import Presentation from './components/Presentation';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

function App() {
  return (
    <div className="App">
        <Routes>
            <Route path='/Home' element={<Home />} />
            <Route path="/presentation/:id" element={<Presentation />} />
        </Routes>
    </div>
  );
}

export default App;
