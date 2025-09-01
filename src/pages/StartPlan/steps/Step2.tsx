import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Wrapper,
  Container,
  DropdownHeader,
  RandomSpinner,
  Regionbutton,
  InputMessage, BigM, SmallM, EtcInput,
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

export default function Step2({ selected }) {
  const [cities, setCities] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCities, setSelectedCities] = useState<string[]>([]);
  const [otherCity, setOtherCity] = useState(""); // 기타 입력값 상태

  useEffect(() => {
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
      } catch (err) {
        console.error(err);
        setCities(["데이터 불러오기 실패", "기타"]);
      } finally {
        setLoading(false);
      }
    };

    fetchCities();
  }, [selected]);

  // 토글 선택
  const toggleCity = (city: string) => {
    setSelectedCities((prev) =>
      prev.includes(city) ? prev.filter((c) => c !== city) : [...prev, city]
    );

    // 기타 해제 시 입력값 초기화
    if (city === "기타" && selectedCities.includes("기타")) {
      setOtherCity("");
    }
  };

  if (!selected) return null;

  return (
    <Wrapper>
      <Container>
        <div>어느지역에 가시나요?</div>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "20px",
            justifyContent: "center",
            alignItems: "center",
            marginTop: "42px"
          }}
        >
          {loading ? (
            <RandomSpinner />
          ) : (
            cities.map((city) => (
              <Regionbutton
                key={city}
                selected={selectedCities.includes(city)}
                onClick={() => toggleCity(city)}
              >
                {city}
              </Regionbutton>
            ))
          )}
        </div>

        {selectedCities.includes("기타") && (
          <>
            <InputMessage>
              <BigM>여행지를 입력하세요. <span></span></BigM>
              <SmallM>여러 개 가능, 쉼표로 구분</SmallM>
            </InputMessage>
            <EtcInput
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
            top: "675px",
            left: "50%",
            transform: "translateX(-50%)",
            width: "300px",
          }}
        >
          {selected.flag} {selected.name}
        </DropdownHeader>
      </Container>
    </Wrapper>
  );
}
