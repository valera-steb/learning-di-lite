/**
 * Created by steb on 28.07.15.
 */
define([], function () {

    function DomainItem(){
        var self = this;

        this.dependencies = '';
        this.key = 'item';

        this.onRun = function(){
            self.key = 'executed';
        }
    }


    return {
        name: 'domain.item',
        c: DomainItem,
        subTypes: arguments
    };
});
