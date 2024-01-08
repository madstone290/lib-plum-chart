import { PlumChart } from "@/core/plum-chart";
import ERROR_IMG_SRC from "@/assets/image/error.svg";
import WARNING_IMG_SRC from "@/assets/image/warning.svg";
import { GlobalErrorType, Lot, LotErrorType, SideError, SideErrorType } from "@/data/types";
import { globalErrors, legends, lotErrorTypes, lotOperationClasses, lotOperationTypes, sideErrorTypes } from "@/data/dummy";
import { PlumChartData, PlumChartOptions } from "@/core/plum-chart.types";

const getRandom = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1) + min);

const lots: Lot[] = [];
let time = 60;
for (let i = 0; i < 100; i++) {
    let operationTime = time;
    let errorTime = time;
    const lot: Lot = {
        number: `20240101000${i}`,
        product: `P12${i % 10}`,
        operations: Array.from({ length: 5 }).map((value, idx) => {
            const startTime = operationTime;
            const endTime = getRandom(operationTime + 1, operationTime + 2);
            const gap = getRandom(0, 1);
            operationTime = endTime + gap;
            return {
                startTime: new Date(2024, 0, 1, Math.floor(startTime / 60), startTime % 60, 0, 0),
                endTime: new Date(2024, 0, 1, Math.floor(endTime / 60), endTime % 60, 0, 0),
                type: lotOperationTypes[Math.floor(Math.random() * lotOperationTypes.length) % lotOperationTypes.length] as any
            }
        }),
        errors: Array.from({ length: 3 }).map((value, idx) => {
            errorTime = getRandom(errorTime, errorTime + 10);
            return {
                time: new Date(2024, 0, 1, Math.floor(time / 60), errorTime % 60, 0, 0),
                type: lotErrorTypes[Math.floor(Math.random() * lotErrorTypes.length) % lotErrorTypes.length] as any
            }
        }),
    }
    lots.push(lot);
    time = operationTime + 5;
}

function getSideErrors(count: number, gap: number = 1200): SideError[] {
    const sideErrors: SideError[] = [];
    let second = 0;
    for (let i = 0; i < count; i++) {
        second = getRandom(second, second + gap);

        let days = Math.floor(second / 86400);
        let hours = Math.floor(second / 3600) % 24;
        let minutes = Math.floor(second / 60) % 60;
        let seconds = second % 60;

        sideErrors.push({
            time: new Date(2024, 0, 1 + days, hours, minutes, seconds, 0),
            type: sideErrorTypes[Math.floor(Math.random() * sideErrorTypes.length) % sideErrorTypes.length] as any
        });
    }
    return sideErrors;
}

window.addEventListener("DOMContentLoaded", () => {
    const containerEl = document.getElementById('root-container')!;
    const plumChart = PlumChart();
    plumChart.create(containerEl);

    const options: Partial<PlumChartOptions> = {
        useEventHoverColor: false,
        eventHoverColor: '#ccc',
        gridColumns: [{
            field: 'number',
            caption: 'Lot Number',
        },
        {
            field: 'product',
            caption: 'Product',
        }],
        gridTitle: 'Lot Information',
        canvasTitle: 'Lot Status',
        chartStartTime: new Date(2024, 0, 1, 0, 0, 0, 0),
        chartEndTime: new Date(2024, 0, 1, 3, 0, 0, 0),
        columnAutoWidth: true,
        cellWidth: 200,
        maxZoomScale: 10,
        minZoomScale: 1,
        currZoomScale: 2,
        hasTooltipVisible: (event) => {
            return true;
        },
        hasTooltipShowTime: (event) => {
            return true;
        },
        getEventIconSrc: (event) => {
            const eventType = (event as any).type;
            if (eventType === LotErrorType.Quality)
                return ERROR_IMG_SRC;
            if (eventType === LotErrorType.Safety)
                return WARNING_IMG_SRC;
            if (eventType === SideErrorType.Man)
                return ERROR_IMG_SRC;
            if (eventType === SideErrorType.Cost)
                return WARNING_IMG_SRC;
            return WARNING_IMG_SRC;
        },
        getTooltipTitle: (event) => {
            const eventType = (event as any).type;
            return eventType;
        },
        getTooltipTextLines: (event) => {
            const lot = (event as any).lot;
            if (!lot)
                return [];

            return [
                "Lot Number: " + lot.number,
                "Product: " + lot.product,
            ];
        },
        hasTooltipLazyLoading: (event) => {
            return true;
        },
        getTooltipLazyTextLines: (event) => {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve([
                        "Lazy: " + new Date(),
                    ]);
                }, 500);
            });
        },
        getEventClassName: (event) => {
            const eventType = (event as any).type;
            if (eventType === GlobalErrorType.Downtime)
                return "pl-downtime";
            if (eventType === GlobalErrorType.Network)
                return "pl-network";
            if (lotOperationClasses.has(eventType))
                return lotOperationClasses.get(eventType)!;

            return "";
        }
    }
    const data = {
        legends: legends,
        entities: lots.map(lot => ({
            number: lot.number,
            product: lot.product,
            pointEvents: lot.errors,
            rangeEvents: lot.operations
        })),
        sidePointEvents: getSideErrors(600, 2400),
        globalRangeEvents: globalErrors
    };
    // display only events in the range of chartStartTime and chartEndTime
    const newData: Partial<PlumChartData> = {
        entities: data.entities.filter((value, idx) => {
            const eventExist = value.rangeEvents.some(operation => {
                return options.chartStartTime!.getTime() < operation.endTime.getTime() &&
                    operation.startTime.getTime() < options.chartEndTime!.getTime();

            });
            return eventExist;
        })
    }
    plumChart.setOptions(options);
    plumChart.setData(data);
    plumChart.setData(newData);
    plumChart.render();

    // start timer to update chart
    setInterval(() => {
        const plumChartOptions = plumChart.getOptions();

        const chartStartTime = plumChartOptions.chartStartTime;
        chartStartTime.setMinutes(chartStartTime.getMinutes() + 1);
        const chartEndTime = plumChartOptions.chartEndTime;
        chartEndTime.setMinutes(chartEndTime.getMinutes() + 1);

        const options: Partial<PlumChartOptions> = {
            chartStartTime: chartStartTime,
            chartEndTime: chartEndTime,
        }
        plumChart.setOptions(options);
        // display only events in the range of chartStartTime and chartEndTime
        const newData: Partial<PlumChartData> = {
            entities: data.entities.filter((value, idx) => {
                const eventExist = value.rangeEvents.some(operation => {
                    return operation.startTime.getTime() < chartEndTime.getTime() &&
                        operation.endTime.getTime() > chartStartTime.getTime();
                });
                return eventExist;
            })
        }
        plumChart.setData(newData);
        plumChart.renderCanvas();

    }, 500);
});