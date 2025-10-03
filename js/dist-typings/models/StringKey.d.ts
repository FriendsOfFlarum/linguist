import Model from "flarum/common/Model";
export default class StringKey extends Model {
    key: () => string;
    locales: () => Record<string, string>;
}
