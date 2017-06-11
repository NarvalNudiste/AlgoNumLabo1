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
    cout("================================================");
    cout("                 START UPDATE                   ");
    cout("================================================");
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
        cout("last direction taken : " + this.lastDirectionTaken);
        this.putLocationInMemory();
        if ( Math.floor((Math.random() * 99) + 1) > FUCKTHISSHITFACTOR){
          this.dropPheromone(map);
          if (searchMethod == 'naive'){
            let tempTile = this.getBestTile(this.getSurroundingTiles(map));
            if (typeof(tempTile) === 'undefined'){
              this.walk_randomly(map);
              this.solvePosition();
            }
            else{
              this.nextPositionX = tempTile.x;
              this.nextPositionY = tempTile.y;
              this.lastDirectionTaken = this.convertCoordsToDirection(this.nextPositionX, this.nextPositionY);
            }
          }
          else if (searchMethod == 'directional'){
            let tempTile = this.getBestTileDirectional(map, this.senseRange);
            if (typeof(tempTile) === 'undefined'){
              this.walk_randomly(map);
              this.solvePosition();
            }
            else{
              this.nextPositionX = tempTile.x;
              this.nextPositionY = tempTile.y;
              this.lastDirectionTaken = this.convertCoordsToDirection(this.nextPositionX, this.nextPositionY);
            }
          }
          this.solvePosition();
        }
        else{
          //fuckthisshit
          this.putLocationInMemory();
          this.walk_randomly(map);
          this.solvePosition();
        }
      }
      /*
       * sense distant pheromone or walk randomly
       */
      else{
        this.putLocationInMemory();
        cout("broken there");
        let tempTile = this.getBestTileDirectional(map, this.senseRange);
        if (typeof(tempTile === 'undefined')){
          cout("test");
          cout("no idea where I go");
          this.walk_randomly(map);
        }
        else{
          cout("sensed pheromone in direction " + this.convertCoordsToDirection(tempTile.x, tempTile.y));
          this.nextPositionX = tempTile.x;
          this.nextPositionY = tempTile.y;
          this.lastDirectionTaken = this.convertCoordsToDirection(this.nextPositionX, this.nextPositionY);
        }
        this.solvePosition();
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
  solvePosition(){
    this.x = this.nextPositionX;
    this.y = this.nextPositionY;
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
  getBestTile(ary){
    let max = 0.0;
    let bestTile;
    for (let i = 0; i < ary.length - 1; i++){
      if (ary[i].pheromoneValue > max){
        bestTile = ary[i];
      }
    }
    return bestTile;
  }

  /* ************************
   * Welcome to switch hell *
   * ************************/
   //determine the best direction in front of the ant
   getBestTileDirectional(ary, range){
     let tiles0;
     let tiles1;
     let tiles2;

     switch(this.lastDirectionTaken){
       case 1:{
         tiles0 = this.getTilesInDirection(4, ary, range);
         tiles1 = this.getTilesInDirection(1, ary, range);
         tiles2 = this.getTilesInDirection(2, ary, range);
       }
       break;
       case 2:{
         tiles0 = this.getTilesInDirection(1, ary, range);
         tiles1 = this.getTilesInDirection(2, ary, range);
         tiles2 = this.getTilesInDirection(3, ary, range);
       }
       break;
       case 3:{
         //just spam hadokens at this point
         tiles0 = this.getTilesInDirection(2, ary, range);
         tiles1 = this.getTilesInDirection(3, ary, range);
         tiles2 = this.getTilesInDirection(6, ary, range);
       }
       break;
       case 4:{
         tiles0 = this.getTilesInDirection(1, ary, range);
         tiles1 = this.getTilesInDirection(4, ary, range);
         tiles2 = this.getTilesInDirection(7, ary, range);
       }
       break;
       case 6:{
         tiles0 = this.getTilesInDirection(3, ary, range);
         tiles1 = this.getTilesInDirection(6, ary, range);
         tiles2 = this.getTilesInDirection(9, ary, range);
       }
       break;
       case 7:{
         tiles0 = this.getTilesInDirection(4, ary, range);
         tiles1 = this.getTilesInDirection(7, ary, range);
         tiles2 = this.getTilesInDirection(8, ary, range);
       }
       break;
       case 8:{
         tiles0 = this.getTilesInDirection(7, ary, range);
         tiles1 = this.getTilesInDirection(8, ary, range);
         tiles2 = this.getTilesInDirection(9, ary, range);
       }
       break;
       case 9:{
         tiles0 = this.getTilesInDirection(8, ary, range);
         tiles1 = this.getTilesInDirection(9, ary, range);
         tiles2 = this.getTilesInDirection(6, ary, range);
       }
       break;
     }
     cout("last direction : " + this.lastDirectionTaken);
     let max0 = this.getBestTile(tiles0);
     let max1 = this.getBestTile(tiles1);
     let max2 = this.getBestTile(tiles2);
     if (typeof(max0) !== 'undefined' && typeof(max1) !== 'undefined' && typeof(max2) !== 'undefined'){
       //the three arrays exist
       cout("all arrays are defined");
       if (max0.pheromoneValue > max1.pheromoneValue){
         if (max0.pheromoneValue > max2.pheromoneValue){
           return max0;
         }
         else {
           return max2;
         }
       }
       else {
         if (max1.pheromoneValue > max2.pheromoneValue){
           return max1;
         }
         else{
           return max2;
         }
       }
     }
     else{
       if (typeof(max0) === 'undefined'){
         cout("max0 is undefined");
         if (typeof(max1) !== 'undefined' && typeof(max2) !== 'undefined'){
           if (max1.pheromoneValue > max2.pheromoneValue){
             return max1;
           }
           else{
             return max2;
           }
         }
         else if (typeof(max1) === 'undefined' && typeof(max2) !== 'undefined'){
           return max2;
         }
         else if (typeof(max1) !== 'undefined' && typeof(max2) === 'undefined'){
           return max1;
         }
         else{
           cout("error");
         }
       }
       if (typeof(max1) === 'undefined'){
         cout("max1 is undefined");
         if (typeof(max0) !== 'undefined' && typeof(max2) !== 'undefined'){
           if (max0.pheromoneValue > max2.pheromoneValue){
             return max0;
           }
           else{
             return max2;
           }
         }
         else if (typeof(max0) === 'undefined' && typeof(max2) !== 'undefined'){
           return max2;
         }
         else if (typeof(max0) !== 'undefined' && typeof(max2) === 'undefined'){
           return max0;
         }
         else{
           cout("error");
         }
       }
       if (typeof(max2) === 'undefined'){
         cout("max2 is undefined");
         if (typeof(max0) !== 'undefined' && typeof(max1) !== 'undefined'){
           if (max0.pheromoneValue > max1.pheromoneValue){
             return max0;
           }
           else{
             return max2;
           }
         }
         else if (typeof(max0) === 'undefined' && typeof(max1) !== 'undefined'){
           return max2;
         }
         else if (typeof(max0) !== 'undefined' && typeof(max1) === 'undefined'){
           return;
         }
         else{
           cout("error");
         }
       }
     }
   }
   //return the surrounding tiles, if they aren't obstructed / out of array
   getSurroundingTiles(map){
     let temp = new Array();
     if (this.check_next_position(1, map)){
       temp.push(map.ary[this.x-1][this.y+1]);
     }
     if (this.check_next_position(2, map)){
       temp.push(map.ary[this.x][this.y+1]);
     }
     if (this.check_next_position(3, map)){
       temp.push(map.ary[this.x+1][this.y+1]);
     }
     if (this.check_next_position(4, map)){
       temp.push(map.ary[this.x-1][this.y]);
     }
     if (this.check_next_position(6, map)){
       temp.push(map.ary[this.x+1][this.y]);
     }
     if (this.check_next_position(7, map)){
       temp.push(map.ary[this.x-1][this.y-1]);
     }
     if (this.check_next_position(8, map)){
       temp.push(map.ary[this.x][this.y-1]);
     }
     if (this.check_next_position(9, map)){
       temp.push(map.ary[this.x+1][this.y-1]);
     }
     return temp;
   }

   /* same function but with cordinates */
   check_next_positionCoord(x, y, map){
     if (typeof map.ary[x] === 'undefined'){
       cout("nope");
       return false;
     }
     else if (typeof map.ary[x][y] === 'undefined'){
       cout("nope");
       return false;
     }
     else{
       cout("CHEKING COORDINATES " + x  + ";" + y);
       if (y == map.height - 1){
         cout("false");
         return false;
       }
       else if (x == map.width - 1){
         return false;
       }
       else if (x < 0 || y < 0){
         return false;
       }
       else if (map.ary[x][y].canBeRunnedTrough()){
         return true;
       }
       else{
         return false;
       }
     }
   }
  // QoL function to check if the next tile is existent and non obstructed
  check_next_position(d, map){
    cout("---------------------------------------------------")
    cout(this.name + " is at position" + this.x + ";" + this.y);
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
   //Check if the ant is at home :)
   /* Check the highest pheromone value all around the ant */
   // NEEDS REFACTORING
   sensePheromoneGlobal(map, bestTilePositionX, bestTilePositionY){
     let maxValue = 0.0;
     let bestTile;
     let currentTile;
     let newValue = 0.0;
     if (this.check_next_position(1, map)){
       currentTile = this.getTile(map, this.x - 1, this.y + 1);
       newValue = currentTile.pheromoneValue;
       if (newValue > maxValue){
         maxValue = newValue;
         bestTile = currentTile;
       }
     }
     if (this.check_next_position(2, map)){
       currentTile = this.getTile(map, this.x, this.y + 1);
       newValue = currentTile.pheromoneValue;
       if (newValue > maxValue){
         maxValue = newValue;
         bestTile = currentTile;
       }
     }
     if (this.check_next_position(3, map)){
       currentTile = this.getTile(map, this.x + 1, this.y + 1);
       newValue = currentTile.pheromoneValue;
       if (newValue > maxValue){
         maxValue = newValue;
         bestTile = currentTile;
       }
     }
     if (this.check_next_position(4, map)){
       currentTile = this.getTile(map, this.x -1, this.y);
       newValue = currentTile.pheromoneValue;
       if (newValue > maxValue){
         maxValue = newValue;
         bestTile = currentTile;
       }
     }
     if (this.check_next_position(6, map)){
       currentTile = this.getTile(map, this.x+1, this.y);
       newValue = currentTile.pheromoneValue;
       if (newValue > maxValue){
         maxValue = newValue;
         bestTile = currentTile;
       }
     }
     if (this.check_next_position(7, map)){
       currentTile = this.getTile(map, this.x-1, this.y-1);
       newValue = currentTile.pheromoneValue;
       if (newValue > maxValue){
         maxValue = newValue;
         bestTile = currentTile;
       }
     }
     if (this.check_next_position(8, map)){
       currentTile = this.getTile(map, this.x, this.y-1);
       newValue = currentTile.pheromoneValue;
       if (newValue > maxValue){
         maxValue = newValue;
         bestTile = currentTile;
       }
     }
     if (this.check_next_position(9, map)){
       currentTile = this.getTile(map, this.x+1, this.y-1);
       newValue = currentTile.pheromoneValue;
       if (newValue > maxValue){
         maxValue = newValue;
         bestTile = currentTile;
       }
     }
     bestTilePositionX;
     bestTilePositionY;
     cout("highest pheromone value : " + maxValue);
     for (let y = 0; y < map.heigth; y++){
       for (let x = 0; x < map.width; x++){
         if (map.ary[x][y] == bestTile){
             cout("tile found at " + x + ";" + y);
             bestTilePositionX = x;
             bestTilePositionY = y;
         }
       }
     }
   }

   getTilesInDirection(d, map, range){
     let tempAry = new Array();
     switch(d){
       case 1:{
         for (let i = 1; i < range; i++){
           if (this.check_next_positionCoord(this.x - i, this.y + i, map)){
             tempAry.push(map.ary[this.x - i][this.y + i]);
             cout("pushing, i = " + i);
           }
         }
       }
       break;
       case 2:{
         for (let i = 1; i < range; i++){
           if (this.check_next_positionCoord(this.x, this.y + i, map)){
             tempAry.push(map.ary[this.x][this.y + i]);
             cout("pushing, i = " + i);
           }
         }
       }
       break;
       case 3:{
         for (let i = 1; i < range; i++){
           if (this.check_next_positionCoord(this.x + i, this.y + i, map)){
             tempAry.push(map.ary[this.x + i][this.y + i]);
             cout("pushing, i = " + i);
           }
         }
       }
       break;
       case 4:{
         for (let i = 1; i < range; i++){
           if (this.check_next_positionCoord(this.x - i, this.y, map)){
             tempAry.push(map.ary[this.x - i][this.y]);
           }
         }
       }
       break;
       case 6:{
         for (let i = 1; i < range; i++){
           if (this.check_next_positionCoord(this.x + i, this.y, map)){
             tempAry.push(map.ary[this.x + i][this.y]);
           }
         }
       }
       break;
       case 7:{
         for (let i = 1; i < range; i++){
           if (this.check_next_positionCoord(this.x - i, this.y - i, map)){
             tempAry.push(map.ary[this.x - i][this.y - i]);
           }
         }
       }
       break;
       case 8:{
         for (let i = 1; i < range; i++){
           if (this.check_next_positionCoord(this.x, this.y, map)){
             tempAry.push(map.ary[this.x][this.y - i]);
           }
         }
       }
       break;
       case 9:{
         for (let i = 1; i < range; i++){
           if (this.check_next_positionCoord(this.x + i, this.y, map)){
             tempAry.push(map.ary[this.x + i][this.y - i]);
           }
         }
       }
       break;
     }
     if (typeof(tempAry) !== 'undefined'){
       cout ("--------------");
       cout("ary obtained : ");
       for (let i = 0; i < tempAry.length - 1; i++){
         cout(i + ": [" + tempAry[i].x + ":" + tempAry[i].y + "] - pheromone value : " + tempAry[i].pheromoneValue);
       }
     }
     return tempAry;
   }
   /*end of class*/
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
