/**
 * Created on 06.10.2015.
 */
define(['require_for_di-lite', 'when', './componentCore'],
    function (ScopeProvider, when, componentCore) {
        if (!ScopeProvider.when)
            ScopeProvider.when = when;

        var config;

        function ComponentWithPrivateScope(swappers) {
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

                /* тут:
                 ? запросить ядро, построить враппер?
                 ? запросить интерфейс, вернуть его как объект?
                 */
                ctx.get('componentCore').buildInterface(self);
                readyDefer.resolver.resolve(self);
            }

            ctxProvider
                .buildCtx([])
                .done(hasCtx);
        }


        return config = {
            name: 'componentWithPrivateScope',
            c: ComponentWithPrivateScope,
            strategy: di.strategy.proto
        }
    });
