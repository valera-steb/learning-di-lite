/**
 * Created on 16.10.2015.
 */
define([], function(){
    function simpleProxy(params){
        var self = this;
        this.log = '';

        this.f = function(){
            self.log += 'f';
            params.parent.f();
        }
    }

    return {
        name: 'simpleProxy',
        c: simpleProxy,
        parent: 'baseProto' // type to wrap
    }
});
