
/*
	Ajoute tes fonctions ici !!!
*/


function plotFunction()
{
	var h = document.getElementById("h").value;
    h = parseFloat(h);
	
	var min = 0;
	var max = 40;

	//Ajoute tes fonctions dans CosFirstDerivate et CosSecondDerivate
	var CosFirstDerivate;
	var CosSecondDerivate;
	
	//Remplace "TA_FONCTION_COS" par ta fonction Cosinus
	var plotCos = plotCalculation(plotCos, "TA_FONCTION_COS", "Cos(x)", min, max);
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
