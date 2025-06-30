import Stats from "@/component/Stats/Stats";
import React from "react";

export const metadata = {
  title: "Track Earnings – Real-Time Revenue Insights | Bio Link",
  description: "Monitor your creator revenue in real time. See performance breakdowns and detailed analytics to grow your income with Bio Link.",
};


const page = () => {
  return (
    <div>
      <Stats
        start="2025-05-01"
        end="2025-05-30"
        placementId="3943648"
        apiKey="47e883e8ed4e810c158f9dc6937f4fd0"
      />
    </div>
  );
};

export default page;
