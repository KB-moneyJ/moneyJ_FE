import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import TripCard from "./PlanCard/PlanCard";
import { EndBtn } from "@/pages/StartPlan/PlanStyle";

export default function PlanCompelete() {
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedCountry, selectedRegions, otherCity, days, people } = location.state;

  const destination = otherCity
    ? `${selectedCountry.name}, ${selectedRegions.join(", ")}, ${otherCity}`
    : `${selectedCountry.name}, ${selectedRegions.join(", ")}`;

  const countryCode = selectedCountry.code;
  const period = `${days.year}.${days.month}.${days.rangeStart} - ${days.year}.${days.month}.${days.rangeEnd}`;
  const thumbnailUrl="https://images.unsplash.com/photo-1503899036084-c55cdd92da26?ixlib=rb-4.0.3&auto=format&fit=crop&w=640&q=80";

  const [progress, setProgress] = useState(0);

  const animateProgress = () => {
    let start = 0;
    const target = 100;
    const duration = 2500;
    const stepTime = 10;
    const step = (target - start) / (duration / stepTime);

    const interval = setInterval(() => {
      start += step;
      if (start >= target) {
        start = target;
        clearInterval(interval);
      }
      setProgress(Math.round(start));
    }, stepTime);
  };

  useEffect(() => {
    animateProgress();
  }, []);

  return (
    <div>
      <div
        style={{ marginTop: "63px", marginLeft: "42px", cursor: "pointer", width:'24.5px' }}
        onClick={() => navigate("/home")}
      >
        <svg
          width="22"
          height="23"
          viewBox="0 0 22 23"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M12.0458 14.6392C13.2749 14.6357 14.2781 15.6262 14.2815 16.8471L14.2902 19.9872C14.2909 20.2496 14.5018 20.4593 14.7713 20.4646L16.717 20.4592C18.2503 20.455 19.4933 19.2204 19.4891 17.7075L19.4643 8.80181C19.4557 8.2812 19.2063 7.7919 18.7797 7.46744L12.0345 2.11863C11.1291 1.40554 9.86527 1.40905 8.96077 2.12922L2.29129 7.51124C1.8502 7.84832 1.6035 8.33901 1.59987 8.86883L1.62459 17.7572C1.62879 19.2701 2.87865 20.4977 4.41194 20.4935L6.37601 20.488C6.65266 20.4872 6.87663 20.2671 6.87588 19.9976C6.87571 19.9384 6.8827 19.8792 6.89479 19.823L6.88657 16.8677C6.8832 15.6539 7.87473 14.6589 9.09459 14.6474L12.0458 14.6392ZM16.7213 21.9905L14.7572 21.9959C13.6322 21.9725 12.762 21.0919 12.7589 19.9915L12.7502 16.8514C12.7492 16.4747 12.4349 16.1693 12.0501 16.1704L9.10396 16.1786C8.72728 16.1817 8.41678 16.4898 8.41782 16.8635L8.42652 19.9933C8.42673 20.0699 8.41673 20.1434 8.39548 20.2129C8.28804 21.2238 7.42662 22.0163 6.38027 22.0192L4.41619 22.0247C2.03868 22.0313 0.0998973 20.1185 0.0933434 17.7615L0.0686092 8.86595C0.0759961 7.85121 0.540953 6.92096 1.34673 6.30724L8.00296 0.934438C9.4687 -0.233392 11.5155 -0.239083 12.9846 0.918545L19.7186 6.25922C20.5094 6.85829 20.9795 7.7839 20.9956 8.78632L21.0203 17.7033C21.0269 20.0604 19.0988 21.9839 16.7213 21.9905V21.9905Z"
            fill="white"
          />
        </svg>
      </div>

      <TripCard
        destination={destination}
        countryCode="JP"
        period={period}
        thumbnailUrl={thumbnailUrl}
        progressPercent={progress}
        savedPercent={progress}
        onClickDetail={() => console.log(`${destination} 상세보기 클릭`)}
      />

      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          marginTop: "27px",
        }}
      >
        <EndBtn>완료</EndBtn>
      </div>
    </div>
  );
}
