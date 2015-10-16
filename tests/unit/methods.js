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
});