import { useEffect, useState } from 'react';
import TripCard from './PlanCard/PlanCard';

export default function PlanCompelete() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let start = 0;
    const target = 100; // 최종 목표
    const duration = 2500; // 애니메이션 총 시간(ms)
    const stepTime = 10; // 몇 ms마다 갱신할지
    const step = (target - start) / (duration / stepTime);

    const interval = setInterval(() => {
      start += step;
      if (start >= target) {
        start = target;
        clearInterval(interval);
      }
      setProgress(Math.round(start));
    }, stepTime);

    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <TripCard
        destination="Tokyo, Japan"
        countryCode="JP"
        period="2025.10.05 - 2025.10.12"
        thumbnailUrl="https://images.unsplash.com/photo-1503899036084-c55cdd92da26?ixlib=rb-4.0.3&auto=format&fit=crop&w=640&q=80"
        progressPercent={progress}
        savedPercent={progress} // 저축 퍼센트도 같이 올라가게
        onClickDetail={() => console.log('도쿄 상세보기 클릭')}
      />
    </div>
  );
}
