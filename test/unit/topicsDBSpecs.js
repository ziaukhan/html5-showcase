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

        topicsdb.add({ "topicName" : "Web Socket", "dataContainer": true, "_id" : new Date().toISOString(), "parentId": 0,  "children" : [] }).then(function(res) {
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
        var dateId1 = new Date();
        var dateId2 = new Date(dateId1.getTime()+1);

        var topicList = {docs: [
            { "topicName" : "Web Socket", "dataContainer": true, "_id" : dateId1.toISOString(), "parentId": 0,  "children" : [

            ] },
            { "topicName" : "Web Socket", "dataContainer": true, "_id" : dateId2.toISOString(), "parentId": 0,  "children" : [] }
        ]};
        topicsdb.saveList(topicList).then(function(res) {
            result = res;
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

    it('should create a list from a tree', inject(function(topicsdb) {

        var dateId1 = new Date();
        var dateId2 = new Date(dateId1.getTime()+1);
        var dateId3 = new Date(dateId2.getTime()+1);

        var topicTree = [
            { "topicName" : "SVG", "dataContainer": true, "_id" : dateId1.toISOString(), "parentId": "0",   "children" : [
                { "topicName" : "D3.js", "dataContainer": true, "_id" : new Date(dateId2.getTime()+3).toISOString(), "parentId": dateId1.toISOString(),  "children" : [] },
            ] },
            { "topicName" : "WebGL", "dataContainer": true, "_id" : dateId2.toISOString(), "parentId": "0",  "children" : [
                { "topicName" : "Three.js", "dataContainer": true, "_id" : new Date(dateId2.getTime()+6).toISOString(), "parentId": dateId2.toISOString(),  "children" : [] },
            ] },
            { "topicName" : "Web Socket", "dataContainer": true, "_id" : dateId3.toISOString(), "parentId": "0",  "children" : [] },
        ];

        var list = [];

        topicsdb.createListFromTree(topicTree, list);

        expect(list.length).toBe(5);

    }));

    it('should create a tree from a list', inject(function(topicsdb) {

        var dateId1 = new Date();
        var dateId2 = new Date(dateId1.getTime()+1);
        var dateId3 = new Date(dateId2.getTime()+1);

        var list = [
            { "topicName" : "SVG", "dataContainer": true, "_id" : dateId1.toISOString(), "parentId": "0",   "children" : [] },
            { "topicName" : "D3.js", "dataContainer": true, "_id" : new Date(dateId2.getTime()+3).toISOString(), "parentId": dateId1.toISOString(),  "children" : [] },
            { "topicName" : "WebGL", "dataContainer": true, "_id" : dateId2.toISOString(), "parentId": "0",  "children" : [] },
            { "topicName" : "Three.js", "dataContainer": true, "_id" : new Date(dateId2.getTime()+6).toISOString(), "parentId": dateId2.toISOString(),  "children" : [] },
            { "topicName" : "Web Socket", "dataContainer": true, "_id" : dateId3.toISOString(), "parentId": "0",  "children" : [] },
        ];

        var tree = [];
        topicsdb.createTreeFromList(list, tree, "0");

        expect(tree.length).toBe(3);
        expect(tree[0].children.length).toBe(1);

    }));



});
