import React, { useState, useEffect } from "react";
import styles from "./RandomQueries.module.css"; // You'll need to create this CSS module
import { Grid } from "@mui/material";

//const queries = [
//  "Tell me about AMD Instinct™ MI300 Series Accelerators",
//  "What is the best AMD EPYC for databases?",
//  "What is the best AMD EPYC for CI/CD?",
//  "Which AMD EPYC has highest frequency?",
//  "Which AMD EPYC is best for finance and banking?",
//  "What is best AMD EPYC for low latency applications?",
//  "What areas latest 4th Gen AMD EPYC is better than Intel Xeon",
//  "Where can I find AMD EPYC GCC tool support",
//  "Where to find latest AMD EPYC related security patches",
//  "How AMD EPYC 4th Gen compares to competition",
//  "What are the best features of latest 4th Gen EPYC",
//  "What is specification for latest 4th Gen EPYC",
//];

const queries = [
  "What types of steam turbines does Triveni Turbines manufacture?",
  "What industries does Triveni Turbines serve?",
  "How long has Triveni Turbines been in operation?",
  "Where is Triveni Turbines headquartered?",
  "What range of power capacities do Triveni Turbines cover?",
  "Does Triveni Turbines offer after-sales services?",
  "What are Triveni’s main technological strengths?",
  "What global regions does Triveni Turbines operate in?",
  "What certifications has Triveni Turbines achieved?",
  "What innovations has Triveni introduced in turbine efficiency?",
  "What maintenance services does Triveni Turbines provide?",
  "What are some recent projects completed by Triveni Turbines?",
];

const getRandomQueries = (arr, n) => {
  let shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, n);
};

const RandomQueries = ({ onQuerySelect }) => {
  const [randomQueries, setRandomQueries] = useState([]);

  useEffect(() => {
    setRandomQueries(getRandomQueries(queries, 3));
  }, []);

  return (
    <>
      <div className="random-queries-container">
        {randomQueries.map((query, index) => (
          <Grid
            className="random-query-card"
            onClick={() => {
              onQuerySelect(query);
            }}
            item
            xs={4}
            md={4}
          >
            {query}
          </Grid>
        ))}
      </div>
    </>
  );
};

export default RandomQueries;
