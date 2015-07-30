/**
 * Created by steb on 28.07.15.
 */
define(['./parent'], function(Parent){
    var id = 10;

    function Child(parent) {
        var self = this;

        this.id = id++;
        this.dependencies = '';

        this.getChildId = function(){
            return self.id;
        };
    }

    return {
        name: 'inheritance.child',
        c: Child,
        subTypes: arguments,
        strategy: di.strategy.proto,
        parent: 'inheritance.parent'
    };
});