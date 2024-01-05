import "@/assets/css/plum-chart.css";
import dayjs from "dayjs";
import { EntityBase, PointEventBase, RangeEventBase } from "./plum-chart-core.types";
import { ChartOptions, CoreChart } from "./plum-chart-core";
import { PlumChartOptions, PlumChartData, SortDirection, PointEvent, RangeEvent, PlumChartState } from "./plum-chart.types";

const CLS_ROOT_CONTAINER = "pl-root-container";
const CLS_LEGEND_CONTAINER = "pl-legend-container";
const CLS_CHART_CONTAINER = "pl-chart-container";

const CLS_LEGENDS = "pl-legends";
const CLS_LEGENDS_LEFT = "pl-legends-left";
const CLS_LEGENDS_RIGHT = "pl-legends-right";
const CLS_LEGEND = "pl-legend";
const CLS_LEGEND_ICON = "pl-legend-icon";
const CLS_LEGEND_LABEL = "pl-legend-label";

const CLS_GRID_TITLE = "pl-grid-title";
const CLS_GRID_COLUMNS = "pl-grid-columns";
const CLS_GRID_COLUMN = "pl-grid-column";
const CLS_GRID_COLUMN_CAPTION = "pl-grid-column-caption";
const CLS_GRID_COLUMN_ICON = "pl-grid-column-icon";

const CLS_GRID_ROW = "pl-grid-row";
const CLS_GRID_CELL = "pl-grid-cell";

const CLS_TOOLTIP = "pl-tooltip";
const CLS_TOOLTIP_TITLE = "pl-tooltip-title";
const CLS_TOOLTIP_VISIBLE = "pl-tooltip-visible";
const CLS_TOOLTIP_INVISIBLE = "pl-tooltip-invisible";

const CLS_CANVAS_TITLE = "pl-canvas-title";
const CLS_CANVAS_COLUMN = "pl-canvas-column";

const CLS_ENTITY_POINT_EVENT = "pl-entity-point-event";
const CLS_ENTITY_RANGE_EVENT = "pl-entity-range-event";
const CLS_GLOBAL_RANGE_EVENT = "pl-global-range-event";

