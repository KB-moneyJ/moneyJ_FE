import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from '@/pages/MainPage/Home';

import About from '@/pages/StartPlan/Plan';
import Splash from '@/pages/SplashPage/Splash';
import Login from '@/pages/LoginPage/Login';
import PlanCompelete from '@/pages/StartPlan/PlanCompelete';

function App() {
  return (
    <Router>
      <Routes>

        <Route path="/" element={<Splash />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/plan" element={<About />} />
        <Route path="/plancompelete" element={<PlanCompelete/>}/>
      </Routes>
    </Router>
  );
}

export default App;
