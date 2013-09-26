/**
 * Created with JetBrains WebStorm.
 * User: Zia
 * Date: 9/23/13
 * Time: 1:42 AM
 * To change this template use File | Settings | File Templates.
 */

//http://mircozeiss.com/building-offline-applications-with-angularjs-and-pouchdb/
//http://pouchdb.com/api.html
//http://jsfiddle.net/zrrrzzt/cNVhE/
sampleApp.factory('pouchdb', function() {
    Pouch.enableAllDbs = true;
    return new Pouch('topicsPouch');
});

sampleApp.factory('topicsdb', function(pouchdb, $rootScope, $q) {
    return {
        getAll: function(){
            var deferred = Q.defer();
            pouchdb.allDocs({include_docs: true}, function(err, res) {
                if (err) {
                    deferred.reject(err)
                } else {
                    deferred.resolve(res)
                }
            });
            return deferred.promise;
        },
        createListFromTree: function(tree, list){
            //var that = this;
            tree.forEach((function(value){
                list.push(value);
                if(value.children.length > 0){
                    this.createListFromTree(value.children, list);
                }

            }).bind(this));
        },
        createTreeFromList: function(list, tree, parentId){
            var that = this;
            var children = util.ArrayListOf(list, function(value){
                 return value.parentId == parentId;
            });
            //console.log("ParentID: " + parentId + " child length: " + children.length)
            children.forEach(function(value){
                tree.push(value);
                value.children = [];
                that.createTreeFromList(list, value.children, value._id);
            });
        },
        saveList: function(docs){
            var deferred = Q.defer();
            pouchdb.bulkDocs(docs, function(err, res) {
                if (err) {
                    deferred.reject(err)
                } else {
                    res.forEach(function(obj, index){
                        if(obj.ok){
                            docs.docs[index]._rev = obj.rev;
                        }
                    });
                    deferred.resolve(res)
                }

            });
            return deferred.promise;

        },
        createPromiseArray: function(topicTree, promiseArray){
            for (var i = 0; i < topicTree.length; i++) {
                promiseArray.push(this.add(topicTree[i]));
                // Do something with element i.
            }

        },
        add: function(doc) {
            var deferred = Q.defer();
            pouchdb.put(doc, function(err, res) {
                if (err) {
                    deferred.reject(err)
                } else {
                    doc._rev = res.rev;
                    //console.log("rev: " + doc._rev)
                    deferred.resolve(res)
                }

            });
            return deferred.promise;
        }
    };
});
