import { PlumChart } from "@/core/plum-chart";

export enum LotErrorType {
    Quality = "quality",
    Safety = "safety",
}

export enum LotOperationType {
    Op1 = "op1",
    Op2 = "op2",
    Op3 = "op3",
    Op4 = "op4",
}

export enum SideErrorType {
    Man = "man",
    Delivery = "delivery",
    Cost = "cost",
}

export enum GlobalErrorType {
    Downtime = "downtime",
    Network = "network",
}

export interface Lot {
    number: string;
    product: string;
    errors: LotError[];
    operations: LotOperation[];
}

export interface LotError {
    time: Date;
    type: LotErrorType;
}

export interface LotOperation {
    startTime: Date;
    endTime: Date;
    type: LotOperationType;
}

export interface SideError {
    time: Date;
    type: SideErrorType;
}

export interface GlobalError {
    startTime: Date;
    endTime: Date;
    type: GlobalErrorType;
}


export interface WorkCenterChart {
    contentEl: HTMLElement;
    workCenter: string;
    chart?: ReturnType<typeof PlumChart>;
    chartIdx: number;
    tabIdx: number;
}

export interface ChartState {
    index: number;
    startTime: Date;
    endTime: Date;
    lots: Lot[];
}
