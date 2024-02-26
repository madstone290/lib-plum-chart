import { GlobalError, GlobalErrorType, LotErrorType, LotOperationType, SideError, SideErrorType } from "./types";
import ERROR_IMG_SRC from "@/assets/image/error.svg";
import WARNING_IMG_SRC from "@/assets/image/warning.svg";
import { Legend } from "@/core/plum-chart.types";

export const lotErrorTypes = Object.values(LotErrorType);
export const lotOperationTypes = Object.values(LotOperationType);
export const sideErrorTypes = Object.values(SideErrorType);
export const globalErrorTypes = Object.values(GlobalErrorType);


export const lotOperationClasses = new Map<LotOperationType, string>([
    [LotOperationType.Op1, "pl-op1"],
    [LotOperationType.Op2, "pl-op2"],
    [LotOperationType.Op3, "pl-op3"],
    [LotOperationType.Op4, "pl-op4"],
    [LotOperationType.NetworkError, "pl-network"],
]);


const l1 = lotOperationTypes.map(type => ({
    label: type,
    className: lotOperationClasses.get(type)!,
}));
const l2 = lotErrorTypes.map(type => ({
    label: type,
    icon: WARNING_IMG_SRC,
}));
const l3 = sideErrorTypes.map(type => ({
    label: type,
    icon: ERROR_IMG_SRC,
    location: "right" as const
}));
const l4 = globalErrorTypes.map(type => ({
    label: type,
    className: type === GlobalErrorType.Downtime ? "pl-downtime" : "pl-network",
    location: "right" as const
}));
export const legends: Legend[] = [...l1, ...l2, ...l3, ...l4];

export const sideErrors: SideError[] = [
    {
        time: new Date(2024, 0, 1, 2, 0, 0, 0),
        type: SideErrorType.Cost
    },
    {
        time: new Date(2024, 0, 1, 2, 10, 0, 0),
        type: SideErrorType.Delivery
    },
    {
        time: new Date(2024, 0, 1, 2, 20, 0, 0),
        type: SideErrorType.Man
    },
    {
        time: new Date(2024, 0, 1, 3, 0, 0, 0),
        type: SideErrorType.Cost
    },
    {
        time: new Date(2024, 0, 1, 3, 10, 0, 0),
        type: SideErrorType.Delivery
    },
    {
        time: new Date(2024, 0, 1, 3, 20, 0, 0),
        type: SideErrorType.Man
    },
];

export const globalErrors: GlobalError[] = [
    {
        startTime: new Date(2024, 0, 1, 1, 10, 0, 0),
        endTime: new Date(2024, 0, 1, 2, 30, 0, 0),
        type: GlobalErrorType.Downtime
    },
    {
        startTime: new Date(2024, 0, 1, 2, 50, 0, 0),
        endTime: new Date(2024, 0, 1, 3, 20, 0, 0),
        type: GlobalErrorType.Network
    },
    {
        startTime: new Date(2024, 0, 1, 3, 40, 0, 0),
        endTime: new Date(2024, 0, 1, 4, 0, 0, 0),
        type: GlobalErrorType.Network
    },
    {
        startTime: new Date(2024, 0, 1, 6, 10, 0, 0),
        endTime: new Date(2024, 0, 1, 6, 30, 0, 0),
        type: GlobalErrorType.Downtime
    },
    {
        startTime: new Date(2024, 0, 1, 7, 0, 0, 0),
        endTime: new Date(2024, 0, 1, 8, 20, 0, 0),
        type: GlobalErrorType.Network
    },
    {
        startTime: new Date(2024, 0, 1, 10, 0, 0, 0),
        endTime: new Date(2024, 0, 1, 12, 0, 0, 0),
        type: GlobalErrorType.Downtime
    },
    {
        startTime: new Date(2024, 0, 1, 14, 0, 0, 0),
        endTime: new Date(2024, 0, 1, 16, 20, 0, 0),
        type: GlobalErrorType.Network
    },
]