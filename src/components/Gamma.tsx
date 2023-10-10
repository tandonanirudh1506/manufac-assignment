import React, { useEffect, useState } from "react";
import wineJson from "../json/Wine-Data.json";

type WineData = {
  Alcohol: number;
  "Malic Acid": number;
  Ash: number;
  "Alcalinity of ash": number;
  Magnesium: number;
  "Total phenols": number;
  Flavanoids: number;
  "Nonflavanoid phenols": number;
  Proanthocyanins: string;
  "Color intensity": number;
  Hue: number;
  "OD280/OD315 of diluted wines": number;
  Unknown: number;
};

const wineData: WineData[] = wineJson

const computeGamma = (data: WineData) => (data.Ash * data.Hue) / data.Magnesium;

const computeMean = (values: number[]) =>
  values.reduce((a, b) => a + b, 0) / values.length;

const computeMedian = (values: number[]) => {
  values.sort((a, b) => a - b);
  const half = Math.floor(values.length / 2);
  if (values.length % 2) return values[half];
  return (values[half - 1] + values[half]) / 2.0;
};

const computeMode = (values: number[]) => {
  const counts: { [key: number]: number } = {};
  let maxCount = 0;
  let modeValue = values[0];
  values.forEach((v) => {
    counts[v] = (counts[v] || 0) + 1;
    if (counts[v] > maxCount) {
      maxCount = counts[v];
      modeValue = v;
    }
  });
  return modeValue;
};

const Gamma: React.FC = () => {
  const [analytics, setAnalytics] = useState<{
    [key: string]: { mean: number; median: number; mode: number };
  }>({});

  useEffect(() => {
    const classes = [...new Set(wineData.map((d) => d.Alcohol))];

    const classAnalytics: {
      [key: string]: { mean: number; median: number; mode: number };
    } = {};

    classes.forEach((c) => {
      const classData = wineData.filter((d) => d.Alcohol === c);
      const gammaValues = classData.map(computeGamma);
      classAnalytics[c] = {
        mean: computeMean(gammaValues),
        median: computeMedian(gammaValues),
        mode: computeMode(gammaValues),
      };
    });

    setAnalytics(classAnalytics);
  }, []);

  return (
    <table style={{marginLeft: "auto", marginRight: "auto"}}>
      <thead>
        <tr>
          <th>Measure</th>
          {Object.keys(analytics).map((c) => (
            <th key={c}>Class {c}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        <tr>
          <td style={{ fontWeight: "bold" }}>Gamma Mean</td>
          {Object.values(analytics).map((a, i) => (
            <td key={i}>{a.mean.toFixed(3)}</td>
          ))}
        </tr>
        <tr>
          <td style={{ fontWeight: "bold" }}>Gamma Median</td>
          {Object.values(analytics).map((a, i) => (
            <td key={i}>{a.median.toFixed(3)}</td>
          ))}
        </tr>
        <tr>
          <td style={{ fontWeight: "bold" }}>Gamma Mode</td>
          {Object.values(analytics).map((a, i) => (
            <td key={i}>{a.mode.toFixed(3)}</td>
          ))}
        </tr>
      </tbody>
    </table>
  );
};

export default Gamma;
