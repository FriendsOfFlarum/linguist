import Model from 'flarum/Model';
import mixin from 'flarum/utils/mixin';

export default class StringKey extends mixin(Model, {
    key: Model.attribute('key'),
    locales: Model.attribute('locales'),
}) {
    //
}
