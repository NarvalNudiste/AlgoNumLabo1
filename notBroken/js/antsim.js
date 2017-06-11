AD = {
  SEEKING_FOOD : 0,
  BRINGING_FOOD_BACK : 1
}
/*
 * Tile class, meant to be used by the Map object
*/
class Tile {
  constructor(_x,_y, _obstacle){
    this.x = _x;
    this.y = _y;
    this.obstacle = _obstacle
    this.pheromoneValue = 0.0;
    this.pheromoneDecrement = 0.002;
    this.hasFood = false;
  }
  update(){
    if (this.pheromoneValue > 0.0){
    this.pheromoneValue -= this.pheromoneDecrement;
    }
  }
  setFoodOnTile(){
    this.hasFood = true;
  }
  hasPheromone(){
    let b = this.pheromoneValue > 0.0 ? true : false;
    return b;
  }

  canBeRunnedTrough(){
    return !this.obstacle;
  }
}

/*
 * Map class, used to store our pseudo environnement
*/
class Map {
  constructor(_height, _width){
    this.height = _height;
    this.width = _width;

    this.ary = new Array(this.height);
    for (let i = 0; i < this.height; i++){
      this.ary[i] = new Array(this.width);
    }
    for (let y = 0; y < this.height; y++){
      for (let x = 0; x < this.width; x++){
        let blocked = Math.random() < 0.05? true : false;
        this.ary[x][y] = new Tile(x,y,blocked);
        cout("Tile at pos " + this.ary[x][y].x + ";" + this.ary[x][y].y + " : Blocked ? : " + this.ary[x][y].canBeRunnedTrough());
      }
    }
  }
}
class MemoryNode {
  constructor(_x,_y){
    this.x = _x;
    this.y = _y;
  }
}
/*
 * Simple data structure + basic logic to implement an ant behaviour
 * logic loop implemented prior to the algorithm described at https://github.com/andreasjansson/ants_simulation
 */
class Ant {
  constructor(_x, _y, _nestX, _nestY){
    this.nextPositionX;
    this.nextPositionY;
    this.x = _x;
    this.y = _y;
    this.nestX = _nestX;
    this.nestY = _nestY;
    this.direction = AD.SEEKING_FOOD;
    this.pheromoneIncrement = 0.1;
    this.name;
    this.lastDirectionTaken = 9;
    this.memory = new Array();
    this.senseRange = 5;

  }

  dropPheromone(map){
    if (map.ary[this.x][this.y].pheromoneValue <= 1.0){
    map.ary[this.x][this.y].pheromoneValue += this.pheromoneIncrement;
    }
  }

  update(map){
    /*
     * if carrying food
     */
    if (this.direction == AD.BRINGING_FOOD_BACK){
      /*
       * If carrying food and AT at the ant nest, drop food and get a new random direction
       */
      if (this.am_i_at_nest()){
        cout("got at nest, switching status to seeking food");
        //todo
        this.memory = [];
        cout("emptied memory");
        this.direction = AD.SEEKING_FOOD;
      }
      /*
       * If carrying food and is NEAR the ant nest, go to nest
       */
      else if (this.am_i_close_to_nest()){
        cout("I can see the nest, going there");
        //todo
        this.nextPositionY = this.nestY;
        this.nextPositionX = this.nestX;
        this.solvePosition();
      }
      /*
       * If carrying food and is standing on pheromone, drop some and set direction on the pheromone in front of you (if any)
       */
      else if (map.ary[this.x][this.y].hasPheromone()){
        cout("Bringing food back, standing on pheromone");
        //todo -> check the highest value
        this.goBackHome(this.memory);
        this.dropPheromone(map);
        //todo change this
        this.solvePosition();
      }
      /*
       * set direction to the ant nest
       */
      else{
        cout("On the way back home");
        this.goBackHome(this.memory);
        this.dropPheromone(map);
        this.solvePosition();
      }
    }
    /*
     * if looking for food
     */
    else {
      /*
       * if you find food, pick it up and drop pheromone
       */
      if (map.ary[this.x][this.y].hasFood == true){
        cout("F00d1!");
          this.direction = AD.BRINGING_FOOD_BACK;
          this.dropPheromone(map);
          cout("found food");
      }
      /*
       * if you're standing on pheromone, set direction on the pheromone in front
       * front : 1 2 3 if looking downward, 3 6 9 if looking right
       * 7 8 9 if looking up, 7 4 1 if looking left
       */
      else if (map.ary[this.x][this.y].hasPheromone()){
        cout("Seeking food, standing on some nasty stuff");
        //TODO random part
        cout("last direction taken : " + this.lastDirectionTaken);
        this.putLocationInMemory();
        this.dropPheromone(map);
        this.walk_randomly(map);
        this.lastDirectionTaken = this.convertCoordsToDirection(this.nextPositionX, this.nextPositionY);
        this.solvePosition();
      }
      /*
       * sense distant pheromone or walk randomly
       */
      else{
        this.putLocationInMemory();
        this.walk_randomly(map);
        this.lastDirectionTaken = this.convertCoordsToDirection(this.nextPositionX, this.nextPositionY);
        this.solvePosition();
        let test = this.getDirectionValue(map, 6, 10)
        this.getAveragePhValueOfArray(test);
      }
    }
  }
  convertCoordsToDirection(x,y){
    if (x > this.x){
      if (y > this.y){
        return 3;
      }
      else if (y == this.y){
        return 6;
      }
      else{
        return 9;
      }
    }
    else if (x == this.x){
      if (y > this.y){
        return 2;
      }
      else{
        return 8;
      }
    }
    else {
      if (y > this.y){
        return 1;
      }
      else if (y == this.y){
        return 4;
      }
      else{
        return 7;
      }
    }
  }
  putLocationInMemory(){
    cout("location in memory called");
    let temp = new MemoryNode(this.x, this.y);
    this.memory.push(new MemoryNode(this.x, this.y));
  }
  /*
   * Get one tile from the map
   */
  getTile(map, x, y){
      return map.ary[x][y];
  }

