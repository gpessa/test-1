require('./css/theme.scss');

import angular from 'angular';
import ngMessages from 'angular-messages';
import ngMocks from 'angular-mocks';

import registerFactories from './factories';
import registerDirectives from './directives';

if(ON_TEST){

  var ngModule = angular.module('app', ['ngMessages', 'ngMock']);

} else {

  var ngModule = angular.module('app', ['ngMessages', 'ngMockE2E']);

  ngModule.config(function($provide) {
    $provide.decorator('$httpBackend', function($delegate) {
      var proxy = function(method, url, data, callback, headers) {
        var interceptor = function() {
          var _this = this,
          _arguments = arguments;
          setTimeout(function() {
            callback.apply(_this, _arguments);
          }, 500);
        };
        return $delegate.call(this, method, url, data, interceptor, headers);
      };
      for(var key in $delegate) {
        proxy[key] = $delegate[key];
      }
      return proxy;
    });
  })

  ngModule.run(function($httpBackend) {
    $httpBackend.whenPOST('/auth/register').respond(function(){
      var success = [
          200, { 'message' : 'user-registered'}
      ];

      var error = [
          500, { 'message' : 'something-went-wrong'}
      ]

      var isSuccess = Math.random() >= 0.5;

      return isSuccess ? success : error;
    });
  })

}


registerFactories(ngModule);
registerDirectives(ngModule);
