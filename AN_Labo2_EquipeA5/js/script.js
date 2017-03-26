/*
*	Dichotomy function which returns the closest value as f(value) = 0
*  	Arguments :
*    			a, b : the range
*    			epsilon : estimation precision
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
	if (laFonction(mnew) > asymptLimit || laFonction(mnew) < -asymptLimit){
		return "infinity";
	}
	//  c("medianne # "+ id + " : " + mnew);
	else{
		return mnew;
	}
}

/*
*	Function to explore the range, this function is used to found all the values where the function past in parameters touch zero
*
*
*/
function explore(_step, _f, _bornesAry, _resultAry){  /*explore la fonction et stocke les bornes à explorer dans un tableau; les zéros ainsi découvert sont également insérés dans _resultAry */
	for (i = -100; i < 99; i+= _step){
		if (_f(i) === 0){
			_resultAry.push(0.0);
		}
		if ((_f(i) > 0 && _f(i+_step) < 0) || (_f(i) < 0 && _f(i+_step) > 0)) {
			_bornesAry.push(new Array(i, i+1));
		}
	}
}

function explore2(_step, _f, _bornesAry, _resultAry,_funcString){

	let countLoop = -100;
	let step =0;

	let func = computefM(_funcString);
	let funcD = computedfM(_funcString);
	let funcDD = computeddfM(_funcString);

	while(countLoop<100){
		step = computeStep2(countLoop,func,funcD,funcDD);
		if(step < 0.1){
			step = 0.1;
		}

		countLoop += step;
		if(countLoop>-1&&countLoop<1){
			c(countLoop + " " + step);
		}
		if (_f(countLoop) === 0){
			_resultAry.push(0.0);
		}
		if ((_f(countLoop) > 0 && _f(countLoop+step) < 0) || (_f(countLoop) < 0 && _f(countLoop+step) > 0)) {
			_bornesAry.push(new Array(countLoop, countLoop+step));
		}
	}
}

/*
*	Apply the dichotomy on the limit, found with the explore function.
*
*	Arguments :	_resultAry (the array with the final result)
*				_limitAry (the array with the upper and the lower limit for the dichotomy function)
*				_epsilon (the precision of the dichotomy function)
*				_f (the function we want to found the 0 value)
*
*	returns :		nothing
*/
function getZeros(_resultAry, _limitAry,  _epsilon, _f){
	for (i = 0; i < _limitAry.length; i++){
		let temp = dich(_limitAry[i][0] , _limitAry[i][1], _epsilon, _f, i)
		_resultAry.push(temp);
	}
}

function printDoubleAry(_ary){ /* de la chiasse */
	for (i = 0; i < _ary.length; i ++){
		data = i + ": [" + _ary[i][0] + ";" + _ary[i][1] + "] ";
		c(data);
	}
}
function printAry(_ary){ /* de la chiasse aussi */
	for (i = 0; i < _ary.length; i ++){
		data = i + ": [" + _ary[i] + "] ";
		c(data);
		document.writeln(data);
	}
}

/*
*	First function of the laboratory
*	This function compute the value of the function past in parameters
*	Arguments : _x (value to compute)
*	Returns : Sin(_x)-_x/3
*/
function f(_x){
	return (Math.sin(_x) - (_x/3));
}
function computefM(_function){
	let h = math.parse(_function);
	return h;
}
function computefMValue(_function,_x){
	return _function.eval({x:_x});
}

function fM(_x){
	return (Math.sin(_x) - (_x/3));
}
//function with the derivate math
function computedfM(_function){
	let h = math.parse(_function);
	let x = math.parse('x');
	let dh = math.derivative(h, x);
	return dh;
}
function computedfMValue(_function,_x){
	return _function.eval({x: _x});
}

function dfM(_x){
	return (Math.cos(_x) - (1/3));
}
//function with the double derivate
function ddfM(_x){
	return -Math.sin(_x);
}

function computeddfM(_function){
	let h = math.parse(_function);
	let x = math.parse('x');
	let dh = math.derivative(h, x);
	let ddh = math.derivative(dh, x);
	return ddh;
}
function computeddfMValue(_function,_x){
	return _function.eval({x: _x});
}


/*
*	Second function of the laboratory
*	This function compute the value of the function past in parameters
*	Arguments : _x (value to compute)
*	Returns : _x / (1-_x^2)
*/
function f2(_x){
	return (_x / (1- Math.pow(_x,2)));
}

/*
*	Function to print value in the console
*/
function c(data){   /* le truc à Anthony */
	console.log(data);
}



function computeStep(_x){
	let temp = (2/(Math.pow(2,-ddfM(_x)*fM(_x))+1))*(2/(Math.pow(2,-dfM(_x)*fM(_x))+1));
	return temp;
}
function computeStep2(_x,_func,_funcD,_funcDD){
	let resFunc = computefMValue(_func,_x);
	let resFuncD = computedfMValue(_funcD,_x);
	let resFuncDD = computeddfMValue(_funcDD,_x);
	let temp = (2/(Math.pow(2,-resFuncDD*resFunc)+1))*(2/(Math.pow(2,-resFuncD*resFunc)+1));
	return temp;
}

var asymptLimit = 8000000000;
