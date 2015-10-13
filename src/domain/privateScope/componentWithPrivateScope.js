/**
 * Created on 06.10.2015.
 */
define(['require_for_di-lite/privateScopeWrapper', './componentCore'], function (Wrapper, componentCore) {

    return new Wrapper('componentWithPrivateScope', componentCore);

});
