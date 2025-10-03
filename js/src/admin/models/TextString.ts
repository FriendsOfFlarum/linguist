import Model from "flarum/common/Model";

export default class TextString extends Model {
    key = Model.attribute<string>("key");
    locale = Model.attribute<string>("locale");
    value = Model.attribute<string>("value");

    apiEndpoint() {
        return (
            // @ts-ignore
            "/fof/linguist/strings" + (this.exists ? "/" + this.data.id : "")
        );
    }
}
