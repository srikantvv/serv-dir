var express = require('express');
var router = express.Router();
var ObjectId = require('mongodb').ObjectID;
var assert = require('assert');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
/* POST to Add road Service */
router.post('/addroad', function(req, res) {
	var db = req.db;
	var startLat = req.body.start_lat;
	var startLng = req.body.start_lng;
	var endLat = req.body.end_lat;
	var endLng = req.body.end_lng;
	req.body._id = ObjectId(req.body._id); 
	var collection = db.get('roadlist');

	collection.update(
		{
			"$or": [
				{"start_lat": startLat, "start_lng": startLng,
				"end_lat": endLat, "end_lng": endLng },
				{"start_lat": endLat, "start_lng": endLng,
				"end_lat": startLat, "end_lng": startLng },
			]
		}, 
		{
			"$setOnInsert": req.body
		},
		{
			"upsert": true
		}, function(err, result){
			res.send(
			    (err === null) ? { msg: '' } : { msg: err }
			);
	});
});

/* POST to Add Step Service */
router.post('/addStep', function(req, res) {

    // Set our internal DB variable
    var db = req.db;

    var startLat = req.body.start_lat;
    var startLng = req.body.start_lng;
    var endLat = req.body.end_lat;
    var endLng = req.body.end_lng;

    // Set our collection
    var collection = db.get('steplist');


    // Submit to the DB
    collection.update(
	{
		"$or": [
			{"start_lat": startLat, "start_lng": startLng,
			"end_lat": endLat, "end_lng": endLng },
			{"start_lat": endLat, "start_lng": endLng,
			"end_lat": startLat, "end_lng": startLng },
		]
	}, 
	{
		"$setOnInsert": req.body
	},
	{
		"upsert": true
	}, function(err, result){
        res.send(
            (err === null) ? { msg: '' } : { msg: err }
        );
    });
});

router.post('/adddefect', function(req, res) {

    // Set our internal DB variable
    var db = req.db;

    // Set our collection
    var collection = db.get('dlist');


    // Submit to the DB
    collection.update(
        {
		"$or": [
                        {"aroad_id": req.body.aroad_id, "broad_id": req.body.broad_id},
                        {"broad_id": req.body.aroad_id, "aroad_id": req.body.broad_id},
                ]

        },
        {
                "$setOnInsert": req.body
        },
        {
                "upsert": true
        }, function(err, result){
        res.send(
            (err === null) ? { msg: '' } : { msg: err }
        );
    });
});
router.post('/addrel', function(req, res) {

    // Set our internal DB variable
    var db = req.db;

    var startLat = req.body.start_lat;
    var startLng = req.body.start_lng;
    var endLat = req.body.end_lat;
    var endLng = req.body.end_lng;

    // Set our collection
    var collection = db.get('rellist');


    // Submit to the DB
    collection.update(
	{
		"$or": [
			{"start_lat": startLat, "start_lng": startLng,
			"end_lat": endLat, "end_lng": endLng },
			{"start_lat": endLat, "start_lng": endLng,
			"end_lat": startLat, "end_lng": startLng },
		]
	}, 
	{
		"$setOnInsert": req.body
	},
	{
		"upsert": true
	}, function(err, result){
        res.send(
            (err === null) ? { msg: '' } : { msg: err }
        );
    });
});

router.get('/steplist', function(req, res) {
    var db = req.db;
    var collection = db.get('steplist');
    collection.find({
		"start_lat": {$lte: "10"}
	},{},function(e,docs){
        res.json(docs);
    });
});

router.get('/steplist2', function(req, res) {
    var db = req.db;
    var collection = db.get('steplist');
    collection.find({
		"headsign" : "2"	
	},{},function(e,docs){
        res.json(docs);
    });
});

router.get('/steplist3', function(req, res) {
    var db = req.db;
    var collection = db.get('steplist');
    collection.find({
		"headsign" : "3"	
	},{},function(e,docs){
        res.json(docs);
    });
});

