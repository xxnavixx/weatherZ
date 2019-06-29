const fs = require('fs');
// console.log(fs.readFileSync);
let dd = fs.readFileSync('./may.txt',{'encoding':'utf-8','flag':'r'});
// console.log('data ',dd);
// console.log('typeof data ',typeof dd);
// console.log('lenght of data ',dd.length);
// console.log('==================');
let count=0;
// for(let ch of dd) {
	
	// console.log(count++,' : ',ch);
// }
// console.log('==================');
let ob = {};

regex1 = /.+?(?==)/gi;
regex2 = /(?<==).*(?=\r\n)/gi;
r1 = dd.match(regex1);
console.log(r1);
r2= dd.match(regex2);
console.log(r2);

for(let i=0;i<r1.length;i++) {
	ob[r1[i]] = r2[i];
}

console.log(ob);

module.exports = ob;