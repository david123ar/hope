"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import SignInSignUpModal from "@/component/SignSignup/SignInSignUpModal";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function LandingPage(props) {
  const [logIsOpen, setLogIsOpen] = useState(false);
  const [landing, setLanding] = useState(true);
  const [username, setUsername] = useState("");
  const [checking, setChecking] = useState(false);

  const { data: session } = useSession();
  const router = useRouter();

  const handleClaimClick = async () => {
    const trimmed = username.trim().toLowerCase();
    const isValid = /^[a-zA-Z0-9_-]{3,32}$/.test(trimmed);
    if (!isValid) {
      return toast.error(
        "Username must be 3–32 characters and contain only letters, numbers, _ or -"
      );
    }

    try {
      setChecking(true);
      const res = await fetch(
        `/api/claim?username=${encodeURIComponent(trimmed)}`
      );
      const data = await res.json();
      if (data.available) {
        toast.success("Username is available! Create your account.");
        setLogIsOpen(true);
        setLanding(true);
      } else {
        toast.error(data.message || "Username is not available");
      }
    } catch {
      toast.error("Failed to check username.");
    } finally {
      setChecking(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-white flex flex-col items-center px-4 py-10">
      {logIsOpen && (
        <SignInSignUpModal
          landing={landing}
          logIsOpen={logIsOpen}
          setLogIsOpen={setLogIsOpen}
          sign={setLogIsOpen}
          refer={props.refer}
          username={username}
        />
      )}

      <div className="text-center max-w-2xl">
        <h1 className="text-4xl font-bold text-[#00f2fe]">
          Monetize Your Bio — Instantly
        </h1>
        <p className="text-gray-300 mt-4">
          With <span className="text-white font-semibold">Bio Link</span>, you
          get a powerful bio page, built-in monetization, and full traffic stats
          — <span className="text-[#00f2fe]">free</span>.
        </p>
      </div>

      {/* 🔽 Tutorial Video Embed Section */}
      {/* <div className="mt-10 w-full max-w-2xl">
        <h3 className="text-[#00f2fe] text-xl font-bold mb-4 text-center">
          📽️ Watch the Quick Tutorial
        </h3>
        <div className="w-full aspect-w-16 aspect-h-9 rounded-xl overflow-hidden shadow-lg border border-[#00f2fe]">
          <iframe
            className="w-full h-full"
            src="https://www.youtube.com/embed/n614q6AmWpo?si=r2rhySmV7BrT2Rme"
            title="BioLynk Tutorial"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      </div> */}

      {session ? (
        <div className="mt-10 text-center">
          <h2 className="text-2xl font-bold mb-4">
            Welcome, {session.user.username}! 🎉
          </h2>
          <button
            onClick={() => router.push("/home")}
            className="bg-[#00f2fe] text-black px-6 py-3 rounded-full font-bold"
          >
            Visit Home Page
          </button>
        </div>
      ) : (
        <div className="mt-10 w-full max-w-md">
          <div className="flex flex-col sm:flex-row w-full border border-[#00f2fe] rounded-full overflow-hidden shadow-md">
            <input
              type="text"
              placeholder="Choose your username"
              className="flex-1 px-5 py-3 bg-[#1e293b] text-white placeholder-gray-400 border-none focus:outline-none text-center sm:text-left"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <button
              onClick={handleClaimClick}
              disabled={checking}
              className="bg-[#00f2fe] hover:bg-[#00defe] text-black font-bold px-6 py-3 transition"
            >
              {checking ? "Checking..." : "Claim Your BioLynk"}
            </button>
          </div>
          <p className="mt-2 text-sm text-gray-400 text-left">
            This will be your unique BioLynk page.
          </p>
        </div>
      )}

      <div className="mt-16 grid gap-6 grid-cols-1 sm:grid-cols-2 w-full max-w-4xl">
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

      <div className="mt-20 w-full max-w-md">
        <div className="bg-[#1e293b] p-6 rounded-xl shadow-lg border border-[#222] text-left">
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
          onClick={(e) => {
            if (!session) {
              e.preventDefault();
              setLogIsOpen(true);
              setLanding(true);
            }
          }}
          className="mt-2 inline-block text-[#00f2fe] hover:underline font-medium cursor-pointer"
        >
          View Full Site
        </Link>
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
