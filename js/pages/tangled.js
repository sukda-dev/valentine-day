gsap.registerPlugin(ScrollTrigger);

ScrollTrigger.normalizeScroll(true);
ScrollTrigger.config({
  ignoreMobileResize: true,
});

let heartLoop;
const VIEWBOX_DESKTOP = "0 0 1440 900";
const VIEWBOX_MOBILE = "360 0 720 900";

$(function () {
  setupScene();
  playIdleAnimations();
  scrollStory();
  arrowDown.downPulse();

  window.addEventListener("resize", () => {
    updateViewBox();
    ScrollTrigger.refresh();
  });

  updateViewBox();
});

/* ================= SETUP ================= */

const setupScene = () => {
  gsap.set("svg", { overflow: "visible" });
  gsap.set("use", { transformOrigin: "center" });

  // ป้องกัน GSAP เขียน transform ซ้อน SVG
  gsap.config({ force3D: true });
};

/* ================= IDLE ANIMATION ================= */
/* ชีวิตเล็ก ๆ เท่านั้น (ค่าต่ำมาก) */

const playIdleAnimations = () => {
  if (isMobile) {
    gsap.set(".lantern-layer.far", { opacity: 0.25 });
    gsap.set(".lantern-layer.near", { opacity: 1 });
  }

  /* ---------- Lantern layers (ลูก) ---------- */
  gsap.utils.toArray(".idle-layer").forEach((layer) => {
    gsap.to(layer, {
      y: gsap.utils.random(-1, 1),
      duration: gsap.utils.random(10, 16),
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });
  });
  createLanterns(".far", 25, 0.06, 0.08);
  createLanterns(".mid", 16, 0.1, 0.12);
  createLanterns(".near", 10, 0.14, 0.18);

  /* ---------- Individual lantern drift ---------- */
  gsap.utils.toArray(".lantern-layer g").forEach((lantern) => {
    gsap.to(lantern, {
      y: gsap.utils.random(-1, 1),
      x: gsap.utils.random(-1, 1),
      duration: gsap.utils.random(30, 60),
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });
  });

  /* ---------- Water ---------- */
  gsap.utils.toArray(".festival-water path").forEach((wave, i) => {
    gsap.to(wave, {
      y: gsap.utils.random(-1, 6),
      duration: gsap.utils.random(1, 3),
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      delay: i * 0.4,
    });
  });

  /* ---------- Boat ---------- */
  gsap.set(".boat-float", {
    transformOrigin: "50% 65%",
  });

  gsap.to(".boat-float", {
    y: -10,
    duration: 4,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut",
  });

  gsap.to(".boat-float", {
    rotation: 1.8,
    duration: 3.5,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut",
  });

  /* ---------- Heart loop ---------- */
  heartLoop = gsap.delayedCall(1.2, function loop() {
    createHeartBurst();
    heartLoop = gsap.delayedCall(1.2, loop);
  });
};

/* ================= SCROLL STORY ================= */
/* Scroll = กล้องเท่านั้น */

const scrollStory = () => {
  const isMobile = window.innerWidth <= 768;
  const PARALLAX = isMobile ? 1 : 2;

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: ".hero",
      start: "top top",
      end: "+=600", // ⭐ ระยะสั้น
      scrub: 0.6,
      pin: true,
      anticipatePin: 1,
      invalidateOnRefresh: true,
    },
  });

  /* ---------- Background depth ---------- */
  tl.to(
    ".bg",
    {
      scale: 2,
      y: -PARALLAX,
      x: "-50%",
      ease: "none",
    },
    0,
  );

  tl.to(
    ".castle",
    {
      scale: 1.006,
      y: PARALLAX * 1.2,
      ease: "none",
    },
    0,
  );

  /* ---------- Sky / Lantern camera ---------- */
  tl.to(
    ".scroll-layer",
    {
      y: -2,
      ease: "none",
    },
    0,
  );

  /* ---------- Water + Boat (anchor เดียว) ---------- */
  tl.to(
    ".water-anchor",
    {
      y: gsap.utils.clamp(-1, 1),
      ease: "none",
    },
    0,
  );

  /* ---------- Card ---------- */
  tl.to(
    ".valentine-card",
    {
      opacity: 1,
      y: -16,
      scale: 1,
      duration: 1,
      ease: "power2.out",
    },
    ">-0.2",
  );
};

/* ================= HEART BURST ================= */

const createHeartBurst = () => {
  const svg = document.querySelector(".lantern-scene");
  if (!svg) return;

  const heart = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "circle",
  );

  svg.appendChild(heart);

  const box = svg.viewBox.baseVal;

  gsap.set(heart, {
    attr: {
      cx: box.width / 2,
      cy: box.height / 2,
      r: gsap.utils.random(1.5, 2.5),
      fill: "#ff8fb1",
    },
    opacity: 0.9,
  });

  gsap.to(heart, {
    attr: {
      cx: `+=${gsap.utils.random(-120, 120)}`,
      cy: `+=${gsap.utils.random(-80, 80)}`,
    },
    opacity: 0,
    duration: 2,
    ease: "power2.out",
    onComplete: () => heart.remove(),
  });
};

/* ================= LANTERN GENERATOR ================= */
/* ใช้เฉพาะตอน init */

const createLanterns = (layer, count, min, max) => {
  const svg = document.querySelector(".lantern-scene");
  const group = svg.querySelector(layer);

  for (let i = 0; i < count; i++) {
    // 🔹 wrapper g (สำคัญมาก)
    const wrapper = document.createElementNS("http://www.w3.org/2000/svg", "g");

    const lantern = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "use",
    );

    lantern.setAttribute("href", "#lanternSymbol");

    // ===== POSITION (เฉพาะฟ้า 0–60%) =====
    const x = gsap.utils.random(0, 1440);
    const y = gsap.utils.random(40, 500); // ⭐ ไม่ลงน้ำ
    const scale = gsap.utils.random(min, max);

    wrapper.setAttribute("transform", `translate(${x} ${y}) scale(${scale})`);

    wrapper.appendChild(lantern);
    group.appendChild(wrapper);

    // 🌬 ลอยเบา ๆ รายดวง
    gsap.to(wrapper, {
      y: `+=${gsap.utils.random(-20, -60)}`,
      x: `+=${gsap.utils.random(-20, 20)}`,
      duration: gsap.utils.random(10, 18),
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });
  }
};

const updateViewBox = () => {
  const svg = document.querySelector(".lantern-scene");
  if (!svg) return;

  const isMobile = window.innerWidth <= 768;

  if (isMobile) {
    // ⭐ ล็อกล่าง (สำคัญมาก)
    svg.setAttribute("viewBox", "360 0 720 900");
    svg.setAttribute("preserveAspectRatio", "xMidYMax meet");
  } else {
    svg.setAttribute("viewBox", "0 0 1440 900");
    svg.setAttribute("preserveAspectRatio", "xMidYMid slice");
  }
};
