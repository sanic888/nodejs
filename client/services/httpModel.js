angular.module('chat').factory('httpModel', function($http, $q) { //, $state, uiNotifications, usSpinnerService, context

  var getAuthHeader = function(){
    var context = {};
    return {'Authorization': 'Bearer ' + context && context.token };
  };
  var apiBaseUrl = 'api';

  var buildUrl = function(url){
    return apiBaseUrl + url;
  };

  var httpModel = {
    getAuthHeader: getAuthHeader,
    
    get: function (url, options) {
      var deferred = $q.defer(),
        config = {
          params: options || {},
          headers: getAuthHeader()
        };

      var self = this;
      $http.get(buildUrl(url), config)
        .success(
        function (data) {
          deferred.resolve(data);
        }).error(function(data, status){
          self.handleErrors(data, status);
          deferred.reject();
        });

      return deferred.promise;
    },

    post: function (url, model, options) {
      var self = this,
        deferred = $q.defer();

      $http.post(buildUrl(url), model, {headers: getAuthHeader()})
        .success(function (data) {
          deferred.resolve(data);
        })
        .error(function (data, status, headers, config) {
          var isProcessed;
          if(options && typeof(options.handleErrors) === 'function' && status != 503){
            isProcessed = options.handleErrors(data, status);
          }
          if(!isProcessed){
            self.handleErrors(data, status);
          }
          deferred.reject(data);
        });

      return deferred.promise;
    },

    handleErrors: function (data, status) {
      console.log("Server error: %j", data);

      switch (status) {
        case 400:
          //don't do anything, just pass errors to the controllers
          //sometimes needed when make a post request and there is validation error you need return to a client
          break;
        case 404:
          $state.go("not-found");
          break;
        case 401:
          window.location = "/logout";
          break;
        case 503:
          window.location = "/";
          break;
        case 403:
          $state.go("access-denied");
          break;

        default:
          usSpinnerService.stop('header');

          uiNotifications.showError("An unexpected error has occurred. Please contact support or try again later.");
          console.error(data);
          break;
      }
    }
  };

  return httpModel;
});