class BinaryToDecimal {
	constructor(_data,_size) {
		this.data = _data;

		this.sizeExponent = _size.sizeExponent;
		this.sizeMantissa = _size.sizeMantissa;
		this.sizeTotal = _size.bitSize;
		this.bias = _size.bias;//ou 0

		this.sign = this.getSign();
		this.exponent = this.getExponent();
		this.mantissa = this.getMantissa();
	}

	checkNumber(){
		let temp="";
		if(this.sign != "1"){
			temp = "-";
		}
		if(!this.exponent.includes("1")&&!this.mantissa.includes("1")){
			temp += "zero";
		}
		if(!this.exponent.includes("0")&&!this.mantissa.includes("1")){
			temp += "Infinity";
		}
		if(!this.exponent.includes("0")&&this.mantissa.includes("1")){
			temp = "NaN";
		}
		return temp;
	}

	rounded(data){
		let round = data.substring(data.length-1, data.length);
		let roudedMantissa = data;
		if(round === "1"){
			let temp = "1";
			for(let i = 0 ; i<data.length-1;i++){
				temp = "0"+temp;
			}
			roudedMantissa = this.computeBinary(data,temp);
			if(roudedMantissa.length > this.sizeMantissa){
				let overflowMantissa = roudedMantissa;
				overflowMantissa = overflowMantissa.substring(0,1);

				if(overflowMantissa==="1"){
					this.overflowMantissa();
				}

				roudedMantissa = roudedMantissa.substr(1);
			}
		}

		return roudedMantissa;
	}

	overflowMantissa(){
		let temp = "1";
		for(let i = 0 ; i<this.exponent.length-1;i++){
			temp = "0"+temp;
		}
		this.exponent = this.computeBinary(this.exponent,temp);
		let overflowExponent = this.exponent;
		overflowExponent = this.exponent.substring(0,1);
		if(overflowExponent === "1"){
			alert("infinity");
		}
		this.exponent = this.exponent.substring(1,this.exponent.length);
	}

	getSign(){
		let temp = this.data.substring(0, 1)
		return Math.pow(-1,temp);
	}
	getExponent(){
		let temp = 1 + this.sizeExponent;
		return this.data.substring(1, temp);
	}
	getMantissa(){
		let limSup = this.sizeTotal;
		let limInf = 1 + this.sizeExponent;
		let temp = this.data.substring(limSup,limInf);
		temp = this.rounded(temp);
		return temp;
	}
	decTotal(){
		let temp = this.checkNumber();
		let expo = this.decExponent();
		let mant = this.decMantissa();
		if(temp==="" || temp === "-"){
			temp = this.sign * (1 + mant) * Math.pow(2,expo-this.bias);
			temp = this.setPrecision(temp);
		}
		return temp;
	}
	setPrecision(data){
		let temp = Math.pow(2,this.sizeMantissa+1);
		let precision = Math.round(Math.log(temp)/Math.log(10));
		return data.toFixed(precision);
	}
	decMantissa(){
		let temp = 0;
		let expo = this.mantissa.length;
		let tempMant = this.reverse(this.mantissa);

		for(let i = expo-1 ; i >=0 ; i--){
			temp += parseInt(tempMant.charAt(i))*Math.pow(2,i);
		}
		temp /= Math.pow(2,expo)
		return temp;
	}
	decExponent(){
		let temp = 0;
		let tempExpo = this.reverse(this.exponent);
		for(let i = tempExpo.length-1 ; i >=0 ; i--){
			temp += parseInt(tempExpo.charAt(i))*Math.pow(2,i);
		}
		return temp;
	}
	reverse(s) {
		return s.split('').reverse().join('');
	}

	computeBinary(nb1,nb2){
		let length = nb1.length;
		let temp = new Array();
		let souv = new Array();
		let res = new Array();
		souv[length] = "0";

		for(let i = length-1; i>=0; i--){
			temp.unshift(nb1.charAt(i) ^ nb2.charAt(i));
			if(nb1.charAt(i)==="1" && nb2.charAt(i)==="1" || nb1.charAt(i)==="1" && souv[i+1] === "1" || nb2.charAt(i)==="1" && souv[i+1]==="1"){
				souv[i]="1";
			}else{
				souv[i]="0";
			}
		}
		temp.unshift("0");

		for(let i = length; i>=0 ; i--){
			res.unshift(temp[i]^souv[i]);
		}

		return res.join("");
	}
}
