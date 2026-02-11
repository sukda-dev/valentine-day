const pageId = "#tangled";
let heartLoop;
const VIEWBOX_DESKTOP = "0 0 1440 900";
const VIEWBOX_MOBILE = "360 0 720 900";
var tl;

$(function () {
  setupScene();
  playIdleAnimations();

  arrowDown.downPulse();

  window.addEventListener("resize", () => {
    updateViewBox();
  });

  scrollLantern();

  updateViewBox();
});

const setupScene = () => {
  gsap.set("svg", { overflow: "visible" });
  gsap.set("use", { transformOrigin: "center" });

  gsap.config({ force3D: true });
};

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

function scrollLantern() {
  const controller = new ScrollMagic.Controller({
    container: document.querySelector(`${pageId} .scroll-wraper`),
  });

  const tl = gsap.timeline({});
  const position = {
    layer1_flower1: {
      x: isMobile ? 800 : 800,
      y: isMobile ? 1340 : 1200,
      scale: 5,
      duration: isMobile ? 15 : 5,
    },
    layer1_flower2: {
      x: isMobile ? -1500 : -1500,
      y: isMobile ? 1200 : 1200,
      scale: 6,
      duration: isMobile ? 15 : 5,
    },
    layer1_flower3: {
      x: isMobile ? 1700 : 1700,
      y: isMobile ? 100 : 100,
      scale: 6,
      duration: isMobile ? 15 : 5,
    },
    layer1_flower4: {
      x: isMobile ? -981 : -600,
      y: isMobile ? -1200 : -1200,
      scale: 6,
      duration: isMobile ? 15 : 5,
    },
    layer1_flower5: {
      x: isMobile ? 600 : 600,
      y: isMobile ? -1200 : -1200,
      scale: 6,
      duration: isMobile ? 15 : 5,
    },
    layer1_flower6: {
      x: isMobile ? -1600 : -3200,
      y: isMobile ? -100 : -200,
      scale: 6,
      duration: isMobile ? 15 : 5,
    },

    layer2_flower1: {
      x: isMobile ? 1200 : 2400,
      y: isMobile ? 1400 : 2800,
      scale: 6,
      duration: isMobile ? 13 : 13,
    },
    layer2_flower2: {
      x: isMobile ? -1500 : -3000,
      y: isMobile ? 100 : 200,
      scale: 6,
      duration: isMobile ? 13 : 13,
    },
    layer2_flower3: {
      x: isMobile ? 100 : 200,
      y: isMobile ? -1800 : -3600,
      scale: 6,
      duration: isMobile ? 13 : 13,
    },
    layer2_flower4: {
      x: isMobile ? 1700 : 3400,
      y: isMobile ? 100 : 200,
      scale: 6,
      duration: isMobile ? 13 : 13,
    },
    layer2_flower5: {
      x: isMobile ? 1400 : 2800,
      y: isMobile ? -500 : -1000,
      scale: 6,
      duration: isMobile ? 13 : 13,
    },
    layer2_flower6: {
      x: isMobile ? -1300 : -2600,
      y: isMobile ? 1600 : 3200,
      scale: 6,
      duration: isMobile ? 13 : 13,
    },

    layer3_flower1: {
      x: isMobile ? -800 : -1600,
      y: isMobile ? -230 : -460,
      scale: 6,
      duration: isMobile ? 10 : 10,
    },
    layer3_flower2: {
      x: isMobile ? -10 : -20,
      y: isMobile ? -880 : -1760,
      scale: 6,
      duration: isMobile ? 10 : 10,
    },
    layer3_flower3: {
      x: isMobile ? -65 : -130,
      y: isMobile ? 620 : 1240,
      scale: 6,
      duration: isMobile ? 10 : 10,
    },
    layer3_flower4: {
      x: isMobile ? 665 : 1330,
      y: isMobile ? 265 : 532,
      scale: 6,
      duration: isMobile ? 10 : 10,
    },
    layer3_flower5: {
      x: isMobile ? 900 : 1800,
      y: isMobile ? -200 : -400,
      scale: 6,
      duration: isMobile ? 10 : 10,
    },
    layer3_flower6: {
      x: isMobile ? -318 : -265,
      y: isMobile ? -385 : -500,
      scale: isMobile ? 4 : 3,
      duration: isMobile ? 10 : 10,
    },
    layer3_flower7: {
      x: isMobile ? 320 : 194.533,
      y: isMobile ? -580 : -575,
      scale: isMobile ? 6 : 4,
      duration: isMobile ? 10 : 10,
    },
    layer3_flower8: {
      x: isMobile ? 405 : 810,
      y: isMobile ? 75 : 150,
      scale: 6,
      duration: isMobile ? 10 : 10,
    },
    layer3_flower9: {
      x: isMobile ? 345 : 80,
      y: isMobile ? 80 : 160,
      scale: 5,
      duration: isMobile ? 10 : 10,
    },
    layer3_flower10: {
      x: isMobile ? -350 : -416,
      y: isMobile ? -100 : -172,
      scale: isMobile ? 5 : 4,
      duration: isMobile ? 10 : 10,
    },
    layer3_flower11: {
      x: isMobile ? -310 : 0,
      y: isMobile ? -518 : -225,
      scale: isMobile ? 4.6 : 5,
      duration: isMobile ? 10 : 10,
    },

    layer4_flower1: {
      x: isMobile ? -314 : -304,
      y: isMobile ? -396 : -535,
      scale: 6,
      duration: isMobile ? 10 : 10,
    },
    layer4_flower2: {
      x: isMobile ? 283 : 260,
      y: isMobile ? -350 : -460,
      scale: 6,
      duration: isMobile ? 10 : 10,
    },
    layer4_flower3: {
      x: isMobile ? 257 : 420,
      y: isMobile ? 35 : 70,
      scale: 6,
      duration: isMobile ? 10 : 10,
    },
    layer4_flower4: {
      x: isMobile ? -301 : -280,
      y: isMobile ? -132 : -170,
      scale: 6,
      duration: isMobile ? 10 : 10,
    },
    layer4_flower5: {
      x: isMobile ? -328 : -400,
      y: isMobile ? 130 : 130,
      scale: 6,
      duration: isMobile ? 10 : 10,
    },
    layer4_flower6: {
      x: isMobile ? -295 : -178,
      y: isMobile ? 27 : 34,
      scale: 6,
      duration: isMobile ? 10 : 10,
    },
    layer4_flower7: {
      x: isMobile ? -50 : -45,
      y: isMobile ? -584 : -358,
      scale: 6,
      duration: isMobile ? 10 : 10,
    },
    layer4_flower8: {
      x: isMobile ? 256 : 120,
      y: isMobile ? 0 : 0,
      scale: 6,
      duration: isMobile ? 10 : 10,
    },
    layer4_flower9: {
      x: isMobile ? 231 : 224,
      y: isMobile ? -170 : -220,
      scale: 6,
      duration: isMobile ? 10 : 10,
    },
    layer4_flower10: {
      x: isMobile ? -263 : -30,
      y: isMobile ? -214 : -85,
      scale: 6,
      duration: isMobile ? 10 : 10,
    },
  };

  tl.to(
    arrowDown,
    {
      alpha: 0,
      duration: 1,
      ease: "power2.out",
    },
    0,
  );

  // layer1
  tl.to(
    `${pageId} .layer--1 .flower--1`,
    {
      x: position.layer1_flower1.x,
      y: position.layer1_flower1.y,
      scale: position.layer1_flower1.scale,
      duration: position.layer1_flower1.duration,
      ease: "power2.out",
    },
    0,
  );
  tl.to(
    `${pageId} .layer--1 .flower--2`,
    {
      x: position.layer1_flower2.x,
      y: position.layer1_flower2.y,
      scale: position.layer1_flower2.scale,
      duration: position.layer1_flower2.duration,
      ease: "power2.out",
    },
    0,
  );
  tl.to(
    `${pageId} .layer--1 .flower--3`,
    {
      x: position.layer1_flower3.x,
      y: position.layer1_flower3.y,
      scale: position.layer1_flower3.scale,
      duration: position.layer1_flower3.duration,
      ease: "power2.out",
    },
    0,
  );
  tl.to(
    `${pageId} .layer--1 .flower--4`,
    {
      x: position.layer1_flower4.x,
      y: position.layer1_flower4.y,
      scale: position.layer1_flower4.scale,
      duration: position.layer1_flower4.duration,
      ease: "power2.out",
    },
    0,
  );
  tl.to(
    `${pageId} .layer--1 .flower--5`,
    {
      x: position.layer1_flower5.x,
      y: position.layer1_flower5.y,
      scale: position.layer1_flower5.scale,
      duration: position.layer1_flower5.duration,
      ease: "power2.out",
    },
    0,
  );
  tl.to(
    `${pageId} .layer--1 .flower--6`,
    {
      x: position.layer1_flower6.x,
      y: position.layer1_flower6.y,
      scale: position.layer1_flower6.scale,
      duration: position.layer1_flower6.duration,
      ease: "power2.out",
    },
    0,
  );

  // layer2
  tl.to(
    `${pageId} .layer--2 .flower--1`,
    {
      x: position.layer2_flower1.x,
      y: position.layer2_flower1.y,
      scale: position.layer2_flower1.scale,
      duration: position.layer2_flower1.duration,
      ease: "power2.inOut",
    },
    0,
  );
  tl.to(
    `${pageId} .layer--2 .flower--2`,
    {
      x: position.layer2_flower2.x,
      y: position.layer2_flower2.y,
      scale: position.layer2_flower2.scale,
      duration: position.layer2_flower2.duration,
      ease: "power2.inOut",
    },
    0,
  );
  tl.to(
    `${pageId} .layer--2 .flower--3`,
    {
      x: position.layer2_flower3.x,
      y: position.layer2_flower3.y,
      scale: position.layer2_flower3.scale,
      duration: position.layer2_flower3.duration,
      ease: "power2.inOut",
    },
    0,
  );
  tl.to(
    `${pageId} .layer--2 .flower--4`,
    {
      x: position.layer2_flower4.x,
      y: position.layer2_flower4.y,
      scale: position.layer2_flower4.scale,
      duration: position.layer2_flower4.duration,
      ease: "power2.inOut",
    },
    0,
  );
  tl.to(
    `${pageId} .layer--2 .flower--5`,
    {
      x: position.layer2_flower5.x,
      y: position.layer2_flower5.y,
      scale: position.layer2_flower5.scale,
      duration: position.layer2_flower5.duration,
      ease: "power2.inOut",
    },
    0,
  );
  tl.to(
    `${pageId} .layer--2 .flower--6`,
    {
      x: position.layer2_flower6.x,
      y: position.layer2_flower6.y,
      scale: position.layer2_flower6.scale,
      duration: position.layer2_flower6.duration,
      ease: "power2.inOut",
    },
    0,
  );

  // layer3
  tl.to(
    `${pageId} .layer--3 .flower--1`,
    {
      x: position.layer3_flower1.x,
      y: position.layer3_flower1.y,
      scale: position.layer3_flower1.scale,
      duration: position.layer3_flower1.duration,
      ease: "power2.inOut",
    },
    0,
  );
  tl.to(
    `${pageId} .layer--3 .flower--2`,
    {
      x: position.layer3_flower2.x,
      y: position.layer3_flower2.y,
      scale: position.layer3_flower2.scale,
      duration: position.layer3_flower2.duration,
      ease: "power2.inOut",
    },
    0,
  );
  tl.to(
    `${pageId} .layer--3 .flower--3`,
    {
      x: position.layer3_flower3.x,
      y: position.layer3_flower3.y,
      scale: position.layer3_flower3.scale,
      duration: position.layer3_flower3.duration,
      ease: "power2.inOut",
    },
    0,
  );
  tl.to(
    `${pageId} .layer--3 .flower--4`,
    {
      x: position.layer3_flower4.x,
      y: position.layer3_flower4.y,
      scale: position.layer3_flower4.scale,
      duration: position.layer3_flower4.duration,
      ease: "power2.inOut",
    },
    0,
  );
  tl.to(
    `${pageId} .layer--3 .flower--5`,
    {
      x: position.layer3_flower5.x,
      y: position.layer3_flower5.y,
      scale: position.layer3_flower5.scale,
      duration: position.layer3_flower5.duration,
      ease: "power2.inOut",
    },
    0,
  );
  tl.to(
    `${pageId} .layer--3 .flower--6`,
    {
      x: position.layer3_flower6.x,
      y: position.layer3_flower6.y,
      scale: position.layer3_flower6.scale,
      duration: position.layer3_flower6.duration,
      ease: "power2.inOut",
    },
    0,
  );
  tl.to(
    `${pageId} .layer--3 .flower--7`,
    {
      x: position.layer3_flower7.x,
      y: position.layer3_flower7.y,
      scale: position.layer3_flower7.scale,
      duration: position.layer3_flower7.duration,
      ease: "power2.inOut",
    },
    0,
  );
  tl.to(
    `${pageId} .layer--3 .flower--8`,
    {
      x: position.layer3_flower8.x,
      y: position.layer3_flower8.y,
      scale: position.layer3_flower8.scale,
      duration: position.layer3_flower8.duration,
      ease: "power2.inOut",
    },
    0,
  );
  tl.to(
    `${pageId} .layer--3 .flower--9`,
    {
      x: position.layer3_flower9.x,
      y: position.layer3_flower9.y,
      scale: position.layer3_flower9.scale,
      duration: position.layer3_flower9.duration,
      ease: "power2.inOut",
    },
    0,
  );
  tl.to(
    `${pageId} .layer--3 .flower--10`,
    {
      x: position.layer3_flower10.x,
      y: position.layer3_flower10.y,
      scale: position.layer3_flower10.scale,
      duration: position.layer3_flower10.duration,
      ease: "power2.inOut",
    },
    0,
  );
  tl.to(
    `${pageId} .layer--3 .flower--11`,
    {
      x: position.layer3_flower11.x,
      y: position.layer3_flower11.y,
      scale: position.layer3_flower11.scale,
      duration: position.layer3_flower11.duration,
      ease: "power2.inOut",
    },
    0,
  );

  // layer4
  tl.to(
    `${pageId} .layer--4 .flower--1`,
    {
      x: position.layer4_flower1.x,
      y: position.layer4_flower1.y,
      scale: position.layer4_flower1.scale,
      duration: position.layer4_flower1.duration,
      ease: "power2.inOut",
    },
    0,
  );
  tl.to(
    `${pageId} .layer--4 .flower--2`,
    {
      x: position.layer4_flower2.x,
      y: position.layer4_flower2.y,
      scale: position.layer4_flower2.scale,
      duration: position.layer4_flower2.duration,
      ease: "power2.inOut",
    },
    0,
  );
  tl.to(
    `${pageId} .layer--4 .flower--3`,
    {
      x: position.layer4_flower3.x,
      y: position.layer4_flower3.y,
      scale: position.layer4_flower3.scale,
      duration: position.layer4_flower3.duration,
      ease: "power2.inOut",
    },
    0,
  );
  tl.to(
    `${pageId} .layer--4 .flower--4`,
    {
      x: position.layer4_flower4.x,
      y: position.layer4_flower4.y,
      scale: position.layer4_flower4.scale,
      duration: position.layer4_flower4.duration,
      ease: "power2.inOut",
    },
    0,
  );
  tl.to(
    `${pageId} .layer--4 .flower--5`,
    {
      x: position.layer4_flower5.x,
      y: position.layer4_flower5.y,
      scale: position.layer4_flower5.scale,
      duration: position.layer4_flower5.duration,
      ease: "power2.inOut",
    },
    0,
  );
  tl.to(
    `${pageId} .layer--4 .flower--6`,
    {
      x: position.layer4_flower6.x,
      y: position.layer4_flower6.y,
      scale: position.layer4_flower6.scale,
      duration: position.layer4_flower6.duration,
      ease: "power2.inOut",
    },
    0,
  );
  tl.to(
    `${pageId} .layer--4 .flower--7`,
    {
      x: position.layer4_flower7.x,
      y: position.layer4_flower7.y,
      scale: position.layer4_flower7.scale,
      duration: position.layer4_flower7.duration,
      ease: "power2.inOut",
    },
    0,
  );
  tl.to(
    `${pageId} .layer--4 .flower--8`,
    {
      x: position.layer4_flower8.x,
      y: position.layer4_flower8.y,
      scale: position.layer4_flower8.scale,
      duration: position.layer4_flower8.duration,
      ease: "power2.inOut",
    },
    0,
  );
  tl.to(
    `${pageId} .layer--4 .flower--9`,
    {
      x: position.layer4_flower9.x,
      y: position.layer4_flower9.y,
      scale: position.layer4_flower9.scale,
      duration: position.layer4_flower9.duration,
      ease: "power2.inOut",
    },
    0,
  );
  tl.to(
    `${pageId} .layer--4 .flower--10`,
    {
      x: position.layer4_flower10.x,
      y: position.layer4_flower10.y,
      scale: position.layer4_flower10.scale,
      duration: position.layer4_flower10.duration,
      ease: "power2.inOut",
    },
    0,
  );
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

  new ScrollMagic.Scene({
    triggerHook: 0,
    duration: isMobile ? 5000 : 20000,
  })
    .setTween(tl)
    .addTo(controller);
}
