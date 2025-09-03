import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from '@/pages/MainPage/Home';
import About from '@/pages/StartPlan/About';
import Splash from '@/pages/SplashPage/Splash';
import Login from '@/pages/LoginPage/Login';
import Agree from '@/pages/SignUpPage/Agree';
import Intro from '@/pages/IntroPage/Intro';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Splash />} />
        <Route path="/login" element={<Login />} />
        <Route path="/agree" element={<Agree />} />
        <Route path="/intro" element={<Intro />} />
        <Route path="/home" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </Router>
  );
}

export default App;
