import "@/assets/css/plum-chart-core.css"
import { ControllerLocation, ChartData, ChartOptions, Entity, PointEvent, RangeEvent, ChartState, ChartElements, EntityRow, PlumChartGlobal } from "./plum-chart-core.types";
declare global {
    interface Window {
        plumChartGlobal: PlumChartGlobal;
    }
}

window.plumChartGlobal = {
    debug: false,
}

// #region Constants
const CLS_ROOT = "tc-root";
const CLS_CANVAS_TITLE = "tc-column-title";
const CLS_CANVAS_COLUMN_BOX = "tc-column-header-box";
const CLS_CANVAS_COLUMN = "tc-column-header";
const CLS_SIDE_CANVAS_BOX = "tc-side-canvas-box";
const CLS_SIDE_CANVAS = "tc-side-canvas";
const CLS_COLUMN_HEADER_ITEM = "tc-column-header-item";
const CLS_COLUMN_PANEL = "tc-column-panel";
const CLS_LEFT_PANEL = "tc-left-panel";
const CLS_MAIN_PANEL = "tc-main-panel";
const CLS_GRID_TITLE = "tc-maintitle";
const CLS_GRID_COLUMN_BOX = "tc-table-column-box";
const CLS_GRID_BOX = "tc-entity-table-box";
const CLS_ENTITY_TABLE_ITEM = "tc-entity-table-item";

const CLS_MAIN_BOX = "tc-main-box";
const CLS_MAIN_CANVAS_BOX = "tc-main-canvas-box";
const CLS_MAIN_CANVAS = "tc-main-canvas";

const CLS_SIDE_CANVASE_V_BORDER = "tc-side-canvas-v-border";
const CLS_SIDE_CANVAS_POINT_EVENT = "tc-side-canvas-point-event";

const CLS_MAIN_CANVAS_H_BORDER = "tc-main-canvas-h-border";
const CLS_MAIN_CANVAS_V_BORDER = "tc-main-canvas-v-border";
const CLS_MAIN_CANVAS_ENTITY_POINT_EVENT = "tc-main-canvas-entity-point-event";
const CLS_MAIN_CANVAS_ENTITY_RANGE_EVENT = "tc-main-canvas-entity-range-event";
const CLS_MAIN_CANVAS_GLOBAL_RANGE_EVENT = "tc-main-canvas-global-range-event";

const CLS_CONTEXT_MENU = "tc-context-menu";
// const CLS_CONTEXT_MENU_FIXED = "tc-context-menu-fixed";
const CLS_CONTEXT_MENU_TOP_LEFT = "tc-context-menu-top-left"
const CLS_CONTEXT_MENU_TOP_RIGHT = "tc-context-menu-top-right"
const CLS_CONTEXT_MENU_BOTTOM_LEFT = "tc-context-menu-bottom-left";
const CLS_CONTEXT_MENU_BOTTOM_RIGHT = "tc-context-menu-bottom-right";
const CLS_CONTEXT_MENU_CLOSED = "tc-context-menu-closed";
const CLS_CONTEXT_MENU_COLLAPSED = "tc-context-menu-collapsed";
const CLS_CONTEXT_MENU_GROUP1 = "tc-context-menu-group1";
const CLS_CONTEXT_MENU_GROUP2 = "tc-context-menu-group2";
const CLS_CONTEXT_MENU_ITEM = "tc-context-menu-item";
const CLS_CONTEXT_MENU_ITEM_UP = "tc-context-menu-item-up";
const CLS_CONTEXT_MENU_ITEM_DOWN = "tc-context-menu-item-down";
const CLS_CONTEXT_MENU_ITEM_LEFT = "tc-context-menu-item-left";
const CLS_CONTEXT_MENU_ITEM_RIGHT = "tc-context-menu-item-right";
const CLS_CONTEXT_MENU_ITEM_ZOOM_IN = "tc-context-menu-item-zoom-in";
const CLS_CONTEXT_MENU_ITEM_ZOOM_OUT = "tc-context-menu-item-zoom-out";
const CLS_CONTEXT_MENU_ITEM_CLOSE = "tc-context-menu-item-close";

const VAR_CELL_HEIGHT = "--tc-cell-height";
const VAR_MAIN_POINT_CONTENT_HEIGHT = "--tc-main-point-content-height";
const VAR_MAIN_RANGE_CONTENT_HEIGHT = "--tc-main-range-content-height";
const VAR_SCROLL_WIDTH = "--tc-scroll-width";

const VAR_CHART_HEIGHT = "--tc-height";
const VAR_CHART_WIDTH = "--tc-width";
const VAR_LEFT_PANEL_WIDTH = "--tc-list-width";
const VAR_COLUMN_TITLE_HEIGHT = "--tc-column-title-height";
const VAR_COLUMN_HEADER_HEIGHT = "--tc-column-header-height";
const VAR_SIDE_CANVAS_HEIGHT = "--tc-side-canvas-height";
const VAR_SIDE_CANVAS_CONTENT_HEIGHT = "--tc-side-canvas-content-height";

const VAR_BORDER_COLOR = "--plc-border-color";
const VAR_CANVAS_LINE_COLOR = "--plc-canvas-line-color";
// #endregion

/**
 * 컨트롤러 위치 클래스 맵
 */
const CONTROLLER_LOCATION_CLS_MAP = new Map<ControllerLocation, string>([
    ["topLeft", CLS_CONTEXT_MENU_TOP_LEFT],
    ["topRight", CLS_CONTEXT_MENU_TOP_RIGHT],
    ["bottomLeft", CLS_CONTEXT_MENU_BOTTOM_LEFT],
    ["bottomRight", CLS_CONTEXT_MENU_BOTTOM_RIGHT]
]);

