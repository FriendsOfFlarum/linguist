import Model from "flarum/common/Model";

export default class StringKey extends Model {
    key = Model.attribute<string>("key");
    locales = Model.attribute<Record<string, string>>("locales");
}
