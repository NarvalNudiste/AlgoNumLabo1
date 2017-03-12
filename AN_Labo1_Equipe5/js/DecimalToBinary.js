class DecimalToBinary {
	constructor(_data,_size) {
		this.data = _data;

		this.sizeExponent = _size.sizeExponent;
		this.sizeMantissa = _size.sizeMantissa;
		this.sizeTotal = _size.bitSize;
		this.bias = _size.bias;//ou 0

		this.mantissa = 0;
		this.exponent = 0;
		this.sign = 0;

		this.approximatedMantissa = 0;
		this.encodedMantissa = "";
		this.encodedExponent = "";
	}

	getSign(){
		if (this.data >= 0){
			this.sign = 0;
		}
		else{
			this.sign = 1;
		}
	}

	convertToBinary() {
		if (Math.abs(this.data) < 1.0){
			while (Math.abs(this.mantissa) < 1 || Math.abs(this.mantissa) >= 2 ){
				this.exponent--;
				this.mantissa = this.data / Math.pow(2,this.exponent);
			}
		}
		else if (Math.abs(this.data) >= 2.0){
			while (Math.abs(this.mantissa) < 1 || Math.abs(this.mantissa) >= 2 ){
				this.exponent++;
				this.mantissa = Math.abs(this.data) / Math.pow(2,this.exponent);
			}
		}
		else{
			this.mantissa = this.data;
			this.exponent = 0;
		}
	}

	findExpo(){
		return this.bias + this.exponent;
	}

	expoToBinary(){
		let dataBin =this.findExpo();
		let temp="";
		let i = 0;
		while (Math.pow(2,i)<dataBin) {
			i++;
		}
		for(i;i>=0;i--){
			if(dataBin-Math.pow(2,i)>=0){
				temp +="1";
				dataBin-=Math.pow(2,i);

			}else{
				temp += "0";
			}
		}

		while(temp.length != this.sizeExponent){
			if(temp.length > this.sizeExponent){
				temp = temp.substr(1);
			}else if (temp.length < this.sizeExponent) {
				temp = "0"+temp;
			}
		}
		return temp;
	}

	getFraction(_input){
       let result = "";
       let approx = 0;
         for (let i = 1; i < this.sizeMantissa+1; i++){
           if ((approx + Math.pow(2,- i)) <= _input){
             approx += Math.pow(2,-i);
             result += "1";
           }
         else{
             result += "0";
         }
       }
       this.approximatedMantissa = approx;
     return result;
     }

	totalBin(){
		this.convertToBinary();
		this.getSign();
		let temp = this.sign;
		temp += this.expoToBinary();
		temp += this.getFraction(this.mantissa-1);
		return temp;
	}
}
