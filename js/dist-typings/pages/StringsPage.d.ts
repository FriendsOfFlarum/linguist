export default class StringsPage {
    oninit(vnode: any): void;
    numberOfResultsToShow: number | undefined;
    filters: any;
    results: any[] | import("flarum/common/Model").default[] | undefined;
    view(vnode: any): any[];
    applyFilters(): void;
    cacheClearInstructions(): any;
}
