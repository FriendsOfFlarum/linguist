import Model from 'flarum/Model';
import mixin from 'flarum/utils/mixin';

export default class DefaultString extends mixin(Model, {
    key: Model.attribute('key'),
    locale: Model.attribute('locale'),
    value: Model.attribute('value'),
}) {
    //
}
