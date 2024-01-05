/**
 * 이벤트 마크 인터페이스
 */
export interface TimeEvent {
}

export interface PointEvent extends TimeEvent {
    time: Date;
}

export interface RangeEvent extends TimeEvent {
    startTime: Date;
    endTime: Date;
}

export interface Entity {
    pointEvents: PointEvent[];
    rangeEvents: RangeEvent[];
}