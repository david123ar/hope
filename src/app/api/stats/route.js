import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { adminDB } from "@/lib/firebaseAdmin";

export async function GET(req) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.username) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const start = searchParams.get("start");
  const end = searchParams.get("end");
  const groupBy = searchParams.get("group_by") || "date";
  const country = searchParams.get("country");

  if (!start || !end) {
    return NextResponse.json({ error: "Missing dates" }, { status: 400 });
  }

  const username = session.user.username;

  let apiKey, domainId;

  if (username === "AnimeArenaX") {
    apiKey = "47e883e8ed4e810c158f9dc6937f4fd0";
    domainId = "3943648";
  } else if (username === "fu9") {
    apiKey = "f7becce758687baa0a1fd8e200e2d4e4";
    domainId = "5263808";
  } else {
    const snap = await adminDB.collection("publishers").doc(username).get();
    if (!snap.exists) {
      return NextResponse.json({ error: "Publisher not found" }, { status: 404 });
    }
    apiKey = "f7becce758687baa0a1fd8e200e2d4e4";
    domainId = snap.data().adUnit?.id;
  }

  let url =
    `https://api3.adsterratools.com/publisher/stats.json` +
    `?start_date=${start}&finish_date=${end}&domain=${domainId}`;

  groupBy.split(",").forEach(g => {
    url += `&group_by[]=${g}`;
  });

  if (country) url += `&country=${country}`;

  const res = await fetch(url, {
    headers: {
      Accept: "application/json",
      "X-API-Key": apiKey,
    },
  });

  const json = await res.json();
  return NextResponse.json(json);
}
