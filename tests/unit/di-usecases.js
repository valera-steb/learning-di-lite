/**
 * Created on 13.07.2015.
 */
describe('di-lite usecases', function () {

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
        var i = 0;

        this.m = function () {
            return ++i;
        }
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

        beforeEach(function () {
            id = 0;
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


        function proA(ctx) {
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

    it('регистрация с контекстом (параметрами) и создание через create([name], param)', function () {
        function x() {
            this.a = arguments[0];
        }

        var ctx = di.createContext(), obj = {'some': 'object'};
        ctx.register("x", x, ctx)
            .strategy(di.strategy.proto);

        ctx.initialize();

        var x0 = ctx.get('x');
        var x1 = ctx.create('x', 'some data');
        var x2 = ctx.create('x', obj);

        expect(x0.a).toBe(ctx);
        expect(x1.a).toBe('some data');
        expect(x2.a).toBe(obj);
    });

    describe('создание прокси/обёртки', function () {

        it('прокси добавить с тем-же именем и наследником объекта, ' +
            'а сам объект переименовать в карте контекста', function () {
            var ctx = di.createContext(),
                log = '';

            function Proxy(parent) {
                var self = this;

                this.m = function () {
                    log += 'c';
                    return parent.m();
                }
            }

            function aProxyC() {
                var parent = ctx.get('ta');
                Proxy.prototype = parent;
                return new Proxy(parent);
            }


            ctx.register("a", a)
                .strategy(di.strategy.proto);

            ctx.initialize();
            var a2 = ctx.get('a');

            ctx.register("ap", aProxyC)
                .strategy(di.strategy.proto)
                .factory(di.factory.func);


            var ta = ctx.map["a"];
            ctx.map['a'] = ctx.map['ap'];
            ctx.map['ta'] = ta;


            var a1 = ctx.get('a');
            expect(a1.data).toBe('data');
            expect(a1.m()).toBe(1);
            expect(log).toBe('c');

            expect(a2.m()).toBe(1);
        });

        it('как поведёт себя при синглтоне базовом объекте?', function () {
            var ctx = di.createContext();
            ctx.register("a", a);

            ctx.initialize();

            var a1 = ctx.get('a');

            var p = registerProxy(ctx, di.strategy.proto);

            var a2 = ctx.get('a');
            expect(a1).not.toBe(a2);

            expect(a1.m()).toBe(1);
            expect(p.log).toBe('');

            expect(a2.m()).toBe(2);
            expect(p.log).toBe('c');


            var a3 = ctx.get('a');
            expect(a2).not.toBe(a3);

            expect(a2.m()).toBe(3);
            expect(p.log).toBe('cc');
        });

        xit('как могут соотноситься стратегии создания' +
            ' прокси и базового объекта');

        function registerProxy(ctx, strategy) {
            var p = {log: ''};

            function Proxy(parent) {
                var self = this;

                this.m = function () {
                    p.log += 'c';
                    return parent.m();
                }
            }

            function aProxyC() {
                var parent = ctx.get('ta');
                Proxy.prototype = parent;
                return new Proxy(parent);
            }

            ctx.register("ap", aProxyC)
                .strategy(strategy)
                .factory(di.factory.func);


            var ta = ctx.map["a"];
            ctx.map['a'] = ctx.map['ap'];
            ctx.map['ta'] = ta;

            return p;
        }
    });

});
