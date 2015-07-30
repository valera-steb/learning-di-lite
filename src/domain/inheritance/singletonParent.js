/**
 * Created by steb on 29.07.2015.
 */
define([], function(){
    var id=0;

    function SingletonParent() {
        var self = this;

        this.id = id++;
        this.dependencies = '';

        this.getId = function(){
            return self.id;
        };
    }

    return {
        name: 'inheritance.sParent',
        c: SingletonParent
    };
});
