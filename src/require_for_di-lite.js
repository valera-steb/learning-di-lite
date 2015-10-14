/**
 * Created on 30.07.2015.
 */
define('require_for_di-lite', ['require_for_di-lite/registrationUtils',
    'require_for_di-lite/utils'], function (registrat, utils) {

    function Require_for_diLite() {
        var self, needCtx = {};

        function add(types, ctx) {
            for (var i in types) {

                var type = types[i];
                if (!utils.isType(type))
                    continue;

                registrat.parent(type, ctx);

                var reg = type['getScope']
                    ? (needCtx[type.name] = !0,
                    ctx.register(type.name, type.c, {ctx: ctx}))
                    : ctx.register(type.name, type.c);

                registrat.settings(reg, type, 'strategy');
                registrat.settings(reg, type, 'factory');


                var subTypes = type['subTypes'];
                if (!subTypes || subTypes.length < 1)
                    continue;

                add(subTypes, ctx);
            }
        }

        var errors = {
            rebuild: function () {
                throw new Error('После создания контекста его нельзя доинициализировать, используйте addTypes');
            },
            noTypes: function (types) {
                if (Array.isArray(types))
                    return;

                throw new Error('При добавлении должен быть передан массив с типами');
            },
            needTypeName: function (name) {
                if (utils.isNotEmptyString(name))
                    return;

                throw new Error('Для создания объекта нужно его имя');
            },
            noNeedCtx: function (params) {
                if (typeof params['ctx'] == 'undefined')
                    return;

                throw new Error('В параметрах для конструктора не может быть контекста (ctx)');
            }
        };

        function makeAddTypes(ctx) {
            ctx['addTypes'] = self['addTypes'] = function (types) {
                errors.noTypes(types);

                add(types, ctx);
            }
        }

        function makeCreate(ctx) {
            ctx['createWith'] = self['create'] = function (name, params) {
                errors.needTypeName(name);

                if (params && needCtx[name]) {
                    errors.noNeedCtx(params);
                    params['ctx'] = ctx;
                }

                return ctx.create(name, params);
            }
        }

        return self = {
            'buildCtx': function (modules, onDone) {

                if (!modules)
                    throw new Error('have no modules array');

                var on = makeCallbacks(onDone);

                function receiveModules() {
                    var ctx = di.createContext();

                    add(arguments, ctx);
                    makeAddTypes(ctx);
                    makeCreate(ctx);
                    self['buildCtx'] = errors.rebuild;

                    on.done(ctx);
                }

                if (modules.length > 0)
                    require(modules, receiveModules, on.fail);
                else
                    receiveModules();

                return on.promise;
            },

            'addTypes': function () {
                throw new Error('Нельзя добавить описание типа без контекста (buildCtx)')
            },

            'create': function () {
                throw new Error('Нельзя создавать объекты без контекста (buildCtx)')
            }
        };
    }

    function makeCallbacks(done) {
        if (!Require_for_diLite.when)
            return {
                done: done || function () {
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

define('require_for_di-lite/utils', [], function () {
    var utils = {};

    if (!Array.isArray) {
        Array.isArray = function (arg) {
            return Object.prototype.toString.call(arg) === '[object Array]';
        };
    }

    utils.isFunction = function (functionToCheck) {
        return Object.prototype.toString.call(functionToCheck) === '[object Function]';
    };

    utils.isNotEmptyString = function (s) {
        var isSt = Object.prototype.toString.call(s) === '[object String]';
        return isSt && s.length > 0;
    };

    utils.isType = function (x) {
        return x && x['name'] && x['c']
            && utils.isFunction(x['c'])
            && utils.isNotEmptyString(typeof x['name']);
    };

    return utils;
});