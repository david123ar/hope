"use client";
import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./stats.css";
import { SessionProvider } from "next-auth/react";
import Navbar from "../Navbar/Navbar";

const Stats = ({ placementId, apiKey }) => {
  const [data, setData] = useState([]);
  const [startDate, setStartDate] = useState(
    new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  );
  const [endDate, setEndDate] = useState(new Date());
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "desc",
  });

  useEffect(() => {
    const fetchData = async () => {
      const start = startDate.toISOString().split("T")[0];
      const end = endDate.toISOString().split("T")[0];

      const url = `/api/stats?start=${start}&end=${end}&placementId=${placementId}&apiKey=${apiKey}`;

      const response = await fetch(url);
      const result = await response.json();

      setData(result.items || []);
    };

    fetchData();
  }, [startDate, endDate]);

  const getSortedData = () => {
    if (!sortConfig.key) return data;

    return [...data].sort((a, b) => {
      const valA =
        sortConfig.key === "date"
          ? new Date(a[sortConfig.key])
          : parseFloat(a[sortConfig.key]);
      const valB =
        sortConfig.key === "date"
          ? new Date(b[sortConfig.key])
          : parseFloat(b[sortConfig.key]);

      return sortConfig.direction === "asc" ? valA - valB : valB - valA;
    });
  };

  const handleSort = (key) => {
    setSortConfig((prev) => {
      if (prev.key === key) {
        return { key, direction: prev.direction === "asc" ? "desc" : "asc" };
      }
      return { key, direction: "desc" };
    });
  };

  // Summary stats
  const totalImpressions = data.reduce(
    (acc, cur) => acc + Number(cur.impression || 0),
    0
  );
  const totalRevenue = data.reduce(
    (acc, cur) => acc + parseFloat(cur.revenue || 0),
    0
  );
  const averageCPM =
    data.length > 0 ? (totalRevenue / totalImpressions) * 1000 : 0;

  return (
    <>
      <SessionProvider>
        <Navbar />
        <div className="stats-container">
          <h1 className="stats-title">Ad Performance Stats</h1>

          <div className="stats-controls">
            <div className="datepicker-wrapper">
              <label>Start Date</label>
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                dateFormat="yyyy-MM-dd"
                className="custom-datepicker"
                popperPlacement="bottom"
              />
            </div>
            <div className="datepicker-wrapper">
              <label>End Date</label>
              <DatePicker
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                dateFormat="yyyy-MM-dd"
                className="custom-datepicker"
                popperPlacement="bottom"
              />
            </div>
          </div>

          <div className="stats-summary">
            <div className="card">
              Total Impressions <span>{totalImpressions.toLocaleString()}</span>
            </div>
            <div className="card">
              Total Revenue <span>${totalRevenue.toFixed(2)}</span>
            </div>
            <div className="card">
              Avg. CPM <span>${averageCPM.toFixed(2)}</span>
            </div>
          </div>

          <div className="stats-table-wrapper">
            <table className="stats-table">
              <thead>
                <tr>
                  <th onClick={() => handleSort("date")}>Date</th>
                  <th onClick={() => handleSort("impression")}>Impressions</th>
                  <th onClick={() => handleSort("clicks")}>Clicks</th>
                  <th onClick={() => handleSort("ctr")}>CTR</th>
                  <th onClick={() => handleSort("cpm")}>CPM</th>
                  <th onClick={() => handleSort("revenue")}>Revenue</th>
                </tr>
              </thead>
              <tbody>
                {getSortedData().map((item, i) => (
                  <tr key={i}>
                    <td>{item.date}</td>
                    <td>{item.impression}</td>
                    <td>{item.clicks}</td>
                    <td>{item.ctr}%</td>
                    <td>${item.cpm}</td>
                    <td>${item.revenue}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </SessionProvider>
    </>
  );
};

export default Stats;
