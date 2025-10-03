export default class ExportPage {
    oninit(): void;
    locale: any;
    namespace: any;
    includeOriginals: any;
    includeAll: any;
    loading: boolean | undefined;
    output: any;
    view(vnode: any): any[];
    exportUrl(): string;
    fetchOutput(): void;
}
