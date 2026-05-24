console.log("Portfolio Website Loaded Successfully");

const body = document.body;
body.classList.add("js-ready");

const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");
const navItems = document.querySelectorAll(".nav-links a");
const revealItems = document.querySelectorAll(".reveal");
const interactiveCards = document.querySelectorAll(".skill-card, .service-card, .project-card, .profile-ring");
const contactForm = document.querySelector(".contact form");
const formStatus = document.querySelector(".form-status");
const modal = document.querySelector(".project-modal");
const modalClose = document.querySelector(".modal-close");
const modalTitle = document.querySelector("#modal-title");
const modalTag = document.querySelector(".modal-tag");
const modalDescription = document.querySelector(".modal-description");
const modalList = document.querySelector(".modal-list");
const projectButtons = document.querySelectorAll("[data-project]");

const projectDetails = {
    "face-detection": {
        tag: "Computer Vision",
        title: "Face Detection System",
        description: "A Python and OpenCV based system for detecting and tracking faces from image or video input.",
        points: [
            "Uses OpenCV techniques for face detection.",
            "Connects well with robotics and ROS 2 learning.",
            "Can be extended for attendance, monitoring, or automation workflows."
        ]
    },
    "todo-app": {
        tag: "Frontend",
        title: "To-Do App",
        description: "A responsive task manager that helps users organize daily work in a clean browser interface.",
        points: [
            "Adds, completes, filters, and deletes tasks.",
            "Uses JavaScript DOM events for real-time UI updates.",
            "Can be extended with local storage for saved task lists."
        ]
    }
};

function closeMenu() {
    if (!menuToggle || !navLinks) return;

    menuToggle.setAttribute("aria-expanded", "false");
    navLinks.classList.remove("open");
    body.classList.remove("menu-open");
}

function openProjectModal(projectId) {
    const project = projectDetails[projectId];
    if (!project || !modal) return;

    modalTag.textContent = project.tag;
    modalTitle.textContent = project.title;
    modalDescription.textContent = project.description;
    modalList.innerHTML = project.points.map((point) => `<p>${point}</p>`).join("");

    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    body.classList.add("modal-open");
    modalClose.focus();
}

function closeProjectModal() {
    if (!modal) return;

    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    body.classList.remove("modal-open");
}

if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
        const isOpen = menuToggle.getAttribute("aria-expanded") === "true";

        menuToggle.setAttribute("aria-expanded", String(!isOpen));
        navLinks.classList.toggle("open", !isOpen);
        body.classList.toggle("menu-open", !isOpen);
    });
}

navItems.forEach((link) => {
    link.addEventListener("click", closeMenu);
});

if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.18 });

    revealItems.forEach((item) => revealObserver.observe(item));

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;

            navItems.forEach((link) => {
                link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
            });
        });
    }, { rootMargin: "-35% 0px -55% 0px" });

    document.querySelectorAll("main section[id]").forEach((section) => sectionObserver.observe(section));
} else {
    revealItems.forEach((item) => item.classList.add("visible"));
}

interactiveCards.forEach((card) => {
    card.addEventListener("pointermove", (event) => {
        if (window.matchMedia("(max-width: 720px)").matches) return;

        const rect = card.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        const rotateY = ((x / rect.width) - 0.5) * 10;
        const rotateX = ((y / rect.height) - 0.5) * -10;

        card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });

    card.addEventListener("pointerleave", () => {
        card.style.transform = "";
    });
});

projectButtons.forEach((button) => {
    button.addEventListener("click", () => {
        openProjectModal(button.dataset.project);
    });
});

if (modalClose) {
    modalClose.addEventListener("click", closeProjectModal);
}

if (modal) {
    modal.addEventListener("click", (event) => {
        if (event.target === modal) {
            closeProjectModal();
        }
    });
}

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        closeMenu();
        closeProjectModal();
    }
});

if (contactForm) {
    contactForm.addEventListener("submit", (event) => {
        event.preventDefault();
        contactForm.reset();

        if (formStatus) {
            formStatus.textContent = "Thanks! Your message has been noted.";
        }
    });
}