router.get('/steplist4', function(req, res) {
    var db = req.db;
    var collection = db.get('steplist');
    collection.find({
		"headsign" : "4"	
	},{},function(e,docs){
        res.json(docs);
    });
});

router.get('/roadlist', function(req, res) {
    var db = req.db;
    var collection = db.get('roadlist');
    collection.find(
	{
		"start_lat": {$lte: "16.5"}
	},{},function(e,docs){
        res.json(docs);
    });
});
router.get('/rellist', function(req, res) {
    var db = req.db;
    var collection = db.get('rellist');
    collection.find({},{},function(e,docs){
        res.json(docs);
    });
});

router.get('/highlist', function(req, res) {
    var db = req.db;
    var collection = db.get('highlist');
    collection.find({},{},function(e,docs){
        res.json(docs);
    });
});


router.post('/stepentry', function(req, res) {
    var db = req.db;
    var collection = db.get('steplist');
    collection.find(
	{
		"$or": [
			{
			 "start_lat": {$gte:req.body.start_lat_min, $lte:req.body.start_lat_max},
			 "start_lng": {$gte:req.body.start_lng_min, $lte:req.body.start_lng_max},
			 "end_lat": {$gte:req.body.end_lat_min, $lte:req.body.end_lat_max},
			 "end_lng": {$gte:req.body.end_lng_min, $lte:req.body.end_lng_max},
			 mid_path: {$in :[req.body.mid_path]}
			},
			{
			 "start_lat": {$gte:req.body.end_lat_min, $lte:req.body.end_lat_max},
			 "start_lng": {$gte:req.body.end_lng_min, $lte:req.body.end_lng_max},
			 "end_lat": {$gte:req.body.start_lat_min, $lte:req.body.start_lat_max},
			 "end_lng": {$gte:req.body.start_lng_min, $lte:req.body.start_lng_max},
			 mid_path: {$in :[req.body.mid_path]}
			},
		]

	},
	{},function(e,docs){
        res.json(docs);
    });
});

router.post('/findroad', function(req, res) {
    var db = req.db;
    var collection = db.get('roadlist');
    var objectId = ObjectId(req.body._id);
    collection.find(
	{
		"_id": objectId
	},
	{},function(e,docs){
	console.log(docs);
        res.json(docs);
    });
});

router.delete('/deleterel', function(req, res) {
	var db = req.db;
	var collection = db.get('rellist');
    	var objectId = ObjectId(req.body._id);
	collection.remove(
	{
		"_id": objectId
	},
	{},function(e,docs){
	res.json(docs);
	});
});
router.delete('/deleteroad', function(req, res) {
	var db = req.db;
	var collection = db.get('roadlist');
    	var objectId = ObjectId(req.body._id);
	collection.remove(
	{
		"_id": objectId
	},
	{},function(e,docs){
	res.json(docs);
	});
});

router.post('/samestep', function(req, res) {
    var db = req.db;
    var collection = db.get('steplist');
    collection.find(
	{
		"road_id": req.body.road_id
	},
	{},function(e,docs){
	console.log(e);
        res.json(docs);
    });
});

router.post('/changestep', function(req, res) {
    var db = req.db;
    var collection = db.get('steplist');
    collection.findAndModify(
	{
		"road_id": req.body.road_id
	},
	{
		$set:{"road_id":req.body.new_road_id, "is_rel": req.body.is_rel}
	},function(e,docs){
	console.log(e);
        res.json(docs);
    });
});


router.post('/getroad', function(req, res) {
    var db = req.db;
    var collection = db.get('steplist');
    collection.find(
	{
		"enc_path": req.body.enc_path
	},
	{},function(e,docs){
	console.log(e);
        res.json(docs);
    });
});
router.get('/stepnode', function(req, res) {
    var db = req.db;
    var collection = db.get('steplist');
    collection.find(
	{
			"start_lat": '/req.body.end_lat/'
		
	},{},function(e,docs){
        res.json(docs);
    });
});

module.exports = router;
