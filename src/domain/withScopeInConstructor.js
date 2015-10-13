/**
 * Created on 07.10.2015.
 */
define(function(){
    function withScopeInConstructor(ctx){
        this.getScope = function(){
            return ctx;
        };
    }

    return {
        name: 'withScopeInConstructor',
        c: withScopeInConstructor,
        getScope: true
    }
});