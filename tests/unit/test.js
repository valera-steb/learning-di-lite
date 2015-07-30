/**
 * Created on 13.07.2015.
 */
describe('test groupe', function(){
    it('should work', function(){
        expect(true).toBeTruthy();
    });

    describe('наследование', function(){
        it('xxx', function(){

            function Child(){
                var self = this;
                this.getId = function(){
                    return self.id;
                };
            }

            Child.prototype = { id:0};
            var c1 = new Child();


            Child.prototype = {id:1};
            var c2 = new Child();


            expect(c1.getId()).toBe(0);
            expect(c2.getId()).toBe(1);
        });
    })
});