export const CoreChart = function () {

    /* Layout
    |---------------|-------------------|
    | grid title    | canvas title      |
    |---------------|-------------------|
    |               | canvas column     |
    | grid column   |-------------------|
    |               | side canvas       |
    |---------------|-------------------|
    |               |                   |
    | entity list   | main canvas       |
    |               |                   |
    |---------------|-------------------|
    */

    /**
    * 타임라인차트 엘리먼트
    */
    const TC_ELEMENT_HTML = `
                    <div class="${CLS_ROOT}">
                        <div class="${CLS_LEFT_PANEL}">
                            <div class="${CLS_GRID_TITLE}"></div>
                            <div class="${CLS_GRID_COLUMN_BOX}"></div>
                            <div class="${CLS_GRID_BOX}"></div>
                        </div>
                        <div class="${CLS_MAIN_PANEL}">
                            <div class="${CLS_COLUMN_PANEL}">
                                <div class="${CLS_CANVAS_TITLE}"></div>
                                <div class="${CLS_CANVAS_COLUMN_BOX}">
                                    <div class="${CLS_CANVAS_COLUMN}"></div>
                                </div>
                                <div class="${CLS_SIDE_CANVAS_BOX}">
                                    <div class="${CLS_SIDE_CANVAS}"></div>
                                </div>
            
                            </div>
                            <div class="${CLS_MAIN_BOX}">
                                <div class="${CLS_MAIN_CANVAS_BOX}">
                                    <div class="${CLS_MAIN_CANVAS}">
                                    </div>
                                </div>
                                <div class="${CLS_CONTEXT_MENU}">
                                    <div class="${CLS_CONTEXT_MENU_GROUP1}">
                                        <div class="${CLS_CONTEXT_MENU_ITEM} ${CLS_CONTEXT_MENU_ITEM_UP}"></div>
                                        <div class="${CLS_CONTEXT_MENU_ITEM} ${CLS_CONTEXT_MENU_ITEM_DOWN}"></div>
                                        <div class="${CLS_CONTEXT_MENU_ITEM} ${CLS_CONTEXT_MENU_ITEM_LEFT}"></div>
                                        <div class="${CLS_CONTEXT_MENU_ITEM} ${CLS_CONTEXT_MENU_ITEM_RIGHT}"></div>
                                    </div>
                                    <div class="${CLS_CONTEXT_MENU_GROUP2}">
                                        <div class="${CLS_CONTEXT_MENU_ITEM} ${CLS_CONTEXT_MENU_ITEM_ZOOM_IN}"></div>
                                        <div class="${CLS_CONTEXT_MENU_ITEM} ${CLS_CONTEXT_MENU_ITEM_ZOOM_OUT}"></div>
                                        <div class="${CLS_CONTEXT_MENU_ITEM} ${CLS_CONTEXT_MENU_ITEM_CLOSE}"></div>
                                    </div>
                                </div>
                            <div>
                        </div>
                    </div>
                    `;

    const _data: ChartData = {
        entities: [],
        sidePointEvents: [],
        globalRangeEvents: []
    };

    const _options: ChartOptions = {
        chartStartTime: new Date(),
        chartEndTime: new Date(new Date().getDate() + 1),
        controllerLocation: "bottomRight",
        canvasLineColor: "#ccc",
        rowHoverColor: "#eee",
        borderColor: "#ccc",
        fixedController: true,
        buttonScrollStepX: 400,
        buttonScrollStepY: 200,
        mainRangeContentRatio: 0.8,
        mainPointContentRatio: 0.6,
        sideCanvasContentHeightRatio: 0.6,
        maxZoomScale: 5,
        minZoomScale: 1,
        currZoomScale: 1,
        cellMinutes: 30,
        cellWidth: 100,
        cellHeight: 50,
        leftPanelWidth: 200,
        gridTitle: "",
        canvasTitle: "",
        columnTitleHeight: 30,
        columnHeaderHeight: 30,
        sideCanvasHeight: 30,
        paddingCellCount: 0,
        scrollWidth: 15,
        hZoomEnabled: true,
        vZoomEnabled: false,
        hasHorizontalLine: true,
        hasVerticalLine: true,
        columnAutoWidth: true,
        entityEventSearchScrollOffset: -100,
        renderMode: "scroll",
        maxRenderCountPerRow: 300,
        customizeElements: (_) => { },
        formatHeaderTime: (time: Date) => { return time.toLocaleTimeString(); },
        renderHeaderCell: (time: Date, containerEl: HTMLElement) => {
            containerEl.innerText = _options.formatHeaderTime!(time);
        },
        renderGridTitle: (containerEl: HTMLElement, title: string) => {
            containerEl.innerText = title;
        },
        renderGridColumns: (containerEl: HTMLElement) => {
            containerEl.innerText = "Column";
        },
        renderGridRow: (idx: number, entity: Entity, containerEl: HTMLElement) => {
            containerEl.innerText = "Row #" + idx;
        },
        renderCanvasTitle: (containerEl: HTMLElement, title: string) => {
            containerEl.innerText = title;
        },
        renderSidePointEvent: (event: PointEvent, canvasEl: HTMLElement, containerEl: HTMLElement) => {
            containerEl.style.backgroundColor = "yellow";
        },
        renderEntityPointEvent: (event: PointEvent, canvasEl: HTMLElement, containerEl: HTMLElement) => {
            containerEl.style.backgroundColor = "red";
        },
        renderEntityRangeEvent: (event: RangeEvent, canvasEl: HTMLElement, containerEl: HTMLElement) => {
            containerEl.style.backgroundColor = "green";
        },
        renderGlobalRangeEvent: (event: RangeEvent, canvasEl: HTMLElement, containerEl: HTMLElement) => {
            containerEl.style.backgroundColor = "blue";
        },
    }

    /**
     * 차트 상태 변수
     */
    const _state: ChartState = {
        chartHeight: 0,
        chartWidth: 0,
        currentZoomScale: 1,
        prevZoomDirection: null,
        cellContentHeight: 0,
        lastZoomTime: new Date(),
        accelResetTimeout: 300,
        cellWidth: _options.cellWidth!,
        cellHeight: _options.cellHeight!,
        canvasColumnCount: 0,
        zoomVelocity: 0,
        defaultZoomStep: 0.1,
        originalCellWidth: 0,
        originalCellHeight: 0,
        chartRenderStartTime: _options.chartStartTime,
        chartRenderEndTime: _options.chartEndTime,
        canvasColumnVLines: [],
        sideCanvasVLines: [],
        mainCanvasVLines: [],
        sidePointEventItems: [],
        globalRangeEventItems: [],
        entityContainerRows: new Map(),
        activeEntityRows: new Map(),
    }

    const NULL_ELEMENT = document.createElement("div");
    /**
     * 차트에서 사용하는 HTML 엘리먼트 목록
     */
    const _elements: ChartElements = {
        root: NULL_ELEMENT,
        gridTitle: NULL_ELEMENT,
        gridColumnBox: NULL_ELEMENT,
        canvasTitle: NULL_ELEMENT,
        gridBox: NULL_ELEMENT,
        canvasColumnBox: NULL_ELEMENT,
        canvasColumn: NULL_ELEMENT,
        sideCanvasBox: NULL_ELEMENT,
        sideCanvas: NULL_ELEMENT,
        mainCanvasBox: NULL_ELEMENT,
        mainCanvas: NULL_ELEMENT,
        contextMenu: NULL_ELEMENT,
        upMenuItem: NULL_ELEMENT,
        downMenuItem: NULL_ELEMENT,
        leftMenuItem: NULL_ELEMENT,
        rightMenuItem: NULL_ELEMENT,
        zoomInMenuItem: NULL_ELEMENT,
        zoomOutMenuItem: NULL_ELEMENT,
        closeMenuItem: NULL_ELEMENT,
    };

    /**
     * 교차 관찰자. 엔티티 행의 가시성을 관찰한다.
     */
    let _intersecionObserver: IntersectionObserver;

    /**
     * 메인캔버스 사이즈 변경 관찰자. fab버튼 및 컬럼헤더 크기 조정에 사용한다.
     */
    let _mainCanvasBoxResizeObserver: ResizeObserver;

    const css = function () {
        function getVariable(name: string) {
            return getComputedStyle(_elements.root).getPropertyValue(name);
        }
        function setVariable(name: string, value: string) {
            _elements.root.style.setProperty(name, value);
        }

        return {
            getVariable,
            setVariable,

            setCanvasLineColor: (color: string) => { setVariable(VAR_CANVAS_LINE_COLOR, color); },
            setBorderColor: (color: string) => { setVariable(VAR_BORDER_COLOR, color); },
            setLeftPanelWidth: (width: number) => { setVariable(VAR_LEFT_PANEL_WIDTH, `${width}px`); },
            setChartWidth: (width: number) => { setVariable(VAR_CHART_WIDTH, `${width}px`); },
            setChartHeight: (height: number) => { setVariable(VAR_CHART_HEIGHT, `${height}px`); },
            setColumnTitleHeight: (height: number) => { setVariable(VAR_COLUMN_TITLE_HEIGHT, `${height}px`); },
            setColumnHeaderHeight: (height: number) => { setVariable(VAR_COLUMN_HEADER_HEIGHT, `${height}px`); },
            setSideCanvasHeight: (height: number) => { setVariable(VAR_SIDE_CANVAS_HEIGHT, `${height}px`); },
            setSideCanvasContentHeight: (height: number) => { setVariable(VAR_SIDE_CANVAS_CONTENT_HEIGHT, `${height}px`); },
            setCellHeight: (height: number) => { setVariable(VAR_CELL_HEIGHT, `${height}px`); },
            setScrollWidth: (width: number) => { setVariable(VAR_SCROLL_WIDTH, `${width}px`); },
            setMainRangeContentHeight: (height: number) => { setVariable(VAR_MAIN_RANGE_CONTENT_HEIGHT, `${height}px`); },
            setMainPointContentHeight: (height: number) => { setVariable(VAR_MAIN_POINT_CONTENT_HEIGHT, `${height}px`); },
        }
    }();

    /**
     * 차트 엘리먼트를 생성한다.
     * @param container 
     */
    function create(container: HTMLElement) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(TC_ELEMENT_HTML, 'text/html');
        const element = doc.body.firstChild!;
        container.appendChild(element);

        _elements.root = container.getElementsByClassName(CLS_ROOT)[0] as HTMLElement;
        _elements.gridTitle = container.getElementsByClassName(CLS_GRID_TITLE)[0] as HTMLElement;
        _elements.gridColumnBox = container.getElementsByClassName(CLS_GRID_COLUMN_BOX)[0] as HTMLElement;
        _elements.canvasTitle = container.getElementsByClassName(CLS_CANVAS_TITLE)[0] as HTMLElement;
        _elements.gridBox = container.getElementsByClassName(CLS_GRID_BOX)[0] as HTMLElement;
        _elements.canvasColumnBox = container.getElementsByClassName(CLS_CANVAS_COLUMN_BOX)[0] as HTMLElement;
        _elements.canvasColumn = container.getElementsByClassName(CLS_CANVAS_COLUMN)[0] as HTMLElement;
        _elements.sideCanvasBox = container.getElementsByClassName(CLS_SIDE_CANVAS_BOX)[0] as HTMLElement;
        _elements.sideCanvas = container.getElementsByClassName(CLS_SIDE_CANVAS)[0] as HTMLElement;
        _elements.mainCanvasBox = container.getElementsByClassName(CLS_MAIN_CANVAS_BOX)[0] as HTMLElement;
        _elements.mainCanvas = container.getElementsByClassName(CLS_MAIN_CANVAS)[0] as HTMLElement;

        _elements.contextMenu = container.getElementsByClassName(CLS_CONTEXT_MENU)[0] as HTMLElement;
        _elements.upMenuItem = container.getElementsByClassName(CLS_CONTEXT_MENU_ITEM_UP)[0] as HTMLElement;
        _elements.downMenuItem = container.getElementsByClassName(CLS_CONTEXT_MENU_ITEM_DOWN)[0] as HTMLElement;
        _elements.leftMenuItem = container.getElementsByClassName(CLS_CONTEXT_MENU_ITEM_LEFT)[0] as HTMLElement;
        _elements.rightMenuItem = container.getElementsByClassName(CLS_CONTEXT_MENU_ITEM_RIGHT)[0] as HTMLElement;
        _elements.zoomInMenuItem = container.getElementsByClassName(CLS_CONTEXT_MENU_ITEM_ZOOM_IN)[0] as HTMLElement;
        _elements.zoomOutMenuItem = container.getElementsByClassName(CLS_CONTEXT_MENU_ITEM_ZOOM_OUT)[0] as HTMLElement;
        _elements.closeMenuItem = container.getElementsByClassName(CLS_CONTEXT_MENU_ITEM_CLOSE)[0] as HTMLElement;

        _initCanvasBasicEventListeners();
        _initContextMenuElements();

        // 컨테이너 크기에 맞춰 차트 크기를 조정한다.
        _setChartSize(container.clientWidth, container.clientHeight);

        console.info("PlumChart created.");
    }

    function _setChartSize(width: number, height: number) {
        _state.chartWidth = width;
        _state.chartHeight = height;
        css.setChartWidth(width);
        css.setChartHeight(height);
    }

    function _setCellHeight(height: number) {
        _state.cellHeight = height;
        css.setCellHeight(height);
        css.setMainRangeContentHeight(_calcMainRangeContentHeight());
        css.setMainPointContentHeight(_calcMainPointContentHeight());
    }

    /**
     * 밀리초를 분으로 변환한다.
     * @param time 
     * @returns 
     */
    function toMinutes(time: number) {
        return time / (60 * 1000);
    }
    /**
     * 분을 밀리초로 변환한다.
     * @param minutes 
     * @returns 
     */
    function toTime(minutes: number) {
        return minutes * 60 * 1000;
    }

    function _calcPositionInContainer(clientX: number, clientY: number, container: HTMLElement) {
        const rect = container.getBoundingClientRect();
        const x = clientX - rect.left;
        const y = clientY - rect.top;
        return { x, y };
    }

    function _calcPositionInMainCanvas(clientX: number, clientY: number) {
        return _calcPositionInContainer(clientX, clientY, _elements.mainCanvas);
    }

    function _calcPositionInMainCanvasBox(clientX: number, clientY: number) {
        return _calcPositionInContainer(clientX, clientY, _elements.mainCanvasBox);
    }

    function _calcClientCenterPositionInMainCanvasBox() {
        const rect = _elements.mainCanvasBox.getBoundingClientRect();
        const clientX = rect.left + rect.width / 2;
        const clientY = rect.top + rect.height / 2;
        return { clientX, clientY };
    }

    function _calcMainRangeContentHeight() {
        return _state.cellHeight * _options.mainRangeContentRatio;
    }
    function _calcMainPointContentHeight() {
        return _state.cellHeight * _options.mainPointContentRatio;
    }

    function _calcSideCanvasContentHeight() {
        return _options.sideCanvasHeight * _options.sideCanvasContentHeightRatio;
    }

    /**
     * 캔버스 기본 이벤트 리스너를 추가한다.(스크롤, 마우스드래그, 마우스휠)
     */
    function _initCanvasBasicEventListeners() {
        _elements.mainCanvasBox.addEventListener("scroll", (e) => {
            // 가로스크롤 동기화
            _elements.canvasColumnBox.scrollLeft = _elements.mainCanvasBox.scrollLeft;
            _elements.sideCanvasBox.scrollLeft = _elements.mainCanvasBox.scrollLeft;
            // 세로스크롤 동기화
            _elements.gridBox.scrollTop = _elements.mainCanvasBox.scrollTop;
        });
        _elements.gridBox.addEventListener("wheel", (e) => {
            // 세로스크롤 동기화
            _elements.mainCanvasBox.scrollTop += e.deltaY;
        });
        _elements.mainCanvas.addEventListener("mousemove", (e) => {
            if (e.buttons === 1) {
                _elements.mainCanvasBox.scrollLeft -= e.movementX;
                _elements.mainCanvasBox.scrollTop -= e.movementY;
            }
        });
        _elements.mainCanvas.addEventListener("mousedown", (e) => {
            document.body.style.cursor = "pointer";
        });
        _elements.mainCanvas.addEventListener("mouseup", (e) => {
            document.body.style.cursor = "default";
        });

        _elements.mainCanvas.addEventListener("wheel", (e) => {
            zoomCanvasWhenWheel(_elements.mainCanvas, e);
        });

        _elements.sideCanvas.addEventListener("wheel", (e) => {
            zoomCanvasWhenWheel(_elements.sideCanvas, e);
        });

        // prevent default zoom
        document.body.addEventListener("wheel", (e) => {
            if (e.ctrlKey) {
                e.preventDefault();
            }
        }, {
            passive: false
        });
        // change cursor when ctrl key is pressed
        document.body.addEventListener("keydown", (e) => {
            if (e.ctrlKey) {
                document.body.style.cursor = "pointer";
            }
        });
        // restore cursor when ctrl key is released
        document.body.addEventListener("keyup", (e) => {
            document.body.style.cursor = "default";
        });
    }

    function _initContextMenuElements() {
        // fab buttons event. scroll main canvas
        let fabIntervalId: any;
        let fabTimeoutId: any;
        const fabIntervalTimeout = 30;
        const fabTimeoutTimeout = 300;

        const shortStepX = () => _options.buttonScrollStepX;
        const shortStepY = () => _options.buttonScrollStepY;
        const longStepX = () => _options.buttonScrollStepX / 2;
        const longStepY = () => _options.buttonScrollStepY / 2;

        const addDirectionDownHandler = (btn: HTMLElement, shortX: () => number, longX: () => number, shortY: () => number, longY: () => number) => {
            btn.addEventListener("mousedown", function (e) {
                _elements.mainCanvasBox.scrollTo({
                    top: _elements.mainCanvasBox.scrollTop + shortY(),
                    left: _elements.mainCanvasBox.scrollLeft + shortX(),
                    behavior: "smooth"
                });
                fabTimeoutId = setTimeout(() => {
                    fabIntervalId = setInterval(() => {
                        _elements.mainCanvasBox.scrollTop += longY();
                        _elements.mainCanvasBox.scrollLeft += longX();
                    }, fabIntervalTimeout);
                }, fabTimeoutTimeout);
            });
            btn.addEventListener("mouseup", (e) => {
                clearInterval(fabIntervalId);
                clearTimeout(fabTimeoutId);
            });
            btn.addEventListener("mouseleave", (e) => {
                clearInterval(fabIntervalId);
                clearTimeout(fabTimeoutId);
            });
        }

        addDirectionDownHandler(_elements.upMenuItem, () => 0, () => 0, () => -shortStepY(), () => -longStepY());
        addDirectionDownHandler(_elements.downMenuItem, () => 0, () => 0, () => shortStepY(), () => longStepY());
        addDirectionDownHandler(_elements.leftMenuItem, () => -shortStepX(), () => -longStepX(), () => 0, () => 0);
        addDirectionDownHandler(_elements.rightMenuItem, () => shortStepX(), () => longStepX(), () => 0, () => 0);

        _elements.zoomInMenuItem.addEventListener("click", (e) => {
            if (_options.fixedController) {
                const { clientX, clientY } = _calcClientCenterPositionInMainCanvasBox();
                const { x, y } = _calcPositionInMainCanvas(clientX, clientY);
                _zoomIn(x, y);
            } else {
                const { x, y } = _calcPositionInMainCanvas(e.clientX, e.clientY);
                _zoomIn(x, y);
            }
        });
        _elements.zoomOutMenuItem.addEventListener("click", (e) => {
            if (_options.fixedController) {
                const { clientX, clientY } = _calcClientCenterPositionInMainCanvasBox();
                const { x, y } = _calcPositionInMainCanvas(clientX, clientY);
                _zoomOut(x, y);
            } else {
                const { x, y } = _calcPositionInMainCanvas(e.clientX, e.clientY);
                _zoomOut(x, y);
            }
        });
        _elements.closeMenuItem.addEventListener("click", (e) => {
            if (_options.fixedController) {
                _elements.contextMenu.classList.toggle(CLS_CONTEXT_MENU_COLLAPSED);
            } else {
                _elements.contextMenu.classList.toggle(CLS_CONTEXT_MENU_CLOSED);
            }
        });


        // 모바일 기기에서 contextmenu 이벤트가 정상적으로 발생하는 지 확인 필요. 
        // 발생하지 않는 경우 touchstart 이벤트를 사용해야 한다.
        // 고정 컨트롤러가 아닌 경우에만 컨텍스트 메뉴 팝업 적용.
        _elements.mainCanvas.addEventListener("contextmenu", (e) => {
            if (!window.plumChartGlobal?.debug) {
                e.preventDefault();
            }
            if (_options.fixedController)
                return;
            const { x, y } = _calcPositionInMainCanvasBox(e.clientX, e.clientY);
            _elements.contextMenu.style.left = `${x}px`;
            _elements.contextMenu.style.top = `${y}px`;
            _elements.contextMenu.classList.remove(CLS_CONTEXT_MENU_CLOSED);
        });

        let touchTimer: any;
        let longTouchDuration = 300;
        _elements.mainCanvas.addEventListener("touchstart", (e) => {
            touchTimer = setTimeout(() => {
            }, longTouchDuration);
        });
        _elements.mainCanvas.addEventListener("touchend", (e) => {
            if (touchTimer)
                clearTimeout(touchTimer);
        });

        _elements.mainCanvas.addEventListener("click", (e) => {
            if (_options.fixedController)
                return;
            const targetEl = e.target as HTMLElement;
            if (targetEl == _elements.zoomInMenuItem || targetEl == _elements.zoomOutMenuItem) {
                return;
            }
            _elements.contextMenu.classList.add(CLS_CONTEXT_MENU_CLOSED);
        });
    }

    function setOptions(options: Partial<ChartOptions>) {
        Object.assign(_options, options);
        setChartTimeRange(_options.chartStartTime, _options.chartEndTime);
    }

    function getOptions() {
        return { ..._options };
    }

    function setChartTimeRange(startTime: Date, endTime: Date) {
        _options.chartStartTime = startTime;
        _options.chartEndTime = endTime;
        _state.chartRenderStartTime = new Date(startTime.valueOf() - toTime(_options.cellMinutes * _options.paddingCellCount))
        _state.chartRenderEndTime = new Date(endTime.valueOf() + toTime(_options.cellMinutes * _options.paddingCellCount))
    }

    function setData(data: ChartData) {
        Object.assign(_data, data);
    }

    function getData() {
        return _data;
    }

    function isTimeInRange(startTime: Date, endTime?: Date): boolean {
        if (endTime == null) {
            return _state.chartRenderStartTime <= startTime && startTime <= _state.chartRenderEndTime;
        }
        else {
            return _options.chartStartTime <= endTime && startTime <= _options.chartEndTime;
        }
    }

    /**
     * 주어진 시간범위를 유효한 시간범위로 조정한다.
     * @param startTime 
     * @param endTime 
     * @returns 
     */
    function trucateTimeRange(startTime: Date, endTime?: Date): [Date, Date?] {
        const trucateStartTime = new Date(Math.max(startTime.getTime(), _state.chartRenderStartTime.getTime()));
        const trucateEndTime = endTime == null ? undefined : new Date(Math.min(endTime.getTime(), _state.chartRenderEndTime.getTime()));
        return [trucateStartTime, trucateEndTime];
    }

    /** 컨트롤러를 초기화한다 */
    function _resetController() {
        // 클래스 초기화
        CONTROLLER_LOCATION_CLS_MAP.forEach(cls => { _elements.contextMenu.classList.remove(cls) });
        _elements.contextMenu.classList.remove(CLS_CONTEXT_MENU_CLOSED);
        _elements.contextMenu.classList.remove(CLS_CONTEXT_MENU_COLLAPSED);

        if (_options.fixedController) {
            // 고정 컨트롤러인 경우 컨텍스트 메뉴를 미니 상태로 설정.
            _elements.contextMenu.classList.add(CLS_CONTEXT_MENU_COLLAPSED);
            // 컨트롤러 위치 적용
            const locationClass = CONTROLLER_LOCATION_CLS_MAP.get(_options.controllerLocation)!;
            _elements.contextMenu.classList.add(locationClass);
        }
    }


    function _applyCssOptions() {
        css.setBorderColor(_options.borderColor);
        css.setCanvasLineColor(_options.canvasLineColor);

        _setCellHeight(_options.cellHeight);

        css.setLeftPanelWidth(_options.leftPanelWidth);
        css.setColumnTitleHeight(_options.columnTitleHeight);
        css.setColumnHeaderHeight(_options.columnHeaderHeight);
        css.setSideCanvasHeight(_options.sideCanvasHeight);
        css.setSideCanvasContentHeight(_calcSideCanvasContentHeight());
        css.setScrollWidth(_options.scrollWidth);
    }

    function _initCanvasState() {
        // 캔버스 컬럼 수를 계산한다. 
        // 이벤트 시간범위 확인을 간단하기 하기 위해 차트 구간이 셀시간으로 나누어 떨어지지 않는 경우에는 내림한다.
        _state.canvasColumnCount = Math.floor((_state.chartRenderEndTime.valueOf() - _state.chartRenderStartTime.valueOf()) / toTime(_options.cellMinutes));


        // 캔버스 셀 크기 백업
        _state.cellWidth = _options.cellWidth;
        _state.cellHeight = _options.cellHeight;
        _state.originalCellWidth = _options.cellWidth;
        _state.originalCellHeight = _options.cellHeight;

        // 캔버스 컬럼 수에 따라 캔버스 너비를 계산한다.
        if (_options.columnAutoWidth) {
            _state.originalCellWidth = _elements.mainCanvasBox.clientWidth / _state.canvasColumnCount;
            _state.cellWidth = _state.originalCellWidth * _options.currZoomScale;
        }
    }
    /**
     * 차트를 그린다.
     */
    function render() {
        _applyCssOptions();
        _resetController();

        _options.customizeElements({ rootElement: _elements.root });

        _renderMainTitle();
        _renderGridColumns();
        _initCanvasState();
        renderCanvas();
        _startResizeObserver();

        console.info("PlumChart rendered.");
    }

    function renderCanvas() {
        // 캔버스 사이즈를 갱신한 후 갱신된 사이즈에 맞춰 렌더링을 실행한다.
        _updateCanvasSize();
        _renderColumnTitle();
        _renderColumnHeader();
        _renderSideCanvas();
        _renderMainCanvas();
        _renderEntities();

        // 스크롤 위치를 강제로 변경시켜 렌더링을 유도한다.
        _elements.mainCanvasBox.scrollTo(_elements.mainCanvasBox.scrollLeft, _elements.mainCanvasBox.scrollTop - 1);


        _zoom(_options.currZoomScale);
    }

    /**
     * 캔버스 박스의 크기가 변경될 경우 셀 너비를 재계산한다.
     */
    function _mainCanvasBoxResizeCallback() {
        if (_options.columnAutoWidth) {
            // 컬럼헤더에 따라 캔버스 사이즈가 변경된다.
            const canvasWidth = _elements.mainCanvasBox.clientWidth;
            _state.originalCellWidth = canvasWidth / _state.canvasColumnCount;
            _state.cellWidth = _state.originalCellWidth * _options.currZoomScale;
            _refreshCanvas();
        }
    }

    /**
     * 캔버스박스의 크기변화를 관찰한다. 
     */
    function _startResizeObserver() {
        _mainCanvasBoxResizeObserver?.disconnect();
        _mainCanvasBoxResizeObserver = new ResizeObserver(_mainCanvasBoxResizeCallback);
        _mainCanvasBoxResizeObserver.observe(_elements.mainCanvasBox);

    }

    function _renderMainTitle() {
        _elements.gridTitle.replaceChildren();
        _options.renderGridTitle(_elements.gridTitle, _options.gridTitle);
    }

    function _renderGridColumns() {
        _elements.gridColumnBox.replaceChildren();
        _options.renderGridColumns(_elements.gridColumnBox);
    }

    function _updateCanvasSize() {
        /**
        * main canvas에만 스크롤을 표시한다.
        * timeline header와 timeline canvas는 main canvas 수평스크롤과 동기화한다.
        * entity list는 main canvas 수직스크롤과 동기화한다.
        */
        let canvasWidth = Math.max(_state.cellWidth * _state.canvasColumnCount, _elements.mainCanvasBox.clientWidth);
        let canvasHeight = Math.max(_state.cellHeight * _data.entities.length, _elements.mainCanvasBox.clientHeight);

        _elements.canvasColumn.style.width = `${canvasWidth + _options.scrollWidth}px`;
        _elements.sideCanvas.style.width = `${canvasWidth + _options.scrollWidth}px`;
        _elements.mainCanvas.style.width = `${canvasWidth}px`;
        _elements.mainCanvas.style.height = `${canvasHeight}px`;
    }


    function _renderColumnTitle() {
        _elements.canvasTitle.replaceChildren();
        _options.renderCanvasTitle(_elements.canvasTitle, _options.canvasTitle);
    }

    let _headerElements = new Map<number, HTMLElement>();

    function _renderColumnHeader() {
        _elements.canvasColumn.replaceChildren();
        _headerElements.clear();

        let cellIndex = 0;
        let currentTime = _state.chartRenderStartTime;
        while (cellIndex < _state.canvasColumnCount) {
            const containerElement = document.createElement("div");
            containerElement.classList.add(CLS_COLUMN_HEADER_ITEM);
            const left = cellIndex == 0 ? 0 : (cellIndex * _state.cellWidth) + 1;
            containerElement.style.left = `${left}px`;
            containerElement.style.width = `${_state.cellWidth}px`;
            _options.renderHeaderCell(currentTime, containerElement);
            _elements.canvasColumn.appendChild(containerElement);
            _headerElements.set(cellIndex, containerElement);

            currentTime = new Date(currentTime.getTime() + toTime(_options.cellMinutes));
            cellIndex++;
        }
        _renderCanvasHeaderVLines();
    }

    function _renderCanvasHeaderVLines() {
        _state.canvasColumnVLines.length = 0;
        let left = 0;
        for (let i = 0; i < _state.canvasColumnCount; i++) {
            left += _state.cellWidth;
            const line = document.createElement("div") as HTMLElement;
            line.classList.add(CLS_SIDE_CANVASE_V_BORDER);
            line.style.left = `${left}px`;
            _elements.canvasColumn.appendChild(line);
            _state.canvasColumnVLines.push(line);
        }
    }

    function _refreshCanvasHeaderVLines() {
        let left = 0;
        for (let i = 0; i < _state.canvasColumnVLines.length; i++) {
            left += _state.cellWidth;
            const line = _state.canvasColumnVLines[i];
            line.style.left = `${left}px`;
        }
    }

    function _refreshColumnHeaders() {
        for (const [index, el] of _headerElements) {
            const left = index == 0 ? 0 : (index * _state.cellWidth) + 1;
            el.style.left = `${left}px`;
            el.style.width = `${_state.cellWidth}px`;
        }
        _refreshCanvasHeaderVLines();
    }

    /**
     * 휠이벤트 발생시 캔버스 줌을 수행한다.
     * @param canvasElement 
     * @param e 
     * @returns 
     */
    function zoomCanvasWhenWheel(canvasElement: HTMLElement, e: WheelEvent) {
        if (e.ctrlKey) {
            let pivotPoint = { x: 0, y: 0 }; // 줌 기준위치. 마우스 커서가 위치한 셀의 좌표.
            // 대상 엘리먼트에 따라 pivotPoint를 다르게 계산한다.
            if (e.target == canvasElement) {
                pivotPoint.x = e.offsetX;
                pivotPoint.y = e.offsetY;
            }
            else if ((e.target as HTMLElement).parentElement == canvasElement) {
                pivotPoint.x = (e.target as HTMLElement).offsetLeft + e.offsetX;
                pivotPoint.y = (e.target as HTMLElement).offsetTop + e.offsetY;
            }
            else if ((e.target as HTMLElement)?.parentElement?.parentElement == canvasElement) {
                pivotPoint.x = (e.target as HTMLElement)!.parentElement!.offsetLeft + e.offsetX;
                pivotPoint.y = (e.target as HTMLElement)!.parentElement!.offsetTop + e.offsetY;
            }
            else {
                return;
            }
            if (e.deltaY > 0) {
                _zoomOut(pivotPoint.x, pivotPoint.y);
            }
            else {
                _zoomIn(pivotPoint.x, pivotPoint.y);
            }
        }
    }

    /**
     * 보조 캔버스를 그린다.
     */
    function _renderSideCanvas() {
        _elements.sideCanvas.replaceChildren();
        if (_options.hasVerticalLine)
            _renderSideCanvasVerticalLine();

        _renderSidePointEvents();
    }

    function _renderSideCanvasVerticalLine() {
        _state.sideCanvasVLines.length = 0;
        const canvasWidth = _elements.sideCanvas.scrollWidth;
        const vLineCount = Math.ceil(canvasWidth / _state.cellWidth);

        let left = 0;
        for (let i = 0; i < vLineCount; i++) {
            left += _state.cellWidth;
            const line = document.createElement("div") as HTMLElement;
            line.classList.add(CLS_SIDE_CANVASE_V_BORDER);
            line.style.left = `${left}px`;
            _elements.sideCanvas.appendChild(line);
            _state.sideCanvasVLines.push(line);
        }
    }

    function _refreshSideCanvas() {
        _refreshSideCanvasVerticalLine();
        _refreshSidePointEvents();
    }

    function _refreshSideCanvasVerticalLine() {
        let left = 0;
        for (let i = 0; i < _state.sideCanvasVLines.length; i++) {
            left += _state.cellWidth;
            const line = _state.sideCanvasVLines[i];
            line.style.left = `${left}px`;
        }
    }


    function _renderSidePointEvents() {
        let sidePointEvents = _data.sidePointEvents;
        if (_options.maxRenderCountPerRow < _data.sidePointEvents.length) {
            sidePointEvents = _filterEvenlySpacedEvents(_data.sidePointEvents, _options.maxRenderCountPerRow);
            console.warn(`The number of side point events exceeds the maximum limit. [max: ${_options.maxRenderCountPerRow}, current: ${_data.sidePointEvents.length}]`);
        }
        for (const event of sidePointEvents) {
            _renderSidePointEvent(event);
        }
    }

    function _renderSidePointEvent(event: PointEvent) {
        const eventTime = event.time;
        if (!isTimeInRange(eventTime))
            return;
        const containerElement = document.createElement("div");
        const { top, left } = _calcSidePointEventPosition(eventTime);
        containerElement.style.top = `${top}px`;
        containerElement.style.left = `${left}px`;
        containerElement.classList.add(CLS_SIDE_CANVAS_POINT_EVENT);

        _options.renderSidePointEvent(event, _elements.sideCanvas, containerElement);

        _elements.sideCanvas.appendChild(containerElement);
        _state.sidePointEventItems.push({
            time: eventTime,
            containerEl: containerElement
        });
    }

    function _refreshSidePointEvents() {
        for (const container of _state.sidePointEventItems) {
            const time = container.time;
            const containerEl = container.containerEl;
            const { top, left } = _calcSidePointEventPosition(time);
            containerEl.style.top = `${top}px`;
            containerEl.style.left = `${left}px`;
        }
    }

    function _calcSidePointEventPosition(eventTime: Date) {
        const [renderStartTime] = trucateTimeRange(eventTime);
        const time = toMinutes(renderStartTime.valueOf() - _state.chartRenderStartTime.valueOf());
        const center = time * _state.cellWidth / _options.cellMinutes;
        const top = (_options.sideCanvasHeight - _calcSideCanvasContentHeight()) / 2;
        const width = _calcSideCanvasContentHeight();
        const left = center - (width / 2);
        return {
            left: left,
            top: top
        }
    }

    function _renderMainCanvas() {
        _elements.mainCanvas.replaceChildren();
        if (_options.hasVerticalLine)
            _renderMainCanvasVLine();
        _renderGlobalRangeEvents();
    }

    function _refreshMainCanvas() {
        _refreshMainCanvasVLines();
        _refreshGlobalRangeEvents();
    }

    function _refreshActiveEntitiList() {
        for (const [_, entityRow] of _state.activeEntityRows.entries()) {
            _refreshEntityRow(entityRow);
        }
    }

    function _renderMainCanvasVLine() {
        _state.mainCanvasVLines.length = 0;
        const canvasWidth = _elements.mainCanvas.scrollWidth;
        const lineGap = _state.cellWidth;
        const lineHeight = _elements.mainCanvas.scrollHeight;
        const vLineCount = Math.ceil(canvasWidth / lineGap);

        let left = 0;
        for (let i = 1; i <= vLineCount - 1; i++) {
            left += lineGap;
            const line = document.createElement("div") as HTMLElement;
            line.classList.add(CLS_MAIN_CANVAS_V_BORDER);
            line.style.left = `${left}px`;
            line.style.height = `${lineHeight}px`;

            _elements.mainCanvas.appendChild(line);
            _state.mainCanvasVLines.push(line);
        }
    }

    function _refreshMainCanvasVLines() {
        for (let i = 0; i < _state.mainCanvasVLines.length; i++) {
            const line = _state.mainCanvasVLines[i];
            line.style.left = `${(i + 1) * _state.cellWidth}px`;
        }
    }

    /**
     * 엔티티를 렌더링한다.
     * 그리드 로우 및 캔버스 이벤트를 포함한다.
     */
    function _renderEntities() {
        _state.entityContainerRows.clear();
        _state.activeEntityRows.clear();
        _elements.gridBox.replaceChildren();

        if (_options.renderMode == "scroll") {
            _renderEntities_Scroll();
        }
        else if (_options.renderMode == "intersection") {
            _renderEntities_Interection();
        } else {
            _renderEntities_Eager();
        }
    }

    function _renderEntityRow(entityRow: EntityRow) {
        const { index, entity, containerEl } = entityRow;
        _options.renderGridRow(index, entity, containerEl);
        _renderEntityEvents(entity, entityRow);

        if (_options.hasHorizontalLine) {
            const mainCanvasHLine = document.createElement("div");
            mainCanvasHLine.classList.add(CLS_MAIN_CANVAS_H_BORDER);
            mainCanvasHLine.style.top = `${_state.cellHeight * (index)}px`;
            _elements.mainCanvas.appendChild(mainCanvasHLine);
            entityRow.hLine = mainCanvasHLine;
        }
        entityRow.lastRenderTime = new Date();
    }

    function _refreshEntityRow(entityRow: EntityRow) {
        const { index } = entityRow;
        entityRow.hLine!.style.top = `${_state.cellHeight * (index)}px`;
        _refreshEntityEvents(entityRow);
        entityRow.lastRenderTime = new Date();
    }

    function _refreshEntityEvents(entityRow: EntityRow) {
        _refreshEntityPointEvents(entityRow);
        _refreshEntityRangeEvents(entityRow);
    }

    /**
     * 엔티티 컨테이너 엘리먼트를 생성한다.
     * @param index
     * @param entity 
     * @returns 
     */
    function _createEntityContainer(index: number, entity: Entity) {
        const containerEl = document.createElement("div");
        containerEl.classList.add(CLS_ENTITY_TABLE_ITEM);
        containerEl.addEventListener("mouseenter", (e) => {
            (containerEl as any).tag = containerEl.style.backgroundColor;
            containerEl.style.backgroundColor = _options.rowHoverColor;
        });
        containerEl.addEventListener("mouseleave", (e) => {
            containerEl.style.backgroundColor = (containerEl as any).tag;
        });
        containerEl.addEventListener("click", (e) => {
            const entityContainer = _state.entityContainerRows.get(containerEl)!;
            const entity = entityContainer.entity;
            const evtStartTime = _getFirstVisibleEventTime(entity);

            if (evtStartTime != null) {
                const [renderStartTime] = trucateTimeRange(evtStartTime);
                const time = toMinutes(renderStartTime.valueOf() - _state.chartRenderStartTime.valueOf());
                const left = time * _state.cellWidth / _options.cellMinutes;
                _elements.mainCanvasBox.scrollLeft = left + _options.entityEventSearchScrollOffset;
            }
        });
        (containerEl as any).tag = index;
        return containerEl;
    }

    /**
     * 엔티티 컨테이너 엘리먼트를 렌더링한다.
     * @param index
     * @param entity 
     * @returns 
     */
    function _renderEntityContainer(index: number, entity: Entity) {
        const containerEl = _createEntityContainer(index, _data.entities[index]);
        _elements.gridBox.appendChild(containerEl);

        const entityRow: EntityRow = {
            index: index,
            containerEl: containerEl,
            entity: _data.entities[index],
            pointEventContainers: [],
            rangeEventContainers: [],
        };
        _state.entityContainerRows.set(containerEl, entityRow);

        return containerEl;
    }

    /**
     * IntersecionObserver를 이용해 엔티티를 렌더링한다.
     * 가상화 리스트 적용.
     */
    function _renderEntities_Interection() {
        _intersecionObserver?.disconnect();
        const options: IntersectionObserverInit = {
            root: _elements.gridBox,
            threshold: 0,
        };
        _intersecionObserver = new IntersectionObserver(activateEntityWhenIntersecting, options);
        const containerCount = _data.entities.length;
        for (let i = 0; i < containerCount; i++) {
            const containerEl = _renderEntityContainer(i, _data.entities[i]);
            _intersecionObserver.observe(containerEl);
        }
    }

    const activateEntityWhenIntersecting: IntersectionObserverCallback = (changedEntries: IntersectionObserverEntry[]) => {
        changedEntries.forEach((entry: IntersectionObserverEntry, i: number) => {
            const containerEl = entry.target as HTMLElement;
            const entityRow = _state.entityContainerRows.get(containerEl)!;
            if (entry.isIntersecting) {
                if (entityRow.lastRenderTime == null) {
                    // 최초 렌더링
                    _renderEntityRow(entityRow);
                } else if (entityRow.lastRenderTime <= _state.lastZoomTime) {
                    // 리페인트
                    _refreshEntityRow(entityRow);
                }
                _state.activeEntityRows.set(entityRow.index, entityRow);
            }
            else {
                // 스크롤에 의해 엔티티가 영역을 벗어나는 경우에만 교차엔티티 리스트에서 제거한다.
                // 루트 요소의 가시성 변경(display:none)에 의한 경우에는 교차엔티티 리스트에서 제거하지 않는다.
                const rootElDisplayNone = entry.rootBounds?.width === 0 && entry.rootBounds?.height === 0;
                if (!rootElDisplayNone) {
                    _state.activeEntityRows.delete(entityRow.index);
                }
            }
        });
    }

    /**
     * 스크롤 이벤트를 이용해 엔티티를 렌더링한다.
     * 가상화 리스트 적용.
     */
    function _renderEntities_Scroll() {
        _elements.mainCanvasBox.removeEventListener("scroll", activateEntityWhenContainerIsVisible);
        _elements.mainCanvasBox.addEventListener("scroll", activateEntityWhenContainerIsVisible);

        const containerCount = _data.entities.length;
        for (let i = 0; i < containerCount; i++) {
            _renderEntityContainer(i, _data.entities[i]);
        }
        activateEntityWhenContainerIsVisible();
    }

    /**
     * 컨테이너가 화면에 보이는 경우 해당 컨테이너에 포함된 엔티티를 활성화(렌더링or업데이트)한다.
     */
    function activateEntityWhenContainerIsVisible() {
        const scrollTop = _elements.mainCanvasBox.scrollTop;
        const clientHeight = _elements.mainCanvasBox.clientHeight;
        const scrollBottom = scrollTop + clientHeight;
        for (const [_, entityRow] of _state.entityContainerRows.entries()) {
            const containerTop = entityRow.index * _state.cellHeight;
            const containerBottom = containerTop + _state.cellHeight;
            if (containerTop <= scrollBottom && scrollTop <= containerBottom) {
                if (entityRow.lastRenderTime == null) {
                    _renderEntityRow(entityRow);
                } else if (entityRow.lastRenderTime < _state.lastZoomTime) {
                    _refreshEntityRow(entityRow);
                }
                _state.activeEntityRows.set(entityRow.index, entityRow);
            } else {
                _state.activeEntityRows.delete(entityRow.index);
            }
        }
    }

    /**
     * 모든 엔티티를 렌더링한다.
     * 가상화 리스트 미적용.
     */
    function _renderEntities_Eager() {
        const containerCount = _data.entities.length;
        for (let i = 0; i < containerCount; i++) {
            const containerEl = _renderEntityContainer(i, _data.entities[i]);
            const entityRow = _state.entityContainerRows.get(containerEl)!;
            _renderEntityRow(entityRow);
            _state.activeEntityRows.set(i, entityRow);
        }
    }

    /**
     * 화면에 보이는 엔티티의 이벤트중 가장 빠른 시간을 찾는다.
     * @param entity 
     * @returns 
     */
    function _getFirstVisibleEventTime(entity: Entity): Date | null {
        const visibleRangeEvents = _getVisibleRangeEvents(entity.rangeEvents);
        let rangeEvtTime = null;
        if (0 < visibleRangeEvents.length) {
            // 현재 화면에 보이는 엔티티의 가장 빠른 이벤트 시간을 찾는다.
            rangeEvtTime = visibleRangeEvents[0].startTime;
        }

        const visiblePointEvents = _getVisiblePointEvents(entity.pointEvents);
        let pointEvtTime = null;
        if (0 < visiblePointEvents.length) {
            pointEvtTime = visiblePointEvents[0].time;
        }

        let evtStartTime = null;
        if (rangeEvtTime != null && pointEvtTime != null) {
            evtStartTime = rangeEvtTime < pointEvtTime ? rangeEvtTime : pointEvtTime;
        }
        else if (rangeEvtTime != null && pointEvtTime == null) {
            evtStartTime = rangeEvtTime;
        }
        else if (rangeEvtTime == null && pointEvtTime != null) {
            evtStartTime = pointEvtTime;
        }
        return evtStartTime;
    }

    /**
     * 화면에 보이는 엔티티의 이벤트 목록을 찾는다. 시간순 정렬.
     * @param rangeEvents 
     * @returns 
     */
    function _getVisibleRangeEvents(rangeEvents: RangeEvent[]) {
        if (rangeEvents == null || rangeEvents.length == 0)
            return [];

        return rangeEvents.filter((evt: RangeEvent) => {
            return _state.chartRenderStartTime.valueOf() <= evt.startTime.valueOf()
                && evt.startTime.valueOf() <= _state.chartRenderEndTime.valueOf();
        }).sort((a: RangeEvent, b: RangeEvent) => {
            return a.startTime.valueOf() - b.startTime.valueOf();
        });
    }

    /**
     * 화면에 보이는 엔티티의 이벤트 목록을 찾는다. 시간순 정렬.
     * @param pointEvents 
     * @returns 
     */
    function _getVisiblePointEvents(pointEvents: PointEvent[]) {
        if (pointEvents == null || pointEvents.length == 0)
            return [];

        return pointEvents.filter((evt: PointEvent) => {
            return _state.chartRenderStartTime.valueOf() <= evt.time.valueOf()
                && evt.time.valueOf() <= _state.chartRenderEndTime.valueOf();
        }).sort((a: PointEvent, b: PointEvent) => {
            return a.time.valueOf() - b.time.valueOf();
        });
    }

    function _renderEntityEvents(entity: Entity, entityRow: EntityRow) {
        _renderEntityPointEvents(entity, entityRow);
        _renderEntityRangeEvents(entity, entityRow);
    }

    function _renderEntityPointEvents(entity: Entity, entityRow: EntityRow) {
        let pointEvents = entity.pointEvents;
        if (_options.maxRenderCountPerRow < entity.pointEvents.length) {
            pointEvents = _filterEvenlySpacedEvents(entity.pointEvents, _options.maxRenderCountPerRow);
            console.warn(`The number of entity point events exceeds the maximum limit. [max: ${_options.maxRenderCountPerRow}, current: ${entity.pointEvents.length}]`);
        }

        for (const event of pointEvents) {
            _renderEntityPointEvent(event, entityRow);
        }
    }

    function _renderEntityRangeEvents(entity: Entity, entityRow: EntityRow) {
        let rangeEvents = entity.rangeEvents;
        if (_options.maxRenderCountPerRow < entity.rangeEvents.length) {
            rangeEvents = _filterEvenlySpacedEvents(entity.rangeEvents, _options.maxRenderCountPerRow);
            console.warn(`The number of entity range events exceeds the maximum limit. [max: ${_options.maxRenderCountPerRow}, current: ${entity.rangeEvents.length}]`);
        }

        for (const event of rangeEvents) {
            _renderEntityRangeEvent(event, entityRow);
        }
    }

    function _refreshEntityPointEvents(entityRow: EntityRow) {
        for (const container of entityRow.pointEventContainers) {
            const eventTime = container.time;
            const rowIndex = entityRow.index;
            const containerEl = container.containerEl;
            const { top, left } = _calcPointEventPosition(eventTime, rowIndex);
            containerEl.style.top = `${top}px`;
            containerEl.style.left = `${left}px`;
        }
    }

    function _renderEntityPointEvent(event: PointEvent, entityRow: EntityRow) {
        const eventTime = event.time;
        const rowIndex = entityRow.index;
        if (!isTimeInRange(eventTime))
            return;
        const containerEl = document.createElement("div");
        const { top, left } = _calcPointEventPosition(eventTime, rowIndex);
        containerEl.style.top = `${top}px`;
        containerEl.style.left = `${left}px`;

        containerEl.classList.add(CLS_MAIN_CANVAS_ENTITY_POINT_EVENT);

        _options.renderEntityPointEvent(event, _elements.mainCanvas, containerEl);

        _elements.mainCanvas.appendChild(containerEl);
        entityRow.pointEventContainers.push({
            time: eventTime,
            containerEl: containerEl
        });
    }

    function _calcPointEventPosition(eventTime: Date, rowIndex: number): { top: number, left: number } {
        const [renderStartTime] = trucateTimeRange(eventTime);
        const time = toMinutes(renderStartTime.valueOf() - _state.chartRenderStartTime.valueOf());
        const center = time * _state.cellWidth / _options.cellMinutes;
        const contentHeight = _calcMainPointContentHeight();
        const top = (_state.cellHeight * rowIndex) + ((_state.cellHeight - contentHeight) / 2) - 1;
        const width = contentHeight;
        const left = center - (width / 2);
        return {
            left: left,
            top: top,
        };
    }

    function _refreshEntityRangeEvents(entityRow: EntityRow) {
        for (const container of entityRow.rangeEventContainers) {
            const startTime = container.startTime;
            const endTime = container.endTime;
            const rowIndex = entityRow.index;
            const { left, width } = _calcRangeEventPosition(startTime, endTime, rowIndex);
            container.containerEl.style.left = `${left}px`;
            container.containerEl.style.width = `${width}px`;
        }
    }

    function _calcRangeEventPosition(eventStartTime: Date, eventEndTime: Date, rowIndex: number): { top: number, left: number, width: number } {
        const [renderStartTime, renderEndTime] = trucateTimeRange(eventStartTime, eventEndTime);
        const startTime = toMinutes(renderStartTime.valueOf() - _state.chartRenderStartTime.valueOf());
        const duration = toMinutes(renderEndTime!.valueOf() - renderStartTime.valueOf());
        const left = startTime * _state.cellWidth / _options.cellMinutes;
        const width = duration * _state.cellWidth / _options.cellMinutes;
        const top = (_state.cellHeight * rowIndex)
            + (_state.cellHeight - _calcMainRangeContentHeight()) / 2
            - 1;
        return {
            left: left,
            top: top,
            width: width
        };
    }

    function _renderEntityRangeEvent(event: RangeEvent, entityRow: EntityRow) {
        const startTime = event.startTime;
        const endTime = event.endTime;
        const rowIndex = entityRow.index;

        if (!isTimeInRange(startTime, endTime))
            return;

        const containerElement = document.createElement("div");
        const { top, left, width } = _calcRangeEventPosition(startTime, endTime, rowIndex);
        containerElement.style.left = `${left}px`;
        containerElement.style.top = `${top}px`;
        containerElement.style.width = `${width}px`;
        containerElement.classList.add(CLS_MAIN_CANVAS_ENTITY_RANGE_EVENT);

        _options.renderEntityRangeEvent(event, _elements.mainCanvas, containerElement);

        _elements.mainCanvas.appendChild(containerElement);
        entityRow.rangeEventContainers.push({
            startTime: startTime,
            endTime: endTime,
            containerEl: containerElement
        });
    }

    function _filterEvenlySpacedEvents(events: any[], maxCount: number): any[] {
        if (events.length <= maxCount)
            return events;

        const filteredEvents: RangeEvent[] = [];
        const step = events.length / maxCount;
        for (let current = 0; current < events.length; current += step) {
            const index = Math.floor(current);
            filteredEvents.push(events[index]);
        }
        return filteredEvents;

    }

    function _renderGlobalRangeEvents() {
        let globalRangeEvents = _data.globalRangeEvents;
        if (_options.maxRenderCountPerRow < _data.globalRangeEvents.length) {
            globalRangeEvents = _filterEvenlySpacedEvents(_data.globalRangeEvents, _options.maxRenderCountPerRow);
            console.warn(`The number of global range events exceeds the maximum limit. [max: ${_options.maxRenderCountPerRow}, current: ${_data.globalRangeEvents.length}]`);
        }
        for (const event of globalRangeEvents) {
            _renderGlobalRangeEvent(event);
        }
    }

    function _refreshGlobalRangeEvents() {
        for (const container of _state.globalRangeEventItems) {
            const startTime = container.startTime;
            const endTime = container.endTime;
            const { left, width } = _calcRangeEventPosition(startTime, endTime, 0);
            container.containerEl.style.left = `${left}px`;
            container.containerEl.style.width = `${width}px`;
        }
    }

    function _renderGlobalRangeEvent(event: RangeEvent) {
        const eventStartTime = event.startTime;
        const eventEndTime = event.endTime;
        if (!isTimeInRange(eventStartTime, eventEndTime))
            return;

        const { left, width } = _calcRangeEventPosition(eventStartTime, eventEndTime, 0);
        const containerElement = document.createElement("div");
        containerElement.style.left = `${left}px`;
        containerElement.style.width = `${width}px`;
        containerElement.classList.add(CLS_MAIN_CANVAS_GLOBAL_RANGE_EVENT);

        _options.renderGlobalRangeEvent(event, _elements.mainCanvas, containerElement);

        _elements.mainCanvas.appendChild(containerElement);
        _state.globalRangeEventItems.push({
            startTime: eventStartTime,
            endTime: eventEndTime,
            containerEl: containerElement
        });
    }

    function _zoomIn(pivotPointX?: number, pivotPointY?: number) {
        const shouldReset = _state.prevZoomDirection == "out" ||
            _state.accelResetTimeout < new Date().valueOf() - _state.lastZoomTime.valueOf();
        if (shouldReset) {
            _state.zoomVelocity = 0;
        }
        _state.zoomVelocity += _state.defaultZoomStep;
        const nextZoomScale = _options.currZoomScale + _state.zoomVelocity;
        console.log("next zoom scale: ", nextZoomScale);
        _zoom(nextZoomScale, pivotPointX, pivotPointY);
        _state.prevZoomDirection = "in";
    }

    function _zoomOut(pivotPointX?: number, pivotPointY?: number) {
        const shouldReset = _state.prevZoomDirection == "in" ||
            _state.accelResetTimeout < new Date().valueOf() - _state.lastZoomTime.valueOf();
        if (shouldReset) {
            _state.zoomVelocity = 0;
        }
        _state.zoomVelocity -= _state.defaultZoomStep;
        const nextZoomScale = _options.currZoomScale + _state.zoomVelocity;
        console.log("next zoom scale: ", nextZoomScale);
        _zoom(nextZoomScale, pivotPointX, pivotPointY);
        _state.prevZoomDirection = "out";
    }

    function _zoom(scale: number, pivotPointX?: number, pivotPointY?: number) {
        if (scale <= _options.minZoomScale)
            scale = _options.minZoomScale;
        if (_options.maxZoomScale <= scale)
            scale = _options.maxZoomScale;
        if (scale === _options.currZoomScale)
            return;

        _options.currZoomScale = scale;

        console.log("Zoom scale: ", scale);
        // 줌 후 스크롤 위치 계산
        let scrollLeft = _elements.mainCanvasBox.scrollLeft;
        let scrollTop = _elements.mainCanvasBox.scrollTop;

        if (_options.hZoomEnabled) {
            const newCellWidth = _state.originalCellWidth * scale;
            const prevCellWidth = _state.cellWidth;
            _state.cellWidth = newCellWidth;

            if (pivotPointX) {
                const scrollOffset = pivotPointX - scrollLeft;
                const newPivotPointX = pivotPointX * newCellWidth / prevCellWidth; // 기준점까지의 거리
                scrollLeft = newPivotPointX - scrollOffset;
            }

        }
        if (_options.vZoomEnabled) {
            const prevCellHeight = _state.cellHeight;
            const newCellHeight = _state.originalCellHeight * scale;
            _setCellHeight(newCellHeight);
            if (pivotPointY) {
                const scrollOffset = pivotPointY - scrollTop;
                const newPivotPointY = pivotPointY * newCellHeight / prevCellHeight; // 기준점까지의 거리
                scrollTop = newPivotPointY - scrollOffset;
            }
        }
        // 일부 렌더링에는 마지막 줌 시간이 필요하므로 미리 저장해둔다.
        _state.lastZoomTime = new Date();
        _refreshCanvas();

        // keep scroll position
        _elements.mainCanvasBox.scrollLeft = scrollLeft;
        _elements.mainCanvasBox.scrollTop = scrollTop;
    }

    /**
     * 캔버스 UI를 갱신한다.
     */
    function _refreshCanvas() {
        _updateCanvasSize();
        _refreshColumnHeaders();
        _refreshSideCanvas();
        _refreshMainCanvas();
        _refreshActiveEntitiList();
    }

    return {
        create,
        setOptions,
        getOptions,
        setData,
        getData,
        setChartTimeRange,
        render,
        renderCanvas,
    }
};

