import Model from 'flarum/Model';

export default class TextString extends Model {
    key = Model.attribute('key');
    locale = Model.attribute('locale');
    value = Model.attribute('value');

    apiEndpoint() {
        return '/fof/linguist/strings' + (this.exists ? '/' + this.data.id : '');
    }
}
