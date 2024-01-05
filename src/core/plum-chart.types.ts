import { CanvasRenderType, ControllerLocation } from "./plum-chart-core";
import { EntityBase, PointEventBase, RangeEventBase } from "./plum-chart-core.types";

export enum SortDirection {
    ASC = "asc",
    DESC = "desc",
    NONE = "none"
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

/**
 * 점 이벤트
 */
export interface PointEvent extends PointEventBase {
    /**
     * 이벤트 시간
     */
    time: Date;
    /**
     * 이벤트 아이콘
     */
    icon: string;
    /**
    * css 클래스명
    */
    className?: string;
    /**
     * 이벤트 제목
     */
    title: string;
    /**
     * 이벤트 추가정보
     */
    lines: string[];
    /**
    * 이벤트 추가정보. 레이지 로딩 적용.
    * @returns 
    */
    lazyLines?: () => Promise<string[]>;
    /**
     * 툴팁 표시 여부
     */
    showTooltip: boolean;
    /**
     * 툴팁에 시간 표시 여부
     */
    showTime: boolean;
}

/**
 * 범위 이벤트
 */
export interface RangeEvent extends RangeEventBase {
    /**
     * 이벤트 시작시간
     */
    startTime: Date;
    /**
     * 이벤트 종료시간
     */
    endTime: Date;
    /**
     * css 클래스명
     */
    className?: string;
    /**
     * 이벤트 색상
     */
    color?: string;
    /**
     * 이벤트 제목
     */
    title: string;
    /**
     * 이벤트 추가정보
     */
    lines: string[];
    /**
     * 이벤트 추가정보. 레이지 로딩 적용.
     * @returns 
     */
    lazyLines?: () => Promise<string[]>;
    /**
     * 툴팁 표시 여부
     */
    showTooltip: boolean;
    /**
     * 툴팁에 시간 표시 여부
     */
    showTime: boolean;
}

export interface Entity extends EntityBase {
    pointEvents: PointEvent[];
    rangeEvents: RangeEvent[];
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
    renderMode: CanvasRenderType,
    useEventHoverColor: boolean,
    eventHoverColor: string,
    gridColumns: GridColumn[],
    gridTitle: string,
    canvasTitle: string,
    chartStartTime: Date,
    chartEndTime: Date,
    leftPanelWidth: number,
    columnTitleHeight: number,
    columnHeaderHeight: number,
    sideCanvasHeight: number,
    sideCanvasContentHeightRatio: number,
    cellMinutes: number,
    cellWidth: number,
    cellHeight: number,
    mainRangeContentRatio: number,
    mainPointContentRatio: number,
    minZoomScale: number,
    maxZoomScale: number,
    hasHorizontalLine: boolean,
    hasVerticalLine: boolean,
    /**
     * 컬럼 너비를 자동으로 맞출지 여부. true인 경우 셀너비 옵션이 무시된다. 현재 차트 너비에 맞춰 셀너비를 조절한다.
     */
    columnAutoWidth: boolean;
    /**
     * 테이블 행에 마우스를 올렸을 때 배경색
     */
    rowHoverColor: string;

    /**
     * 컨트롤러 고정 여부
     */
    fixedController: boolean;

    /**
     * 컨트롤러 위치. 고정 컨트롤러인 경우에만 사용한다.
     */
    controllerLocation: ControllerLocation;


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
    entitiesBackup: Entity[],
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
    gridColumnSortFuncs: GridColumnSort<Entity>[],
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
    fixedTooltipMap: Map<HTMLElement, HTMLElement>
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