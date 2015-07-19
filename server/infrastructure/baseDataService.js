var Q = require('q');

var BaseDataService = function(col){
  this._col = col;
};

BaseDataService.prototype.findOne = function(query){
    return this._perform("findOne", query);
};

BaseDataService.prototype.find = function(query, options, withSize){
    var deferred = Q.defer();

    if (options){
        this._col.find(query, options, callback);
    }else {
        this._col.find(query, callback);
    }

    function callback(err, cursor){
        if(err){
            deferred.reject(err);
        }else{
            cursor.toArray(function(err, items){
                if (withSize){
                    cursor.count(function(err, size){
                        deferred.resolve({
                            size: size,
                            items: items
                        });
                    });
                }else {
                    deferred.resolve(items);
                }
            });
        }
    };

    return deferred.promise;
};

BaseDataService.prototype.insert = function(doc){
    return this._perform("insert", doc);
};

BaseDataService.prototype.save = function(doc){
    var deferred = Q.defer();
    this._col.save(doc, function(err, result, arg2){
        if(err){
            deferred.reject(err);
        }else{
            deferred.resolve(doc);
        }
    });
    return deferred.promise;
};

BaseDataService.prototype.findAndModify = function(query, sort, doc, options){
    var deferred = Q.defer();
    this._col.findAndModify(query, sort, doc, options, function(err, result){
        if(err){
            deferred.reject(err);
        }else{
            deferred.resolve(result);
        }
    });
    return deferred.promise;
};

BaseDataService.prototype.update = function(query, update, parameters){
    var deferred = Q.defer();
    parameters = parameters || {};
    this._col.update(query,update, {upsert: parameters.upsert || false, multi :parameters.multi || false}, function(err, result){
        if(err){
            deferred.reject(err);
        }else{
            deferred.resolve(result);
        }
    });
    return deferred.promise;
};

BaseDataService.prototype.updateDoc = function(query, updateFn){
    var deferred = Q.defer();
    var self = this;

    this.findOne(query).then(function(item){
        if(!item){
            var message = "UPDATE: Document was not found by query " + JSON.stringify(query);
            deferred.reject(new Error(message));
            return;
        }
        updateFn(item);
        return self.save(item).then(function(doc){
            deferred.resolve(doc);
        });
    })
    return deferred.promise;
};

BaseDataService.prototype._perform = function(method, query, options){
    var deferred = Q.defer();
    this._col[method](query, options || {}, function(err, result){
        if(err){
            deferred.reject(err);
        }else{
            deferred.resolve(result);
        }
    });
    return deferred.promise;
};

BaseDataService.prototype.delete = function(query){
    return this._perform("remove", query);
};

BaseDataService.prototype.count = function(query){
    return this._perform("count", query);
};

BaseDataService.prototype.aggregate = function(query, options){
    return this._perform("aggregate", query, options);
};

module.exports = BaseDataService;