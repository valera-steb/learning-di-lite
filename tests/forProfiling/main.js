/**
 * Created on 13.07.2015.
 */

function a() {
    this.data = 'data';
}


var id = 0, someObj;

function ConstructorUsingCtx(ctx) {
    id++;

    return {
        x: ctx.get('a'),
        id: id
    }
}

function run(){
    var ctx = di.createContext();

    ctx.register("a", a);
    ctx.register("obj", ConstructorUsingCtx, ctx)
        .strategy(di.strategy.proto);

    ctx.initialize();

    someObj = ctx.get('obj');
}