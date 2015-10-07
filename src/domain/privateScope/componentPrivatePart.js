/**
 * Created on 07.10.2015.
 */
define([], function () {
    function ComponentPrivatePart(){
        var state = 10;

        this.getState = function(){
            return state;
        };

        this.act = function(){
            state++
        };
    }

    return{
        name: 'componentPrivatePart',
        c: ComponentPrivatePart,
        strategy: di.strategy.proto
    };
});