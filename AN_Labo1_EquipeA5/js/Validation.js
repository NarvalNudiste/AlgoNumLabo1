class Validation {
	constructor(_data) {
		this.bitSize = _data;
		this.sizeExponent = this.getSizeExponent();
		this.sizeMantissa = this.getSizeMantissa();
		this.bias = this.getBias();

		c("sdfs"+ this.sizeExponent);
	}

	getSizeExponent(){
		let temp;

		if(this.bitSize < 128 ){
			temp = Math.round((3*(Math.log(this.bitSize/8)/Math.log(2)) + 2));
		}else{
			temp = Math.round((4*(Math.log(this.bitSize)/Math.log(2)) - 13));
		}
		return temp;
	}

	getSizeMantissa(){
		return this.bitSize-this.sizeExponent-1;
	}

	getBias(){
		return Math.pow(2,this.sizeExponent-1)-1;
	}
}
