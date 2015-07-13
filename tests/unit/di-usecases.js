/**
 * Created on 13.07.2015.
 */
describe('di usecases', function () {

    function Constructor() {
        var i = {
            dependencies: 'a',
            someF: function () {
            }
        };

        return i;
    }

    function a() {
        this.data = 'data';
    }

    it('должен подмешивать зависимости в объект', function () {
        // create di context
        var ctx = di.createContext();

        ctx.register("a", a);
        ctx.register("obj", Constructor);

        ctx.initialize();

        var c = ctx.get('obj');
        expect(c.a).toBeDefined();
    });


    describe('создаваемый объект может запрашивать в себе зависимости', function () {
        var id;

        function ConstructorUsingCtx(ctx) {
            id++;

            return {
                x: ctx.get('a'),
                id: id
            }
        }

        beforeEach(function(){
            id=0;
        });

        it('создание через create([name], ctx)', function () {
            // create di context
            var ctx = di.createContext();

            ctx.register("a", a);
            ctx.register("obj", ConstructorUsingCtx)
                .strategy(di.strategy.proto);

            //ctx.initialize(); - нельзя, т.к. в конструктор не передаёться контекст

            var c = ctx.create('obj', ctx);
            expect(c.x).toBeDefined();
        });

        it('регистрация с ссылкой на контекст', function () {
            // create di context
            var ctx = di.createContext();

            ctx.register("a", a);
            ctx.register("obj", ConstructorUsingCtx, ctx)
                .strategy(di.strategy.proto);

            ctx.initialize();

            var c = ctx.get('obj');
            expect(c.x).toBeDefined();
        });


        function proA(ctx){
            return {
                b: ctx.get('obj')
            }
        }
        it('циклические зависимости запрошенные через контекст при создании вызывают исключение', function () {
            // create di context
            var ctx = di.createContext();

            ctx.register("a", proA, ctx);
            ctx.register("obj", ConstructorUsingCtx, ctx)
                .strategy(di.strategy.proto);

            expect(function () {
                ctx.initialize();
            }).toThrow();
        });
    });
});