  /*
   * Proceed to next position
   */
   goBackHome(ary){
     if (this.memory.length > 0){
     let temp = ary.pop();
     this.nextPositionX = temp.x;
     this.nextPositionY = temp.y;
     cout(temp.x + ";"+ temp.y)
     }
     else{
       cout("error");
     }
   }

   /*
    * Solve movement
    */
  solvePosition(){
    this.x = this.nextPositionX;
    this.y = this.nextPositionY;
    cout("---------------------------------------------------")
    cout(this.name + " is at position" + this.x + ";" + this.y);
    cout("Last direction taken : " + this.lastDirectionTaken);
  }
  /*
   * Randomly pick a direction and go there
   */
  walk_randomly(map){
    let nextDir;
    do{
      nextDir = Math.floor((Math.random() * 9) + 1);
    }
    while (nextDir == 5 || this.check_next_position(nextDir, map) == false)
    this.set_next_position(nextDir);
    this.lastDirectionTaken = nextDir;
  }
  /*
   * Check if the ant is at home :)
   */
  am_i_at_nest(){
    let response = (this.x == this.nestX) && (this.y == this.nestY) ? true : false;
    return response;
  }
  /*
   * Check if the ant is close to home :)
   */
  am_i_close_to_nest(){
    if (this.am_i_at_nest()) return true;
    else{
      let diffX = this.x - this.nestX;
      let diffY = this.y - this.nestY;
      let response = (Math.abs(diffX) <= 1) && (Math.abs(diffY) <= 1) ? true : false;
      return response;
    }
  }
  /*
   * return an array of value of a given direction
   */

  getAveragePhValueOfArray(ary){
    let sizeWithoutObstacle = ary.length;
    let sum = 0;
    for (let i = 0; i < ary.length; i++){
      if (ary[i].canBeRunnedTrough()){
        sum += ary[i].pheromoneValue;
      }
      else{
        sizeWithoutObstacle--;
      }
    }
    cout("average value : " + sum/sizeWithoutObstacle);
    return sum/sizeWithoutObstacle;
  }
  getDirectionValue(map, direction, range){
    let tempAry = new Array();
    switch(direction){
      case 6:{
        for (let i = 1; i < range; i++){
          if (this.x + i < map.width){
            tempAry.push(map.ary[this.x+i][this.y]);
          }
        }
        cout("-------------------------------");
        for (let i = 0; i < tempAry.length; i++){
          cout(i + ":" + tempAry[i].x + ";" + tempAry[i].y);
        }
      }
      break;
      case 4:{
        for (let i = 1; i < range; i++){
          if (this.x - i >= 0){
            tempAry.push(map.ary[this.x-i][this.y]);
          }
        }
      }
      break;
      case 8:{
        for (let i = 1; i < range; i++){
          if (this.y - i >= 0){
            tempAry.push(map.ary[this.x][this.y-i]);
          }
        }
      }
      break;
      case 2:{
        for (let i = 1; i < range; i++){
          if (this.y + i < map.height){
            tempAry.push(map.ary[this.x][this.y+i]);
          }
        }
      }
      break;
      //downback
      case 1:{
        for (let i = 1; i < range; i++){
          if (this.x - i >= 0 && this.y + i < map.height){
            tempAry.push(map.ary[this.x-i][this.y+i]);
          }
        }
      }
      break;
      case 3:{
        for (let i = 1; i < range; i++){
          if (this.x + i < map.width && this.y + i < map.height){
            tempAry.push(map.ary[this.x + i][this.y + i]);
          }
        }
      }
      break;
      case 9:{
        for (let i = 1; i < range; i++){
          if (this.x + i < map.width && this.y - i >= 0){
            tempAry.push(map.ary[this.x + i][this.y - i]);
          }
        }
      }
      break;
      case 7:{
        for (let i = 1; i < range; i++){
          if (this.x - i >= 0 && this.y - i >= 0){
            tempAry.push(map.ary[this.x - i][this.y - i]);
          }
        }
      }
      break;
      //end of switch
      return tempAry;
    }

  }

