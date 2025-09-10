import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import TripCard from "./PlanCard/PlanCard";
import { EndBtn } from "@/pages/StartPlan/PlanStyle";

import { Plane, Home, Utensils } from "lucide-react";

const ACCESS_KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;

export default function PlanCompelete() {
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedCountry, selectedRegions, otherCity, days, people, friendIds } =
    location.state;

  const destination = otherCity
    ? `${selectedCountry.country}, ${selectedRegions.join(", ")}, ${otherCity}`
    : `${selectedCountry.country}, ${selectedRegions.join(", ")}`;

  const countryCode = selectedCountry.countryCode;

  const period = `${days.year}.${days.month}.${days.rangeStart} - ${days.year}.${days.month}.${days.rangeEnd}`;
  const [thumbnailUrl, setThumbnailUrl] = useState(
    "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?ixlib=rb-4.0.3&auto=format&fit=crop&w=640&q=80"
  );

  const [progress, setProgress] = useState(0);
  const [items, setItems] = useState<any[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const fetchThumbnail = async () => {
      try {
        // 검색 키워드 구성: 도시(있으면) + 지역들 + 나라
        const queryParts = [];
        if (otherCity) queryParts.push(otherCity);
        if (selectedRegions && selectedRegions.length > 0) {
          queryParts.push(selectedRegions.join(" "));
        }
        queryParts.push(selectedCountry.country);

        const query = queryParts.join(" ");

        const res = await fetch(
          `https://api.unsplash.com/search/photos?query=${encodeURIComponent(
            query + "landmark"
          )}&client_id=${ACCESS_KEY}&per_page=1`
        );

        if (!res.ok) throw new Error("썸네일 불러오기 실패");
        const data = await res.json();

        if (data.results.length > 0) {
          setThumbnailUrl(data.results[0].urls.small);
        }
      } catch (err) {
        console.error("썸네일 로드 에러:", err);
      }
    };

    fetchThumbnail();
  }, [selectedCountry, selectedRegions, otherCity]);


  // 비용 조회
  useEffect(() => {
    const fetchBudget = async () => {
      try {
        const formatDate = (year: string, month: string, day: string) =>
          `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;

        const cities = [...selectedRegions];
        if (otherCity) cities.push(otherCity);
        const cityString = cities.join(", ");

        let startDate: string;
        let endDate: string;

        if (days.rangeStart && days.rangeEnd) {
          startDate = formatDate(days.year, days.month, days.rangeStart);
          endDate = formatDate(days.year, days.month, days.rangeEnd);
        } else {
          const lastDayOfMonth = new Date(
            Number(days.year),
            Number(days.month),
            0
          ).getDate();

          startDate = formatDate(days.year, days.month, "01");
          endDate = formatDate(days.year, days.month, String(lastDayOfMonth));
        }

        const res = await fetch("http://localhost:8080/trip-plans/budget", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            country: selectedCountry.country,
            city: cityString,
            nights: Number(days.nights),
            days: Number(days.days),
            startDate,
            endDate,
          }),
        });

        if (!res.ok) throw new Error("비용 정보 불러오기 실패");

        const data = await res.json();

        const newItems = [
          { id: "flight", label: "항공비", amount: data.flightCost, icon: <Plane size={18} /> },
          { id: "hotel", label: "숙박", amount: data.accommodationCost, icon: <Home size={18} /> },
          { id: "food", label: "식비", amount: data.foodCost, icon: <Utensils size={18} /> },
        ];

        setItems(newItems);
        setIsLoaded(true);
      } catch (err) {
        console.error(err);
      }
    };

    fetchBudget();
  }, [selectedCountry, selectedRegions, otherCity, days]);

  // 진행률 애니메이션
  useEffect(() => {
    if (!isLoaded) return;

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

    return () => clearInterval(interval);
  }, [isLoaded]);

  const handleSavePlan = async () => {
    try {
      const formatDate = (year: string, month: string, day: string) =>
        `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;

      const cities = [...selectedRegions];
      if (otherCity) cities.push(otherCity);
      const cityString = cities.join(", ");

      const tripStartDate = formatDate(days.year, days.month, days.rangeStart);
      const tripEndDate = formatDate(days.year, days.month, days.rangeEnd);

      const categoryDTOList = items.map((item) => ({
        categoryName: item.label,
        amount: item.amount,
      }));

      const totalBudget = categoryDTOList.reduce(
        (sum, item) => sum + item.amount,
        0
      );

      //  startDate: 오늘
      const today = new Date();
      const startDate = today.toISOString().split("T")[0]; // yyyy-MM-dd

      //  targetDate: tripStartDate - 7일
      const tripStart = new Date(tripStartDate);
      tripStart.setDate(tripStart.getDate() - 7);
      const targetDate = tripStart.toISOString().split("T")[0];

      const payload = {
        country: selectedCountry.country,
        countryCode,
        city: cityString,
        categoryDTOList,
        // nights: Number(days.nights),   //  테스트용이라 주석 처리
        // days: Number(days.days),       //  테스트용이라 주석 처리
        duration: Number(days.days),      //  days → duration으로 임시 변환
        tripStartDate,
        tripEndDate,
        totalBudget,
        startDate,
        targetDate,  // 여행 7일 전
        tripMemberEmail: friendIds, //  Step4에서 입력받은 친구 이메일 리스트
      };


      console.log("최종 POST 데이터:", payload);

      const res = await fetch("http://localhost:8080/trip-plans", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("여행 저장 실패");

      alert("여행 계획이 성공적으로 저장되었습니다!");
      navigate("/home");
    } catch (err) {
      console.error(err);
      alert("저장 중 오류가 발생했습니다.");
    }
  };


  return (
    <div>
      <div
        style={{
          marginTop: "63px",
          marginLeft: "42px",
          cursor: "pointer",
          width: "24.5px",
        }}
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
        countryCode={countryCode}
        period={period}
        people={people}
        thumbnailUrl={thumbnailUrl}
        progressPercent={progress}
        savedPercent={progress}
        items={items}
        onUpdateItems={setItems}
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
        <EndBtn onClick={handleSavePlan}>완료</EndBtn>
      </div>
    </div>
  );
}
