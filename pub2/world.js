console.log('world.js');


let mainmap,tile;
go();
function go() {
	// myLocation().then(val=>{
		// console.log(val);
		// initLeaflet(val.coords.latitude,val.coords.longitude);
		// return val;
	// });
	requestDB().then(val=>{
		console.log('ooo ',val);
		initLeaflet(50,50,2);
		return val;
	}).then(val=>{
		return val.json()
	}).then(vals=>{
		console.log('ooooo ',vals);
		for(let ob of vals){
			if(ob.lat && ob.lng && ob.weather && ob.temperature)
				markMap(ob.lat,ob.lng,ob.weather,ob.temperature);
			console.log(ob);
		}
	});

}

function initLeaflet(lat,lng,zoom) {
	let pos = L.latLng(lat,lng);
	mainmap = L.map(document.querySelector('#mainmap')).setView(pos,zoom);;
	tile = L.tileLayer(
		'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
		{ attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' }
	).addTo(mainmap);
}

function markMap(lat,lng,w,t) {
	let pos = L.latLng(lat,lng);
	let marker = L.marker(pos);
	marker.addTo(mainmap);
	marker.bindPopup(`weather is ${w} temperature is ${t}`)
    .openPopup()
	
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

function requestDB() {
	let url=`/loadWeather`;
	let pro = fetch(url,{'method':'GET'});
	return pro;
}