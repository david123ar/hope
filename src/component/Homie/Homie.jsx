"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import SignInSignUpModal from "@/component/SignSignup/SignInSignUpModal";
import toast from "react-hot-toast";
import { useState } from "react";
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
        "Username must be 3–32 characters (letters, numbers, _ or -)"
      );
    }

    try {
      setChecking(true);
      const res = await fetch(
        `/api/claim?username=${encodeURIComponent(trimmed)}`
      );
      const data = await res.json();

      if (data.available) {
        toast.success("Username available! Create your Henpro page.");
        setLogIsOpen(true);
        setLanding(true);
      } else {
        toast.error(data.message || "Username not available");
      }
    } catch {
      toast.error("Failed to check username.");
    } finally {
      setChecking(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0b0b] text-white flex flex-col items-center px-4 py-10">
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

      {/* HERO */}
      <div className="text-center max-w-2xl">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
          Find Anime, Hanime & Movie Names Instantly
        </h1>
        <p className="text-gray-300 mt-4">
          <span className="font-semibold text-white">Henpro</span> is made for
          Instagram anime, hanime and movie pages.  
          Share one link in your bio — users get exact titles from your posts,
          and you{" "}
          <span className="text-yellow-400 font-semibold">
            earn from the traffic
          </span>{" "}
          via <span className="text-orange-400">Adsterra</span>.
        </p>
      </div>

      {/* SESSION */}
      {session ? (
        <div className="mt-10 text-center">
          <h2 className="text-2xl font-bold mb-4">
            Welcome, {session.user.username} 🍥
          </h2>
          <button
            onClick={() => router.push("/home")}
            className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-6 py-3 rounded-full font-bold"
          >
            Go to Dashboard
          </button>
        </div>
      ) : (
        <div className="mt-10 w-full max-w-md">
          <div className="flex flex-col sm:flex-row w-full border border-yellow-500 rounded-full overflow-hidden shadow-md">
            <input
              type="text"
              placeholder="Claim your anime page username"
              className="flex-1 px-5 py-3 bg-[#151515] text-white placeholder-gray-400 focus:outline-none text-center sm:text-left"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <button
              onClick={handleClaimClick}
              disabled={checking}
              className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold px-6 py-3"
            >
              {checking ? "Checking..." : "Claim Your Page"}
            </button>
          </div>
          <p className="mt-2 text-sm text-gray-400">
            Use this page to show anime, hanime, movie names & links.
          </p>
        </div>
      )}

      {/* FEATURES */}
      <div className="mt-16 grid gap-6 grid-cols-1 sm:grid-cols-2 w-full max-w-4xl">
        <Feature
          title="Anime, Hanime & Movie Names"
          description="Show exact titles from your Instagram posts."
        />
        <Feature
          title="Optional External Links"
          description="Add links if you own a site, Telegram, or episode page."
        />
        <Feature
          title="Made for Instagram Reels"
          description="Perfect for comment replies and bio links."
        />
        <Feature
          title="Earn From Traffic"
          description="Ads run automatically — Tier-1 traffic pays more."
        />
      </div>

      {/* HOW IT WORKS */}
      <div className="mt-20 w-full max-w-md">
        <div className="bg-[#151515] p-6 rounded-xl border border-[#222]">
          <h3 className="text-yellow-400 text-xl font-bold mb-2">
            How Henpro Works
          </h3>
          <ol className="list-decimal list-inside space-y-2 text-sm text-gray-300">
            <li>Post anime / hanime / movie reels</li>
            <li>Reply “Link in bio”</li>
            <li>Users find titles by post number</li>
            <li>Ads run → you earn</li>
          </ol>
        </div>
      </div>

      {/* FOOTER */}
      <div className="mt-10 text-center text-sm text-gray-500">
        <p>Already have a Henpro account?</p>
        <div
          onClick={() => {
            setLogIsOpen(true);
            setLanding(false);
          }}
          className="text-yellow-400 hover:underline cursor-pointer"
        >
          Log in
        </div>

        <Link
          href={session ? "/home" : "#"}
          onClick={(e) => {
            if (!session) {
              e.preventDefault();
              setLogIsOpen(true);
              setLanding(true);
            }
          }}
          className="block mt-3 text-yellow-400 hover:underline"
        >
          View Example Page
        </Link>
      </div>
    </div>
  );
}

function Feature({ title, description }) {
  return (
    <div className="bg-[#151515] border border-[#222] p-5 rounded-xl">
      <h3 className="text-lg font-semibold text-yellow-400 mb-1">{title}</h3>
      <p className="text-sm text-gray-300">{description}</p>
    </div>
  );
}
