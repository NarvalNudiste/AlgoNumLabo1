class Addition {
	constructor(_data1,_data2,_size) {
		this.data1 = _data1;
		this.data2 = _data2;

		this.sizeExponent = _size.sizeExponent;
		this.sizeMantissa = _size.sizeMantissa;
		this.sizeTotal = _size.bitSize;
		this.bias = _size.bias;//ou 0


		this.sign = this.getSign();
		this.exponent1 = this.getExponent(this.data1);
		this.exponent2 = this.getExponent(this.data2);

		this.mantissa1 = this.getMantissa(this.data1);
		this.mantissa2 = this.getMantissa(this.data2);
	}

	total(){
		let calcExpo1 = this.exponent1-this.bias;
		let calcExpo2 = this.exponent2-this.bias;

		c(this.exponent2);

		let tempMantissa1 = this.normalize(this.mantissa1);
		let tempMantissa2 = this.normalize(this.mantissa2);

		let tempExpoFinal = calcExpo1;

		let result;
		if(calcExpo1 > this.sizeMantissa || calcExpo2 > this.sizeMantissa){
			if(calcExpo1 < calcExpo2){
				result = this.data2;
			}else{
				result = this.data1;
			}

		}else{

			let diffExpo = 0;

			if(calcExpo1 < calcExpo2){
				tempMantissa1 = this.shiftMantissa(tempMantissa1,calcExpo2 - calcExpo1);
				tempExpoFinal = calcExpo2;
			}else if (calcExpo2 < calcExpo1) {
				tempMantissa2 = this.shiftMantissa(tempMantissa2,calcExpo1 - calcExpo2);
				tempExpoFinal = calcExpo1;
			}else if (calcExpo1 == calcExpo2) {
				diffExpo = 1;
			}

			result = this.computeBinary(tempMantissa1,tempMantissa2);
			c("check : " + result + result.length);

			diffExpo =tempExpoFinal+this.bias+diffExpo;

			tempExpoFinal = this.convertToBinary(diffExpo);
c("avant "+tempExpoFinal);
			if(tempExpoFinal.length>this.sizeExponent){
				tempExpoFinal = tempExpoFinal.substr(1);
			}

			c(tempExpoFinal);

			if(result.charAt(0)==="1"){
				let check = result.substring(0,3);
				result = result.substr(1);
				result = result.substring(0, result.length-2);
				c(check);
				if(check==="101"||check==="100"){

					tempExpoFinal = this.overflowMantissa(tempExpoFinal);
				}

			}else{

				result = result.substr(2);
				result = result.substring(0, result.length-1);
			}
			let tempResult = result.substring(result.length-2, result.length);
			result = result.substring(0, result.length-2);


			result = this.sign + tempExpoFinal + result;
		}

		return result;
	}

	overflowMantissa(exponent){
		let temp = "1";
		for(let i = 0 ; i<exponent.length-1;i++){
			temp = "0"+temp;
		}
		exponent = this.computeBinary(exponent,temp);
		let overflowExponent = exponent;
		overflowExponent = exponent.substring(0,1);
		if(overflowExponent === "1"){
			alert("infinity");
		}
		exponent = exponent.substring(1,exponent.length);
		c(exponent);
		return exponent;
	}

	convertToBinary(data){
		let temp="";
		let i = 0;
		while (Math.pow(2,i)<data) {
			i++;
		}
		for(i;i>=0;i--){
			if(data-Math.pow(2,i)>=0){
				temp +="1";
				data-=Math.pow(2,i);

			}else{
				temp += "0";
			}
		}
		return temp;
	}

	shiftMantissa(data,diff){
		for(let i = 0; i < diff ; i++){
			data = "0"+data;
			data = data.slice(0, data.length-1);
		}
		return data;
	}

	getSign(){
		return this.data1.substring(0, 1);
	}

	getExponent(data){
		let temp = 1 + this.sizeExponent;
		return this.decExponent(data.substring(1, temp)) ;
	}
	decExponent(data){
		let temp = 0;
		let tempExpo = this.reverse(data);
		for(let i = tempExpo.length-1 ; i >=0 ; i--){
			temp += parseInt(tempExpo.charAt(i))*Math.pow(2,i);
		}
		return temp;
	}
	reverse(s) {
		return s.split('').reverse().join('');
	}

	getMantissa(_data){
		let limSup = this.sizeTotal;
		let limInf = 1 + this.sizeExponent;
		return _data.substring(limSup,limInf);
	}

	normalize(_data){
		return "1"+_data+"000";
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
