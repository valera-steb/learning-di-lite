/**
 * Created by steb on 14.10.15.
 */
describe('require_for_di-lite', function () {
    var Provider;

    beforeAll(function (done) {
        require.config({
            baseUrl: '../../src/domain/',

            map: {
                '*': {'when': '../../bower_components/when/when'}
            },
            deps: ['../require_for_di-lite'],

            callback: function () {
                require(['require_for_di-lite/privateScopeWrapper'], function () {
                    Provider = require('require_for_di-lite');
                    done();
                });
            }
        });
    });

    xdescribe('todo', function () {
        it('проверить утечки памяти');

        it('подумать в сторону высвобождения памяти');

        it('поискать циклические ссылки');

        it('require_for_di-lite при инициализации контекста прокидывает ' +
            'в него функции дополнительные - как это высвобождать?');

        it('узкое место создание прокси через наследника ' +
            '- установка значения p.v=...');

        it('создание родителя - как ему передавать параметры .get/.create?');

        it('в ctx.map strategy не то-же, что и di.strategy.ххх, посему прокси сейчас принудительно proto');
    });


    describe('сценарии использования', function () {
        describe('подмена', function () {
            xit('встроить фикстуру', function () {
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

            xit('встроить прокси/оббёртку');

            xit('встроить фикстуру в private scope', function () {
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

            xit('встроить прокси/оббёртку в private scope');

            xit('отловить вызов создание контекста из 2-го приватного скоупа');
        });


        xit('можно создать несколько независимых контекстов ' +
            'над одним классом (js файлом)', function () {
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


        describe('наследование', function () {
            xit('должно работать с синглтоном родителем', function () {

            });

            xit('должно работать когда оба синглтоны', function (done) {
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
    });


    describe('core', function () {
        xit('должен строить контекст (подгружая указанные js файлы ' +
            'с описанием типов)');

        xit('должен запрещать перестраивать контекст');

        xit('должен вызывать callback полсе создания контекста');

        xit('при наличии when должен возвращать promise');

        xit('если модули не указанны - создаёт контекст и синхронно вызывает callback');

        xit('позволяте добавлять типы в созданный контекст');

        xit('добавлять можно только после построения контекста');

        xit('должен регистрировать дочернии типы ' +
            '(описание типа может содержать описание дочерних типов)');

        xit('должен строить зависимость родитель/потомок', function () {
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

        xit('должен прокидывать настройки из описания типа (strategy, factory)');

        xit('должен подмешивать в конструктор ссылку на контекст (если запрошена)');

        xit('должен игнорировать в зависимостях не типы');

        it('должен создавать объект с параметром ' +
            '(подмешивая в него ссылку на контекст, если запрошена)', function () {
            var
                cParams,
                type = {
                    name: 'testType',
                    c: function (params) {
                        cParams = params;
                    },
                    strategy: di.strategy.proto,
                    getScope: true
                };

            (new Provider()).buildCtx([], test);

            function test(ctx) {
                ctx.addTypes([type]);
                ctx.createWith('testType', {x: 10});

                expect(cParams.x).toBe(10);
                expect(cParams.ctx).toBe(ctx);
            }
        });

       it('должен регистрировать прокси (на место существующего типа)', function (done) {
            function test(Proxy, ctx) {
                ctx.addProxy(Proxy);

                var obj = ctx.get('baseProto');

                expect(obj.v).toBe('x');
                expect(obj.counter).toBe(0);
                expect(obj.log).toBe('');

                obj.f();
                expect(obj.counter).toBe(1);
                expect(obj.log).toBe('f');

                obj.clean();
                expect(obj.counter).toBe(0);
                expect(obj.log).toBe('f');

                done();
            };

            require(['proxy/simple'], function (Proxy) {
                (new Provider).buildCtx(['proxy/baseProto'],function(ctx) {
                    test(Proxy, ctx);
                });
            });
        });
    });


    describe('private scope', function () {
        var Wrapper;

        beforeAll(function () {
            Wrapper = require('require_for_di-lite/privateScopeWrapper');
        });

        function onReady(f) {
            (new Provider())
                .buildCtx(['privateScope/componentWithPrivateScope'], f);
        }

        it('должен инициализировать указанный объект', function (done) {
            onReady(function (ctx) {
                var c = ctx.get('componentWithPrivateScope');
                expect(c.key).toBe('10');
                done();
            });
        });

        it('должен запрашивать интерфейс внутреннего объекта ' +
            '(и пробрасывать его во внешний scope)', function (done) {
            onReady(function (ctx) {
                var c = ctx.get('componentWithPrivateScope');
                expect(c.state()).toBe(10);

                c.some();

                expect(c.state()).toBe(11);
                done();
            })
        });

        xit('должен пробрасывать коллбэки в приватные scopes');
    });
});


