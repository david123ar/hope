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
  const [adInput, setAdInput] = useState({
    nativeBar: "",
    clickUrl: "",
    apiKey: "",
    id: "",
  });
  const [showAdForm, setShowAdForm] = useState(false);
  const [publisherLoaded, setPublisherLoaded] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();
  const adsterraReferralLink =
    "https://beta.publishers.adsterra.com/referral/fbpH9hBDcx";

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

  useEffect(() => {
    const checkAdUnit = async () => {
      if (session?.user?.username) {
        try {
          const res = await fetch(
            `/api/getPublisher?username=${session.user.username}`
          );
          const data = await res.json();
          const ad = data?.adUnit || {};
          const isEmpty =
            !ad.scriptUrl && !ad.containerId && !ad.clickUrl && !ad.apiKey;
          setShowAdForm(isEmpty);
          setPublisherLoaded(true);
        } catch {
          toast.error("Failed to load publisher data");
        }
      }
    };
    checkAdUnit();
  }, [session]);

  const handleAdSubmit = async () => {
    const { nativeBar, clickUrl, apiKey, id } = adInput;
    if (!nativeBar || !clickUrl || !apiKey || !id) {
      return toast.error("All fields are required!");
    }

    if (!/^\d{7}$/.test(id)) {
      return toast.error("ID must be a 7-digit number");
    }

    const match = nativeBar.match(/\/\/([^/]+)\/([a-f0-9]{32})\/invoke\.js/);
    if (!match) {
      return toast.error("Invalid native bar script URL!");
    }

    const [, domain, hash] = match;
    const scriptUrl = `//${domain}/${hash}/invoke.js`;
    const containerId = `container-${hash}`;

    const finalUnit = {
      scriptUrl,
      containerId,
      clickUrl,
      apiKey,
      id,
      index: Date.now().toString(),
    };

    const res = await fetch("/api/updatePublisher", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: session.user.username,
        adUnit: finalUnit,
      }),
    });

    const data = await res.json();
    if (res.ok) {
      toast.success("Ad unit info saved successfully!");
      setShowAdForm(false);
    } else {
      toast.error(data.message || "Failed to save");
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
      <div className="mt-10 w-full max-w-2xl">
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
      </div>

      {session ? (
        showAdForm ? (
          <div className="mt-10 w-full max-w-xl space-y-5">
            <div className="bg-[#1e293b] p-5 rounded-xl border border-[#00f2fe] shadow-md text-center">
              <h2 className="text-lg font-semibold text-white mb-2">
                Ads powered by Adsterra
              </h2>
              <p className="text-sm text-gray-400 mb-4">
                You’ll need an Adsterra account to run ads on your Biolynk page.
              </p>
              <a
                href={adsterraReferralLink}
                target="_blank"
                rel="nofollow noopener noreferrer"
                className="inline-block px-6 py-3 bg-[#00f2fe] text-black font-bold rounded-full hover:bg-[#00defe] transition"
              >
                Visit and Create Adsterra Account
              </a>
            </div>

            {[
              {
                key: "id",
                label: "Domain ID (7-digit)",
                placeholder: "1234567",
              },
              {
                key: "nativeBar",
                label: "Native Bar Script URL",
                placeholder: "Paste full script src URL",
              },
              {
                key: "clickUrl",
                label: "Click URL",
                placeholder: "Enter click URL",
              },
              {
                key: "apiKey",
                label: "API Key",
                placeholder: "Enter your API key",
              },
            ].map(({ key, label, placeholder }) => (
              <div key={key}>
                <label className="block text-sm font-semibold text-white mb-1">
                  {label}
                </label>
                <input
                  type="text"
                  value={adInput[key]}
                  onChange={(e) =>
                    setAdInput({ ...adInput, [key]: e.target.value })
                  }
                  placeholder={placeholder}
                  className="w-full px-4 py-3 rounded-md bg-[#1e293b] text-white placeholder-gray-400 border border-[#00f2fe] focus:ring-2 focus:ring-[#00f2fe] focus:outline-none transition-all shadow-[0_0_10px_#00f2fe55]"
                />
              </div>
            ))}

            <button
              onClick={handleAdSubmit}
              className="w-full mt-4 bg-[#00f2fe] text-black font-bold py-3 rounded-lg hover:bg-[#00defe] transition"
            >
              Save Ad Configuration
            </button>
          </div>
        ) : publisherLoaded ? (
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
          <p className="text-gray-400 mt-8">Loading publisher data...</p>
        )
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
