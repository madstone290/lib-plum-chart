/**
 * 차트 이벤트.
 */
export interface PointEventBase {
    time: Date;
}

export interface RangeEventBase {
    startTime: Date;
    endTime: Date;
}

export interface EntityBase {
    pointEvents: PointEventBase[];
    rangeEvents: RangeEventBase[];
}