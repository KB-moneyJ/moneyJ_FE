import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from '@/pages/MainPage/Home';
import About from '@/pages/StartPlan/Plan';
import DetailPage from '@/pages/DetailPage/DetailPage';
import Splash from '@/pages/SplashPage/Splash';
import Login from '@/pages/LoginPage/Login';
import PlanCompelete from '@/pages/StartPlan/PlanCompelete';

function App() {
  return (
    <Router>
      <Routes>
        {/* Auth (첫 시작) */}
        <Route path="/" element={<Splash />} />
        <Route path="/login" element={<Login />} />

        {/* Home */}
        <Route path="/home" element={<Home />} />
        
        {/* Plan (설문/시작 플로우) */}
        <Route path="/plan" element={<About />} />
        
        {/* Trip (상세) */}
        <Route path="/trip/:tripId" element={<DetailPage />} />

        {/* TODO: 404 
        <Route path="*" element={<NotFound />} /> 
        */}
        
        <Route path="/plancompelete" element={<PlanCompelete/>}/>
      </Routes>
    </Router>
  );
}

export default App;
