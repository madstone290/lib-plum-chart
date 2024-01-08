/**
 * 플럼차트 글로벌 인터페이스
 */
export interface PlumChartGlobal {
    debug: boolean;
}

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

export type ControllerLocation = "topLeft" | "topRight" | "bottomLeft" | "bottomRight";
export const CanvasRenderTypes = ["scroll", "intersection", "eager"] as const;
export type CanvasRenderType = typeof CanvasRenderTypes[number];


interface PointEventItem {
    /**
     * 이벤트 시간
     */
    time: Date;
    /**
     * 이벤트 컨테이너 엘리먼트
     */
    containerEl: HTMLElement;
}

export interface RangeEventItem {
    /**
     * 이벤트 시작시간
     */
    startTime: Date;
    /**
     * 이벤트 종료시간
     */
    endTime: Date;
    /**
    * 이벤트 컨테이너 엘리먼트
    */
    containerEl: HTMLElement;
}

/**
 * 엔티티 행. 엔티티 하나에 대한 행을 의미한다.
 * 테이블 파트와 캔버스 파트를 포함한다.
 */
export interface EntityRow {
    /**
     * 엔티티 인덱스
     */
    index: number;
    /**
     * 엔티티
     */
    entity: Entity;
    /**
     * 테이블 행의 컨테이너 엘리먼트
     */
    containerEl: HTMLElement;
    /**
     * 캔버스의 수평선
     */
    hLine?: HTMLElement;
    /**
     * 최근 렌더링 시간
     */
    lastRenderTime?: Date;
    /**
     * 캔버스에 렌더링된 포인트 이벤트 목록
     */
    pointEventContainers: PointEventItem[];
    /**
     * 캔버스에 렌더링된 레인지 이벤트 목록
     */
    rangeEventContainers: RangeEventItem[];
}

export interface ChartData {

    entities: Entity[];

    /**
     * 사이드캔버스에 표시할 이벤트
     */
    sidePointEvents: PointEvent[];

    /**
     * 메인 캔버스에 표시할 글로벌 포인트 이벤트 목록.
     */
    globalRangeEvents: RangeEvent[];
}

export interface ChartOptions {
    chartStartTime: Date;
    chartEndTime: Date;
    renderMode: CanvasRenderType;
    paddingCellCount: number;
    scrollWidth: number;
    gridTitle: string;
    canvasTitle: string;
    leftPanelWidth: number;
    borderColor: string;
    canvasLineColor: string;
    columnTitleHeight: number;
    columnHeaderHeight: number;
    sideCanvasHeight: number;
    cellMinutes: number;
    cellWidth: number;
    cellHeight: number;
    sideCanvasContentHeightRatio: number;
    mainRangeContentRatio: number;
    mainPointContentRatio: number;
    /**
     * 차트 줌 최소 스케일
     */
    minZoomScale: number;
    /**
     * 차트 줌 최대 스케일
     */
    maxZoomScale: number;
    /**
     * 차트의 현재 줌 스케일
     */
    zoomScale: number;
    /**
     * 차트의 현재 스크롤 탑 위치
     */
    scrollTop: number;
    /**
     * 차트의 현재 스크롤 레프트 위치
     */
    scrollLeft: number;
    /**
     * 수평선 표시 여부
     */
    hasHorizontalLine: boolean;
    /**
     * 수직선 표시 여부
     */
    hasVerticalLine: boolean;
    /**
     * 컬럼 너비를 자동으로 맞출지 여부. true인 경우 셀너비 옵션이 무시된다. 현재 차트 너비에 맞춰 셀너비를 조절한다.
     */
    columnAutoWidth: boolean;
    /**
    * 수평 줌 활성화 여부
    */
    hZoomEnabled: boolean;

    /**
    * 수직 줌 활성화 여부
    */
    vZoomEnabled: boolean;

    /**
     * 테이블 행에 마우스를 올렸을 때 배경색
     */
    rowHoverColor: string;

    /**
    * 버튼 클릭시 작동할 세로스크롤 길이
    */
    buttonScrollStepY: number;

    /**
    * 버튼 클릭시 작동할 가로스크롤 길이
    */
    buttonScrollStepX: number;

    /**
     * 컨트롤러 고정 여부
     */
    fixedController: boolean;

    /**
     * 컨트롤러 위치. 고정 컨트롤러인 경우에만 사용한다.
     */
    controllerLocation: ControllerLocation;

    /**
     * 엔티티클릭으로 이벤트 검색결과를 표시할 때 사용하는 오프셋. 오프셋만큼 스크롤위치를 보정한다.
     */
    entityEventSearchScrollOffset: number;

