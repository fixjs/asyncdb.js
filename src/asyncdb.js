define([
  'will'
], function (will) {
  'use strict';
  function asyncdb(_) {
    var storage = navigator.storage || navigator.alsPolyfillStorage,
      doc = global.document,
      prefix = (_.isElement(doc.currentScript) && doc.currentScript.getAttribute('prefix')) || 'asyncdb-',
      fix = will(_);

    function AsyncDB(data) {
      if (_.isArray(data)) {
        this.data = data;
        this.name = undefined;
      } else if (_.isString(data)) {
        this.name = data;
        this.data = undefined;
      }
    }

    AsyncDB.load = function (list) {
      var db = {};
      if (_.isArray(list)) {
        _.forEach(list, function (name) {
          AsyncDB.new(name, db);
        });
      }
      return db;
    };

    AsyncDB.new = function (name, db) {
      var collection = new AsyncDB(name);
      if (_.isObject(db)) {
        db[name] = collection;
      }
      return collection;
    };

    AsyncDB.prototype.store = function (name) {
      var key = prefix + name,
        deferred = fix.defer(),
        promise;
      try {
        promise = storage.get(key);
        promise.then(function (data) {
          if (_.isArray(data)) {
            deferred.resolve(data);
          } else {
            deferred.resolve([]);
          }
        });
      } catch (err) {
        deferred.reject(err);
      }
      return deferred.promise;
    };

    AsyncDB.prototype.do = function (fn) {
      var deferred = fix.defer(),
        that = this;

      if (_.isArray(this.data)) {
        deferred.resolve(fn.call(this));
      } else {
        this.store(this.name).then(function (data) {
          that.data = data;
          deferred.resolve(fn.call(that));
        });
      }
      return deferred.promise;
    };

    AsyncDB.prototype.find = function (predicate) {
      return this.do(function () {
        return _.filter(this.data, predicate);
      });
    };

    AsyncDB.prototype.findOne = function (predicate) {
      return this.do(function () {
        return _.find(this.data, predicate);
      });
    };

    AsyncDB.prototype.findLast = function (predicate) {
      return this.do(function () {
        return _.findLast(this.data, predicate);
      });
    };

    AsyncDB.prototype.count = function (predicate) {
      return this.do(function () {
        if (_.isObject(predicate)) {
          return _.filter(this.data, predicate).count();
        }
        return this.data.length;
      });
    };

    AsyncDB.prototype.fetch = function () {
      return this.do(function () {
        return this.data;
      });
    };

    AsyncDB.prototype.insert = function (obj) {
      return this.do(function () {
        var id = this.data.push(obj);
        obj.id = id;
        return id;
      });
    };

    AsyncDB.prototype.save = function (name) {
      var deferred = fix.defer(),
        key;

      if (_.isString(name) && name) {
        this.name = name;
      }
      key = prefix + this.name;

      if (_.isArray(this.data)) {
        storage.set(key, this.data).then(deferred.resolve);
      }
      return deferred.promise;
    };

    AsyncDB.prototype.saveAs = function (name) {
      return this.save(name);
    };

    AsyncDB.prototype.remove = function (predicate, justOne) {
      return this.do(function () {
        if (justOne) {
          _.pull(this.data, _.find(this.data, predicate));
        } else {
          return _.remove(this.data, predicate);
        }
      });
    };

    /*
     * db.collection.update({id:1}, {name:'Mehran'});
     * db.collection.update({ isAdmin : null }, {isAdmin:true}, false);
     */
    AsyncDB.prototype.update = function (predicate, obj, justOne) {
      return this.do(function () {
        var filtered,
          dataObj;
        if (justOne === undefined || justOne) {
          dataObj = _.find(this.data, predicate);
          if (dataObj) {
            _.extend(dataObj, obj);
          }
        } else {
          filtered = _.filter(this.data, predicate);
          _.forEach(filtered, function (dataObject) {
            _.extend(dataObject, obj);
          });
        }
      });
    };

    AsyncDB.prototype.findAndModify = function () {
      console.log('Not implemented yet!');
    };
    return AsyncDB;
  }
  return asyncdb;
});