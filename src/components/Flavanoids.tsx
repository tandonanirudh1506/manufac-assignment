import React, { useState, useEffect } from "react";
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

interface Stats {
  mean?: number;
  median?: number;
  mode?: number;
}

const Flavanoids: React.FC = () => {
  const [stats, setStats] = useState<Record<number, Stats>>({});

  const fetchData = async () => {
    // For this example, I'm using static data.
    const data: WineData[] = wineJson;
    calculateStats(data);
  };

  const calculateStats = (data: WineData[]) => {
    const grouped: Record<number, number[]> = {};

    data.forEach((d) => {
      if (!grouped[d.Alcohol]) {
        grouped[d.Alcohol] = [];
      }
      grouped[d.Alcohol].push(d.Flavanoids);
    });

    const calculatedStats: Record<number, Stats> = {};
    for (const key in grouped) {
      const values = grouped[key];
      calculatedStats[key] = {
        mean: values.reduce((a, b) => a + b, 0) / values.length,
        median: values.sort()[Math.floor(values.length / 2)],
        mode: getMode(values),
      };
    }
    setStats(calculatedStats);
  };

  const getMode = (values: number[]): number => {
    const frequency: Record<number, number> = {};
    let max = 0;
    let mode = values[0];

    values.forEach((v) => {
      if (frequency[v]) {
        frequency[v]++;
      } else {
        frequency[v] = 1;
      }

      if (frequency[v] > max) {
        max = frequency[v];
        mode = v;
      }
    });

    return mode;
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <table style={{marginLeft: "auto", marginRight: "auto"}}>
      <thead>
        <tr>
          <th>Measure</th>
          <th>Class 1</th>
          <th>Class 2</th>
          <th>Class 3</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td style={{ fontWeight: "bold" }}>Flavanoids Mean</td>
          <td>{stats[1]?.mean?.toFixed(3)}</td>
          <td>{stats[2]?.mean?.toFixed(3)}</td>
          <td>{stats[3]?.mean?.toFixed(3)}</td>
        </tr>
        <tr>
          <td style={{ fontWeight: "bold" }}>Flavanoids Median</td>
          <td>{stats[1]?.median?.toFixed(3)}</td>
          <td>{stats[2]?.median?.toFixed(3)}</td>
          <td>{stats[3]?.median?.toFixed(3)}</td>
        </tr>
        <tr>
          <td style={{ fontWeight: "bold" }}>Flavanoids Mode</td>
          <td>{stats[1]?.mode?.toFixed(3)}</td>
          <td>{stats[2]?.mode?.toFixed(3)}</td>
          <td>{stats[3]?.mode?.toFixed(3)}</td>
        </tr>
      </tbody>
    </table>
  );
};

export default Flavanoids;
