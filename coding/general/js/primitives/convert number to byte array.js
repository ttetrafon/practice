bytes=new Array(3);
x=1092381;
bytes[3]=x & (255);
x=x>>8
bytes[2]=x & (255);
x=x>>8
bytes[1]=x & (255);
x=x>>8
bytes[0]=x & (255);

console.log(bytes);
