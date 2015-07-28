/**
 * Created by steb on 28.07.15.
 */
define('require_js_provider', [], function () {

    function registrateSettings(reg, type, key) {
        if (type[key])
            reg[key](type[key]);
    }

    function isType(x) {
        return x['name'] && x['c'];
    }

    function add(types, ctx) {
        for (i in types) {

            var type = types[i];
            if (!isType(type))
                continue;

            var reg = ctx.register(type.name, type.c);

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

            if (!modules || modules.length < 1)
                throw new Error('have no modules array');


            require(modules, function () {
                var ctx = di.createContext();

                add(arguments, ctx);
                onDone(ctx);

                delete ctx;
            });
        },
        'addTypes': add
    };
});