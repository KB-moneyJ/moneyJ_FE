import React, { useEffect, useState } from "react";
import axios from "axios";

const CLIENT_ID = "PAGwZ8RyXRy9KPxeCGVP1Be1nRDtix7o";
const CLIENT_SECRET = "SxtnF5HARyg2qeuK";

interface Flight {
  price: { total: string; currency: string };
  validatingAirlineCodes: string[];
  itineraries: any[];
}

export const Splash: React.FC = () => {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(false);

  const AUTH_URL = "https://api.amadeus.com/v1/security/oauth2/token";
  const FLIGHT_URL = "https://api.amadeus.com/v2/shopping/flight-offers";

  // 🔑 토큰 발급
  const getToken = async (): Promise<string> => {
    const res = await axios.post(
      AUTH_URL,
      new URLSearchParams({
        grant_type: "client_credentials",
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    console.log("🔑 Access Token 발급 성공:", res.data);
    return res.data.access_token;
  };

  // ✈️ 항공권 조회
  const getFlights = async () => {
    setLoading(true);
    try {
      const token = await getToken();
      const res = await axios.get(FLIGHT_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          originLocationCode: "ICN",
          destinationLocationCode: "KIX",
          departureDate: "2025-11-01",
          returnDate: "2025-11-05",
          adults: 1,
          max: 5,
        },
      });
      console.log("✈️ API 응답 전체:", res.data);
      setFlights(res.data.data || []);
    } catch (err: any) {
      console.error("❌ 항공권 조회 실패:", err.response?.data || err.message);
      alert("항공권 조회 실패!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getFlights();
  }, []);

  return (
    <div style={{ padding: 20 , background: "#fff" }}>
      <h1>한국 → 오사카 항공권 (2025-11-01 ~ 11-05)</h1>
      {loading && <p>로딩중...</p>}
      {flights.map((flight, idx) => (
        <div
          key={idx}
          style={{
            border: "1px solid #ddd",
            borderRadius: 8,
            padding: 10,
            marginBottom: 10,
          }}
        >
          <p>
            <strong>가격:</strong> {flight.price.total} {flight.price.currency}
          </p>
          <p>
            <strong>항공사:</strong> {flight.validatingAirlineCodes.join(", ")}
          </p>
          <p>
            <strong>출발:</strong>{" "}
            {flight.itineraries?.[0]?.segments?.[0]?.departure?.iataCode ?? "-"}{" "}
            {flight.itineraries?.[0]?.segments?.[0]?.departure?.at ?? "-"}
          </p>
          <p>
            <strong>도착:</strong>{" "}
            {flight.itineraries?.[0]?.segments?.[0]?.arrival?.iataCode ?? "-"}{" "}
            {flight.itineraries?.[0]?.segments?.[0]?.arrival?.at ?? "-"}
          </p>
          <p>
            <strong>왕복 도착:</strong>{" "}
            {flight.itineraries?.[1]?.segments?.[0]?.arrival?.iataCode ?? "-"}{" "}
            {flight.itineraries?.[1]?.segments?.[0]?.arrival?.at ?? "-"}
          </p>
        </div>
      ))}
    </div>
  );
};

export default Splash;
