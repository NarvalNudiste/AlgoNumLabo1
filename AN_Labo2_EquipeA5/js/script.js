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
		return "Asymptote verticale en x = " + mnew;
	}
	else{
		return "x = " + mnew;
	}
}

/*
*	Function to explore the range, this function is used to found all the values where the function past in parameters touch zero.
*	This function use a constant step and we used this function for a disctontinuous function.
*
*	Arguments :	_step (The size of the step)
*				_f (the mathematical function to explore)
*				_bornesAry (the array where the bornes will be store)
*				_resultAry (the array where the mathematical function touch zero)
*
*	Returns :		nothing
*/
function explore(_step, _f, _bornesAry, _resultAry){
	for (i = -100; i < 99; i+= _step){
		if (_f(i) === 0.0){
			_resultAry.push("x = " +0.0);
		}
		if ((_f(i) > 0 && _f(i+_step) < 0) || (_f(i) < 0 && _f(i+_step) > 0)) {
			_bornesAry.push(new Array(i, i+1));
		}
	}
}

/*
*	Function to explore the range, this function is used to found all the values where the function past in parameters touch zero.
*	This function use a variant step, this step is compute with our formula, see the computeStep() function.
*
*	Arguments :	_f (the mathematical function to explore)
*				_bornesAry (the array where the bornes will be store)
*				_resultAry (the array where the mathematical function touch zero)
*				_funcString (the mathematical function on string form to compute the derivate)
*
*	Returns :		nothing
*/
function explore2( _f, _bornesAry, _resultAry,_funcString){

	let countLoop = -100;
	let step =0;

	let func = computefM(_funcString);
	let funcD = computedfM(_funcString);
	let funcDD = computeddfM(_funcString);

	while(countLoop<100){
		step = computeStep(countLoop,func,funcD,funcDD);
		if(step < 0.1){
			step = 0.1;
		}
		countLoop += step;
		if(countLoop>-1&&countLoop<1){
			c(countLoop + " " + step);
		}
		if (_f(countLoop) === 0){
			_resultAry.push("x = " +0.0);
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

/*
*	Print the double array past in paramters
*/
function printDoubleAry(_ary){
	for (i = 0; i < _ary.length; i ++){
		data = i + ": [" + _ary[i][0] + ";" + _ary[i][1] + "] ";
		c(data);
	}
}
/*
*	Print the array past in paramters
*/
function printAry(_ary){
	for (i = 0; i < _ary.length; i ++){
		data = i + ": [" + _ary[i] + "] ";
		c(data);
		document.writeln(data);
	}
}



function computefMValue(_function,_x){
	return _function.eval({x:_x});
}

function computefM(_function){
	let h = math.parse(_function);
	return h;
}
/*
*	Compute the derivate of the function past in paramters
*/
function computedfM(_function){
	let h = math.parse(_function);
	let x = math.parse('x');
	let dh = math.derivative(h, x);
	return dh;
}

/*
*	Comptute the double derivate of the function past in paramters
*/
function computeddfM(_function){
	let h = math.parse(_function);
	let x = math.parse('x');
	let dh = math.derivative(h, x);
	let ddh = math.derivative(dh, x);
	return ddh;
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


/*
*	This function is used to compute the step for our explore2 function.
*	We are using our formula to compute this step and in this formula we need the function, the derivate of the function and the double derivate.
*/
function computeStep(_x,_func,_funcD,_funcDD){
	let resFunc = computefMValue(_func,_x);
	let resFuncD = computefMValue(_funcD,_x);
	let resFuncDD = computefMValue(_funcDD,_x);
	let temp = (2/(Math.pow(2,-resFuncDD*resFunc)+1))*(2/(Math.pow(2,-resFuncD*resFunc)+1));
	return temp;
}

var asymptLimit = 8000000000;
