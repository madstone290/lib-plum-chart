import "@/assets/css/main.css"
import { renderBasicChart, renderMonitoringChart } from "./chartRenderer";
{
    const basicChartContent = document.querySelector('.basicChartContent') as HTMLDivElement;
    const monitoringChartContent = document.querySelector('.monitoringChartContent') as HTMLDivElement;
    const btn1 = document.getElementById('btn1') as HTMLButtonElement;
    const btn2 = document.getElementById('btn2') as HTMLButtonElement;

    function showBasicChart() {
        basicChartContent.classList.remove('hidden');
        monitoringChartContent.classList.add('hidden');
        basicChartContent.innerHTML = '';
        renderBasicChart(basicChartContent);

        btn1.setAttribute('data-selected', 'true');
        btn2.removeAttribute('data-selected');
    }

    function showMonitoringChart() {
        basicChartContent.classList.add('hidden');
        monitoringChartContent.classList.remove('hidden');
        monitoringChartContent.innerHTML = '';
        renderMonitoringChart(monitoringChartContent);

        btn1.removeAttribute('data-selected');
        btn2.setAttribute('data-selected', 'true');
    }

    btn1.addEventListener('click', showBasicChart);
    btn2.addEventListener('click', showMonitoringChart);

    showBasicChart();
}