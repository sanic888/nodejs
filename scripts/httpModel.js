angular.module('chat').factory('httpModel', function($http, $q) { //, $state, uiNotifications, usSpinnerService, context

  var getAuthHeader = function(){
    return {'Authorization': 'Bearer ' + context && context.token };
  };
  var apiBaseUrl = '/api/v1';
  var buildUrl = function(url){
    return apiBaseUrl + url;
  };

  var httpModel = {
    getAuthHeader: getAuthHeader,
    buildQueryString: function(obj, prefix){
      var str = [];
      for (var p in obj) {
        var k = prefix ? prefix + "[" + p + "]" : p,
          v = obj[p];

        if(angular.isObject(v)){
          str.push(httpModel.buildQueryString(v, k).substr(1));
        } else {
          str.push(v ? (k) + "=" + encodeURIComponent(v)  : (k) + "=");
        }
      }
      return "?" + str.join("&");
    },

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

    verb: function (url, model, method, options) {
      var self = this,
        deferred = $q.defer();

      $http[method](buildUrl(url), model, {headers: getAuthHeader()})
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

    /**
     *  Fills form[]
     *  errors: {
       *    msg: "Error message",
       *    '<field>': "NameOfFailedParameter",
       *    value: "Value of parameter that failed"
       *  }
     */
    fillFormErrors : function(form, errors, field, message) {
      for (var i = 0; i < errors.length; i++) {
        if (errors[i][field] && errors[i][field] != "") {
          form[errors[i][field]].$serverErrorText = errors[i][message];
        } else {
          var msg = errors[i][message];
          if(msg){
            form.globalErrors = msg;
            console.log(msg);
          }
        }
      }
    },

    verbForm: function(url, form, model, method) {
      var self = this;
      var deferred = $q.defer();

      $http[method](buildUrl(url), model, {headers: getAuthHeader()})
        .success(function (data) {
          deferred.resolve(data);
          var result = {};
          result.success = true;
          result.data = data;

          //cleanup old errors
          for (var key in form) {
            if (form[key] && form[key].$serverErrorText) { //This seems unecessary but otherwise if there are already errors and we press submit we get an undefined error
              form[key].$serverErrorText = "";
            }
          }
        })
        .error(function (data, status, headers, config) {
          data.error = true;
          usSpinnerService.stop('header');
          switch (status) {
            case 400:
              //[{field: "", message: ""}]
              var errors = typeof data == 'object' ? data.errors : JSON.parse(data).errors;
              //cleanup old errors
              for (var key in form) {
                if (form[key] && form[key].$serverErrorText) { //This seems unecessary but otherwise if there are already errors and we press submit we get an undefined error
                  form[key].$serverErrorText = "";
                }
              }

              self.fillFormErrors(form, errors, 'param', 'msg');
              self.fillFormErrors(form, errors, 'field', 'message');
            default:
              self.handleErrors(data, status);
              break;
          }
          deferred.reject();
        });

      return deferred.promise;
    },

    verbFile: function(url, form, file, model, method) {
      var self = this;
      var deferred = $q.defer();

      $upload.upload({
        url: buildUrl(url),
        data: model,
        file: file,
        method: method,
        headers: getAuthHeader()
      })
        .success(function (data) {
          deferred.resolve(data);
          var result = {};
          result.success = true;
          result.data = data;

          //cleanup old errors
          for (var key in form) {
            if (form[key] && form[key].$serverErrorText) { //This seems unecessary but otherwise if there are already errors and we press submit we get an undefined error
              form[key].$serverErrorText = "";
            }
          }
        })
        .error(function (data, status, headers, config) {
          data.error = true;
          usSpinnerService.stop('header');
          switch (status) {
            case 400:
              //[{field: "", message: ""}]
              var errors = typeof data == 'object' ? data.errors : JSON.parse(data).errors;
              //cleanup old errors
              for (var key in form) {
                if (form[key] && form[key].$serverErrorText) { //This seems unecessary but otherwise if there are already errors and we press submit we get an undefined error
                  form[key].$serverErrorText = "";
                }
              }

              self.fillFormErrors(form, errors, 'param', 'msg');
              self.fillFormErrors(form, errors, 'field', 'message');
            default:
              self.handleErrors(data, status);
              break;
          }
          deferred.reject();
        });

      return deferred.promise;
    },

    remove: function(url, model, options) {
      return this.verb(url, model, 'delete', options);
    },

    post: function (url, model, options) {
      return this.verb(url, model, 'post', options);
    },

    put: function (url, model, options) {
      return this.verb(url, model, 'put', options);
    },

    postForm: function (url, form, model) {
      return this.verbForm(url, form, model, 'post');
    },

    putForm: function (url, form, model) {
      return this.verbForm(url, form, model, 'put');
    },

    postFile: function(url, form, file, data) {
      return this.verbFile(url, form, file, data, 'post');
    },

    putFile: function(url, form, file, data) {
      return this.verbFile(url, file, data, 'put');
    },

    delete: function (url, options) {
      return this.verb(url, {}, 'delete', options);
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