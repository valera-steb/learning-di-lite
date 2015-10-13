/**
 * Created on 30.07.2015.
 */
define('require_for_di-lite', [], function () {

    function Require_for_diLite() {

        function registrateParent(type, ctx) {
            if (!type['parent'])
                return;

            type['factory'] = di.factory.func;

            var c = type['c'];
            type['c'] = function () {
                var parent = ctx.get(type['parent']);
                c.prototype = parent;

                return new c(parent);
            }
        }

        function registrateSettings(reg, type, key) {
            if (type[key])
                reg[key](type[key]);
        }

        function isType(x) {
            return x && x['name'] && x['c'];
        }

        function add(types, ctx) {
            for (i in types) {

                var type = types[i];
                if (!isType(type))
                    continue;

                registrateParent(type, ctx);

                var reg = type['getScope']
                    ? ctx.register(type.name, type.c, ctx)
                    : ctx.register(type.name, type.c);

                registrateSettings(reg, type, 'strategy');
                registrateSettings(reg, type, 'factory');


                var subTypes = type['subTypes'];
                if (!subTypes || subTypes.length < 1)
                    continue;

                add(subTypes, ctx);
            }
        }

        return {
            'buildCtx': function (modules, onDone) {

                if (!modules)
                //|| modules.length < 1)
                    throw new Error('have no modules array');

                var on = makeCallbacks(onDone);

                require(modules, function () {
                    var ctx = di.createContext();

                    add(arguments, ctx);
                    on.done(ctx);

                    delete ctx;
                }, on.fail);

                return on.promise;
            },
            'addTypes': add
        };
    };

    function makeCallbacks(done) {
        if (!Require_for_diLite.when)
            return {done: done};

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


define('require_for_di-lite/privateScopeWrapper', ['require_for_di-lite', 'when'], function (ScopeProvider, when) {
    if (!ScopeProvider.when)
        ScopeProvider.when = when;

    return function (componentName, componentCore) {
        var config;


        function PrivateScope(swappers) {
            var
                readyDefer = when.defer(),
                self = this,
                ctxProvider = new ScopeProvider();

            self.ready = readyDefer.promise;

            function hasCtx(ctx) {
                ctxProvider.addTypes([componentCore], ctx);

                if (swappers && swappers[config.name])
                    swappers[config.name](ctxProvider, ctx);

                ctx.initialize();

                ctx.get(componentCore.name).buildInterface(self);
                readyDefer.resolver.resolve(self);
            }

            ctxProvider
                .buildCtx([])
                .done(hasCtx);
        };


        return config = {
            name: PrivateScope.component = componentName,
            c: PrivateScope,
            strategy: di.strategy.proto
        };
    };
});