"use client";
import React, { useState } from "react";
import "./payment.css";
import { SessionProvider } from "next-auth/react";
import Navbar from "@/component/Navbar/Navbar";

export default function Payment() {
  const [filterOpen, setFilterOpen] = useState(false);
  const [filterFrom, setFilterFrom] = useState("");
  const [filterTo, setFilterTo] = useState("");

  // Dummy payment history data
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

  // Helper: filter payments by date range
  const filteredPayments = paymentHistory.filter((payment) => {
    if (!filterFrom && !filterTo) return true;

    const paymentDate = new Date(payment.date);
    const fromDate = filterFrom ? new Date(filterFrom) : null;
    const toDate = filterTo ? new Date(filterTo) : null;

    if (fromDate && paymentDate < fromDate) return false;
    if (toDate && paymentDate > toDate) return false;

    return true;
  });

  const toggleFilter = () => setFilterOpen(!filterOpen);

  const clearFilter = () => {
    setFilterFrom("");
    setFilterTo("");
  };

  return (
    <>
      <SessionProvider>
        <Navbar />
        <div className="payment-container">
          {/* Payment Rules - unchanged */}
          <div className="payment-title">Payment Rules</div>
          <div className="payment-subtitle">
            Read the following to understand how and when payouts are made.
          </div>

          <div className="payment-section">
            <h2>📅 Payment Dates</h2>
            <p>
              Payments are processed on the <strong>1-2</strong> and{" "}
              <strong>16-17</strong> of each month, between{" "}
              <strong>9:00 AM to 6:00 PM GMT</strong>. If these dates fall on a
              weekend or holiday, payment will be processed on the nearest
              business day.
            </p>
          </div>

          <div className="payment-section">
            <h2>⏳ Payout Hold</h2>
            <p>
              Once you reach the minimum payout amount, your funds are placed on
              a <strong>two-week hold</strong>. You’ll receive your payout in
              the next available period after the hold ends.
            </p>
            <ul>
              <li>
                Reach minimum on <strong>June 8</strong> → Hold ends{" "}
                <strong>June 22</strong> → Paid on <strong>July 1-2</strong>.
              </li>
              <li>
                Reach minimum on <strong>June 17</strong> → Hold ends{" "}
                <strong>July 1</strong> → Paid on <strong>July 16-17</strong>.
              </li>
            </ul>
          </div>

          <div className="payment-section">
            <h2>💳 Payment Methods</h2>
            <p>
              Visit the <a href="/help/payment-methods">Help Center</a> for a
              list of supported payment methods. Availability depends on your
              account.
            </p>
          </div>

          {/* Payment History header and filter */}
          <div className="payment-title" style={{ marginTop: "2rem" }}>
            Previous Payments
          </div>
          <div className="payment-subtitle">Detailed payout records</div>

          <div className="filter-container">
            <button className="filter-toggle-btn" onClick={toggleFilter}>
              {filterOpen ? "Hide Filter" : "Filter Payments"}
            </button>

            {filterOpen && (
              <div className="filter-box">
                <label>
                  From:{" "}
                  <input
                    type="date"
                    value={filterFrom}
                    max={filterTo || ""}
                    onChange={(e) => setFilterFrom(e.target.value)}
                  />
                </label>
                <label>
                  To:{" "}
                  <input
                    type="date"
                    value={filterTo}
                    min={filterFrom || ""}
                    onChange={(e) => setFilterTo(e.target.value)}
                  />
                </label>
                <button className="clear-filter-btn" onClick={clearFilter}>
                  Clear Filter
                </button>
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
                {filteredPayments.length === 0 ? (
                  <tr>
                    <td
                      colSpan="7"
                      style={{ textAlign: "center", padding: "1rem" }}
                    >
                      No payments found for the selected date range.
                    </td>
                  </tr>
                ) : (
                  filteredPayments.map((payment, index) => (
                    <tr key={index}>
                      <td>{payment.date}</td>
                      <td>{payment.sum}</td>
                      <td>{payment.fee}</td>
                      <td>{payment.type}</td>
                      <td>{payment.account}</td>
                      <td>{payment.comment}</td>
                      <td>
                        <a
                          href={`/documents/${payment.document}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {payment.document}
                        </a>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="payment-footer">
            For any payout issues, please contact support from your dashboard.
          </div>
        </div>
      </SessionProvider>
    </>
  );
}
