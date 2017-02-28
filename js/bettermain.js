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
  this.bias = 126;  //to change

  //methods
  this.getSign = function(){

    /*returns 0 for positive floats, 1 for negative ones*/
    if (this.value >= 0)
        return 0;
      else
        return 1;
  }

  this.encode = function(){
    this.sign = this.getSign();

  }
}

foo = new Float(1.32);
