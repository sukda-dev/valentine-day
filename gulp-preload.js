import gulp from "gulp";
import fs from "fs/promises";
import path from "path";
import prettier from "gulp-prettier";
import { deleteAsync } from "del";
import { deepListDir } from "deep-list-dir";

const OUTPUT_FILE = "js/controller/preload.js";
const GENERAL_DIR = "images/general";
const PAGES_DIR = "images/pages";

export async function preload(done) {
  await deleteAsync([OUTPUT_FILE]);

  const generalImages = await getImages(GENERAL_DIR);
  const pageFolders = await getPageFolders(PAGES_DIR);

  let content = `
function preloadImages(expression) {
  switch (expression) {

    // general
    case "general":
      $.preloadImages(
${formatList(generalImages)}
      );
      break;
`;

  for (const page of pageFolders) {
    const images = await getImages(path.join(PAGES_DIR, page));

    content += `
    // ${page}
    case "${page}":
      $.preloadImages(
${formatList(images)}
      );
      break;
`;
  }

  content += `
  }
}
`;

  await fs.mkdir(path.dirname(OUTPUT_FILE), { recursive: true });
  await fs.writeFile(OUTPUT_FILE, content, "utf8");

  return gulp
    .src(OUTPUT_FILE, { base: "./" })
    .pipe(prettier({ printWidth: 100 }))
    .pipe(gulp.dest("./"))
    .on("end", done);
}

/* ---------------- helpers ---------------- */

async function getImages(dir) {
  try {
    const files = await deepListDir(dir);
    return files
      .filter((f) => !f.includes("DS_Store"))
      .map((f) => f.replace(/\\/g, "/"))
      .sort();
  } catch {
    return [];
  }
}

async function getPageFolders(dir) {
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    return entries
      .filter((e) => e.isDirectory())
      .map((e) => e.name)
      .sort();
  } catch {
    return [];
  }
}

function formatList(items) {
  if (!items.length) return "        // no images\n";

  return items.map((i) => `        "${i}",`).join("\n");
}
