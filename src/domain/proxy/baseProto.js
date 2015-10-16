/**
 * Created on 16.10.2015.
 */
define([], function(){
    function BaseProto(){
        var self = this;

        this.v = 'x';
        this.counter = 0;

        this.f = function(){
            self.counter++;
        };

        this.clean = function(){
            self.counter = 0;
        }
    }

    return {
        name: 'baseProto',
        c: BaseProto,
        strategy: di.strategy.proto
    }
});