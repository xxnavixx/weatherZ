console.log('keyReader running');
// console.log(global.fs?'global.fs exist in keyReader.js':'global.fs not exist in keyReader.js');
// global.mymyname = 'xyz';
const fs = require('fs');

function KeyReader (filename,showLog=false) {
	this._filename = filename;
	this._showLog=showLog;
}

KeyReader.prototype.getKey = function(keyname) {
	let pro,res,rej;
	let keyname2 = keyname + '=';
	pro = new Promise((a,b)=>{res=a;rej=b});
	
	fs.readFile(this._filename,{'encoding':'utf-8'},(err,data)=>{
		if(err) {
			console.log('error reading file ',this._filename)
			rej(err);
		} else {
			console.log('resolving');
			res(data);
		}
	});
	let pro2 = pro.then(val=>{
		let target = val;
		let keyIndex = target.indexOf(keyname2);
		let startIndex;
		target = target.substring(keyIndex);
		let endIndex = target.indexOf('\r');
		if(endIndex<0) {
			if(this._showLog){
				console.log(`index of ${keyname}: `);
				console.log(keyIndex);
				console.log('endIndex is end of file');
			}
			return target.substring(keyname2.length);
		} else {
			if(this._showLog) {
				console.log(`index of ${keyname}: `);
				console.log(keyIndex);
				console.log('endIndex ',endIndex);
			}
			return target.substring(keyname2.length,endIndex);
		}
		
	}).then(val=>{
		// if(this._showLog) {
			console.log('keyreader result ')
			console.log('keyreader key name : ',keyname);
			console.log('keyreader key value : ',val);
		// }
		return val;
	}).catch(val=>{console.log('error ',val)});
	return pro2;
}

module.exports = KeyReader;
