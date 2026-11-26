
import { initializeSimulation } from "./components/simulation.js";
import { initializeComparison } from "./components/comparison.js";
import { initializeMassComparison } from "./components/massComparison.js";

initializeSimulation();
initializeComparison();
initializeMassComparison();

const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.getElementById("nav-links");
if (navToggle && navLinks) {
    navToggle.hidden = false;
    const closeMenu = () => navToggle.setAttribute("aria-expanded", "false");
    navToggle.addEventListener("click", () => navToggle.setAttribute("aria-expanded", String(navToggle.getAttribute("aria-expanded") !== "true")));
    navLinks.addEventListener("click", event => { if (event.target.closest("a")) closeMenu(); });
    document.addEventListener("keydown", event => { if (event.key === "Escape" && navToggle.getAttribute("aria-expanded") === "true") { closeMenu(); navToggle.focus(); } });
    window.matchMedia("(max-width: 768px)").addEventListener("change", closeMenu);
}
