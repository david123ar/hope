"use client";
import React, { useState } from "react";
import "./payment.css";
import { SessionProvider } from "next-auth/react";
import Navbar from "@/component/Navbar/Navbar";

export default function Payment() {
  const [filterOpen, setFilterOpen] = useState(false);
  const [filterFrom, setFilterFrom] = useState("");
  const [filterTo, setFilterTo] = useState("");

  const paymentHistory = [
    {
      date: "2024-06-17",
      sum: "$150.00",
      fee: "$5.00",
      type: "PayPal",
      account: "john.doe@gmail.com",
      comment: "Monthly payout",
      document: "Invoice_June.pdf",
    },
    {
      date: "2024-06-01",
      sum: "$200.00",
      fee: "$10.00",
      type: "Bank Transfer",
      account: "Bank of America - ****4321",
      comment: "Bi-weekly payout",
      document: "Invoice_May.pdf",
    },
    {
      date: "2024-05-16",
      sum: "$180.00",
      fee: "$6.00",
      type: "Payoneer",
      account: "rishu@payoneer.com",
      comment: "April Revenue",
      document: "Invoice_April.pdf",
    },
  ];

  const filteredPayments = paymentHistory.filter((p) => {
    if (!filterFrom && !filterTo) return true;
    const d = new Date(p.date);
    if (filterFrom && d < new Date(filterFrom)) return false;
    if (filterTo && d > new Date(filterTo)) return false;
    return true;
  });

  return (
    <SessionProvider>
      {/* Navbar keeps its own theme */}
      <Navbar theme="royal" />

      {/* Payment has its OWN theme */}
      <div className="payment-container theme-royal">
        <div className="payment-title">Payment Rules</div>
        <div className="payment-subtitle">
          Read the following to understand how and when payouts are made.
        </div>

        <div className="payment-section">
          <h2>📅 Payment Dates</h2>
          <p>
            Payments are processed on the <strong>1-2</strong> and{" "}
            <strong>16-17</strong> of each month between{" "}
            <strong>9:00 AM – 6:00 PM GMT</strong>.
          </p>
        </div>

        <div className="payment-section">
          <h2>⏳ Payout Hold</h2>
          <p>
            Funds are placed on a <strong>two-week hold</strong> once minimum
            payout is reached.
          </p>
        </div>

        <div className="payment-section">
          <h2>💳 Payment Methods</h2>
          <p>
            Visit the <a href="/help/payment-methods">Help Center</a> for supported
            payment methods.
          </p>
        </div>

        <div className="payment-title">Previous Payments</div>
        <div className="payment-subtitle">Detailed payout records</div>

        <div className="filter-container">
          <button
            className="filter-toggle-btn"
            onClick={() => setFilterOpen(!filterOpen)}
          >
            {filterOpen ? "Hide Filter" : "Filter Payments"}
          </button>

          {filterOpen && (
            <div className="filter-box">
              <label>
                From
                <input
                  type="date"
                  value={filterFrom}
                  onChange={(e) => setFilterFrom(e.target.value)}
                />
              </label>
              <label>
                To
                <input
                  type="date"
                  value={filterTo}
                  onChange={(e) => setFilterTo(e.target.value)}
                />
              </label>
            </div>
          )}
        </div>

        <div className="payment-history">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Sum</th>
                <th>Fee</th>
                <th>Type</th>
                <th>Account</th>
                <th>Comment</th>
                <th>Documents</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayments.map((p, i) => (
                <tr key={i}>
                  <td>{p.date}</td>
                  <td>{p.sum}</td>
                  <td>{p.fee}</td>
                  <td>{p.type}</td>
                  <td>{p.account}</td>
                  <td>{p.comment}</td>
                  <td>
                    <a href={`/documents/${p.document}`}>{p.document}</a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="payment-footer">
          For payout issues, contact support from your dashboard.
        </div>
      </div>
    </SessionProvider>
  );
}
