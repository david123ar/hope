import PaymentInfo from "@/component/PayInfo/PayInfo";
import React from "react";

export const metadata = {
  title: "Payment Information – Understand Your Payout Process | Bio Link",
  description:
    "Learn how payments work, when you'll get paid, and everything about the payout process on your Bio Link monetization dashboard.",
};

const page = () => {
  return (
    <div>
      <PaymentInfo />
    </div>
  );
};

export default page;
