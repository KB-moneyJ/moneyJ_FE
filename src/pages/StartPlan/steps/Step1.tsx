import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Container,
  Wrapper,
  DropdownWrapper,
  DropdownHeader,
  DropdownList,
  DropdownItem,
  ArrowIcon,
} from "./StepsStyle";

const countries = [
  { flag: "🇰🇷", name: "South Korea" },
  { flag: "🇯🇵", name: "Japan" },
  { flag: "🇹🇭", name: "Thailand" },
  { flag: "🇺🇸", name: "USA" },
  { flag: "🇫🇷", name: "France" },
  { flag: "🇮🇹", name: "Italy" },
  { flag: "🇪🇸", name: "Spain" },
  { flag: "🇩🇪", name: "Germany" },
  { flag: "🇬🇧", name: "UK" },
  { flag: "🇨🇦", name: "Canada" },
  { flag: "🇦🇺", name: "Australia" },
  { flag: "🇨🇳", name: "China" },
  { flag: "🇻🇳", name: "Vietnam" },
  { flag: "🇸🇬", name: "Singapore" },
  { flag: "🇲🇾", name: "Malaysia" },
  { flag: "🇮🇩", name: "Indonesia" },
  { flag: "🇵🇭", name: "Philippines" },
  { flag: "🇲🇽", name: "Mexico" },
  { flag: "🇧🇷", name: "Brazil" },
  { flag: "🇪🇬", name: "Egypt" },
  { flag: "🇹🇷", name: "Turkey" },
];

export default function Step1({ onSelectCountry, selected, goNext }) {
  const [isOpen, setIsOpen] = useState(false);
  const [headerDown, setHeaderDown] = useState(false); // ✅ 내려갈지 여부

  const toggleDropdown = () => setIsOpen((prev) => !prev);

  const selectCountry = (country) => {
    onSelectCountry(country);
    setIsOpen(false);

    setTimeout(() => setHeaderDown(true), 250);
  };

  return (
    <Wrapper>
      <Container>
        <div>어디로 여행가시나요?</div>

        <DropdownWrapper>
          <motion.div
            initial={false}
            animate={{ y: headerDown ? 400 : 0 }} // ✅ 400px 아래로
            transition={{ duration: 0.6, ease: "easeInOut" }}
            onAnimationComplete={() => {
              if (headerDown) {
                goNext(); // ✅ 내려오기 끝나면 Step2로 이동
              }
            }}
          >
            <DropdownHeader onClick={toggleDropdown}>
              {!selected ? (
                <>
                  <span role="img" aria-label="globe" style={{ marginRight: "8px" }}>
                    🌍
                  </span>
                  Select Country
                </>
              ) : (
                <>
                  {selected.flag} {selected.name}
                </>
              )}
              <ArrowIcon $isOpen={isOpen} />
            </DropdownHeader>
          </motion.div>

          {isOpen && (
            <DropdownList>
              {countries.map((c) => (
                <DropdownItem key={c.name} onClick={() => selectCountry(c)}>
                  {c.flag} {c.name}
                </DropdownItem>
              ))}
            </DropdownList>
          )}
        </DropdownWrapper>
      </Container>
    </Wrapper>
  );
}