    /**
     * 로우당 렌더링 가능한 최대 이벤트 수
     */
    maxRenderCountPerRow: number;

    customizeElements: (elements: { rootElement: HTMLElement }) => void;
    formatHeaderTime: (time: Date) => string;
    renderHeaderCell: (time: Date, containerEl: HTMLElement) => void;
    renderCanvasTitle: (containerEl: HTMLElement, title: string) => void;
    renderGridTitle: (containerEl: HTMLElement, title: string) => void;
    renderGridColumns: (containerEl: HTMLElement) => void;
    renderGridRow: (idx: number, entity: Entity, containerEl: HTMLElement) => void;
    renderSidePointEvent: (event: PointEvent, canvasEl: HTMLElement, containerEl: HTMLElement) => void;
    renderEntityPointEvent: (event: PointEvent, canvasEl: HTMLElement, containerEl: HTMLElement) => void;
    renderEntityRangeEvent: (event: RangeEvent, canvasEl: HTMLElement, containerEl: HTMLElement) => void;
    renderGlobalRangeEvent: (event: RangeEvent, canvasEl: HTMLElement, containerEl: HTMLElement) => void;
}

export interface ChartState {
    chartHeight: number;

    chartWidth: number;


    /**
     * 현재 셀 너비(px)
     */
    cellWidth: number;

    /**
     * 현재 셀 높이(px)
     */
    cellHeight: number;

    /**
     * 현재 캔버스 열 개수
     */
    canvasColumnCount: number;

    currentZoomScale: number;

    cellContentHeight: number;

    /**
     * 이전 줌 방향. 줌 방향이 바뀌면 가속도를 초기화한다.
     */
    prevZoomDirection: null | "in" | "out";

    /**
     * 줌 가속 초기화 시간(밀리초)
     */
    accelResetTimeout: number;

    /**
     * 최근 줌 시간. 줌 이전에 렌더링된 엘리먼트는 새로 렌더링한다.
     */
    lastZoomTime: Date;

    /**
     * 차트 렌더링 시작 시간. 패딩을 포함한 시간.
     */
    chartRenderStartTime: Date;
    /**
     * 차트 렌더링 종료 시간. 패딩을 포함한 시간.
     */
    chartRenderEndTime: Date;


    /**
    * 원본 셀 너비.
    */
    originalCellWidth: number;
    /**
     * 원본 셀 높이.
     */
    originalCellHeight: number;

    /**
     * 기본 줌 스텝.
     */
    defaultZoomStep: number;
    /**
     * 현재 줌 속도
     */
    zoomVelocity: number;

    /**
     * 렌더링된 캔버스 수직경계 엘리먼트 목록
     */
    canvasColumnVLines: HTMLElement[];

    /**
     * 렌더링된 사이드캔버스 수직경계 엘리먼트 목록
     */
    sideCanvasVLines: HTMLElement[];

    /**
     * 렌더링된 메인캔버스 수직경계 엘리먼트 목록
     */
    mainCanvasVLines: HTMLElement[];

    /**
     * 엔티티 컨테이너 목록. key: 컨테이너 엘리먼트, value: 엔티티 행
     */
    entityContainerRows: Map<HTMLElement, EntityRow>;

    /**
     * 활성화 엔티티 목록. key: 엔티티 인덱스, value: 엔티티 행
     */
    activeEntityRows: Map<number, EntityRow>;

    /**
     * 사이드캔버스 포인트 이벤트 엘리먼트 목록
     */
    sidePointEventItems: Array<PointEventItem>;


    /**
     * 글로벌 레인지 이벤트 엘리먼트 목록
     */
    globalRangeEventItems: Array<RangeEventItem>;

}

export interface ChartElements {
    root: HTMLElement;
    gridTitle: HTMLElement;
    gridColumnBox: HTMLElement;
    canvasTitle: HTMLElement;
    gridBox: HTMLElement;
    canvasColumnBox: HTMLElement;
    canvasColumn: HTMLElement;
    sideCanvasBox: HTMLElement;
    sideCanvas: HTMLElement;
    mainCanvasBox: HTMLElement;
    mainCanvas: HTMLElement;
    contextMenu: HTMLElement;
    upMenuItem: HTMLElement;
    downMenuItem: HTMLElement;
    leftMenuItem: HTMLElement;
    rightMenuItem: HTMLElement;
    zoomInMenuItem: HTMLElement;
    zoomOutMenuItem: HTMLElement;
    closeMenuItem: HTMLElement;
}
