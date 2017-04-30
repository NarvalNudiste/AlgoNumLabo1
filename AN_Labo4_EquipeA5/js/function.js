/*
 * Function that uses Taylor serie to approximate a cosinus function.
 * We exploit the fact that a cosine can be represnted via the serie (1 - x^2/2! + x^4/4! - x^6/6! + x^8/8! ..)
 * The number of steps value can be tweaked, but values in the 60-90 range seems to work pretty well
 * Args : the base value
 * Returns : the cosine estimation
 */
function approximateCos(_x){
let cos = 0;
let n = 0;
for (let i = 0; i < 80; i++){
	let temp = Math.pow(_x,n)/facto(n) - (Math.pow(_x,n+2)/facto(n+2));
	if (isNaN(temp))
		break;
	cos += temp;
	n+=4;
}
return cos;
}

/*
 * Simple recursive function which returns the factorial sum of a number
 * Args : the base value
 * Returns : the sum
 */
function facto(_x){
	if (_x == 1 || _x <= 0)
		return 1;
	let result = facto(_x-1) * _x;
	return result;
}

/* As seen in lecture ¯\_(ツ)_/¯
 * Args : the base function
 * Returns : the approximated derivative function
 */
function derivate(_f,_h)
{
  var nêwFunc = function(_x)
  {
    return (8.0*(_f(_x+(_h/2.0))-_f(_x-(_h/2.0))) - _f(_x+_h) + _f(_x-_h))/(6*_h);
  }
  return nêwFunc;
}

function plotFunction()
{
	var h = document.getElementById("h").value;
    h = parseFloat(h);

	var min = 0;
	var max = 40;


	var CosFirstDerivate = derivate(approximateCos, h);
	var CosSecondDerivate = derivate(CosFirstDerivate, h);


	var plotCos = plotCalculation(plotCos, approximateCos, "Cos(x)", min, max);

	var plotCosFirstDerivate = plotCalculation(plotCosFirstDerivate, CosFirstDerivate, "Cos(x)'", min, max);
	var plotCosSecondDerivate = plotCalculation(plotCosSecondDerivate, CosSecondDerivate , "Cos(x)''", min, max);

	var data = [plotCos, plotCosFirstDerivate, plotCosSecondDerivate];

	var range = {
      xaxis: {
      range: [min,max]

      },
      yaxis: {
      range: [-1.5,1.5]

      },
      hovermode: 'closest'
    };

	Plotly.newPlot("FunctionPlot", data, range);
}

  function plotCalculation(plot, functionToPlot, name, min, max)
  {
    plot = {};
    plot.type = 'scatter';
    plot.x = [];
    plot.y = [];
    plot.name = name;

    var x = min;

    while (x < max)
    {
      plot.x.push(x);
      plot.y.push(functionToPlot(x));
      x+=0.1;
    }

    return plot;
  }
