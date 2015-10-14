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

        xit('должен строить зависимость родитель/потомок');

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
    });

    describe('private scope', function () {
        var Wrapper;

        beforeAll(function () {
            Wrapper = require('require_for_di-lite/privateScopeWrapper');
        });

        it('должен инициализировать указанный объект', function (done) {
            function test(ctx) {
                var c = ctx.get('componentWithPrivateScope');
                expect(c.key).toBe('10');
                done();
            }

            (new Provider())
                .buildCtx(['privateScope/componentWithPrivateScope'], test);
        })
    });
});