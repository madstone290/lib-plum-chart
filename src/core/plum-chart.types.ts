import { TimeEvent, PointEvent, RangeEvent, EntityBase, ChartOptions } from "./plum-chart-core.types";

export enum SortDirection {
    ASC = "asc",
    DESC = "desc",
    NONE = "none"
}

export interface Entity extends EntityBase {
    /**
     * 데이터 그리드 로우에 적용할 클래스명
     */
    gridRowClassName?: string;

    pointEvents: PointEvent[];
    rangeEvents: RangeEvent[];
}

/**
 * 범례
 */
export interface Legend {
    /**
     * 범례 아이콘
     */
    icon?: string;
    /**
     * 범례 색상
     */
    color?: string;
    /**
     * css 클래스명
     */
    className?: string;
    /**
     * 범례 제목
     */
    label: string;
    /**
     * 범례 위치
     */
    location?: "left" | "right";
}


export interface GridColumn {
    field: string,
    caption: string,
}

export interface GridColumnSort<T> {
    field: string,
    compareFn: (a: T, b: T) => number,
}

export interface PlumChartOptions {
    getEventColor<T extends TimeEvent>(event: T): string;
    getTooltipTitle<T extends TimeEvent>(event: T): string;
    hasTooltipVisible<T extends TimeEvent>(event: T): boolean;
    getEventIconSrc<T extends TimeEvent>(event: T): string;
    getEventClassName<T extends TimeEvent>(event: T): string;
    getTooltipLazyTextLines<T extends TimeEvent>(event: T): Promise<string[]>;
    hasTooltipLazyLoading<T extends TimeEvent>(event: T): boolean;
    getTooltipTextLines<T extends TimeEvent>(event: T): string[];
    hasTooltipShowTime<T extends TimeEvent>(event: T): boolean;

    coreOptions: Partial<ChartOptions>;

    useEventHoverColor: boolean,
    eventHoverColor: string,
    gridColumns: GridColumn[],

    formatTime: (time: Date) => string;
    formatTimeRange: (start: Date, end: Date) => string;
    renderCanvasColumn: (time: Date, containerEl: HTMLElement) => HTMLElement;
    /**
     * 점 이벤트 툴팁 커스텀 렌더링 함수
     */
    renderPointEventTooltip: (event: PointEvent, eventEl: HTMLElement, tooltipEl: HTMLElement) => void;
    /**
     * 범위 이벤트 툴팁 커스텀 렌더링 함수
     */
    renderRangeEventTooltip: (event: RangeEvent, eventEl: HTMLElement, tooltipEl: HTMLElement) => void;
}

export interface PlumChartState {
    /**
     * 엔티티 목록 백업. 정렬에 사용.
     */
    entitiesBackup: EntityBase[],
    /**
     * 그리드 컬럼 목록. key: 그리드컬럼, value: 그리드컬럼 엘리먼트
     */
    gridColumnMap: Map<GridColumn, HTMLElement>,
    /**
     * 그리드 컬럼 목록. key: 그리드컬럼, value: icon element
     */
    gridColumnIconMap: Map<GridColumn, HTMLElement>,
    /**
     * 그리드 컬럼 정렬 함수
     */
    gridColumnSortFuncs: GridColumnSort<EntityBase>[],
    /**
     * 현재 정렬 방향
     */
    sortDirection: SortDirection,

    /**
     * 현재 정렬 컬럼
     */
    sortColumnField: string,
    /**
     * PlumChart컨테이너 엘리먼트
     */
    containerEl: HTMLElement,
    /**
     * 범례 엘리먼트
     */
    legendsEl: HTMLElement,
    /**
     * 고정된 툴팁 목록. key: 툴팁 컨테이너 엘리먼트, value: 툴팁 엘리먼트
     */
    fixedTooltips: Set<HTMLElement>,

    /**
     * 엘리먼트 커스텀함수가 호출되었는지 여부
     */
    elementCustomized: boolean,
}

export interface PlumChartData {
    /**
     * 범례 목록
     */
    legends: Legend[],
    /**
     * 엔티티 목록
     */
    entities: Entity[],
    /**
     * 보조 점 이벤트 목록
     */
    sidePointEvents: PointEvent[],
    /**
     * 전역 범위 이벤트 목록
     */
    globalRangeEvents: RangeEvent[],
}





