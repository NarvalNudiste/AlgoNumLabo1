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


/*var matrix = json.getMatrix();
var size = json.getMatrixSize();
var results = json.getMatrixResultColumn();
printMatrix(matrix);
printResults(results);*/
json = new jsonParser();


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
					let matrix = json.getMatrix();
					printMatrix(matrix);
				}

				reader.readAsText(file);	
			} else {
				fileDisplayArea.innerText = "File not supported!"
			}
		});
}


