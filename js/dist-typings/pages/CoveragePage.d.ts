export default class CoveragePage {
    oninit(): void;
    columns: string | undefined;
    showAllFrontends: boolean | undefined;
    totalPercent: boolean | undefined;
    locale: any;
    view(vnode: any): any[];
    prefixCoverage(browseWithFilters: any, namespace: any, frontend: any): any;
    localeCoverage(browseWithFilters: any, locale: any, namespace: any, frontend: any): any;
}
