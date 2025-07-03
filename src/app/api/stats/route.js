import { NextResponse } from "next/server";

const ADSTERRA_KEYS = {
  AnimeArenaX: {
    domainId: "3943648",
    apiKey: "47e883e8ed4e810c158f9dc6937f4fd0",
  },
  default: {
    apiKey: "f7becce758687baa0a1fd8e200e2d4e4", // 🔑 Key for everyone else
  },
};

// 💰 Users eligible for today's $1.134 earnings trick
const BONUS_USERS = {
  Roromoazoro: {
    adUnitId: "5076225",
  },
  Hanimereels2: {
    adUnitId: "5076247",
  },
};

// 👇 Helper
function isToday(dateStr) {
  const today = new Date();
  const target = new Date(dateStr);
  return (
    today.getFullYear() === target.getFullYear() &&
    today.getMonth() === target.getMonth() &&
    today.getDate() === target.getDate()
  );
}

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const start = searchParams.get("start");
  const end = searchParams.get("end");
  const user = searchParams.get("user"); // 👈 Pass ?user=username

  if (!start || !end || !user) {
    return NextResponse.json(
      { error: "Missing start, end, or user" },
      { status: 400 }
    );
  }

  try {
    let url = "";
    let apiKey = "";

    if (user === "AnimeArenaX") {
      const { domainId, apiKey: key } = ADSTERRA_KEYS.AnimeArenaX;
      apiKey = key;
      url = `https://api3.adsterratools.com/publisher/stats.json?start_date=${start}&finish_date=${end}&group_by=date&domain=${domainId}`;
    } else {
      const adUnitId = BONUS_USERS[user]?.adUnitId;

      if (!adUnitId) {
        return NextResponse.json({ error: "Ad unit ID not found for user" }, { status: 404 });
      }

      apiKey = ADSTERRA_KEYS.default.apiKey;
      url = `https://api3.adsterratools.com/publisher/stats.json?start_date=${start}&finish_date=${end}&group_by=date&domain=${adUnitId}`;
    }

    const res = await fetch(url, {
      headers: {
        Accept: "application/json",
        "X-API-Key": apiKey,
      },
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to fetch Adsterra stats" },
        { status: res.status }
      );
    }

    const json = await res.json();
    const stats = json?.items || [];

    // 🎯 Apply $1.134 logic only for today and only for bonus users
    const patched = stats.map((item) => {
      if (BONUS_USERS[user] && isToday(item.date)) {
        const impressions = item.impression || 33;
        const fixedRevenue = 1.134;
        const cpm = (fixedRevenue / impressions) * 1000;
        const ctr = parseFloat(item.ctr) || ((item.clicks || 0) / impressions) * 100;

        return {
          ...item,
          revenue: fixedRevenue.toFixed(3),
          cpm: cpm.toFixed(3),
          ctr: ctr.toFixed(3),
        };
      }
      return item;
    });

    return NextResponse.json({ ...json, items: patched });
  } catch (err) {
    console.error("🔥 Stats fetch error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
