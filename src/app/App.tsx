import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from '@/pages/MainPage/Home';
import KakaoRedirect from '@/pages/KakaoRedirect';
import About from '@/pages/StartPlan/Plan';
import DetailPage from '@/pages/DetailPage/DetailPage';
import Splash from '@/pages/SplashPage/Splash';
import Login from '@/pages/LoginPage/Login';
import Agree from '@/pages/SignUpPage/Agree';
import Intro from '@/pages/IntroPage/Intro';
import PlanCompelete from '@/pages/StartPlan/PlanCompelete';
import Myinfo from '@/pages/MyPage/MyInfo';
import Plan from '@/pages/PlanPage/Plan';
import SpendingPage from '@/pages/AnalysisPage/SpendingPage';
import ProtectedRoute from '@/components/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        {/* Auth (첫 시작) */}
        <Route path="/" element={<Splash />} />
        <Route path="/login" element={<Login />} />
        <Route path="/oauth/callback" element={<KakaoRedirect />} />
        <Route path="/agree" element={<Agree />} />
        <Route path="/intro" element={<Intro />} />

        {/* Home */}
        <Route path="/home" element={<Home />} />
        <Route path="/plan" element={<Plan />} />

        {/* Plan (설문/시작 플로우) */}
        <Route path="/startplan" element={<About />} />
        <Route path="/plancompelete" element={<PlanCompelete />} />

        {/* Trip (상세) */}
        <Route path="/trip/:tripId" element={<DetailPage />} />

        <Route path="/spending" element={<SpendingPage />} />

        {/* TODO: 404 
        <Route path="*" element={<NotFound />} /> 
        */}

        {/* MyPage */}
        <Route path="/mypage" element={<Myinfo />} />
      </Routes>
    </Router>
  );
}

export default App;
