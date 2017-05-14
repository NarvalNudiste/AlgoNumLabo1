window.onload = function(){

  var canvas = document.getElementById("mainCanvas");
  c = canvas.getContext("2d");

  var barLength = 20;
  var timer = 0;
  var lineCount = 0;
  var currentLinePosition = 0;
  var cameraPos = 0;
  var piApproxValue = 0;
  var speed = 1.0;

  var scrollingRight = false;
  var scrollingLeft = false;
  var speedingUp = false;
  var speedingDown = false;

window.addEventListener('keydown', (event) => {

  const keyName = event.key;
  if (keyName === 'a'){
    scrollingLeft = true;
  }
  if (keyName === 'd'){
    scrollingRight = true;
  }
  if (keyName === '1'){
    speed = 1.0;
	timer = 0.0;
  }
  if (keyName === '2'){
	  speed = 2.0;
	  timer = 0.0;
  }
  if (keyName === '3'){
	  speed = 4.0
	  timer = 0.0;
  }
  if (keyName === '4'){
	  speed = 10.0;
	  timer = 0.0;
  }
  if (keyName === '5'){
	  speed = 20.0;
	  timer = 0.0;
  }
});

window.addEventListener('keyup', (event) => {

  const keyName = event.key;
  if (keyName === 'a'){
    scrollingLeft = false;
  }
  if (keyName === 'd'){
    scrollingRight = false;
  }
});


  var lines = [];
  setInterval(function(){
    /*
      Clearing the canvas
    */
    c.fillStyle = 'rgba(255, 165, 0, 0.5  )';
    c.fillRect(0,0,canvas.width, canvas.height);
    c.strokeStyle = "white";
    c.lineWidth = 2;
    c.fillStyle = "white";
    c.font = '25px Abel';
    c.fillText("Pi/4 approximation : " + piApproxValue, 10, 50);
    c.fillText("Pi approximation : " + piApproxValue*4, 10, 100);
    c.fillText("Steps : " + lineCount, 10, 150);


    /* Drawing a line for each LinePi object in array */
    for (i = 0; i < lines.length; i++){
      let temp = lines[i];
      let drawingHeight = temp.getStack() * (canvas.height-40);
        if (temp.isFinished()){
          line(c, temp.startingPos - cameraPos + canvas.width/2, drawingHeight, canvas.width/2 + temp.startingPos + barLength - cameraPos, drawingHeight);
        }
        else{
          line(c, temp.startingPos - cameraPos + canvas.width/2, drawingHeight, canvas.width/2 + temp.startingPos + timer - cameraPos, drawingHeight);
        }
    }

    timer+=speed;
    /* when the timer expire, we add a new line object to the array with correct values */
    if (timer == barLength){
      timer = 0;
      lines.push(new LinePi(barLength * lineCount, 1/(2*lineCount+1), piApproxValue));
      /* Computing the next "step" of the pi approx */
      if (lineCount % 2 == 0){
        piApproxValue += lines[lines.length-1].getValue();
      }
      else{
        piApproxValue -= lines[lines.length-1].getValue();
      }
      lineCount++;
      if (lineCount >= 2){
      lines[lineCount-2].setFinished(true);
      }
    }
          cameraPos += speed;
          if (scrollingLeft){
            cameraPos -= 10*speed;
          }
          if (scrollingRight){
            cameraPos += 10*speed;
          }
          if (speedingUp){
            speed*=2;
          }
          if (speedingDown && speed >= 0.5)
          {
            speed*=2;
          }
  }, 0);
}

class LinePi {
  /*Simple data struct for storing lines to draw */
  constructor(_startingPos, _value, _stack) {
    this.startingPos = _startingPos;
    this.value = _value;
    this.finishedDrawing = false;
    this.stack = _stack;
  }
  isFinished(){
    return this.finishedDrawing;
  }
  setFinished(_bool){
    this.finishedDrawing = _bool;
  }
  getValue(){
    return this.value;
  }
  getStack(){
    return this.stack;
  }
}
/* QoL function for drawing line */
function line(ctx,x1,y1,x2,y2){
  ctx.beginPath();
  ctx.moveTo(x1,y1);
  ctx.lineTo(x2,y2);
  ctx.stroke();
  ctx.closePath();
}
