//pas top mais dich
function dich(a,b,epsilon, laFonction, id){
  let fa = laFonction(a);
  let mnew = a+b;
  let mold = 2*mnew;
  let fm;
  while (Math.abs(mnew - mold) > epsilon){
    mold = mnew;
    mnew = (a+b)/2;
    fm = laFonction(mnew);
    if (fm*fa <= 0){
      b = mnew;
    }
    else{
      a = mnew;
      fa = fm;
    }
  }
      c("medianne # "+ id + " : " + mnew);
}

function f(_x){
return (Math.sin(_x) - (_x/3));
}

function f2(_x){
return (_x / (1- Math.pow(_x,2)));
}
function c(data){
  console.log(data);
}


//display

/*var ctx = document.getElementById("jolicanvas");  //get the canvas
var myChart = new Chart(ctx, {
    type: 'line',
    data: getPlotPoints(f),
    options: options
});
*/
function getPlotPoints(_f){ //plots the function
  let i = -100;
  var ary = new Array(200);
  for (i; i < 100; i++){
    ary[i+100] = _f(i);
  }
  return ary;
}
