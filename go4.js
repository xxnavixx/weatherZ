const getExpress = require('express');
const server = getExpress();
let pubMiddleware  = getExpress.static('./pub2');
const nfetch = require('node-fetch');
const dbConstructor = require('nedb');
const db = new dbConstructor('weather3.db');
db.loadDatabase();
// console.log('db',db);
server.use(pubMiddleware);
let darkSkyKey;

server.get('/weather',(req,res)=>{
	console.log('find weather request');
	let url = `https://api.darksky.net/forecast/${darkSkyKey}/${req.query.lat},${req.query.lng}`;
	console.log(url);
	let pro = nfetch(url,{'method':'get'});
	pro.then(val=>val.json())
	.then(val=>{
		console.log('sending back obj ',val);
		res.send(val);
		return val;
	});
});

server.get('/saveWeather',(req,res)=>{
	console.log('save weather request');
	db.update({'lat':req.query.lat,'lng':req.query.lng},
			{'$set':{'weather':req.query.weather,'temperature':req.query.temperature}},
			(err,ndocs,docs)=>{
		if(err){
			console.log('error while update() db',err);
			res.send({'result':'error updating data'});
			return;
		} else if(ndocs) {
			console.log('total update : ',ndocs);
			res.send({'result':'updated data'});
			return;
		} else {
			console.log('total update : ',ndocs);
			// res.send({'result':'updated '});
			db.insert(
				{'lat':req.query.lat,
				'lng':req.query.lng,
				'weather':req.query.weather,
				'temperature':req.query.temperature
				},
				(err,docs)=>{
				if(err) {
					console.log('error while insert() db ',err);
					res.send({'result':'error while insert()'});
					return;
				} else {
					console.log('inserted to db ');
					res.send({'result':'created new entry to db'});
					return;
				}
			});
			return;
		}
	})
});

server.get('/loadWeather',(req,res)=>{
	console.log('load weather request');
	// console.log(req.query);
	// db.find({'lat':req.query.lat,'lng':req.query.lng},(err,docs)=>{
	db.find({lat:{$regex:/\d*\.\d*/gi},lng:{$regex:/\d*\.\d*/gi}},(err,docs)=>{
		if(err) {
			console.log('error while find() db ',err);
			res.send({'result':'error finding data'});
			return;
		} else if(docs.length) {
			console.log('found data entry total : ',docs.length);
			res.send(docs);
			return;
		} else {
			res.send({'result':'no data found'});
			return;
		}
	});
});

init();
	
async function init() {
	darkSkyKey = await getDarkskyKey();
	console.log('ddd key ',darkSkyKey);
	server.listen(getPort(),()=>{console.log(`server running`)});	
}


function getDarkskyKey() {
	let filename = './key.env';
	let keyname = 'darkskyKey';
	let keyValue = process.env.darkskyKey;
	
	let keyPro,res,rej;
	if(keyValue) {
		console.log('process.env.darkskyKey : ',keyValue);
		keyPro = new Promise((a,b)=>{res=a;rej=b;});
		keyPro.res(keyValue);
		
	} else {
		let keyReaderConstructor = require('./keyreader.js');
		let kr = new keyReaderConstructor(filename);
		
		keyPro = kr.getKey(keyname);
	}
	return keyPro;
}

function getPort() {
	let pt = process.env.PORT;
	if(!pt) pt = 3000;
	console.log(`port is ${pt}`);
	return pt;
}