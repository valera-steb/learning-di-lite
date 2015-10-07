/**
 * Created on 07.10.2015.
 */
define([], function () {
    return function () {
        var log = '';

        function fixture() {
            this.getState = function () {
                log += ':getState';
            };
            this.act = function () {
                log += ':act';
            };
        };

        return {
            definition: {
                name: 'componentPrivatePart',
                c: fixture,
                strategy: di.strategy.proto
            },
            getLog: function () {
                return log;
            }
        }
    }
});