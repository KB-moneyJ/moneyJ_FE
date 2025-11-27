import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app/App.tsx';
import './index.css';

// 실제 화면 높이를 계산해서 CSS 변수(--vh)에 반영
function setViewportHeight() {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
}

setViewportHeight();

// 화면 회전, 리사이즈 시에도 자동 업데이트
window.addEventListener('resize', setViewportHeight);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
