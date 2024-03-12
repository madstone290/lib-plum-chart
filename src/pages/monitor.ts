import { renderMonitoringChart } from "@/chartRenderer";


window.addEventListener("DOMContentLoaded", () => {
    const containerEl = document.getElementById('root-container')!;
    renderMonitoringChart(containerEl);
});