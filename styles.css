const loader = document.querySelector(".loader");
const revealItems = document.querySelectorAll(".reveal");
const projectModal = document.querySelector("#project-modal");
const projectModalFrame = document.querySelector("#project-modal-frame");
const projectModalTitle = document.querySelector("#project-modal-title");
const projectTriggers = document.querySelectorAll("[data-project-url]");
const projectCloseTriggers = document.querySelectorAll("[data-close-modal]");

window.addEventListener("load", () => {
  window.setTimeout(() => {
    document.body.classList.add("is-loaded");

    if (loader) {
      loader.setAttribute("aria-hidden", "true");
    }
  }, 1000);
});

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
