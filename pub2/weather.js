console.log('weather.js');

let weatherP = document.querySelector('p.weather');
let temperatureP = document.querySelector('p.temperature');
let myLat,myLng,myWeather,myTemperature;
let saveBtn = document.querySelector('#saveDB');
saveBtn.addEventListener('click',()=>{
	console.log('sending request to server to save in DB');
	
	let url = `/saveWeather?lat=${myLat}&lng=${myLng}&weather=${myWeather}&temperature=${myTemperature}`;
	fetch(url,{'method':'GET'}).then(val=>val.json())
	.then(val=>{console.log(val);return val});
});

go();

async function go() {
	let loc = await myLocation();
	myLat = lat = loc.coords.latitude;
	myLng = lng = loc.coords.longitude;
	console.log(`current location lat:${lat}, long${lng}`);
	// loc.coords.latitude
	let rsp = await requestWeather(lat,lng);
	console.log(rsp);
	let dark = await rsp.json();
	console.log('dark : ',dark);
	myWeather = weatherP.innerHTML = dark.currently.summary;
	myTemperature = dark.currently.temperature;
	temperatureP.innerHTML = myTemperature+'&deg;F';
}

function go2() {
	let pro = myLocation()
	.then(val=>{
		console.log(`current location lat:${val.coords.latitude}, long${val.coords.longitude}`);
		return requestWeather(val.coords.latitude,val.coords.longitude);
	})
	.then(val=>{
		console.log('dark sky data ',val);
		return val;
	})
	.then(val=>val.json())
	.then(val=>{console.log(val);return val;})
	return pro;
}

function myLocation() {
	let newpro,res,rej;
	newpro	= new Promise((a,b)=>{res=a,rej=b});
	try{
		navigator.geolocation.getCurrentPosition(val=>{
			// console.log(val.coords.latitude,val,coords.longitude);
			res(val);
		})
	} catch(e) {
		rej(e);
	}
	return newpro;
}

function requestWeather(lat,lng) {
	let url = `/weather?lat=${lat}&lng=${lng}`;
	return fetch(url,{'method':'GET'});
}

/*
let pros=[],res,rej;
function test() {
	
	pros[0] = new Promise((a,b)=>{res=a,rej=b})
	pros[1] = pros[0].then(val=>{return new Promise(
		(a,b)=>{
			setTimeout(function(){a('world')},1000)
		}
	)});
	pros[2] = pros[1].then(val=>{
		let aa = val+'!!';
		return aa});
	
}

function show() {
	for(let pro of pros) console.log(pro);
}
*/
