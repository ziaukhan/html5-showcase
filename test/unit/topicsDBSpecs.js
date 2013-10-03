/**
 * Created with JetBrains WebStorm.
 * User: Zia
 * Date: 9/23/13
 * Time: 4:55 AM
 * To change this template use File | Settings | File Templates.
 */

'use strict';

/* jasmine specs for controllers go here */

describe('topicsDB Service', function(){

    beforeEach(module('sampleApp'));

    it('should return a Pouch instance', inject(function(pouchdb) {
        expect(pouchdb instanceof Pouch).toBeTruthy();
    }));

    it('db has put method', inject(function(pouchdb) {
        expect(pouchdb.put).toBeDefined();
    }));

    it('should set "enableAllDbs" to true', inject(function(pouchdb) {
        expect(Pouch.enableAllDbs).toBeTruthy();
    }));

    it('should create a db with name "topicsPouch"', inject(function(pouchdb) {
        var result;

        pouchdb.info(function(err, res) {
            result = res;
        });

        waitsFor(function() {
            return result;
        });

        runs(function() {
            expect(result.db_name).toEqual('_pouch_topicsPouch');
        });

    }));

    it('should allow saving new objects via a promise', inject(function(topicsdb) {
        var result;

        topicsdb.saveObject(
            {
                "topicName" : "Web Socket",
                "dataContainer": true,
                "_id" : new Date().toISOString(),
                "parentId": 0,  "children" : []
            }).then(function(res) {

            result = res;

        });

        waitsFor(function() {
            return result;
        });

        runs(function() {
            expect(result.ok).toBeTruthy();
        });

    }));

    it('should allow saving a topic list', inject(function(topicsdb) {
        var result;
        var _id;

        var topicList =  [
            {
                "topicName" : "SVG",
                "dataContainer": true,
                "_id" :(function(){ _id =util.generateElementID(); return _id}()),
                "parentId":0,
                parent:"true",
                "children" : [
                    {
                        "parentId":_id,
                        "_id" :(function(){ _id = util.generateElementID(); return _id}()),
                        "topicName" : "D3.js",
                        "dataContainer": true,
                        "children" : [] }
                ] },
            {
                "topicName" : "CSS",
                "dataContainer": true,
                "_id" :(function(){ _id =util.generateElementID(); return _id}()),
                "parentId":0,
                parent:"true",
                "children" : [
                    {
                        "parentId":_id,
                        "_id" :(function(){ _id = util.generateElementID(); return _id}()),
                        "topicName" : "Animations",
                        "dataContainer": true,
                        "children" : [] }
                ] }


        ];


        topicsdb.saveList(topicList, function(res) {

            result = res;

        }, function(err){

            result = err;

        });

        waitsFor(function() {
            return result;
        });

        runs(function() {
            expect(result.length).toBe(2);

        });

    }));

    it('should allow getting all topics in the db', inject(function(topicsdb) {
        var result;
        topicsdb.getAll().then(function(res) {
            result = res;
        });

        waitsFor(function() {
            return result;
        });

        runs(function() {
            //console.log(JSON.stringify(result));
            expect(result.total_rows).toBeGreaterThan(1);

        });

    }));


});
