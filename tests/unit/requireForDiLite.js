/**
 * Created by steb on 14.10.15.
 */
describe('require_for_di-lite', function () {
    beforeAll(function (done) {
        require.config({
            baseUrl: '../../src/domain/',

            map: {
                '*': {'when': '../../bower_components/when/when'}
            },
            deps: ['../require_for_di-lite'],

            callback: function(){
                require(['require_for_di-lite/privateScopeWrapper'],  done);
            }
        });
    });

    describe('core', function () {

    });

    describe('private scope', function () {
        var Wrapper, Provider;

        beforeAll(function () {
            Wrapper = require('require_for_di-lite/privateScopeWrapper');
            Provider = require('require_for_di-lite');
        });

        it('должен инициализировать указанный объект', function (done) {
            function test(ctx){
                var c = ctx.get('componentWithPrivateScope');
                expect(c.key).toBe('10');
                done();
            }

            (new Provider())
                .buildCtx(['privateScope/componentWithPrivateScope'], test);
        })
    });
});