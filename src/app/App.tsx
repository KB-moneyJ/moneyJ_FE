import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from '@/pages/MainPage/Home';

import About from '@/pages/StartPlan/Plan';
import Splash from '@/pages/SplashPage/Splash';
import Login from '@/pages/LoginPage/Login';

function App() {
  return (
    <Router>
      <Routes>

        <Route path="/" element={<Splash />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/plan" element={<About />} />
      </Routes>
    </Router>
  );
}

export default App;
