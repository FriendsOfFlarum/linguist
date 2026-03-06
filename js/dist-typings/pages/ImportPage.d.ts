import Component, { ComponentAttrs } from "flarum/common/Component";
import type Mithril from "mithril";
export default class ImportPage extends Component<ComponentAttrs> {
    locale: string;
    overrideExisting: boolean;
    input: string;
    loading: boolean;
    oninit(vnode: Mithril.Vnode<ComponentAttrs, this>): void;
    view(_vnode: Mithril.VnodeDOM<ComponentAttrs, this>): JSX.Element;
}
