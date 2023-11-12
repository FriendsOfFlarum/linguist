import Model from "flarum/common/Model";

export default class StringKey extends Model {
    key = Model.attribute("key");
    locales = Model.attribute("locales");
}
