/**
 * Created by steb on 29.07.2015.
 */
define(['./singletonParent'], function(childType){
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
        name: 'inheritance.sChild',
        c: Child,
        subTypes: arguments,
        parent: 'inheritance.sParent'
    };
});