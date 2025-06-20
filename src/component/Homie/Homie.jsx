"use client";
import SignInSignUpModal from "@/component/SignSignup/SignInSignUpModal";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function LandingPage(props) {
  const [logIsOpen, setLogIsOpen] = useState(false);
  const [landing, setLanding] = useState(true);

  const { data: session, status } = useSession();

  const sign = (sign) => {
    setLogIsOpen(sign);
  };

  useEffect(() => {
    // This ensures session-based actions rerender as session updates
    console.log("Session updated:", session);
  }, [session]);

  const handleViewSiteClick = (e) => {
    if (!session) {
      e.preventDefault();
      setLogIsOpen(true);
      setLanding(true);
    }
  };

  return (
    <div>
      {logIsOpen && (
        <SignInSignUpModal
          landing={landing}
          logIsOpen={logIsOpen}
          setLogIsOpen={setLogIsOpen}
          sign={sign}
          refer={props.refer}
        />
      )}
      <div className="min-h-screen bg-[#0f172a] text-white flex flex-col items-center px-6 py-12">
        {/* Hero */}
        <div className="text-center max-w-2xl">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-[#00f2fe]">
            Monetize Your Bio — Instantly
          </h1>
          <p className="text-gray-300 mt-4 text-lg">
            With <span className="text-white font-semibold">Bio Link</span>, you
            get a powerful bio page, built-in monetization, and full traffic
            stats — completely{" "}
            <span className="text-[#00f2fe] font-semibold">free</span>.
          </p>
          <div
            onClick={() => {
              setLogIsOpen(true);
              setLanding(true);
            }}
            className="mt-8 inline-block bg-[#00f2fe] hover:bg-[#00defe] text-black font-semibold py-3 px-8 rounded-full text-lg transition cursor-pointer"
          >
            Start Earning Now
          </div>
          <p className="mt-3 text-sm text-gray-400">
            No fees. No setup. Just share your link.
          </p>
        </div>

        {/* Benefits */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-4xl">
          <Feature
            title="We Provide the Ads"
            description="You don’t need sponsors or brands. We handle ads — you just get paid."
          />
          <Feature
            title="100% Free Forever"
            description="No subscription, no limits. Everything you need to grow and earn — for free."
          />
          <Feature
            title="All Your Links in One"
            description="Instagram, YouTube, your shop — one stylish, customizable link page."
          />
          <Feature
            title="Your Stats Dashboard"
            description="Track clicks, traffic, and earnings in real-time with your personal dashboard."
          />
        </div>

        {/* Visual Preview */}
        <div className="mt-20 max-w-md w-full">
          <div className="rounded-xl bg-[#1e293b] p-6 shadow-xl border border-[#222] text-left">
            <h3 className="text-[#00f2fe] text-xl font-bold mb-2">
              How It Works
            </h3>
            <ol className="list-decimal list-inside space-y-2 text-sm text-gray-300">
              <li>Create your free account</li>
              <li>Add your links — socials, shop, content</li>
              <li>Share your page with your audience</li>
              <li>We run the ads. You get paid.</li>
            </ol>
          </div>
        </div>

        {/* Call to Action */}
        <div
          onClick={() => {
            setLogIsOpen(true);
            setLanding(true);
          }}
          className="mt-12 bg-[#00f2fe] hover:bg-[#00defe] text-black font-semibold py-3 px-10 rounded-full text-lg transition cursor-pointer"
        >
          Claim Your Free Monetized Page
        </div>

        {/* Footer Links */}
        <div className="mt-10 text-center text-sm text-gray-500">
          <p className="mb-2">Already using Bio Link?</p>
          <div
            onClick={() => {
              setLogIsOpen(true);
              setLanding(false);
            }}
            className="text-[#00f2fe] hover:underline font-medium cursor-pointer"
          >
            Log in
          </div>
          <br />
          <Link
            href={session ? "/home" : "#"}
            onClick={handleViewSiteClick}
            className="mt-2 inline-block text-[#00f2fe] hover:underline font-medium cursor-pointer"
          >
            View Full Site
          </Link>
        </div>
      </div>
    </div>
  );
}

function Feature({ title, description }) {
  return (
    <div className="bg-[#1e293b] border border-[#222] p-5 rounded-xl shadow hover:shadow-lg transition">
      <h3 className="text-lg font-semibold text-[#00f2fe] mb-1">{title}</h3>
      <p className="text-sm text-gray-300">{description}</p>
    </div>
  );
}
