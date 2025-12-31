"use client";

import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./stats.css";
import { SessionProvider } from "next-auth/react";
import Navbar from "../Navbar/Navbar";

/* ===============================
   COUNTRY LIST (INLINE)
================================ */
const COUNTRIES = [
  { code: "", name: "All Countries" },
  { code: "IN", name: "India" },
  { code: "US", name: "United States" },
  { code: "GB", name: "United Kingdom" },
  { code: "CA", name: "Canada" },
  { code: "AU", name: "Australia" },
  { code: "DE", name: "Germany" },
  { code: "FR", name: "France" },
  { code: "BR", name: "Brazil" },
  { code: "ID", name: "Indonesia" },
  { code: "PH", name: "Philippines" },
  { code: "PK", name: "Pakistan" },
  { code: "BD", name: "Bangladesh" },
  { code: "NP", name: "Nepal" },
  { code: "TR", name: "Turkey" },
  { code: "RU", name: "Russia" },
  { code: "VN", name: "Vietnam" },
  { code: "MX", name: "Mexico" },
  { code: "EG", name: "Egypt" },
];

const Stats = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const [startDate, setStartDate] = useState(
    new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  );
  const [endDate, setEndDate] = useState(new Date());

  const [groupBy, setGroupBy] = useState(["date"]);
  const [country, setCountry] = useState("");

  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "desc",
  });

  /* ===============================
     FETCH DATA
  ================================ */
  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);

      const start = startDate.toISOString().split("T")[0];
      const end = endDate.toISOString().split("T")[0];

      const url =
        `/api/stats?start=${start}&end=${end}` +
        `&group_by=${groupBy.join(",")}` +
        (country ? `&country=${country}` : "");

      const res = await fetch(url);
      const json = await res.json();

      setData(json.items || []);
      setLoading(false);
    };

    fetchStats();
  }, [startDate, endDate, groupBy, country]);

  /* ===============================
     SORTING
  ================================ */
  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction:
        prev.key === key && prev.direction === "desc" ? "asc" : "desc",
    }));
  };

  const sortedData = [...data].sort((a, b) => {
    if (!sortConfig.key) return 0;

    const A =
      sortConfig.key === "date"
        ? new Date(a.date)
        : Number(a[sortConfig.key] || 0);

    const B =
      sortConfig.key === "date"
        ? new Date(b.date)
        : Number(b[sortConfig.key] || 0);

    return sortConfig.direction === "asc" ? A - B : B - A;
  });

  /* ===============================
     SUMMARY
  ================================ */
  const impressions = data.reduce(
    (a, c) => a + Number(c.impression || 0),
    0
  );
  const clicks = data.reduce((a, c) => a + Number(c.clicks || 0), 0);
  const revenue = data.reduce((a, c) => a + Number(c.revenue || 0), 0);

  const avgCTR = impressions ? (clicks / impressions) * 100 : 0;
  const avgCPM = impressions ? (revenue / impressions) * 1000 : 0;

  return (
    <SessionProvider>
      <Navbar theme="lime" />

      <div className="stats-container">
        <h1 className="stats-title">Ad Performance</h1>

        {/* ===============================
            CONTROLS
        ================================ */}
        <div className="stats-controls">
          <div>
            <label>Start Date</label>
            <DatePicker
              selected={startDate}
              onChange={setStartDate}
              dateFormat="yyyy-MM-dd"
              className="custom-datepicker"
            />
          </div>

          <div>
            <label>End Date</label>
            <DatePicker
              selected={endDate}
              onChange={setEndDate}
              dateFormat="yyyy-MM-dd"
              className="custom-datepicker"
            />
          </div>

          <div>
            <label>Group By</label>
            <select
              value={groupBy[0]}
              onChange={(e) => setGroupBy([e.target.value])}
            >
              <option value="date">Date</option>
              <option value="country">Country</option>
              <option value="placement">Placement</option>
              <option value="domain">Domain</option>
            </select>
          </div>

          <div>
            <label>Country</label>
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
            >
              {COUNTRIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* ===============================
            SUMMARY CARDS
        ================================ */}
        <div className="stats-summary">
          <div className="card">
            Impressions <span>{impressions.toLocaleString()}</span>
          </div>
          <div className="card">
            Clicks <span>{clicks.toLocaleString()}</span>
          </div>
          <div className="card">
            Revenue <span>${revenue.toFixed(3)}</span>
          </div>
          <div className="card">
            Avg CPM <span>${avgCPM.toFixed(3)}</span>
          </div>
          <div className="card">
            Avg CTR <span>{avgCTR.toFixed(2)}%</span>
          </div>
        </div>

        {/* ===============================
            TABLE
        ================================ */}
        <div className="stats-table-wrapper">
          {loading ? (
            <div className="loading">Loading stats…</div>
          ) : (
            <table className="stats-table">
              <thead>
                <tr>
                  {groupBy.includes("date") && (
                    <th onClick={() => handleSort("date")}>Date</th>
                  )}
                  {groupBy.includes("country") && <th>Country</th>}
                  {groupBy.includes("placement") && <th>Placement</th>}
                  <th onClick={() => handleSort("impression")}>Impressions</th>
                  <th onClick={() => handleSort("clicks")}>Clicks</th>
                  <th>CTR</th>
                  <th>CPM</th>
                  <th onClick={() => handleSort("revenue")}>Revenue</th>
                </tr>
              </thead>

              <tbody>
                {sortedData.map((item, i) => {
                  const ctr = item.impression
                    ? (item.clicks / item.impression) * 100
                    : 0;
                  const cpm = item.impression
                    ? (item.revenue / item.impression) * 1000
                    : 0;

                  return (
                    <tr key={i}>
                      {item.date && <td>{item.date}</td>}
                      {item.country && <td>{item.country}</td>}
                      {item.placement && <td>{item.placement}</td>}
                      <td>{item.impression}</td>
                      <td>{item.clicks}</td>
                      <td>{ctr.toFixed(2)}%</td>
                      <td>${cpm.toFixed(3)}</td>
                      <td>${Number(item.revenue).toFixed(3)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </SessionProvider>
  );
};

export default Stats;
