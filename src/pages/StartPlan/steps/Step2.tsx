import React, { useEffect, useState, useRef } from "react";
import {
  Wrapper,
  Container2,
  DropdownHeader,
  RandomSpinner,
  Regionbutton,
  InputMessage,
  BigM,
  SmallM,
  EtcInput,
} from './StepsStyle';

const countryCodeMap: Record<string, string> = {
  "South Korea": "KR",
  Japan: "JP",
  Thailand: "TH",
  USA: "US",
  France: "FR",
  Italy: "IT",
  Spain: "ES",
  Germany: "DE",
  UK: "GB",
  Canada: "CA",
  Australia: "AU",
  China: "CN",
  Vietnam: "VN",
  Singapore: "SG",
  Malaysia: "MY",
  Indonesia: "ID",
  Philippines: "PH",
  Mexico: "MX",
  Brazil: "BR",
  Egypt: "EG",
  Turkey: "TR",
};

interface Step2Props {
  selected: any;
  selectedRegions: string[];
  setSelectedRegions: React.Dispatch<React.SetStateAction<string[]>>;
  otherCity: string;
  setOtherCity: React.Dispatch<React.SetStateAction<string>>;
}

export default function Step2({
                                selected,
                                selectedRegions,
                                setSelectedRegions,
                                otherCity,
                                setOtherCity,
                              }: Step2Props) {
  const [cities, setCities] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const etcInputRef = useRef<HTMLInputElement | null>(null);

  // 나라 변경 시 초기화
  useEffect(() => {
    setCities([]);
    setSelectedRegions([]);
    setOtherCity("");
    if (!selected) return;

    const countryCode = countryCodeMap[selected.name];
    if (!countryCode) {
      setCities(["대표 관광지가 준비중입니다.", "기타"]);
      return;
    }

    const fetchCities = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `https://wft-geo-db.p.rapidapi.com/v1/geo/cities?countryIds=${countryCode}&limit=8&sort=-population`,
          {
            method: "GET",
            headers: {
              "X-RapidAPI-Key": "4c6450c651mshda51bad5e02688cp150d1fjsnd8f36b69ed31",
              "X-RapidAPI-Host": "wft-geo-db.p.rapidapi.com",
            },
          }
        );
        const data = await response.json();
        const cityNames: string[] = data.data.map((city: any) => city.city);

        // 번역
        /*
        const translated: string[] = [];
        for (const city of cityNames) {
          const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=ko&dt=t&q=${encodeURIComponent(
            city
          )}`;
          const res = await fetch(url);
          const result = await res.json();
          translated.push(result[0][0][0]);
        }

        translated.push("기타"); // 항상 기타 추가
        setCities(translated);
        */

        // 번역 없이 원본 cityNames 사용
        setCities([...cityNames, "기타"]);
      } catch (err) {
        console.error(err);
        setCities(["데이터 불러오기 실패", "기타"]);
      } finally {
        setLoading(false);
      }
    };


    fetchCities();
  }, [selected]);

  // 도시 선택 토글
  const toggleCity = (city: string) => {
    setSelectedRegions((prev) => {
      let newSelected = prev.includes(city)
        ? prev.filter((c) => c !== city)
        : [...prev, city];

      // 기타 선택 시 포커스
      if (city === "기타" && !prev.includes("기타")) {
        setTimeout(() => {
          etcInputRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
          etcInputRef.current?.focus();
        }, 100);
      }

      // 기타 해제 시 입력값 초기화
      if (city === "기타" && prev.includes("기타")) {
        setOtherCity("");
      }

      return newSelected;
    });
  };

  if (!selected) return null;

  return (
    <Wrapper>
      <Container2>
        <div>어느지역에 가시나요?</div>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "20px",
            justifyContent: "center",
            alignItems: "center",
            marginTop: "42px",
          }}
        >
          {loading ? (
            <RandomSpinner />
          ) : (
            cities.map((city) => (
              <Regionbutton
                key={city}
                selected={
                  city === "기타" ? otherCity.length > 0 : selectedRegions.includes(city)
                }
                onClick={() => toggleCity(city)}
              >
                {city}
              </Regionbutton>
            ))
          )}
        </div>

        {selectedRegions.includes("기타") && (
          <>
            <InputMessage>
              <BigM>여행지를 입력하세요. <span></span></BigM>
              <SmallM>여러 개 가능, 쉼표로 구분</SmallM>
            </InputMessage>
            <EtcInput
              ref={etcInputRef}
              type="text"
              value={otherCity}
              onChange={(e) => setOtherCity(e.target.value)}
              placeholder="직접 입력해주세요"
            />
          </>
        )}

        <DropdownHeader
          style={{
            position: "absolute",
            top: "500px",
            left: "50%",
            transform: "translateX(-50%)",
            width: "300px",
          }}
        >
          {selected.flag} {selected.name}
        </DropdownHeader>
      </Container2>
    </Wrapper>
  );
}
