const loader = document.querySelector(".loader");
const revealItems = document.querySelectorAll(".reveal");
const projectModal = document.querySelector("#project-modal");
const projectModalFrame = document.querySelector("#project-modal-frame");
const projectModalTitle = document.querySelector("#project-modal-title");
const projectTriggers = document.querySelectorAll("[data-project-url]");
const projectCloseTriggers = document.querySelectorAll("[data-close-modal]");
const counterItems = document.querySelectorAll("[data-counter]");
const portfolioPreviews = document.querySelectorAll(".portfolio-preview[data-preview-src]");
const rootStyle = document.documentElement.style;
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

window.addEventListener("load", () => {
  window.setTimeout(() => {
    document.body.classList.add("is-loaded");

    if (loader) {
      loader.setAttribute("aria-hidden", "true");
    }
  }, 1000);
});

if (!prefersReducedMotion.matches && window.matchMedia("(pointer: fine)").matches) {
  let backgroundFrame = null;
  let backgroundTarget = { x: 50, y: 30 };
  let backgroundCurrent = { x: 50, y: 30 };

  const animateBackgroundDepth = () => {
    backgroundCurrent.x += (backgroundTarget.x - backgroundCurrent.x) * 0.08;
    backgroundCurrent.y += (backgroundTarget.y - backgroundCurrent.y) * 0.08;

    rootStyle.setProperty("--cursor-x", `${backgroundCurrent.x}%`);
    rootStyle.setProperty("--cursor-y", `${backgroundCurrent.y}%`);

    const settled =
      Math.abs(backgroundTarget.x - backgroundCurrent.x) < 0.05 &&
      Math.abs(backgroundTarget.y - backgroundCurrent.y) < 0.05;

    if (settled) {
      backgroundFrame = null;
      return;
    }

    backgroundFrame = window.requestAnimationFrame(animateBackgroundDepth);
  };

  const requestBackgroundFrame = () => {
    if (!backgroundFrame) {
      backgroundFrame = window.requestAnimationFrame(animateBackgroundDepth);
    }
  };

  window.addEventListener(
    "pointermove",
    (event) => {
      backgroundTarget.x = (event.clientX / window.innerWidth) * 100;
      backgroundTarget.y = (event.clientY / window.innerHeight) * 100;
      requestBackgroundFrame();
    },
    { passive: true }
  );
}

if (portfolioPreviews.length > 0) {
  const previewObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const preview = entry.target;
        const src = preview.getAttribute("data-preview-src");
        const title = preview.getAttribute("data-project-title") || "Project preview";

        if (!src) {
          previewObserver.unobserve(preview);
          return;
        }

        if (entry.isIntersecting) {
          if (preview.dataset.previewLoaded === "true") {
            return;
          }

          const iframe = document.createElement("iframe");
          iframe.src = src;
          iframe.title = title;
          iframe.loading = "lazy";
          iframe.tabIndex = -1;

          iframe.addEventListener(
            "load",
            () => {
              preview.classList.add("is-preview-loaded");
            },
            { once: true }
          );

          preview.prepend(iframe);
          preview.dataset.previewLoaded = "true";
          return;
        }

        const activeFrame = preview.querySelector("iframe");

        if (activeFrame && window.innerWidth < 900) {
          activeFrame.remove();
          preview.dataset.previewLoaded = "false";
          preview.classList.remove("is-preview-loaded");
        }
      });
    },
    {
      rootMargin: "250px 0px",
      threshold: 0.08,
    }
  );

  portfolioPreviews.forEach((preview) => previewObserver.observe(preview));
}

if (revealItems.length > 0) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.16,
    }
  );

  revealItems.forEach((item) => observer.observe(item));
}

if (counterItems.length > 0) {
  const animateCounter = (element) => {
    const targetValue = Number(element.getAttribute("data-counter") || "0");
    const suffix = element.getAttribute("data-counter-suffix") || "";
    const duration = 1400;
    const startTime = performance.now();

    const tick = (currentTime) => {
      const progress = Math.min((currentTime - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const currentValue = Math.round(targetValue * eased);

      element.textContent = `${currentValue}${suffix}`;

      if (progress < 1) {
        window.requestAnimationFrame(tick);
      } else {
        element.textContent = `${targetValue}${suffix}`;
      }
    };

    window.requestAnimationFrame(tick);
  };

  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        const element = entry.target;

        if (element.dataset.counterPlayed === "true") {
          counterObserver.unobserve(element);
          return;
        }

        element.dataset.counterPlayed = "true";
        animateCounter(element);
        counterObserver.unobserve(element);
      });
    },
    {
      threshold: 0.55,
    }
  );

  counterItems.forEach((item) => {
    item.textContent = "0";
    if (item.dataset.counterSuffix) {
      item.textContent = `0${item.dataset.counterSuffix}`;
    }
    counterObserver.observe(item);
  });
}

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    const targetId = link.getAttribute("href");

    if (!targetId || targetId === "#") {
      return;
    }

    const target = document.querySelector(targetId);

    if (!target) {
      return;
    }

    event.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

if (projectModal && projectModalFrame && projectModalTitle && projectTriggers.length > 0) {
  const openProjectModal = (url, title) => {
    projectModalFrame.src = url;
    projectModalTitle.textContent = title || "Project Preview";
    projectModal.classList.add("is-open");
    projectModal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  };

  const closeProjectModal = () => {
    projectModal.classList.remove("is-open");
    projectModal.setAttribute("aria-hidden", "true");
    projectModalFrame.src = "about:blank";
    document.body.style.overflow = "";
  };

  projectTriggers.forEach((trigger) => {
    trigger.addEventListener("click", () => {
      const url = trigger.getAttribute("data-project-url");
      const title = trigger.getAttribute("data-project-title");

      if (!url) {
        return;
      }

      openProjectModal(url, title);
    });
  });

  projectCloseTriggers.forEach((trigger) => {
    trigger.addEventListener("click", closeProjectModal);
  });

  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && projectModal.classList.contains("is-open")) {
      closeProjectModal();
    }
  });
}