export function PlumChart() {

    const _options: PlumChartOptions = {
        renderMode: "scroll",
        useEventHoverColor: true,
        eventHoverColor: "#ccc",
        gridColumns: [],
        gridTitle: "",
        canvasTitle: "",
        chartStartTime: new Date(),
        chartEndTime: new Date(),
        leftPanelWidth: 350,
        columnTitleHeight: 50,
        columnHeaderHeight: 50,
        sideCanvasHeight: 50,
        sideCanvasContentHeightRatio: 0.8,
        cellMinutes: 20,
        cellWidth: 100,
        cellHeight: 50,
        mainRangeContentRatio: 0.9,
        mainPointContentRatio: 0.8,
        minZoomScale: 1,
        maxZoomScale: 4,
        hasHorizontalLine: true,
        hasVerticalLine: true,
        columnAutoWidth: true,
        rowHoverColor: "#ddd",
        fixedController: true,
        controllerLocation: "bottomRight",
        formatTime: (time) => {
            return dayjs(time).format("HH:mm:ss");
        },
        formatTimeRange: _defaultFormatTimeRange,
        renderCanvasColumn: _renderHeaderCell,
        renderPointEventTooltip: _renderDefaultPointEventTooltip,
        renderRangeEventTooltip: _renderDefaultRangeEventTooltip,
    }

    const _data: PlumChartData = {
        legends: [],
        entities: [],
        sidePointEvents: [],
        globalRangeEvents: [],
    };

    const NULL_ELEMENT = document.createElement("div");
    const _state: PlumChartState = {
        entitiesBackup: [],
        gridColumnMap: new Map(),
        gridColumnIconMap: new Map(),
        gridColumnSortFuncs: [],
        sortDirection: SortDirection.NONE,
        sortColumnField: "",
        containerEl: NULL_ELEMENT,
        legendsEl: NULL_ELEMENT,
        fixedTooltipMap: new Map()
    };

    /**
     * 코어차트
     */
    const _coreChart = CoreChart();


    function create(containerEl: HTMLElement) {
        _state.containerEl = containerEl;
        _state.legendsEl = _createLegendEl();

        const rootEl = document.createElement("div");
        rootEl.classList.add(CLS_ROOT_CONTAINER);

        const legendContainerEl = document.createElement("div");
        legendContainerEl.classList.add(CLS_LEGEND_CONTAINER);
        legendContainerEl.appendChild(_state.legendsEl);
        rootEl.appendChild(legendContainerEl);

        const chartContainerEl = document.createElement("div");
        chartContainerEl.classList.add(CLS_CHART_CONTAINER);
        _coreChart.create(chartContainerEl);
        rootEl.appendChild(chartContainerEl);

        _state.containerEl.appendChild(rootEl);
    }

    /**
     * 기본 시간범위 문자열 변환 함수
     * @param start 
     * @param end 
     * @returns 
     */
    function _defaultFormatTimeRange(start: Date, end: Date): string {
        const totalMilliseconds = end.getTime() - start.getTime();
        const totalSeconds = totalMilliseconds / 1000;
        const totalMinutes = totalSeconds / 60;
        const totalHours = totalMinutes / 60;
        const totalDays = totalHours / 24;
        const totalMonths = totalDays / 30;
        const totalYears = totalMonths / 12;

        const seconds = Math.floor(totalSeconds % 60);
        const minutes = Math.floor(totalMinutes % 60);
        const hours = Math.floor(totalHours % 24);
        const days = Math.floor(totalDays % 30);
        const months = Math.floor(totalMonths % 12);
        const years = Math.floor(totalYears);

        let timeDiffString = '';
        if (years > 0) {
            timeDiffString = timeDiffString + years + "년";
        }
        if (months > 0) {
            timeDiffString = timeDiffString + months + "개월";
        }
        if (days > 0) {
            timeDiffString = timeDiffString + days + "일";
        }
        if (hours > 0) {
            timeDiffString = timeDiffString + hours + "시간";
        }
        if (minutes > 0) {
            timeDiffString = timeDiffString + minutes + "분";
        }
        if (seconds > 0) {
            timeDiffString = timeDiffString + seconds + "초";
        }
        if (timeDiffString === '')
            timeDiffString = '0초';
        return timeDiffString;
    }

    /**
     * 캔버스 헤더 셀을 렌더링한다.
     * @param time 
     * @param containerEl 
     * @returns 
     */
    function _renderHeaderCell(time: Date, containerEl: HTMLElement): HTMLElement {
        const divElement = document.createElement("div");
        divElement.classList.add(CLS_CANVAS_COLUMN);
        divElement.innerText = dayjs(time).format("HH:mm");
        containerEl.appendChild(divElement);
        return divElement;
    };

    /**
     * 그리드 셀에 마우스 호버시 배경색을 변경한다.
     * @param eventEl 
     * @returns 
     */
    function _setEventHoverColor(eventEl: HTMLElement) {
        const originalColor = eventEl.style.backgroundColor;
        eventEl.addEventListener("mouseenter", (e) => {
            eventEl.style.backgroundColor = _options.eventHoverColor;
        });
        eventEl.addEventListener("mouseleave", (e) => {
            eventEl.style.backgroundColor = originalColor;
        });
    }

    function _showTooltip(tooltipEl: HTMLElement) {
        tooltipEl.classList.add(CLS_TOOLTIP_VISIBLE);
        tooltipEl.classList.remove(CLS_TOOLTIP_INVISIBLE);
    }

    function _hideTooltip(tooltipEl: HTMLElement) {
        tooltipEl.classList.add(CLS_TOOLTIP_INVISIBLE);
        tooltipEl.classList.remove(CLS_TOOLTIP_VISIBLE);
    }

    /**
     * 마우스위치에 맞춰 툴팁 위치를 조정한다.
     * @param tooltipElement 
     * @param evt 
     */
    function _relocateTooltip(tooltipElement: HTMLElement, evt?: MouseEvent) {
        const mouseEvent: MouseEvent = evt ?? (tooltipElement as any).tag;
        if (!mouseEvent)
            return;
        (tooltipElement as any).tag = evt;

        const locationOffset = 10;
        const tooltipClientRect = tooltipElement.getBoundingClientRect();

        // 툴팁이 윈도우 높이보다 길면 최대 높이를 윈도우 높이로 설정한다.
        const tooltipHeight = tooltipClientRect.height;
        const windowInnerHeight = window.innerHeight - locationOffset * 2;
        if (tooltipHeight >= windowInnerHeight) {
            tooltipElement.style.maxHeight = windowInnerHeight + "px";
        } else {
            tooltipElement.style.maxHeight = "";
        }

        let clientX = mouseEvent.clientX;
        let clientY = mouseEvent.clientY;
        let left = clientX + locationOffset;
        let top = clientY + locationOffset;

        // 마우스 x좌표 + 툴팁너비 + offset  이 윈도우 너비보다 크면 좌측방향으로 툴팁을 위치한다.
        if (clientX + locationOffset + tooltipElement.offsetWidth > window.innerWidth) {
            left = Math.max(locationOffset, clientX - tooltipElement.offsetWidth - locationOffset);
        }
        // 윈도우 높이보다 툴팁이 길면 툽팁 y좌표를 조정한다.
        if (window.innerHeight < clientY + tooltipElement.offsetHeight + locationOffset) {
            top = Math.max(locationOffset, window.innerHeight - tooltipElement.offsetHeight - locationOffset);
        }
        tooltipElement.style.top = top + "px";
        tooltipElement.style.left = left + "px";


    };

    /**
     * 툴팁이 고정되어있는지 여부를 반환한다.
     * @param tooltipContainerEl
     * @returns 
     */
    function _isTooltipFixed(tooltipContainerEl: HTMLElement) {
        return _state.fixedTooltipMap.has(tooltipContainerEl);
    }

    /**
     * 엘리먼트에 툴팁을 추가한다.
     * @param containerEl 툴팁을 적용할 엘리먼트
     * @param tooltipEl 툴팁 엘리먼트
     * @param fixEvent 툴팁을 고정할 이벤트
     */
    function _addTooltip(containerEl: HTMLElement, tooltipEl: HTMLElement, fixEvent: "click" | "dblclick" = "dblclick") {
        // 마우스 이동시 툴팁 위치를 조정한다.
        containerEl.addEventListener("mousemove", (e) => {
            if (e.target !== containerEl) {
                return;
            }
            if (_isTooltipFixed(containerEl))
                return;
            _relocateTooltip(tooltipEl, e);
        });
        // 마우스가 엘리먼트를 벗어나면 툴팁을 숨긴다.
        containerEl.addEventListener("mouseleave", (e) => {
            if (_isTooltipFixed(containerEl))
                return;
            _hideTooltip(tooltipEl);
        });
        // 마우스가 엘리먼트에 들어오면 툴팁을 보여준다.
        // mouseenter이벤트만 발생하고 mousemove이벤트가 발생하지 않는 경우가 있다. ex) 휠스크롤
        // mouseenter이벤트순간부터 툴팁위치를 조정한다.
        containerEl.addEventListener("mouseenter", (e) => {
            if (_isTooltipFixed(containerEl))
                return;
            _showTooltip(tooltipEl);
            _relocateTooltip(tooltipEl, e);
        });
        // 마우스 클릭/더블클릭시 툴팁을 고정한다.
        containerEl.addEventListener(fixEvent, (e) => {
            e.stopPropagation();
            if (_isTooltipFixed(containerEl)) {
                _hideTooltip(tooltipEl);
                _state.fixedTooltipMap.delete(containerEl);
            } else {
                _showTooltip(tooltipEl);
                _state.fixedTooltipMap.set(containerEl, tooltipEl);
            }
        });
        // 툴팁 클릭시 캔버스 클릭 이벤트가 발생하지 않도록 한다. 캔버스 이동, 툴팁 숨김 기능이 동작하지 않도록 한다.
        tooltipEl.addEventListener("click", (e) => {
            e.stopPropagation();
        });
        // 툴팁에서 마우스 이동 이벤트전파를 중단한다. 툴팁 숨김 기능이 동작하지 않도록 한다.
        tooltipEl.addEventListener("mousemove", (e) => {
            e.stopPropagation();
        });
    }

    /**
     * 추가 정보 엘리먼트를 툴팁에 추가한다.
     * @param line 
     * @param tooltipEl 
     * @returns 
     */
    function _renderLineElement(line: string, tooltipEl: HTMLElement): HTMLElement {
        const lineEl = document.createElement("div");
        lineEl.innerText = line;
        tooltipEl.appendChild(lineEl);
        return lineEl;
    }

    function _renderDefaultPointEventTooltip(event: PointEvent, eventEl: HTMLElement, tooltipEl: HTMLElement) {
        const titleEl = document.createElement("div");
        titleEl.classList.add(CLS_TOOLTIP_TITLE);
        titleEl.innerText = event.title;
        tooltipEl.appendChild(titleEl);

        if (event.showTime) {
            const timeEl = document.createElement("div");
            timeEl.innerText = _options.formatTime(event.time);
            tooltipEl.appendChild(timeEl);
        }

        for (const line of event.lines) {
            _renderLineElement(line, tooltipEl);
        }

        let lazyLoaded = false;
        eventEl.addEventListener("mouseenter", async (e) => {
            if (!event.lazyLines)
                return;
            if (lazyLoaded)
                return;
            lazyLoaded = true;
            const lazyLines = await event.lazyLines();
            for (const line of lazyLines) {
                _renderLineElement(line, tooltipEl);
            }
            _relocateTooltip(tooltipEl);
        });
    }

    async function _renderPointEvent(event: PointEvent, canvasEl: HTMLElement, containerEl: HTMLElement, classNames: { img: string }) {
        const imgEl = document.createElement("img");
        imgEl.classList.add(classNames.img);
        imgEl.src = event.icon;
        if (event.className) {
            imgEl.classList.add(event.className);
        }
        containerEl.appendChild(imgEl);

        const tooltipEl = document.createElement("div");
        tooltipEl.classList.add(CLS_TOOLTIP);
        canvasEl.appendChild(tooltipEl);

        _options.renderPointEventTooltip(event, imgEl, tooltipEl);

        if (event.showTooltip) {
            _addTooltip(imgEl, tooltipEl);
        }
        if (_options.useEventHoverColor) {
            _setEventHoverColor(imgEl);
        }
    }

    function _renderDefaultRangeEventTooltip(event: RangeEvent, eventEl: HTMLElement, tooltipEl: HTMLElement) {
        const titleEl = document.createElement("div");
        titleEl.classList.add(CLS_TOOLTIP_TITLE);
        titleEl.innerText = event.title;
        tooltipEl.appendChild(titleEl);

        if (event.showTime) {
            const startTime = _options.formatTime(event.startTime);
            const endTime = _options.formatTime(event.endTime);
            const timeRange = _options.formatTimeRange(event.startTime, event.endTime);
            const timeEl = document.createElement("div");
            timeEl.innerText = `${startTime} ~ ${endTime} (${timeRange})`;
            tooltipEl.appendChild(timeEl);
        }

        for (const line of event.lines) {
            _renderLineElement(line, tooltipEl);
        }

        let lazyLoaded = false;
        eventEl.addEventListener("mouseenter", async (e) => {
            if (!event.lazyLines)
                return;
            if (lazyLoaded)
                return;
            lazyLoaded = true;
            const lazyLines = await event.lazyLines();
            for (const line of lazyLines) {
                _renderLineElement(line, tooltipEl);
            }
            _relocateTooltip(tooltipEl);
        });
    }


    async function _renderRangeEvent(event: RangeEvent, canvasEl: HTMLElement, containerEl: HTMLElement, classNames: { box: string }) {
        const boxEl = document.createElement("div");
        boxEl.classList.add(classNames.box);
        if (event.className) {
            boxEl.classList.add(event.className);
        }
        if (event.color) {
            boxEl.style.backgroundColor = event.color;
        }
        if (event.className) {
            boxEl.classList.add(event.className);
        }
        containerEl.appendChild(boxEl);

        const tooltipEl = document.createElement("div");
        tooltipEl.classList.add(CLS_TOOLTIP);
        canvasEl.appendChild(tooltipEl);

        _options.renderRangeEventTooltip(event, boxEl, tooltipEl);

        if (event.showTooltip) {
            _addTooltip(boxEl, tooltipEl);
        }
        if (_options.useEventHoverColor) {
            _setEventHoverColor(boxEl);
        }
    }

    /**
     * 엔티티 점 이벤트를 기본 렌더링한다.
     * @param event 
     * @param canvasEl 
     * @param containerEl 
     */
    async function _renderEntityPointEvent(event: PointEventBase, canvasEl: HTMLElement, containerEl: HTMLElement) {
        _renderPointEvent(event as PointEvent, canvasEl, containerEl, {
            img: CLS_ENTITY_POINT_EVENT,
        });
    };

    /**
     * 엔티티 범위 이벤트를 렌더링한다.
     * @param event 
     * @param canvasEl 
     * @param containerEl 
     */
    async function _renderEntityRangeEvent(event: RangeEventBase, canvasEl: HTMLElement, containerEl: HTMLElement) {
        _renderRangeEvent(event as RangeEvent, canvasEl, containerEl, {
            box: CLS_ENTITY_RANGE_EVENT,
        });
    };

    /**
     * 보조 점 이벤트를 렌더링한다.
     * @param event 
     * @param canvasEl 
     * @param containerEl 
     */
    function _renderSidePointEvent(event: PointEventBase, canvasEl: HTMLElement, containerEl: HTMLElement) {
        // 엔티티 점 이벤트와 동일하게 렌더링한다.
        _renderEntityPointEvent(event as PointEvent, canvasEl, containerEl);
    };

    /**
     * 전역 범위 이벤트를 렌더링한다.
     * @param event
     * @param canvasEl 
     * @param containerEl 
     */
    async function _renderGlobalRangeEvent(event: RangeEventBase, canvasEl: HTMLElement, containerEl: HTMLElement) {
        _renderRangeEvent(event as RangeEvent, canvasEl, containerEl, {
            box: CLS_GLOBAL_RANGE_EVENT
        });
    };

    /**
     * 메인 타이틀을 렌더링한다.
     * @param containerEl 
     * @param title 
     */
    function _renderGridTitle(containerEl: HTMLElement, title: string) {
        const titleEl = document.createElement("div");
        titleEl.classList.add(CLS_GRID_TITLE);
        titleEl.innerText = title;
        containerEl.appendChild(titleEl);
    }

    function _renderGridColumns(containerEl: HTMLElement) {
        console.log("renderGridColumns");
        const gridColumnsEl = document.createElement("div");
        gridColumnsEl.classList.add(CLS_GRID_COLUMNS);
        containerEl.appendChild(gridColumnsEl);

        let columnIdx = 0;
        for (const column of _state.gridColumnMap.keys()) {
            const [columnEl, iconEl] = _createColumn(gridColumnsEl, columnIdx++, column.caption);
            gridColumnsEl.appendChild(columnEl);
            _state.gridColumnMap.set(column, columnEl);
            _state.gridColumnIconMap.set(column, iconEl);
        }

        console.log("_state.gridColumnMap", _state.gridColumnMap);
        for (const [column, columnEl] of _state.gridColumnMap.entries()) {
            columnEl.addEventListener("click", (e) => {
                const selectedField = column.field;

                if (_state.sortColumnField != selectedField) {
                    _state.sortDirection = SortDirection.ASC;
                }
                else {
                    if (_state.sortDirection == SortDirection.ASC) {
                        _state.sortDirection = SortDirection.DESC;
                    } else if (_state.sortDirection == SortDirection.DESC) {
                        _state.sortDirection = SortDirection.NONE;
                    } else {
                        _state.sortDirection = SortDirection.ASC;
                    }
                }
                _state.sortColumnField = selectedField;

                for (const otherIconEl of _state.gridColumnIconMap.values()) {
                    _updateColumnIcon(otherIconEl, SortDirection.NONE);
                }

                const iconEl = _state.gridColumnIconMap.get(column)!;
                _updateColumnIcon(iconEl, _state.sortDirection);
                _sortEntities(selectedField, _state.sortDirection);

                const sortEvent = new CustomEvent("sort", { detail: { field: selectedField, direction: _state.sortDirection } });
                window.dispatchEvent(sortEvent);
            });
        }

    }

    function _createColumn(containerEl: HTMLElement, index: number, caption: string): HTMLElement[] {
        const columnEl = document.createElement("div");
        columnEl.classList.add(CLS_GRID_COLUMN);
        columnEl.setAttribute("data-index", index.toString());

        const captionEl = document.createElement("div");
        captionEl.classList.add(CLS_GRID_COLUMN_CAPTION);
        captionEl.innerText = caption;
        columnEl.appendChild(captionEl);

        const icon = document.createElement("div");
        icon.classList.add(CLS_GRID_COLUMN_ICON);
        columnEl.appendChild(icon);

        containerEl.appendChild(columnEl);
        return [columnEl, icon];
    }

    /**
     * 정렬방향에 따라 컬럼의 아이콘을 업데이트한다.
     * @param columnEl 
     * @param sortDirection 
     */
    function _updateColumnIcon(iconEl: HTMLElement, sortDirection: SortDirection) {
        if (sortDirection == SortDirection.ASC) {
            iconEl.innerHTML = "&#9650;";
        } else if (sortDirection == SortDirection.DESC) {
            iconEl.innerHTML = "&#9660;";
        } else {
            iconEl.innerHTML = "";
        }
    }

    /**
     * 엔티티를 정렬한다. 그리드 및 캔버스를 정렬한다.
     * @param columnField 
     * @param sortDirection 
     * @returns 
     */
    function _sortEntities(columnField: string, sortDirection: SortDirection) {
        let sortedEntities = [..._state.entitiesBackup];

        if (sortDirection == SortDirection.NONE) {
            _coreChart.setData({
                entities: sortedEntities,
                sidePointEvents: _data.sidePointEvents,
                globalRangeEvents: _data.globalRangeEvents
            });
            _coreChart.renderCanvas();
            return;
        }

        const gridColumnSort = _state.gridColumnSortFuncs.find((sort) => sort.field == columnField);
        if (gridColumnSort) {
            sortedEntities = _data.entities.sort(gridColumnSort.compareFn);
        }
        _coreChart.setData({
            entities: sortedEntities,
            sidePointEvents: _data.sidePointEvents,
            globalRangeEvents: _data.globalRangeEvents
        });

        _coreChart.setData({
            entities: sortedEntities,
            sidePointEvents: _data.sidePointEvents,
            globalRangeEvents: _data.globalRangeEvents
        });
        _coreChart.renderCanvas();
    }

    /**
     * 그리드 행을 렌더링한다
     * @param entity 
     * @param containerEl 
     */
    function _renderGridRow(index: number, entity: EntityBase, containerEl: HTMLElement): void {
        containerEl.classList.add(CLS_GRID_ROW);
        console.log("renderGridRow", index, entity, containerEl);
        let cellIndex = 0;
        for (const column of _state.gridColumnMap.keys()) {
            const itemEl = document.createElement("div");
            itemEl.setAttribute("data-index", (cellIndex++).toString());
            itemEl.classList.add(CLS_GRID_CELL);
            itemEl.innerText = ((entity as any)[column.field] as object).toString() ?? "";
            containerEl.appendChild(itemEl);
        }
    }

    /**
     * 캔버스 타이틀을 렌더링한다.
     * @param containerEl
     * @param title 
     */
    function _renderCanvasTitle(containerEl: HTMLElement, title: string) {
        const titleEl = document.createElement("div");
        titleEl.classList.add(CLS_CANVAS_TITLE);
        titleEl.innerText = title;
        containerEl.appendChild(titleEl);
    }

    let isMainCanvasCostomized = false;

    /**
     * 타임라인 차트 엘리먼트를 커스터마이징한다.
     * @param elements
     * @returns 
     */
    function _customizeElements(elements: { rootElement: HTMLElement }) {
        if (isMainCanvasCostomized)
            return;

        // 캔버스 클릭시 툴팁을 숨긴다.
        elements.rootElement.addEventListener("click", (e) => {
            for (const [_, tooltipEl] of _state.fixedTooltipMap.entries()) {
                _hideTooltip(tooltipEl);
            }
            _state.fixedTooltipMap.clear();
        });
        isMainCanvasCostomized = true;
    }

    function _createLegendEl() {
        const box = document.createElement("div");
        box.classList.add(CLS_LEGENDS);

        const leftBox = document.createElement("div");
        leftBox.classList.add(CLS_LEGENDS_LEFT);

        const rightBox = document.createElement("div");
        rightBox.classList.add(CLS_LEGENDS_RIGHT);

        box.appendChild(leftBox);
        box.appendChild(rightBox);
        return box;
    }

    function _renderLegends() {
        if (!_data.legends)
            return;
        const leftBox = _state.legendsEl.getElementsByClassName(CLS_LEGENDS_LEFT)[0];
        const rightBox = _state.legendsEl.getElementsByClassName(CLS_LEGENDS_RIGHT)[0];
        leftBox.replaceChildren();
        rightBox.replaceChildren();
        for (const item of _data.legends) {
            const box = document.createElement("div");
            box.classList.add(CLS_LEGEND);
            if (item.location == "left" || item.location == null) {
                leftBox.appendChild(box);
            }
            else {
                rightBox.appendChild(box);
            }

            const icon = document.createElement("div");
            icon.classList.add(CLS_LEGEND_ICON);
            if (item.icon) {
                icon.style.backgroundImage = `url(${item.icon})`;
                icon.style.backgroundSize = "contain";
            }
            if (item.color)
                icon.style.backgroundColor = item.color;
            if (item.className)
                icon.classList.add(item.className);

            const label = document.createElement("div");
            label.classList.add(CLS_LEGEND_LABEL);
            label.innerText = item.label;

            box.appendChild(icon);
            box.appendChild(label);
        }
    }

    function setOptions(options: Partial<PlumChartOptions>) {
        for (const key in options) {
            if ((options as any)[key] != null) {
                (_options as any)[key] = (options as any)[key];
            }
        }
        const coreOptions: Partial<ChartOptions> = {
            renderMode: _options.renderMode,
            gridTitle: _options.gridTitle,
            canvasTitle: _options.canvasTitle,
            chartStartTime: _options.chartStartTime,
            chartEndTime: _options.chartEndTime,
            columnTitleHeight: _options.columnTitleHeight,
            columnHeaderHeight: _options.columnHeaderHeight,
            sideCanvasHeight: _options.sideCanvasHeight,
            sideCanvasContentHeightRatio: _options.sideCanvasContentHeightRatio,
            cellMinutes: _options.cellMinutes,
            cellWidth: _options.cellWidth,
            cellHeight: _options.cellHeight,
            mainRangeContentRatio: _options.mainRangeContentRatio,
            mainPointContentRatio: _options.mainPointContentRatio,
            maxZoomScale: _options.maxZoomScale,
            hasHorizontalLine: _options.hasHorizontalLine,
            hasVerticalLine: _options.hasVerticalLine,
            columnAutoWidth: _options.columnAutoWidth,
            rowHoverColor: _options.rowHoverColor,
            fixedController: _options.fixedController,
            controllerLocation: _options.controllerLocation,
            hZoomEnabled: true,
            vZoomEnabled: false,
            paddingCellCount: 0,
            leftPanelWidth: 350,
            buttonScrollStepX: 400,
            buttonScrollStepY: 400,
            borderColor: "#333c77",
            canvasLineColor: "#e1edf8",
            renderGridRow: _renderGridRow,
            renderHeaderCell: _renderHeaderCell,
            renderGridTitle: _renderGridTitle,
            renderGridColumns: _renderGridColumns,
            renderCanvasTitle: _renderCanvasTitle,
            customizeElements: _customizeElements,
            renderSidePointEvent: _renderSidePointEvent,
            renderGlobalRangeEvent: _renderGlobalRangeEvent,
            renderEntityPointEvent: _renderEntityPointEvent,
            renderEntityRangeEvent: _renderEntityRangeEvent,
        };

        _coreChart.setOptions(coreOptions);

        _state.gridColumnMap.clear();
        _options.gridColumns?.forEach((column) => {
            _state.gridColumnMap.set(column, NULL_ELEMENT);
        });
        _state.gridColumnSortFuncs = _options.gridColumns?.map((column) => {
            return {
                field: column.field,
                compareFn: (a, b) => {
                    const aText = ((a as any)[column.field] as object)?.toString();
                    const bText = ((b as any)[column.field] as object)?.toString();
                    const sign = _state.sortDirection == SortDirection.ASC ? 1 : -1;
                    return sign * aText.localeCompare(bText);
                }
            };
        }) ?? [];

    }

    function getOptions() {
        return _options;
    }

    function setData(data: Partial<PlumChartData>) {
        Object.assign(_data, data);

        _state.entitiesBackup = _data.entities.map((entity) => {
            return {
                ...entity,
                pointEvents: [...entity.pointEvents],
                rangeEvents: [...entity.rangeEvents]
            };
        });
        _coreChart.setData({
            entities: _data.entities,
            sidePointEvents: _data.sidePointEvents,
            globalRangeEvents: _data.globalRangeEvents
        });
    }

    function getData() {
        return _data;
    }

    function render() {
        isMainCanvasCostomized = false;
        _renderLegends();
        _coreChart.render();
    }

    function renderCanvas() {
        // 정렬과정에서 렌더링이 발생한다. 중복렌더링을 방지를 위해 renderCanvas()를 호출하지 않도록 한다.
        _sortEntities(_state.sortColumnField, _state.sortDirection);
    }

    function getCoreChart() {
        return _coreChart;
    }

    return {
        create,
        setOptions,
        getOptions,
        setData,
        getData,
        render,
        renderCanvas,
        getCoreChart
    }
}
