/* Dichotomy function which returns the closest value as f(value) = 0
  Arguments :
    a, b : the range
    epsilon : estimation precision
  */
function dich(a,b,epsilon, laFonction, id){
  let fa = laFonction(a);
  let mnew = a+b;
  let mold = 2*mnew;
  let fm;
  while (Math.abs(mnew - mold) > epsilon){
    //  c(Math.abs(mnew-mold));
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
    //  c("medianne # "+ id + " : " + mnew);
      return mnew;
}

function explore(_step, _f, _bornesAry, _resultAry){  /*explore la fonction et stocke les bornes à explorer dans un tableau; les zéros ainsi découvert sont également insérés dans _resultAry */
    for (i = -100; i < 99; i+= _step){
      if (_f(i) === 0){
        _resultAry.push(0.0);
      }
      if ((_f(i) > 0 && _f(i+1) < 0) || (_f(i) < 0 && _f(i+1) > 0)) {
        _bornesAry.push(new Array(i, i+1));
      }
    }
}

function getZeros(_resultAry, _bornesAry,  _epsilon, _f){ /* applique la dichotomie sur les bornes découvertes avec la fonction explore */
  for (i = 0; i < _bornesAry.length; i++){
    let temp = dich(_bornesAry[i][0] , _bornesAry[i][1], _epsilon, _f, i)
    _resultAry.push(temp);
  }
}

function printDoubleAry(_ary){ /* de la chiasse */
  for (i = 0; i < _ary.length; i ++){
    c(i + ": [" + _ary[i][0] + ";" + _ary[i][1] + "]");
  }
}
function printAry(_ary){ /* de la chiasse aussi */
  for (i = 0; i < _ary.length; i ++){
    c(i + ": [" + _ary[i] + "]");
  }
}

function f(_x){ /* pls */
return (Math.sin(_x) - (_x/3));
}

function f2(_x){
return (_x / (1- Math.pow(_x,2)));
}
function c(data){   /* le truc à Anthony */
  console.log(data);
}

function getPlotPoints(_f){ //plots the function
  let i = -100;
  var ary = new Array(200);
  for (i; i < 100; i++){
    ary[i+100] = _f(i);
  }
  return ary;
}
