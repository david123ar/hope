const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");
const { adminDB } = require("../lib/firebaseAdmin.js");


/* =========================
   CONFIG
========================= */
const COLLECTION_NAME = "animeLinks";

// Resolve @/ path (Next.js alias)
const csvPath = path.join(
  process.cwd(),
  "AnimeArenaX_Link_List_v2.csv"
);

/* =========================
   UPLOAD FUNCTION
========================= */
const uploadCSV = async () => {
  let batch = adminDB.batch();
  let batchCount = 0;
  let totalCount = 0;

  return new Promise((resolve, reject) => {
    fs.createReadStream(csvPath)
      .pipe(csv())
      .on("data", (row) => {
        const linkName = row["Link Name"]?.trim();
        const animeName = row["Anime Name"]?.trim();

        if (!linkName || !animeName) return;

        const docRef = adminDB
          .collection(COLLECTION_NAME)
          .doc(); // auto ID

        batch.set(docRef, {
          linkName,
          animeName,
          createdAt: new Date(),
        });

        batchCount++;
        totalCount++;

        // Firestore batch limit
        if (batchCount === 500) {
          batch.commit();
          batch = adminDB.batch();
          batchCount = 0;
        }
      })
      .on("end", async () => {
        if (batchCount > 0) await batch.commit();
        console.log(`✅ Uploaded ${totalCount} documents`);
        resolve();
      })
      .on("error", reject);
  });
};

uploadCSV().catch(console.error);
