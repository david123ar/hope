"use client";
import React, { useState } from "react";
import "./paymentInfo.css";
import { SessionProvider } from "next-auth/react";
import Navbar from "@/component/Navbar/Navbar";

export default function PaymentInfo() {
  const [method, setMethod] = useState("");
  const [details, setDetails] = useState({});

  const handleChange = (e) => {
    setDetails({ ...details, [e.target.name]: e.target.value });
  };

  const renderInputs = () => {
    switch (method) {
      case "paypal":
        return (
          <div className="form-group">
            <label htmlFor="paypalEmail">PayPal Email</label>
            <input
              type="email"
              id="paypalEmail"
              name="paypalEmail"
              placeholder="Enter your PayPal email"
              onChange={handleChange}
              required
            />
          </div>
        );
      case "upi":
        return (
          <div className="form-group">
            <label htmlFor="upiId">UPI ID</label>
            <input
              type="text"
              id="upiId"
              name="upiId"
              placeholder="Enter your UPI ID"
              onChange={handleChange}
              required
            />
          </div>
        );
      case "bank":
        return (
          <>
            <div className="form-group">
              <label htmlFor="accountHolder">Account Holder Name</label>
              <input
                type="text"
                id="accountHolder"
                name="accountHolder"
                placeholder="Account Holder Name"
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="accountNumber">Account Number</label>
              <input
                type="text"
                id="accountNumber"
                name="accountNumber"
                placeholder="Account Number"
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="ifsc">IFSC Code</label>
              <input
                type="text"
                id="ifsc"
                name="ifsc"
                placeholder="IFSC Code"
                onChange={handleChange}
                required
              />
            </div>
          </>
        );
      default:
        return null;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitted:", method, details);
    alert("Payment information saved successfully!");
  };

  return (
    <>
      <SessionProvider>
        <Navbar />
        <div className="payment-info-wrapper">
          <div className="payment-info-container">
            <h2>Payment Information</h2>
            <p className="subtitle">Please fill in your payment details</p>

            <form onSubmit={handleSubmit} className="payment-form">
              <div className="form-group">
                <label htmlFor="fullName">Full Name</label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  placeholder="Your full name"
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="country">Country</label>
                <input
                  type="text"
                  id="country"
                  name="country"
                  placeholder="Your country"
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="currency">Preferred Currency</label>
                <input
                  type="text"
                  id="currency"
                  name="currency"
                  placeholder="e.g., USD, INR"
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="method">Payment Method</label>
                <select
                  id="method"
                  value={method}
                  onChange={(e) => setMethod(e.target.value)}
                  required
                >
                  <option value="">-- Select Payment Method --</option>
                  <option value="paypal">PayPal</option>
                  <option value="upi">UPI</option>
                  <option value="bank">Local Bank Transfer</option>
                </select>
              </div>

              {renderInputs()}

              {method && (
                <>
                  <div className="form-group">
                    <label htmlFor="phone">Phone Number</label>
                    <input
                      type="text"
                      id="phone"
                      name="phone"
                      placeholder="Phone Number"
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="amount">Amount (in USD)</label>
                    <input
                      type="number"
                      id="amount"
                      name="amount"
                      placeholder="Amount in USD"
                      min="1"
                      step="0.01"
                      onChange={handleChange}
                      required
                    />
                  </div>
                </>
              )}

              <button type="submit">Save Payment Info</button>
            </form>
          </div>
        </div>
      </SessionProvider>
    </>
  );
}
