class jsonParser{
	constructor(){
	this.text = "";
	this.matrixSize = 0;

	}

	readJsonFile(path){
		var reader = new FileReader();
		reader.onload = function(e) {
		var input = reader.result;
	}
	reader.readAsText(path, encoding);
	}

	setDefault(){
		this.text = '{"n": [3], "A": [3.0,4.0,-1.0,1.0,-1.0,2.0,2.0,3.0,4.0],"B": [23.0,3.0,7.0]}';
	}
	/*Parses the json matrix actually selected
		returns : a double array containing the matrix */

	getMatrix(){
		let temp = JSON.parse(this.text);
		this.matrixSize = temp.n;
		let ary = new Array();
		let i = 0;
		let count = 0;
		for (i; i < temp.n; i++){
			ary[i] = new Array();
			let j = 0;
			for (j; j < temp.n; j++){
				ary[i].push(temp.A[count]);
				count++;
			}

		}
		return ary;
	}
	getMatrixSize(){
		return this.matrixSize;
	}
	getMatrixResultColumn(){
		let ary = new Array();
		let temp = JSON.parse(this.text);
		let i = 0;
		for (i; i < temp.n; i++){
			ary[i] = temp.B[i];
		}
		return ary;
	}
}

function printMatrix(_a){
	let oi = 0
	let text = "";
	for (oi; oi < _a.length; oi++){
		let oj = 0;
		text += '|';
		for (oj ; oj < _a[oi].length; oj++){
			if (oj == 0){
				text+= ' ';
			}
			text+= _a[oi][oj].toString();
			if (_a[oi][oj] < 0){
				text+=' ';
			}
			else{
				text+= '  ';
			}

		}
		text+= ' |';
		console.log(text);
		text = '';
		let l = 0;
		text += ' ';
		for (l = 0; l < _a.length; l++){
			text+= '----';
		}
		console.log(text);
		text = "";
	}
}

function printResults(_a){
	let oi = 0;
	for (oi ; oi < _a.length ; oi++){
		console.log(_a[oi]);
	}
}

function testParse(){
	console.log(document.getElementById("fileField").innerHTML);
	alert("test");
}

json = new jsonParser();

var A;
var B;

var text;

window.onload = function() {
		var fileInput = document.getElementById('fileInput');
		var fileDisplayArea = document.getElementById('fileDisplayArea');

		fileInput.addEventListener('change', function(e) {
			var file = fileInput.files[0];
			var textType = /text.*/;

			if (!file.type.match(textType)) {
				var reader = new FileReader();

				reader.onload = function(e) {
					//fileDisplayArea.innerText = reader.result;

					json.text = reader.result;
					A = json.getMatrix();
					B = json.getMatrixResultColumn();
					if(A.length ===0 || B.length ===0){
						text = "Matrice ou vecteur vide";
					}else{
						text ="";
					}
				}

				reader.readAsText(file);
			} else {
				fileDisplayArea.innerText = "File not supported!"
			}
		});
}
/*
*	Function to compute the matrix and show the results in the html dom
*	Take in args the global matrix A,B and the global variable text
*
*	Arguments :	nothing
*
*	Returns :		nothing
*/
function computeMatrix(){
	var t0 = performance.now();
	if(!text){

		let temp = setOrderMatrix(A,B,A.length);
		if(temp != false)
		{
			eliminate(A,B,A.length);
			text = finalComputation(A, B);
		}
		else
		{
			text = "Pas de solution";
		}
	}

	var t1 = performance.now();
	resultArea.innerHTML = text;
	chronoZone.innerHTML = "Computation took " + (t1 - t0) + " milliseconds.";
}

/*
*	Funtion to swap 2 lines of the matrix past in arguments.
*
*	Arguments :	matrix (the matrix to swap)
*				i1 (the first line to swap)
*				i2 (the second line to swap)
*
*	Returns :		the new matrix with the line swap
*/
function swap(matrix, i1, i2)
{
	let tmp = matrix[i1];
	matrix[i1] = matrix[i2];
	matrix[i2] = tmp;

	return matrix;
}

/*
*	function to change the line if there is a 0 on the diagonal
*
*	Arguments :	matrixA,matrixB (the two matrix for the triangularisation)
*				n (the size of the matrix)
*
*	Returns :		nothing if there no problems and false if there is a row with 0
*/
function setOrderMatrix(matrixA, matrixB, n){
	let swapLine;
	for(let i = 0; i < n; i++){
		if(matrixA[i][i] === 0){
			swapLine = search(matrixA, i, n);
			if(swapLine != false){
				swap(matrixA, i, swapLine);
				swap(matrixB, i, swapLine);
			}else{
				console.log("pas de réponse");
				return false;
			}
		}
	}
}

/*
*	This function will search if there is a another line to swap the value if there is a 0
*
*	Arguments :	matrix (the matrix where to search)
*				i (the line where to begin the search)
*				n (the size of the matrix)
*
*	Returns :		the number of the line to swap if there is a valid possibility in the other way return false
*/
function search(matrix, i, n){
	let j;
	for(j = i; j < n; j++){
		if(matrix[j][i]!=0){
			return j;
		}
	}
	return false;
}

/*
*	This function will render a triangular matrix
*
*	Arguments :	matrixA,matrixB (the two matrix for the triangularisation)
*				n (the size of the matrix)
*
*	Returns :		nothing
*/
function eliminate(matrixA, matrixB, n){
	let i,j,k;
	for (i=0; i < matrixA.length; i++) {
		matrixA[i].push(matrixB[i]);
	}
	for(i = 0; i < n; i ++){
		for(k = i+1; k < n; k++){
			let c = -matrixA[k][i]/matrixA[i][i];
			for(j = i; j < n+1; j++){
				if(i===j){
					matrixA[k][j]=0;
				}else{
					matrixA[k][j] += c * matrixA[i][j];
				}
			}
		}
	}
	for (i=0; i < matrixA.length; i++) {
		matrixB[i]=matrixA[i].pop();
	}
}

/*
*	This function will compute the value of the vector and put the answer in a string
*
*	Arguments :	matrix, vector(for the computation)
*
*	Returns :		the string with the results
*/
function finalComputation(matrice, vector)
{
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
			resultString += result[i];
			resultString += "</li>";
		}
		result[0] = vector[0]/matrice[0][0];
		resultString += "<li>"
		resultString += "x";
		resultString += i;
		resultString += " : ";
		resultString += result[i];
		resultString += "</li>";
	}
	resultString += "</ul>";
	return resultString;

}
