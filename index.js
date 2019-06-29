const createApplication = require('./node_modules/express');

const server = createApplication();
const nfetch = require('./node_modules/node-fetch');
const dbCon = require('nedb');
const db = new dbCon('weather3.db');
require('dotenv').config();

db.loadDatabase();
// console.log(server);
let pubMiddle = createApplication.static('./pub2');
// let jsonMiddle = createApplication.json({'limit':'2mb'});
console.log('env ',process.env);
server.use(pubMiddle);
// server.use(jsonMiddle);

server.get('/',(req,res)=>{
	console.log('hello world');
	console.log('req ',req);
	console.log('res ',res);
	
	res.send('hi');
});

server.get('/weather',(req,res)=>{
	console.log('weather request');
	console.log(req.query);
	// console.log(req.params);
	console.log(1);
	let pro = requestDarksky(req.query.lat,req.query.lng);
	console.log(2);
	pro.then(val=>{
		console.log('dark sky response : ');
		console.log('=================');
		console.log(val);
		
		console.log('=================');
		return val.json();
		
	}).then(val=>{
		console.log('response jsoned: ');
		console.log('=================');
		console.log(val);
		
		console.log('=================');
		res.send(val);
		return val;
	}).catch(e=>{
		// console.error(e);
		res.send('error connecting darksky');
	})
	console.log(3);
})

server.get('/saveWeather',(req,res)=>{
	console.log('save weather request ');
	console.log(req.query);
	
	let que = req.query;
	
	db.update({'lat':que.lat,'lng':que.lng},
			{$set:{'temperature':que.temperature,'weather':que.weather}},
			(err,numAffected,updatedDocs,upsert)=>{
				console.log('upsert? ' ,upsert);
				if(err) {
					console.log(err);
					res.send({'result':'error updating db'});
					return;
				}
				
				console.log(`updated total : ${numAffected}`);
				if(numAffected) {
					res.send({'result':'updated db'});
				} else {
					db.insert(
						{'lat':que.lat,'lng':que.lng,'temperature':que.temperature,'weather':que.weather},
						(err,docs)=>{
							if(err) {
								console.log(err);
								res.send({'result':'error while insert()'});
								return;
							} else{
								res.send({'result':'inserted new entry in db'});
								return;
							}
					});
					
				}
			}
		)
});

server.get('/loadWeather',(req,res)=>{
	console.log('load weather request ');
	console.log(req.query);
	db.find({},(err,docs)=>{
		if(err) {
			console.log(err);
			res.send({result:'failed to find() db'})
			return;
		} 
		if(docs) {
			res.send(docs);
			return;
		} else {
			res.send([{result:'no data found'}]);
			return;
		}
	})
});

server.get('/test',(req,res)=>{
	console.log('weather request');
	console.log(req.query);
	// console.log(req.params);
	
});

server.get('/123',(req,res)=>{
	console.log('request 123');
	// console.log('req ',req);
	// console.log('res ',res);
	console.log('zzzzzzzzzzzzzzz');
	res.send({name:'zzz',name2:'cccc'});
});

server.get('/z',(req,res)=>{
	console.log('request 123');
	// console.log('req ',req);
	// console.log('res ',res);
	console.log('zzzzzzzzzzzzzzz');
	res.send('<!doctype html><html><head></head><body><p>i am Z</p></body></html>');
});

// server.get('/pub2/weather.html',(a,b)=>{
	
// })

function requestDarksky(lat,lng,units='us') {
	let url = `https://api.darksky.net/forecast/${process.env.darkskykey}/${lat},${lng}?units=${units}`;
	let pro = nfetch(url,{'method':'GET'});
	return pro;
}

if(process.env.PORT) {
	console.log(`using port : ${process.env.PORT}`);
	server.listen(process.env.PORT);
}
else {
	console.log('could not find PORT from enviroment variables using default port:3000');
	server.listen(3000);
}
