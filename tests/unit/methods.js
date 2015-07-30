/**
 * Created on 13.07.2015.
 */
describe('подход к компоновке объектов', function () {
    describe('связка предметных областей / интерпретация', function () {
        function A() {
            var self = {
                dependencies: 'b, c',
                toB: {
                    m1: 'func 1'
                },
                toC: {
                    m2: 'func 2'
                }
            };
            return self;
        }

        function B() {
            var self = {
                dependencies: 'a, c',
                toA: {
                    m3: 'f3'
                },
                toC: {
                    m4: 'f4'
                }
            };
            return self;
        }

        function C() {
            var self = {
                dependencies: 'a, b',
                toA: {
                    m5: 'f5'
                },
                toB: {
                    m6: 'f6'
                }
            };
            return self;
        }

        it('создание - возможно только при статических объектах', function () {
            var ctx = di.createContext();

            ctx.register("a", A);
            //  .strategy(di.strategy.proto);
            ctx.register("b", B);
            //  .strategy(di.strategy.proto);
            ctx.register("c", C)
                .strategy(di.strategy.proto);

            ctx.initialize();

            var a = ctx.get('a');
            expect(a.b).toBeDefined();
            expect(a.b.c).toBeDefined();
            expect(a.b.a).toBe(a);

            expect(a.c).toBeDefined();
            expect(a.c.b).toBeDefined();
            expect(a.c.a).toBe(a);
        });
    });

    describe('подгрузка модулей require.js-ом', function () {
        beforeEach(function () {
            require.config({
                baseUrl: '../../src/domain'

            });
        });


        it('должен выстраивать контекст по данным базовым файлам', function (done) {
            require(['require_js_provider'], function (provider) {
                provider['buildCtx'](['model'], function (ctx) {
                    ctx.initialize();

                    var domain = ctx.get('domain');
                    expect(domain.item.key).toBe('item');
                    domain.run();

                    expect(domain.item.key).toBe('executed');
                    done();
                });
            });
        });

        it('можно выстраивать наследование *', function(done){
            require(['require_js_provider'], function (provider) {
                provider['buildCtx'](['inheritance/child'], function (ctx) {
                    ctx.initialize();

                    var child1 = ctx.get('inheritance.child');
                    var child2 = ctx.get('inheritance.child');

                    /* при инициализации di-lite создаёт экземпляры объектов
                       поэтому хоть нумерация родителя и начинаеться с 0-ля,
                       но в прототип приходит 3-й созданный объект:
                       .1-й - он сам
                       .2-й - в child */
                    expect(child1.getId()).toBe(2);
                    expect(child1.getChildId()).toBe(11);

                    expect(child2.getId()).toBe(3);
                    expect(child2.getChildId()).toBe(12);

                    done();
                });
            });
        });

        xit('должно работать наследование c синглтоном родителем', function(){

        });

        it('должно работать наследование когда оба синглтоны', function(done){
            require(['require_js_provider'], function (provider) {
                provider['buildCtx'](['inheritance/singletonChild'], function (ctx) {
                    ctx.initialize();

                    var child1 = ctx.get('inheritance.sChild');
                    var child2 = ctx.get('inheritance.sChild');

                    expect(child1.getId()).toBe(0);
                    expect(child1.getChildId()).toBe(10);

                    expect(child2.getId()).toBe(0);
                    expect(child2.getChildId()).toBe(10);

                    done();
                });
            });
        });
    });

    describe('тестирование с подгрузкой модулей require.js-ом', function () {
        it('должен переопределять имена после загрузки', function (done) {
            require.config({
                baseUrl: '../../src/domain'

            });
            require(['require_js_provider'], function (provider) {
                provider['buildCtx'](['model', 'testItem'], function (ctx) {
                    // фикстура testItem - не уверен что подмешаеться вовремя...

                    //require(['testItem'], function (fixture) {
                    //  provider['addTypes'](arguments, ctx);

                    ctx.initialize();

                    var domain = ctx.get('domain');
                    expect(domain.item.key).toBe('item');
                    domain.run();

                    expect(domain.item.key).toBe('fixture');
                    done();
                    //});
                });
            });
        });
    });
});