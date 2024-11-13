import React, { useState, useEffect } from "react";
import styles from "./RandomQueries.module.css"; // You'll need to create this CSS module

const queries = [
  "What is the best AMD EPYC for databases?",
  "What is the best AMD EPYC for CI/CD?",
  "Which AMD EPYC has the highest frequency?",
  "Which AMD EPYC is best for finance and banking?",
  "What is the best AMD EPYC for low latency applications?",
  "What is the best AMD EPYC for MongoDB?",
  "In what areas is the latest 4th Gen AMD EPYC better than Intel Xeon?",
  "Where can I find AMD EPYC GCC tools support?",
  "What is the maximum memory supported by a 2P AMD EPYC platform?",
  "What is the maximum DRAM speed supported by AMD EPYC?",
  "Where can I find the latest AMD EPYC-related security patches?",
  "How does AMD EPYC 4th Gen compare to the competition?",
  "What are the best features of the latest 4th Gen AMD EPYC?",
  "What are the specifications for the latest 4th Gen EPYC?",
  "Which GCC compiler should be used with AMD EPYC 4th Gen?",
  "What are the best Java practices for the 4th Gen AMD EPYC?",
  "Is there a 4th Gen AMD EPYC tuning guide for networking?",
  "How is AMD EPYC helping the climate?",
  "Which AMD EPYC is best for HPC?",
  "Where can I find the AMD EPYC 4th Gen memory population guide?"
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
      <div
        className="random-queries-container"
      >
        {randomQueries.map((query, index) => (
          <p
            className="random-query-card"
            key={index}
            onClick={() => {
              onQuerySelect(query);
            }}
          >
            {query}
          </p>
        ))}
      </div>
    </>
  );
};

export default RandomQueries;
