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
import countriesData from "../../../assets/data/country.json";
import ReactCountryFlag from "react-country-flag";

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
  const etcInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setSelectedRegions([]);
    setOtherCity("");

    if (!selected) return;

    // ✅ country.json에서 해당 국가 찾기
    const found = countriesData.find((c) => c.countryCode === selected.countryCode);
    if (found) {
      setCities([...found.cities, "기타"]);
    } else {
      setCities(["대표 관광지가 준비중입니다.", "기타"]);
    }
  }, [selected]);

  const toggleCity = (city: string) => {
    setSelectedRegions((prev) => {
      let newSelected = prev.includes(city)
        ? prev.filter((c) => c !== city)
        : [...prev, city];

      if (city === "기타" && !prev.includes("기타")) {
        setTimeout(() => {
          etcInputRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
          etcInputRef.current?.focus();
        }, 100);
      }

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
          {cities.map((city) => (
            <Regionbutton
              key={city}
              selected={
                city === "기타" ? otherCity.length > 0 : selectedRegions.includes(city)
              }
              onClick={() => toggleCity(city)}
            >
              {city}
            </Regionbutton>
          ))}
        </div>

        {selectedRegions.includes("기타") && (
          <>
            <InputMessage>
              <BigM>여행지를 입력하세요.</BigM>
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
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            {selected?.countryCode && (
              <ReactCountryFlag
                countryCode={selected.countryCode}
                svg
                style={{ width: "20px", height: "20px" }}
              />
            )}
            <span>{selected?.country}</span> {/* country */}
            {selectedRegions.length > 0 && (
              <span>, {selectedRegions.join(", ")}</span>
            )}
          </div>
        </DropdownHeader>

      </Container2>
    </Wrapper>
  );
}
