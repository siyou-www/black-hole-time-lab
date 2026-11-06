
import {
    calculateSchwarzschildRadius,
    calculateTimeDilation
} from "../physics/schwarzschild.js";

export function initializeMassComparison() {
    const massSlider = document.getElementById("mass-slider");
    const massValue = document.getElementById("mass-value");
    const radiusValue = document.getElementById("mass-radius");
    const distanceValue = document.getElementById("mass-distance");
    const factorValue = document.getElementById("mass-factor");

    const SOLAR_MASS = 1.9885e30;
    const DISTANCE_IN_RS = 2;

    function updateMassComparison() {
        const solarMasses = Number(massSlider.value);
        const massKg = solarMasses * SOLAR_MASS;

        const rsMeters = calculateSchwarzschildRadius(massKg);
        const observerDistanceMeters = DISTANCE_IN_RS * rsMeters;

        const factor = calculateTimeDilation(DISTANCE_IN_RS);

        massValue.textContent = solarMasses.toLocaleString("en-US");

        radiusValue.textContent =
            `${(rsMeters / 1000).toLocaleString("en-US", {
                maximumFractionDigits: 2
            })} km`;

        distanceValue.textContent =
            `${(observerDistanceMeters / 1000).toLocaleString("en-US", {
                maximumFractionDigits: 2
            })} km`;

        factorValue.textContent = factor.toFixed(6);
    }

    massSlider.addEventListener("input", updateMassComparison);

    updateMassComparison();
}
