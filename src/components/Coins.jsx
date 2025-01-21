import { HStack, Container, RadioGroup, Radio, Button } from "@chakra-ui/react";
import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import Loader from "./Loader";
import ErrorComponent from "./ErrorComponent";
import { server } from "../index";
import CoinCard from "./CoinCard";

const Coins = () => {
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [page, setPage] = useState(1);
  const [currency, setCurrency] = useState("inr");
  const [totalPages, setTotalPages] = useState(1);

  const currencySymbol =
    currency === "inr" ? "₹" : currency === "eur" ? "€" : "$";

  const changePage = (page) => {
    setPage(page);
  };

  const fetchCoins = useCallback(async () => {
    try {
      setLoading(true); // Start loader when fetching data
      setError(false); // Reset error state
      const result = await axios.get(
        `${server}/coins/markets?vs_currency=${currency}&page=${page}`
      );
      setCoins(result.data);
      setTotalPages(50); // Example: Replace with actual total pages from API response if available
      setLoading(false); // Stop loader after data is fetched
    } catch (error) {
      console.error("Error fetching coins:", error);
      setLoading(false);
      setError(true);
    }
  }, [currency, page]);

  useEffect(() => {
    fetchCoins(); // Fetch coins whenever currency or page changes
  }, [fetchCoins]);

  if (error)
    return (
      <ErrorComponent
        message="Error While Fetching Coins. Please try again later."
      />
    );

  return (
    <Container maxW={"container.2xl"}>
      {loading ? (
        <Loader />
      ) : (
        <>
          <RadioGroup value={currency} onChange={setCurrency} p={"8"}>
            <HStack spacing={"4"}>
              <Radio value={"inr"}>INR</Radio>
              <Radio value={"usd"}>USD</Radio>
              <Radio value={"eur"}>EUR</Radio>
            </HStack>
          </RadioGroup>

          <HStack wrap={"wrap"} justifyContent={"space-evenly"}>
            {coins.map((i) => (
              <CoinCard
                id={i.id}
                key={i.id}
                name={i.name}
                price={i.current_price}
                img={i.image}
                symbol={i.symbol}
                currencySymbol={currencySymbol}
              />
            ))}
          </HStack>

          <HStack w={"full"} overflowX={"auto"} p={"8"}>
            {Array.from({ length: totalPages }, (_, index) => (
              <Button
                key={index}
                bgColor={"blackAlpha.900"}
                color={"white"}
                onClick={() => changePage(index + 1)}
              >
                {index + 1}
              </Button>
            ))}
          </HStack>
        </>
      )}
    </Container>
  );
};

export default Coins;
