console.log('test 0629');


function test1() {
	console.log('test1 arguments',arguments);
}

let test2 = ()=>{
	console.log('test2 arguments',arguments);
}

test1('a','b','c');

test2('d','e','f');