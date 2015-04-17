define(function () {  
  'use strict';
  function will(_) {
    function resolve(value, baseFulfill, baseReject, save) {
      var promise;
      if (value && _.isFunction(value.then) || false) {
        value.done(baseFulfill, baseReject);
        promise = value;
      } else {
        promise = new Promise(function (fulfill) {
          fulfill(value);
          baseFulfill(value);
        });
      }
      save(promise);
    }

    function reject(reason, baseReject, save) {
      save(new Promise(function (fulfill, reject) {
        reject(reason);
        baseReject(reason);
      }));
    }

    function defer() {
      var resolvedPromise,
        baseFulfill,
        baseReject,
        deferred = {},
        promise = new Promise(function (fulfill, reject) {
          baseFulfill = fulfill;
          baseReject = reject;
        });
      // setProperty(deferred, 'deferred', true);

      function save(newPromise) {
        resolvedPromise = newPromise;
        promise.source = newPromise;
      }
      deferred.promise = promise;
      deferred.resolve = function (value) {
        if (resolvedPromise) {
          return;
        }
        resolve(value, baseFulfill, baseReject, save);
      };
      deferred.reject = function (reason) {
        if (resolvedPromise) {
          return;
        }
        reject(reason, baseReject, save);
      };
      return deferred;
    }
    return {
      defer: defer
    };
  }
  return will;
});