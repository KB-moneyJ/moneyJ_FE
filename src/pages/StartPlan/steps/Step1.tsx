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
import countriesData from "../../../assets/data/country.json";
import ReactCountryFlag from "react-country-flag";

export default function Step1({ onSelectCountry, selected, goNext }) {
  const [isOpen, setIsOpen] = useState(false);
  const [headerDown, setHeaderDown] = useState(false);

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
            animate={{ y: headerDown ? 400 : 0 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            onAnimationComplete={() => {
              if (headerDown) goNext();
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
                  <ReactCountryFlag
                    countryCode={selected.countryCode}
                    svg
                    style={{ marginRight: "8px" }}
                  />
                  {selected.country}
                </>
              )}
              <ArrowIcon $isOpen={isOpen} />
            </DropdownHeader>
          </motion.div>

          {isOpen && (
            <DropdownList>
              {countriesData.map((c) => (
                <DropdownItem key={c.countryCode} onClick={() => selectCountry(c)}>
                  <ReactCountryFlag
                    countryCode={c.countryCode}
                    svg
                    style={{ marginRight: "8px" }}
                  />
                  {c.country}
                </DropdownItem>
              ))}
            </DropdownList>
          )}
        </DropdownWrapper>
      </Container>
    </Wrapper>
  );
}
