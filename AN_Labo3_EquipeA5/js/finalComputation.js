function finalComputation(matrice, vector)
{
	//result = document.getElementById('#result');
	var resultString = "<h2>Résulats :</h2> </br>";
	if(vector.length != matrice.length)
	{
		alert("les tailles de la matrice et du vecteur ne sont pas compatibles entre elles");
	}
	else
	{
		result = [];
		resultString += "<ul>";
		for(i=matrice.length-1; i>0; i--)
		{
			result[i] = vector[i]/matrice[i][i];

			for(j=i-1; j>=0; j--)
			{
				vector[j] -= result[i]*matrice[j][i];
			}
			resultString += "<li>"
			resultString += "x";
			resultString += i;
			resultString += " : ";
			resultString += result[i].toFixed(2);
			resultString += "</li>";
		}
		result[0] = vector[0]/matrice[0][0];
		resultString += "<li>"
		resultString += "x";
		resultString += i;
		resultString += " : ";
		resultString += result[i].toFixed(2);
		resultString += "</li>";
	}
	resultString += "</ul>";
	resultArea.innerHTML = resultString;
}
