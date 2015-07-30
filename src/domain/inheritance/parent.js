/**
 * Created by steb on 28.07.15.
 */
define([], function(){
    var id=0;

    function Parent() {
        var self = this;

        this.id = id++;
        this.dependencies = '';

        this.getId = function(){
            return self.id;
        };
    }

    return {
        name: 'inheritance.parent',
        c: Parent,
        //factory: di.factory.func
        strategy: di.strategy.proto
    };
});