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
  this.bitSize = 7;
  this.bias = 0;

  this.adjustBits = function(){
	var scan = this.bitSize;
	var a = parseInt(scan, 10);
	if(!isNaN(a)) {
		// je dois donner d, e et m
		// la fonction : 4 log2(N) - 13 (arrondit) sauf pour 32(7) -> 8 et 16(3) -> 5
		if(a >= 180) {
			var e = parseInt((4*(Math.log(a)/Math.log(2)) - 13));
		}
		else if(a>0) {
		//2+3*(log(n/8)/log(2))+1
		var e = parseInt((3*(Math.log(a/8)/Math.log(2)) + 2));
		}
		var m = parseInt(a-e-1);
		alert("e : " + e + ", m : " + m);
		
		this.sizeExponent = e;
		this.sizeMantissa = m;
		this.bias = Math.pow(2,this.sizeExponent-1) -1;
		console.log("exponent size:" + this.sizeExponent + " mantissa size: " + this.sizeMantissa);
	}
	else {
		alert("not a number...");
		}
  }
  
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
    this.getSign();-
    this.convertToBinary();
    this.encodedMantissa = this.approximateBinaryMantissa(this.mantissa-1);
    this.encodedExponent = this.convertExponentToBinary(this.bias + this.exponent);

  }
  
  this.validate = function(){
	return !isNaN(this.value);
  }
}

foo = new Float(0.085);
if (foo.validate() == true){
	foo.adjustBits();
	foo.encode();
	foo.print();

}
else{
	console.log("exception : input isn't a number");
}
