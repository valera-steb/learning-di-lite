/**
 * Created on 07.10.2015.
 */
define(['require_for_di-lite/privateScopeWrapper', './componentCore'], function(wrapper, core){
    return new wrapper('wrapped', core);
});
