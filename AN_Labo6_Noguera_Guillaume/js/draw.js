window.onload = function(){

  var canvas = document.getElementById("mainCanvas");
  c = canvas.getContext("2d");

  //init the map
  map = new Map(64, 64);
  // add food
  map.ary[3][3].obstacle = false
  map.ary[3][3].setFoodOnTile();

  tileSizeX = canvas.width / map.width;
  tileSizeY = canvas.height / map.height

  setInterval(function(){
    c.fillStyle = 'rgba(240,240,240,1.0)';
    c.fillRect(0,0,canvas.width, canvas.height);
    drawMap();
    drawAnthill(0,0);
    drawAnts();
    drawLines();
    for (let i = 0; i < ants.length; i++){
      ants[i].update(map);
    }
  }, 300);

  function drawAnthill(_x, _y){
    c.fillStyle = '#D9B44A'
    c.fillRect(_x*tileSizeX, _y*tileSizeY, tileSizeX, tileSizeY);
  }

  function drawAnts(){
    c.fillStyle = 'rgba(226,137,108)';
    for (let i = 0; i < ants.length; i ++){
          c.fillRect(ants[i].x*tileSizeX, ants[i].y*tileSizeY, tileSizeX, tileSizeY);
    }
  }

  function drawMap(){
    for (let y = 0; y < map.height; y++){
      for (let x = 0; x < map.width; x++){
        map.ary[x][y].update();
        if (map.ary[x][y].canBeRunnedTrough()){
          if (map.ary[x][y].hasFood){
          c.fillStyle = 'red';
          }
          else{
          c.fillStyle = 'rgba(149, 185, 98, ' + map.ary[x][y].pheromoneValue + ')';
          }
          c.fillRect(x*tileSizeX, y*tileSizeY, tileSizeX, tileSizeY);
        }
        else{
          c.fillStyle = "#4F6457";
          c.fillRect(x*tileSizeX, y*tileSizeY, tileSizeX, tileSizeY);
        }
      }
    }
  }

  function drawLines(){
    c.strokeStyle = "white";
    for (let x = 0; x <= map.width; x++){
      c.lineWidth = tileSizeX / 4;
      c.beginPath();
      c.moveTo(x*tileSizeX, 0);
      c.lineTo(x*tileSizeX,canvas.height);
      c.stroke();
    }
    for (let y = 0; y <= map.height; y++){
      c.lineWidth = tileSizeY / 4;
      c.beginPath();
      c.moveTo(0,y*tileSizeY);
      c.lineTo(canvas.width,y*tileSizeY);
      c.stroke();
    }
  }

}
