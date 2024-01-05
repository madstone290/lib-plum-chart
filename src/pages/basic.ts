import { PlumChart } from "@/core/plum-chart";
import ERROR_IMG_SRC from "@/assets/image/error.svg";
import WARNING_IMG_SRC from "@/assets/image/warning.svg";
import { GlobalErrorType, Lot, LotErrorType, SideError, SideErrorType } from "@/data/types";
import { globalErrors, legends, lotErrorTypes, lotOperationClasses, lotOperationTypes, sideErrorTypes } from "@/data/dummy";
import { PlumChartOptions, PointEvent, RangeEvent } from "@/core/plum-chart.types";


console.log("index.ts is running", new Date());

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
        chartEndTime: new Date(2024, 0, 1, 24, 0, 0, 0),
        columnAutoWidth: true,
        maxZoomScale: 50
    }
    Object.assign(options, options);
    plumChart.setOptions(options);
    plumChart.setData({
        legends: legends,
        entities: lots.filter((value, idx) => idx < 100).map(lot => ({
            number: lot.number,
            product: lot.product,
            pointEvents: lot.errors.map(error => {
                const pointEvent: PointEvent = {
                    time: error.time,
                    title: error.type,
                    icon: error.type === LotErrorType.Quality ? ERROR_IMG_SRC : WARNING_IMG_SRC,
                    showTooltip: true,
                    showTime: true,
                    lines: [
                        "Lot Number: " + lot.number,
                        "Product: " + lot.product,
                    ],
                    lazyLines: () => {
                        return new Promise((resolve, reject) => {
                            setTimeout(() => {
                                const lines = Array.from({ length: 3 }).map(() => "Lazy: " + new Date());
                                resolve(lines);
                            }, 500);
                        });
                    }
                }
                return pointEvent;
            }),
            rangeEvents: lot.operations.map(operation => {
                const rangeEvent: RangeEvent = {
                    title: operation.type,
                    startTime: operation.startTime,
                    endTime: operation.endTime,
                    className: lotOperationClasses.get(operation.type),
                    showTooltip: true,
                    showTime: true,
                    lines: [
                        "Lot Number: " + lot.number,
                        "Product: " + lot.product,
                    ],
                    lazyLines: () => {
                        return new Promise((resolve, reject) => {
                            setTimeout(() => {
                                const lines = Array.from({ length: 50 }).map(() => "Lazy: " + new Date());
                                resolve(lines);
                            }, 500);
                        });
                    },
                }
                return rangeEvent;
            })
        })),
        sidePointEvents: getSideErrors(600, 2400).map(error => {
            const pointEvent: PointEvent = {
                time: error.time,
                title: error.type,
                icon: error.type === SideErrorType.Man ? ERROR_IMG_SRC : WARNING_IMG_SRC,
                showTooltip: true,
                showTime: true,
                lines: [
                    "Side Error",
                ],
                lazyLines: () => {
                    return new Promise((resolve, reject) => {
                        setTimeout(() => {
                            const lines = Array.from({ length: 5 }).map(() => "Lazy: " + new Date());
                            resolve(lines);
                        }, 500);
                    });
                }
            }
            return pointEvent;
        }),
        globalRangeEvents: globalErrors.map(error => {
            const rangeEvent: RangeEvent = {
                title: error.type,
                startTime: error.startTime,
                endTime: error.endTime,
                className: error.type === GlobalErrorType.Downtime ? "pl-downtime" : "pl-network",
                showTooltip: true,
                showTime: true,
                lines: [
                    "Global Error",
                ],
                lazyLines: () => {
                    return new Promise((resolve, reject) => {
                        setTimeout(() => {
                            resolve([
                                "Lazy: " + new Date(),
                            ]);
                        }, 500);
                    });
                },
            }
            return rangeEvent;
        })
    });
    plumChart.render();
});