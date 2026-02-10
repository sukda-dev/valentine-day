import gulp from "gulp";
import fs from "fs/promises";
import path from "path";
import prettier from "gulp-prettier";
import readline from "readline";
import footer from "gulp-footer";

const DEFAULT_LANG = process.env.DEFAULT_LANGUAGE || "en-gb";

const PATHS = {
  html: (name) => `templates/${name}.html`,
  scss: (name) => `scss/pages/_${name}.scss`,
  js: (name) => `js/pages/${name}.js`,
  json: (name) => `data/${DEFAULT_LANG}/${name}.json`,
  mainScss: "scss/main.scss",
};

export async function generate(done) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  console.log("\x1b[33m\nGenerating html, js, scss and json page\x1b[0m");

  rl.question("Page name (use space to separate page): ", async (value) => {
    const pageNames = value
      .split(" ")
      .map((n) => n.trim())
      .filter(Boolean);

    const success = [];
    const failed = [];

    for (const name of pageNames) {
      const exists = await isPageExists(name);
      if (exists) {
        failed.push(name);
        console.log(`❌ File already exists: ${name}`);
        continue;
      }

      await Promise.all([
        createHtml(name),
        createScss(name),
        createScript(name),
        createJson(name),
      ]);

      success.push(name);
      console.log(`✅ Create page: ${name}`);
    }

    if (success.length) {
      updateMainScss(success);
    }

    if (failed.length) {
      console.log("\n⚠️ Skipped pages:", failed.join(", "));
    }

    rl.close();
    done();
  });
}

/* ---------------- helpers ---------------- */

async function isPageExists(name) {
  const files = [
    PATHS.html(name),
    PATHS.scss(name),
    PATHS.js(name),
    PATHS.json(name),
  ];

  for (const file of files) {
    try {
      await fs.access(file);
      return true;
    } catch {}
  }
  return false;
}

async function writeFile(filePath, content, format = true) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, content, "utf8");

  if (!format) return;

  return gulp
    .src(filePath, { base: "./" })
    .pipe(prettier({ printWidth: 100 }))
    .pipe(gulp.dest("./"));
}

/* ---------------- creators ---------------- */

function createHtml(name) {
  return writeFile(
    PATHS.html(name),
    `<div id="${name}" class="page">
  <div class="container"></div>
</div>`
  );
}

function createScss(name) {
  return writeFile(
    PATHS.scss(name),
    `@use "../global" as *;

#${name} {
}
`,
    false
  );
}

function createScript(name) {
  return writeFile(
    PATHS.js(name),
    `const pageId = "#${name}";

function onNextButtonClicked() {
  goto($store[pageId].nextPage, "next");
}

function onPreviousButtonClicked() {
  goto($store[pageId].prevPage, "prev");
}

preloadImages($store[pageId].nextPage);
`
  );
}

function createJson(name) {
  return writeFile(
    PATHS.json(name),
    `[
  {
    "key": "key",
    "data": {
      "value": "text",
      "validated": false,
      "comment": ""
    }
  }
]`
  );
}

/* ---------------- update main scss ---------------- */

function updateMainScss(pageNames) {
  const imports = pageNames
    .map((name) => `@use "pages/${name}" as *;`)
    .join("\n");

  return gulp
    .src(PATHS.mainScss, { base: "./" })
    .pipe(footer(`\n${imports}\n`))
    .pipe(gulp.dest("./"));
}
