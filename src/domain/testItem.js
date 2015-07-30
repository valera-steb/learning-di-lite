/**
 * Created by steb on 28.07.15.
 */
define([], function () {

    function DomainItemFixture() {
        var self = this;

        this.dependencies = '';
        this.key = 'item';

        this.onRun = function () {
            self.key = 'fixture';
        }
    }

    return {
        name: 'domain.item',
        c: DomainItemFixture
    };
});