import { renderBasicChart } from "@/chartRenderer";

window.addEventListener("DOMContentLoaded", () => {
    const containerEl = document.getElementById('root-container')!;
    renderBasicChart(containerEl);
});