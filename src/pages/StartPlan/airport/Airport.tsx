import React, { useState, useEffect } from "react";
import axios from "axios";
import { RandomSpinner } from "@/pages/StartPlan/steps/StepsStyle";
import {PageWrapper, DurationText, LoadingWrapper, LoadingText, HeaderText, PriceText, Section, SectionTitle,
RouteSub,RouteRow, GlassRow, AirlineInfo, AirportBtn, CardTop, FlightCard, Divider, Analysis, LogoCircle }
  from '@/pages/StartPlan/airport/airportstyle'
import ExchangeRateCard from '@/pages/DetailPage/sections/ExchangeRateCard/ExchangeRateCard';
// =======================
// 🔑 Amadeus API 정보
// =======================
const CLIENT_ID = "6j6PRJFX1dH0hGzvGOt2reeYrYuTOyX4";
const CLIENT_SECRET = "YbRNvADtljVymAPG";

// =======================
// 타입 정의
// =======================
interface Flight {
  price: { total: string; currency: string };
  validatingAirlineCodes: string[];
  itineraries: any[];
  analysis?: {
    average: number;
    diffRate: number;
    isCheap: boolean;
  };
}

export const Airport: React.FC<{ destinationCode: string }> = ({ destinationCode }) => {
  const [origin, setOrigin] = useState("ICN");

  const [destination] = useState(destinationCode);
  const [depart] = useState("2025-12-10");
  const [returnDate] = useState("2025-12-15");

  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(false);

  const [airportLowest, setAirportLowest] =
    useState<Record<string, number>>({});

  const AUTH_URL = "https://api.amadeus.com/v1/security/oauth2/token";
  const FLIGHT_URL = "https://api.amadeus.com/v2/shopping/flight-offers";

  // 항공사 이름 매핑
  const airlineNameMap: Record<string, string> = {
    OZ: "아시아나항공",
    KE: "대한항공",
    LJ: "진에어",
    "7C": "제주항공",
    TW: "티웨이항공",
    ZG: "이스타항공",
    MM: "피치항공",
    NH: "ANA 전일본항공",
    JL: "JAL 일본항공",
  };

  // ======================
  // 날짜/시간 포맷
  // ======================
  const formatTime = (str: string) => {
    const d = new Date(str);
    let h = d.getHours();
    const m = String(d.getMinutes()).padStart(2, "0");
    const period = h >= 12 ? "오후" : "오전";
    h = h % 12 || 12;

    return `${period} ${h}:${m}`;
  };

  // +1 표시 포함
  const formatTimeWithPlus = (start: string, end: string) => {
    const s = new Date(start);
    const e = new Date(end);

    const diffDay = e.getDate() - s.getDate();
    const plus = diffDay >= 1 ? `+${diffDay}` : "";

    return `${formatTime(end)}${plus}`;
  };

  // 소요시간 파싱 → PT5H30M → 5시간 30분
  const parseDuration = (duration: string) => {
    const h = duration.match(/(\d+)H/)?.[1] ?? "0";
    const m = duration.match(/(\d+)M/)?.[1] ?? "0";
    return `${Number(h)}시간 ${Number(m)}분`;
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일`;
  };

  // ======================
  // 토큰
  // ======================
  const getToken = async () => {
    const res = await axios.post(
      AUTH_URL,
      new URLSearchParams({
        grant_type: "client_credentials",
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
      }),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );
    return res.data.access_token;
  };

  // ======================
  // 공항별 최저가
  // ======================
  const fetchLowestPriceForAllAirports = async () => {
    const token = await getToken();
    const result: Record<string, number> = {};

    for (const air of airportList) {
      try {
        const res = await axios.get(FLIGHT_URL, {
          headers: { Authorization: `Bearer ${token}` },
          params: {
            originLocationCode: air.code,
            destinationLocationCode: destination,
            departureDate: depart,
            returnDate: returnDate,
            adults: 1,
            max: 5,
          },
        });

        const data = res.data.data;
        if (!data) continue;

        const lowest = Math.min(
          ...data.map((f: Flight) => Number(f.price.total))
        );
        result[air.code] = lowest;
      } catch (err) {
        console.log(air.code, "조회 실패");
      }
    }

    setAirportLowest(result);
  };

  // ======================
  // 상세 조회
  // ======================
  const getFlights = async (selectedOrigin: string) => {
    setLoading(true);
    setFlights([]);

    try {
      const token = await getToken();
      const res = await axios.get(FLIGHT_URL, {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          originLocationCode: selectedOrigin,
          destinationLocationCode: destination,
          departureDate: depart,
          returnDate: returnDate,
          adults: 1,
          max: 20,
        },
      });

      const arr: Flight[] = res.data.data || [];

      const prices = arr.map((f) => Number(f.price.total));
      const avg = prices.reduce((a, b) => a + b, 0) / prices.length;

      const lowest10 = arr
        .sort((a, b) => Number(a.price.total) - Number(b.price.total))
        .slice(0, 10);

      const enriched = lowest10.map((f) => ({
        ...f,
        analysis: {
          average: Math.round(avg),
          diffRate: Math.round(
            ((Number(f.price.total) - avg) / avg) * 100
          ),
          isCheap: Number(f.price.total) < avg,
        },
      }));

      setFlights(enriched);
    } catch (err) {
      alert("조회 실패!");
    } finally {
      setLoading(false);
    }
  };

  // 공항 목록
  const airportList = [
    { code: "ICN", name: "인천공항" },
    { code: "PUS", name: "김해공항" },
    { code: "TAE", name: "대구공항" },
    { code: "CJU", name: "제주공항" },
  ];

  const airportNameMap: Record<string, string> = {
    ICN: "인천",
    PUS: "부산",
    TAE: "대구",
    CJU: "제주",
    KIX: "오사카",
  };

  useEffect(() => {
    fetchLowestPriceForAllAirports();
    getFlights(origin);
  }, []);

  // ======================
  // UI
  // ======================
  return (
    <PageWrapper>
      <HeaderText>
        ✈ {formatDate(depart)} ~ {formatDate(returnDate)}{" "}
        {airportNameMap[destination]} 왕복 항공권
      </HeaderText>

      {/* 공항 선택 */}
      <GlassRow>
        {airportList.map((air) => (
          <AirportBtn
            key={air.code}
            onClick={() => {
              setOrigin(air.code);
              getFlights(air.code);
            }}
            $selected={origin === air.code}
          >
            <div>{air.name}</div>
            <small style={{ fontSize: 10, opacity: 0.8, color: "pink" }}>
              {airportLowest[air.code]
                ? `최저 ${airportLowest[air.code]}€`
                : "조회중..."}
            </small>
          </AirportBtn>
        ))}
      </GlassRow>

      {/* 로딩 */}
      {loading && (
        <LoadingWrapper>
          <RandomSpinner />
          <LoadingText>항공권 조회 중...</LoadingText>
        </LoadingWrapper>
      )}

      {/* 항공권 */}
      {flights.map((f, idx) => {
        const out = f.itineraries?.[0]?.segments?.[0];
        const ret = f.itineraries?.[1]?.segments?.[0];

        const airlineCode = f.validatingAirlineCodes[0];
        const airlineName = airlineNameMap[airlineCode] ?? airlineCode;

        return (
          <FlightCard key={idx}>
            {/* 상단 */}
            <CardTop>
              <AirlineInfo>
                <LogoCircle>{airlineCode}</LogoCircle>
                <div className="airline">{airlineName}</div>
              </AirlineInfo>

              <PriceText>
                {f.price.total} {f.price.currency}
              </PriceText>
            </CardTop>

            <Divider />

            {/* 가는 편 */}
            <Section>
              <SectionTitle>가는 편</SectionTitle>
              <RouteRow>
                <div className="time">
                  {formatTime(out?.departure?.at)} —{" "}
                  {formatTimeWithPlus(out?.departure?.at, out?.arrival?.at)}
                </div>
                <DurationText>
                  {parseDuration(out?.duration)}
                </DurationText>
              </RouteRow>

              <RouteSub>
                {out?.departure?.iataCode} → {out?.arrival?.iataCode}
              </RouteSub>
            </Section>

            <Divider />

            {/* 오는 편 */}
            <Section>
              <SectionTitle>오는 편</SectionTitle>
              <RouteRow>
                <div className="time">
                  {formatTime(ret?.departure?.at)} —{" "}
                  {formatTimeWithPlus(ret?.departure?.at, ret?.arrival?.at)}
                </div>
                <DurationText>
                  {parseDuration(ret?.duration)}
                </DurationText>
              </RouteRow>

              <RouteSub>
                {ret?.departure?.iataCode} → {ret?.arrival?.iataCode}
              </RouteSub>
            </Section>

            <Divider />

            {/* 평균가 */}
            <Analysis>
              {f.analysis?.isCheap ? (
                <p className="cheap">
                  🔥 평균보다 {Math.abs(f.analysis.diffRate)}% 저렴!
                </p>
              ) : (
                <p className="expensive">
                  ❗ 평균보다 {f.analysis?.diffRate}% 비쌈
                </p>
              )}
            </Analysis>
          </FlightCard>
        );
      })}
      <ExchangeRateCard destination="Japan" />
    </PageWrapper>
  );
};

export default Airport;

