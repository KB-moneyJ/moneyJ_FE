import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from '@/pages/MainPage/Home';
import About from "../pages/StartPlan/Plan";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/plan" element={<About />} />
      </Routes>
    </Router>
  );
}

export default App;
