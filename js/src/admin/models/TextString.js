import Model from 'flarum/Model';
import mixin from 'flarum/utils/mixin';

export default class TextString extends mixin(Model, {
    key: Model.attribute('key'),
    locale: Model.attribute('locale'),
    value: Model.attribute('value'),
}) {
    /**
     * @inheritDoc
     */
    apiEndpoint() {
        return '/fof/linguist/strings' + (this.exists ? '/' + this.data.id : '');
    }
}
