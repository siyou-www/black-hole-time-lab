
import { calculateTimeDilation } from "../physics/schwarzschild.js";

export function initializeSimulation() {
    const distanceSlider = document.getElementById("distance-slider");
    const distanceValue = document.getElementById("distance-value");
    const distancePresets = document.querySelectorAll(".distance-preset");
    const observer = document.getElementById("observer");

    const nearClock = document.getElementById("near-clock");
    const farClock = document.getElementById("far-clock");

    const startButton = document.getElementById("start-button");
    const resetButton = document.getElementById("reset-button");
    
    const dilationFactor = document.getElementById("dilation-factor");
    const clockRate = document.getElementById("clock-rate");
    const dilationExplanation = document.getElementById("dilation-explanation");


    // SVG coordinates
    const blackHoleX = 200;
    const blackHoleY = 200;
    const horizonRadius = 75;
    const maxObserverX = 550;

    // Simulation state
    const timeScale = 60;
    let farElapsed = 0;
    let nearElapsed = 0;
    let isRunning = false;
    let lastTimestamp = null;
    let animationId = null;

    function formatTime(totalSeconds) {
        const seconds = Math.floor(totalSeconds);

        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const remainingSeconds = seconds % 60;

        return [hours, minutes, remainingSeconds]
            .map(value => String(value).padStart(2, "0"))
            .join(":");
    }

    const dialHands = Object.fromEntries(["near", "far"].map(id => [
        id, ["hour", "minute", "second"].map(hand => document.getElementById(id + "-" + hand))
    ]));

    function updateDial(id, elapsed) {
        const periods = [43200, 3600, 60];
        dialHands[id].forEach((hand, i) => {
            if (hand) hand.setAttribute("transform", "rotate(" + ((elapsed % periods[i]) / periods[i] * 360) + " 80 80)");
        });
    }

    function renderClocks() {
        nearClock.textContent = formatTime(nearElapsed);
        farClock.textContent = formatTime(farElapsed);
        updateDial("near", nearElapsed);
        updateDial("far", farElapsed);
    }

    function updateObserver() {
        const distance = Number(distanceSlider.value);

        distanceValue.textContent = distance.toFixed(2);

        distancePresets.forEach(button => {
            const isSelected = Math.abs(Number(button.dataset.distance) - distance) < 0.005;
            button.setAttribute("aria-pressed", String(isSelected));
        });

        const minDistance = Number(distanceSlider.min);
        const maxDistance = Number(distanceSlider.max);

        const progress =
            (distance - minDistance) /
            (maxDistance - minDistance);

        const minObserverX = blackHoleX + horizonRadius + 15;

        const observerX =
            minObserverX +
            progress * (maxObserverX - minObserverX);

        observer.setAttribute(
            "transform",
            `translate(${observerX}, ${blackHoleY})`
        );

        // Calculate and display time dilation information
        const factor = calculateTimeDilation(distance);
        const percentage = (factor * 100).toFixed(2);

        dilationFactor.textContent = factor.toFixed(4);
        clockRate.textContent = `${percentage}%`;

        dilationExplanation.textContent =
         `The near clock runs at ${percentage}% of the ` +
         `far-away clock's rate.`;
    }

    function animate(timestamp) {
        if (!isRunning) return;

        if (lastTimestamp === null) {
            lastTimestamp = timestamp;
        }

        const deltaSeconds = (timestamp - lastTimestamp) / 1000;
        lastTimestamp = timestamp;

        const simulatedSeconds = deltaSeconds * timeScale;
        const distance = Number(distanceSlider.value);
        const factor = calculateTimeDilation(distance);

        farElapsed += simulatedSeconds;
        nearElapsed += simulatedSeconds * factor;

        renderClocks();

        animationId = requestAnimationFrame(animate);
    }

    function startSimulation() {
        if (isRunning) {
            // Pause
            isRunning = false;
            cancelAnimationFrame(animationId);
            lastTimestamp = null;
            startButton.textContent = "Start";
        } else {
            // Start or resume
            isRunning = true;
            lastTimestamp = null;
            startButton.textContent = "Pause";
            animationId = requestAnimationFrame(animate);
        }
    }

    function resetSimulation() {
        isRunning = false;
        cancelAnimationFrame(animationId);

        farElapsed = 0;
        nearElapsed = 0;
        lastTimestamp = null;

        startButton.textContent = "Start";
        renderClocks();
    }

    distanceSlider.addEventListener("input", updateObserver);
    distancePresets.forEach(button => {
        button.addEventListener("click", () => {
            distanceSlider.value = button.dataset.distance;
            updateObserver();
        });
    });
    startButton.addEventListener("click", startSimulation);
    resetButton.addEventListener("click", resetSimulation);

    updateObserver();
    renderClocks();
}
