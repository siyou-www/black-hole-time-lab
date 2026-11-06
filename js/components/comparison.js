
import {
    calculateTimeDilationAtRadius,
    calculateSchwarzschildRadius
} from "../physics/schwarzschild.js";

export function initializeComparison() {
    const container = document.getElementById("comparison-container");

    const DAY_SECONDS = 86400;

    const objects = [
        {
            name: "Earth",
            mass: 5.9722e24,
            radius: 6.371e6,
            description: "At Earth's surface"
        },
        {
            name: "Sun",
            mass: 1.9885e30,
            radius: 6.957e8,
            description: "At the Sun's surface"
        },
        {
            name: "Black Hole",
            mass: 1.9885e31,
            radius: null,
            description: "At 2 Schwarzschild radii"
        }
    ];

    function calculateResults(object) {
        const radius = object.radius ??
            2 * calculateSchwarzschildRadius(object.mass);

        const factor = calculateTimeDilationAtRadius(
            object.mass,
            radius
        );

        return {
            ...object,
            factor,
            timeLost: DAY_SECONDS * (1 - factor)
        };
    }

    function formatDifference(seconds) {
        if (seconds < 0.001) {
            return `${(seconds * 1e6).toFixed(2)} microseconds`;
        }

        if (seconds < 1) {
            return `${seconds.toFixed(3)} seconds`;
        }

        if (seconds < 60) {
            return `${seconds.toFixed(2)} seconds`;
        }

        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const remainingSeconds = Math.round(seconds % 60);

        return `${hours}h ${minutes}m ${remainingSeconds}s`;
    }

    const results = objects.map(calculateResults);

    container.innerHTML = results.map(object => `
        <article class="comparison-card">
            <h3>${object.name}</h3>
            <p>${object.description}</p>

            <div class="comparison-value">
                ${object.factor.toFixed(9)}
            </div>

            <p class="comparison-label">
                Time Dilation Factor
            </p>

            <div class="comparison-difference">
                ${formatDifference(object.timeLost)}
            </div>

            <p class="comparison-label">
                Time difference per far-away day
            </p>
        </article>
    `).join("");
}
