import Luke from "@/component/Home/home";
import React from "react";

// 👇 This line forces dynamic rendering
export const dynamic = "force-dynamic";

const Page = async ({ searchParams }) => {
  const searchParam = await searchParams;
  const refer = searchParam.refer;
  return (
    <div>  
      <Luke refer={refer} />
    </div>
  );
};

export default Page;
