/**
 * Created on 06.10.2015.
 */

define(['./componentPrivatePart'], function () {
    function ComponentCore() {
        var self = this;
        this.dependencies = 'componentPrivatePart';


        this.buildInterface = function(outer){
            outer.some = function(){
                self.componentPrivatePart.act();
            };

            outer.state = function(){
                return self.componentPrivatePart.getState()
            };

            outer.key = '10';
        };
    }

    return {
        name: 'componentCore',
        c: ComponentCore,
        subTypes: arguments
    }
});