function finalComputation(matrice, vector)
{
	if(vector.length != matrice.length)
	{
		alert("les tailles de la matrice et du vecteur ne sont pas compatibles entre elles");
	}
	else
	{	
		result = [];
		
		for(i=matrice.length-1; i>0; i--)
		{
			result[i] = vector[i]/matrice[i][i];
			
			for(j=i-1; j>=0; j--)
			{
				vector[j] -= result[i]*matrice[j][i];
			}
			document.write("x");
			document.write(i);
			document.write(" = ");
			document.writeln(result[i]);
		}
		result[0] = vector[0]/matrice[0][0];
		document.write("x");
		document.write(i);
		document.write(" = ");
		document.writeln(result[i]);
	}
}