function FloatEncoder(_input, _bias) {
  //attributes
  this.toEncode = _input;
  this.bias = _bias;
  //methods
  this.encode = function(){
    result = 0;
    exponent = 0;

    while (Math.abs(result) < 1 || Math.abs(result) >= 2 ){
      exponent--;
      result = this.toEncode.value / Math.pow(2,exponent);
      console.log(this.toEncode.value + "/" + Math.pow(2,exponent) + " = " + result);
      }
    this.toEncode.sign = this.sign();
    this.toEncode.mantissa = Math.abs(result);
    this.toEncode.exponent = this.bias + exponent;
   if (Math.abs(this.toEncode.mantissa) > 1){
     this.toEncode.encodedMantissa = this.approximateBinaryMantissa(Math.abs(this.toEncode.mantissa) - 1)
   }
   else{
     this.toEncode.encodedMantissa = this.approximateBinaryMantissa(Math.abs(this.toEncode.mantissa))
   }
      console.log("mantissa : " + this.toEncode.mantissa + " exponent : " + this.toEncode.exponent + " sign : " + this.toEncode.sign);
      console.log("approximated mantissa : " + this.toEncode.approximatedMantissa + " | encoded mantissa : " + this.toEncode.encodedMantissa);
      this.toEncode.encodedExponent = this.convertToBinary(this.toEncode.exponent);
      console.log("encoded exponent : " + this.toEncode.encodedExponent);
      console.log("result : " + this.toEncode.sign + this.toEncode.encodedExponent + this.toEncode.encodedMantissa);
  }
  this.sign = function(){
    /*returns 0 for positive floats, 1 for negative ones*/
    if (this.toEncode.value >= 0)
        return 0;
      else
        return 1;
  }

  this.approximateBinaryMantissa = function(_input){
    result = "";
    approx = 0;
    /*todo : fix approximation */
      for (i = 1; i < 24; i++){
        if ((approx + Math.pow(2,-i)) < _input){
          console.log(Math.pow(2,-i) + " < " + _input + ", appending 1");
          approx += Math.pow(2,-i);
          result += "1";
        }
      else{
          console.log(Math.pow(2,-i) +" > " + _input + ", appending 0");
          result += "0";
      }
    }
    this.toEncode.approximatedMantissa = approx;
  return result;
  }

  this.convertToBinary = function(_input){
    result = "";
    sum = 0;
    for (i = 7; i >= 0; i --){
      if (Math.pow(2, i) <= _input){  /*fix me pls*/
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
}

function Float(_input){
  this.value = _input;
  this.mantissa = 0;
  this.exponent = 0;
  this.sign = 0;
  this.approximatedMantissa = 0;
  this.encodedMantissa = "";
  this.encodedExponent = "";
}

float = new Float(0.085);
floatEncoder = new FloatEncoder(float, 127);
floatEncoder.encode();

/* On veut convertir un chiffre flottant en suite de bits.
*  Je tente une première implementation sans prendre en compte le bit caché,
*  Je verrai la suite ensuite ..
*
*  Première étape : Créer une fonction qui détermine le signe de float -> fait
*  Deuxième étape : Décomposer le float en mantisse / exposants -> fait
*  Troisième étape : Conversion en chaine de bits
*/
