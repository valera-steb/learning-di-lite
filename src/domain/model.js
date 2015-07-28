/**
 * Created by steb on 28.07.15.
 */
define(['./item'], function (provider) {
    function Domain() {
        var self = this;

        this.dependencies = 'item=domain.item';

        this.run = function () {
            console.log(self);
            self.item.onRun();
        };
    }


    return {
        name: 'domain',
        c: Domain,
        subTypes: arguments
        //strategy: di.strategy.proto
        //factory: di.factory.func
    };
});