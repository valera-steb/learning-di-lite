/**
 * Created on 30.07.2015.
 */
define('require_for_di-lite', ['require_for_di-lite/registrationUtils'], function (registrat) {

    function Require_for_diLite() {

        function isType(x) {
            return x && x['name'] && x['c'];
        }

        function add(types, ctx) {
            for (var i in types) {

                var type = types[i];
                if (!isType(type))
                    continue;

                registrat.parent(type, ctx);

                var reg = type['getScope']
                    ? ctx.register(type.name, type.c, {ctx: ctx})
                    : ctx.register(type.name, type.c);

                registrat.settings(reg, type, 'strategy');
                registrat.settings(reg, type, 'factory');


                var subTypes = type['subTypes'];
                if (!subTypes || subTypes.length < 1)
                    continue;

                add(subTypes, ctx);
            }
        }


        return {
            'buildCtx': function (modules, onDone) {

                if (!modules)
                    throw new Error('have no modules array');

                var on = makeCallbacks(onDone);

                function receiveModules() {
                    var ctx = di.createContext();

                    add(arguments, ctx);
                    on.done(ctx);
                }

                if (modules.length > 0)
                    require(modules, receiveModules, on.fail);
                else
                    receiveModules();

                return on.promise;
            },
            'addTypes': add
        };
    }

    function makeCallbacks(done) {
        if (!Require_for_diLite.when)
            return {done: done || function () {
            }};

        var
            defer = Require_for_diLite.when.defer(),
            ret = {
                done: defer.resolver.resolve,
                fail: defer.resolver.reject,
                promise: defer.promise
            };

        if (done)
            defer.promise.then(done);

        return ret;
    }

    return Require_for_diLite;
});


define('require_for_di-lite/privateScopeWrapper', ['require_for_di-lite', 'require_for_di-lite/registrationUtils'], function (ScopeProvider, register) {
    return function (componentName, componentCore, publicConfig) {
        var config = {
            name: PrivateScope.component = componentName,
            c: PrivateScope,
            strategy: di.strategy.proto
        };


        function PrivateScope(params) {
            var
                self = this,
                ctxProvider = new ScopeProvider();

            if (publicConfig && publicConfig['dependencies'])
                this['dependencies'] = publicConfig['dependencies'];


            function hasCtx(ctx) {
                ctxProvider.addTypes([componentCore], ctx);

                if (params && params['swappers'] && params['swappers'][config.name])
                    params['swappers'][config.name](ctxProvider, ctx);

                if (publicConfig && publicConfig['getScope']) {
                    if (!params || !params.ctx)
                        throw new Error('Child scope ask for parent scope, but has no in params');

                    ctx.register('parentScope', params.ctx);
                }

                ctx.initialize();

                ctx.get(componentCore.name)['buildInterface'](self);
            }

            ctxProvider
                .buildCtx([], hasCtx);
        }

        function buildConfig() {
            register.settings(config, publicConfig, 'strategy');
            //register.settings(config, publicConfig, 'factory');
            register.settings(config, publicConfig, 'getScope');
            register.settings(config, publicConfig, 'subTypes');

            return config;
        }

        return buildConfig();
    };
});

define('require_for_di-lite/registrationUtils', [], {
    parent: function (type, ctx) {
        if (!type['parent'])
            return;

        type['factory'] = di.factory.func;

        var c = type['c'];
        type['c'] = function () {
            var parent = ctx.get(type['parent']);
            c.prototype = parent;

            return new c(parent);
        }
    },

    settings: function (reg, type, key) {
        if (type && type[key])
            reg[key](type[key]);
    }
});