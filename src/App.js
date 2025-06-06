import { Routes, Route } from 'react-router-dom';
import './index.css';
import AuthPage from './components/AuthPage';
import PresentationEditor from './components/PresentationEditor';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

function App() {
  return (
    <div className="App">
        <Routes>
            <Route path='/' element={<AuthPage />} />
            <Route path='/editor' element={<PresentationEditor />} />
        </Routes>
    </div>
  );
}

export default App;