  // QoL function to check if the next tile is existent and non obstructed
  check_next_position(d, map){
    switch(d){
      case 1:{
        let newDirectionX = this.x - 1;
        let newDirectionY = this.y + 1;
        cout("1 : checking position " + newDirectionX + ";" + newDirectionY);
        if ((this.y == map.height - 1) || this.x == 0){
          return false;
        }
        else{
          if (map.ary[this.x-1][this.y+1].canBeRunnedTrough()){
            return true;
          }
          else return false;
        }
      }
      break;
      case 2:{
        let newDirectionX = this.x;
        let newDirectionY = this.y + 1;
        cout("2 : checking position " + newDirectionX + ";" + newDirectionY);
        if (this.y == map.height - 1){
          return false;
        }
        else if (map.ary[this.x][this.y+1].canBeRunnedTrough()){
          return true;
        }
        else return false;
      }
      break;
      case 3:{
        let newDirectionX = this.x + 1;
        let newDirectionY = this.y + 1;
        cout("3 : checking position " + newDirectionX + ";" + newDirectionY);
        if ((this.y == map.height - 1) || this.x == map.width - 1){
          return false;
        }
        else{
          if (map.ary[this.x+1][this.y+1].canBeRunnedTrough()){
            return true;
          }
          else return false;
        }
      }
      break;
      case 4:{
        let newDirectionX = this.x - 1;
        let newDirectionY = this.y;
        cout("4 : checking position " + newDirectionX + ";" + newDirectionY);
        if (this.x == 0){
          return false;
        }
        else {
          if (map.ary[this.x -1][this.y].canBeRunnedTrough()){
            return true;
          }
          else return false;
        }
      }
      break;
      case 6:{
        let newDirectionX = this.x + 1;
        let newDirectionY = this.y;
        cout("6 : checking position " + newDirectionX + ";" + newDirectionY);
        if (this.x == map.width - 1){
          return false;
        }
        else {
          if (map.ary[this.x + 1][this.y].canBeRunnedTrough()){
            return true;
          }
          else return false;
        }
      }
      break;
      case 7:{
        let newDirectionX = this.x - 1;
        let newDirectionY = this.y - 1;
        cout("7 : checking position " + newDirectionX + ";" + newDirectionY);
        if ((this.y == 0) || this.x == 0){
          return false;
        }
        else{
          if (map.ary[this.x-1][this.y-1].canBeRunnedTrough()){
            return true;
          }
          else return false;
        }
      }
      break;
      case 8:{
        let newDirectionX = this.x;
        let newDirectionY = this.y - 1;
        cout("8 : checking position " + newDirectionX + ";" + newDirectionY);
        if (this.y == 0){
          return false;
        }
        else if (map.ary[this.x][this.y-1].canBeRunnedTrough()){
          return true;
        }
        else return false;
      }
      break;
      case 9:{
        let newDirectionX = this.x + 1;
        let newDirectionY = this.y - 1;
        cout("9 : checking position " + newDirectionX + ";" + newDirectionY);

        if ((this.y == 0) || this.x == map.width - 1){
          return false;
        }
        else{
          if (map.ary[this.x+1][this.y-1].canBeRunnedTrough()){
            return true;
          }
          else return false;
        }
      }
      break;
    }
  }
   // QoL switch to convert the [1,2,3,4,6,7,8,9] direction to our coordinate system
  set_next_position(d){
    this.nextPositionX = this.x;
    this.nextPositionY = this.y;
    switch(d){
      case 1:{
        this.nextPositionX--;
        this.nextPositionY++;
      }
      break;
      case 2:{
        this.nextPositionY++;
      }
      break;
      case 3:{
        this.nextPositionX++;
        this.nextPositionY++;
      }
      break;
      case 4:{
        this.nextPositionX--;
      }
      break;
      case 6:{
        this.nextPositionX++;
      }
      break;
      case 7:{
        this.nextPositionX--;
        this.nextPositionY--;
      }
      break;
      case 8:{
        this.nextPositionY--;
      }
      break;
      case 9:{
        this.nextPositionY--;
        this.nextPositionX++;
      }
      break;
    }
  }
}

//QoL stuff
function cout(_str){
  if (DEBUG_MODE === true)
  console.log(_str);
}

function init(){
  let nestX = 0;
  let nestY = 0;
  ants.push(new Ant(1, 1, nestX, nestY));
  //Civ 6 barbs are retarded
//let the swarm flow
  for (let i = 0; i < ANTS_QUANTITY; i ++){
    ants.push(new Ant(0,0, nestX, nestY));
    ants[i].name = 'Bapu';
  }
}

document.addEventListener('keydown', function(event) {
    if(event.keyCode == 32) {
    for (let i = 0; i < ants.length - 1; i++){
      ants[i].update(map);
      for (let y = 0; y < map.height; y++){
        for (let x = 0; x < map.width; x++){
          map.ary[x][y].update();
        }
      }
    }
    }
});

//init the map
map = new Map(5, 5);
// add food
map.ary[3][3].obstacle = false;
map.ary[3][3].setFoodOnTile();



//add ants
var ants = Array();
var DEBUG_MODE = true;
var STOP_MODE = true;
var FUCKTHISSHITFACTOR = 10;
var ANTS_QUANTITY = 1;
var searchMethod = 'directional';
init();
