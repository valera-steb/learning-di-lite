/**
 * Created on 13.07.2015.
 */
describe('подход к компоновке объектов', function () {
    var r_config = {
        baseUrl: '../../src/domain/',
        map: {
            '*': {'when': '../../bower_components/when/when'}
        },
        deps: ['../require_for_di-lite']
    };


    describe('уточнения', function () {
    });


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

        it('можно выстраивать наследование *', function (done) {
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

        xit('должно работать наследование c синглтоном родителем', function () {

        });

        it('должно работать наследование когда оба синглтоны', function (done) {
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

    describe('require_for_di-lite - клей библиотек с добавлением наследования', function () {
        xit('позволяет создать несколько скоупов от одного класса (нужно запускать самостоятельно, зависит от состояние кеша require.js)', function (done) {
            require.config(r_config);

            require(['require_for_di-lite', 'when'], function (Provider, when) {
                Provider.when = when;

                when.all([
                    (new Provider).buildCtx(['inheritance/singletonChild']),
                    (new Provider).buildCtx(['inheritance/singletonChild'])
                ])
                    .then(function (ctxs) {
                        console.log(arguments);

                        var c1 = ctxs[0].get('inheritance.sChild'),
                            c2 = ctxs[1].get('inheritance.sChild');

                        expect(c1.getChildId()).toBe(10);
                        expect(c2.getChildId()).toBe(11);

                        c1.id = 1;

                        expect(ctxs[0].get('inheritance.sChild').getChildId()).toBe(1);
                        expect(ctxs[1].get('inheritance.sChild').getChildId()).toBe(11);

                        expect(true).toBeTruthy();
                        done();
                    });
            });
        });

        xit('создание приватного объекта');

        it('подмешивать скоуп в конструктор, если запросили', function(done){
            r_config.callback = function(){
                require(['require_for_di-lite', 'when'], function(p, w){
                    p.when = w;

                    (new p)
                        .buildCtx(['withScopeInConstructor'])
                        .then(test);
                })
            };

            function test(ctx){
                var c = ctx.get('withScopeInConstructor');
                var _ctx = c.getScope();

                expect(ctx).toBe(_ctx);
                done();
            }

            require.config(r_config);
        });
    });

    describe('тестирование с подгрузкой модулей require.js-ом', function () {
        it('должен переопределять имена после загрузки', function (done) {
            require.config({
                baseUrl: '../../src/domain'

            });
            require(['require_js_provider'], function (provider) {
                provider['buildCtx'](['model', 'item'], function (ctx) {
                    // фикстура testItem - не уверен что подмешаеться вовремя...

                    require(['testItem'], function (fixture) {
                        provider['addTypes'](arguments, ctx);

                        ctx.initialize();

                        var domain = ctx.get('domain');
                        expect(domain.item.key).toBe('item');
                        domain.run();

                        expect(domain.item.key).toBe('fixture');
                        done();
                    });
                });
            });
        });

        xit('подмешивание фикутуры приватного объекта');
    });


    describe('private scopes', function () {
        var provider;


        function init(lunch) {
            r_config.callback = function () {
                require(['require_for_di-lite'], function (Provider) {
                    provider = new Provider();
                    provider.buildCtx(['privateScope/componentWithPrivateScope'], lunch);
                });
            };

            require.config(r_config);
        }

        function onReady(ready) {
            init(function (ctx) {
                var c = ctx.get('componentWithPrivateScope');

                c.ready.then(ready);
            });
        }


        it('инициализироваться', function (done) {
            onReady(function (c) {
                expect(c.key).toBe('10');
                done();
            });
        });

        it('добираться до внутрннего поведения', function (done) {
            onReady(function (c) {
                expect(c.state()).toBe(10);

                c.some();

                expect(c.state()).toBe(11);
                done();
            })
        });

        it('подставлять фикстуры', function (done) {
            var fixture;

            init(function (ctx) {
                require(['privateScope/partFixture'], function (Fixture) {
                    var swapper = {
                        'componentWithPrivateScope': function (provider, ctx) {
                            provider.addTypes([fixture.definition], ctx);
                        }
                    };

                    fixture = new Fixture();

                    ctx
                        .create('componentWithPrivateScope', swapper)
                        .ready.then(test);
                });
            });

            function test(c) {
                c.state();
                c.some();

                expect(fixture.getLog()).toBeTruthy(':state:act');
                done();
            }
        });
    });


    describe('private scopes: privateScopeWrapper', function () {
        it('создаваться', function (done) {
            r_config.callback = function () {
                require(['require_for_di-lite'], function (Provider) {
                    var provider = new Provider();

                    provider.buildCtx(['privateScope/wrapped'], function (ctx) {
                        ctx.get('wrapped')
                            .ready.then(function (c) {
                                expect(c.state()).toBe(10);

                                c.some();

                                expect(c.state()).toBe(11);
                                done();
                            });
                    });
                });
            };

            require.config(r_config);
        })

        xit('должен внутри скоупа предоставлять доступ к локальному контексту');
    });
});