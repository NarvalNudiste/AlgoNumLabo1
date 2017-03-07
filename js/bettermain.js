function Float(_input){
  //ctor
  this.value = _input;
  this.mantissa = 0;
  this.exponent = 0;
  this.sign = 0;
  this.approximatedMantissa = 0;
  this.encodedMantissa = "";
  this.encodedExponent = "";
  this.sizeMantissa = 23;
  this.sizeExponent = 8;
  this.bias = Math.pow(2,this.sizeExponent-1) -1;  //to change

  //methods
  this.getSign = function(){

    /*returns 0 for positive floats, 1 for negative ones*/
    if (this.value >= 0)
        this.sign = 0;
      else
        this.sign = 1;
  }
  this.convertToBinary = function(){
    if (Math.abs(this.value) < 1.0){
      while (Math.abs(this.mantissa) < 1 || Math.abs(this.mantissa) >= 2 ){
        this.exponent--;
        this.mantissa = this.value / Math.pow(2,this.exponent);
        }
    }
    else if (Math.abs(this.value) >= 2.0){
      while (Math.abs(this.mantissa) < 1 || Math.abs(this.mantissa) >= 2 ){
        this.exponent++;
        this.mantissa = Math.abs(this.value) / Math.pow(2,this.exponent);
        }
    }
    else{
      this.mantissa = this.value;
      this.exponent = 0;
    }
  }

  this.approximateBinaryMantissa = function(_input){
	  console.log(_input);
    result = "";
    approx = 0;
    /*todo : fix approximation */
      for (i = 1; i < this.sizeMantissa+1; i++){
        if ((approx + Math.pow(2,- i)) <= _input){
          console.log(">" + i + " - " + (approx + Math.pow(2,-i)) + " < " + _input + ", poce bleu");
          approx += Math.pow(2,-i);
          result += "1";
        }
      else{
          console.log(">" + i + " - " + (approx + Math.pow(2,-i)) +" > " + _input + ", poce rouge");
          result += "0";
      }
    }
    this.approximatedMantissa = approx;
  return result;
  }

  this.convertExponentToBinary = function(_input){
    result = "";
    sum = 0;
    for (i = this.sizeExponent-1; i >= 0; i --){
      if (Math.pow(2, i) <= Math.abs(_input)){  /*fix me pls*/
        console.log((sum + Math.pow(2, i)) + " <= " + _input)
        _input -= Math.pow(2,i);
        result += "1";
      }
      else{
        console.log((sum + Math.pow(2, i)) + " > " + _input)
        result += "0";
      }
    }
    return result;
  }


  this.print = function(){
    console.log("Valeur : " +
    this.value +
    " | Mantisse : " +
    this.mantissa +
    " | Exposant : " +
    this.exponent +
    " | Signe : " + this.sign +
    " | Exponent to encode : " +
    (this.bias + this.exponent) +
    " | Encoded Exponent : " +
    this.encodedExponent +
    " | Encoded Mantissa : " +
    this.encodedMantissa +
    " | Approximated mantissa : " +
    this.approximatedMantissa +
    " | Binary form : " +
    this.sign + this.encodedExponent + this.encodedMantissa);
  }
  this.encode = function(){
    this.getSign();
    this.convertToBinary();
    this.encodedMantissa = this.approximateBinaryMantissa(this.mantissa-1);
    this.encodedExponent = this.convertExponentToBinary(this.bias + this.exponent);

  }
  
  this.validate = function(){
	return !isNaN(this.value);
  }
}

foo = new Float(1.2);
if (foo.validate() == true){
	foo.encode();
	foo.print();	
}
else{
	console.log("exception : input isn't a number");
}
