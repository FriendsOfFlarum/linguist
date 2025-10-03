import Model from "flarum/common/Model";
export default class TextString extends Model {
    key: () => string;
    locale: () => string;
    value: () => string;
    apiEndpoint(): string;
}
