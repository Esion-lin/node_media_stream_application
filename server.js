console.log('filename is' +  __filename );
console.log('dirname is' + __dirname );

function printHello(){
   console.log( "Hello, World!");
}
// 两秒后执行以上函数
setTimeout(printHello, 2000);

