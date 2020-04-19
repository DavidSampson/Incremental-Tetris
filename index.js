
const blocksHigh = 20;
const blocksWide = 10;
const moveTime = 1000;
/* Grabbing the #tetris container and saving it as a variable
so that we can manipulate it later. */
const container = document.getElementById('tetris');
container.style.setProperty('--blocks-high', blocksHigh);
container.style.setProperty('--blocks-wide', blocksWide);
const startingCoordinates = [2,1];

let restingBlocks = [];
class MovableObject {
  init(x, y, container){
    this.x = x;
    this.y = y;

    if(container)
      this.addToDisplay(container);
  }
  canMoveDown(){
    let next = this.copy();
    next.moveDown();
    return next.isValid();
  }
  moveDown(){
    this.y++;
  }
  canMoveLeft(){
    let next = this.copy();
    next.moveLeft();
    return next.isValid();
  }
  moveLeft(){
    this.x--;
  }
  canMoveRight(){
    let next = this.copy();
    next.moveRight();
    return next.isValid();
  }
  moveRight(){
    this.x++;
  }
}
class Block extends MovableObject {
  constructor(...args){
    super();
    this.el = document.createElement('div');
    this.el.classList.add('block');
    this.init(...args);

  }
  get x(){
    return parseInt(this.el.style.getPropertyValue('--x-coord'));
  }
  set x(v){
    this.el.style.setProperty('--x-coord', v);
  }
  get y(){
    return parseInt(this.el.style.getPropertyValue('--y-coord'));
  }
  set y(v){
    this.el.style.setProperty('--y-coord', v);
  }
  addToDisplay(container){
    container.appendChild(this.el);
    return this;
  }
  removeFromDisplay(){
    this.el.remove();
  }
  isInBounds(){
    return (this.x >= 0) && (this.y < blocksHigh) && (this.x < blocksWide);
  }
  isValid(){
    return this.isInBounds() && restingBlocks.every(block => !this.intersects(block));
  }
  intersects(block){
    return this.x == block.x && this.y == block.y;
  }
  copy(){
    return new Block(this.x, this.y);
  }
}

class Shape extends MovableObject {
  constructor(shape, ...args){
    super();
    this.blocks = [];
    for(let [x,y] of shape){
      let block = new Block(x,y);
      block.localX = x;
      block.localY = y;
      this.blocks.push(block);
    }
    this.init(...args);
  }
  get x(){
    return this._x;
  }
  set x(v){
    this._x = v;
    for(let block of this.blocks){
      block.x = v + block.localX;
    }
  }
  get y(){
    return this._y;
  }
  set y(v){
    this._y = v;
    for(let block of this.blocks){
      block.y = v + block.localY;
    }
  }
  addToDisplay(container){
    for(let block of this.blocks){
      block.addToDisplay(container);
    }
  }
  removeFromDisplay(){
    for(let block of this.blocks){
      block.removeFromDisplay();
    }
  }
  isValid(){
    return this.blocks.every(block => block.isValid());
  }

  canRotate(){
    let next = this.copy();
    next.rotate();
    return next.isValid();
  }
  rotate(){
    for(let block of this.blocks){
      block.x += block.localY - block.localX;
      block.y += -block.localX - block.localY;
      ([block.localX, block.localY] = [block.localY, -block.localX]);
    }
  }
  intersects(block){
    return this.blocks.every(myBlock => !block.intersects(myBlock));
  }

  copy(){
    let locals = [];
    for(let block of this.blocks){
      locals.push([block.localX, block.localY]);
    }
    return new Shape(locals, this.x, this.y);
  }

  static square(...args){
    return new Shape([ [0,-1],   [0,0],    [1,-1], [1,0] ],...args);
  }
  static straight(...args){
    return new Shape([ [-1,0],   [0, 0],   [1, 0], [2, 0] ], ...args);
  }
  static L(...args){
    return new Shape([ [-1,0],   [-1,-1],  [0,-1], [1,-1]], ...args);
  }
  static J(...args){
    return new Shape([ [-1,-1],  [0,-1],   [1,-1], [1,0]], ...args);
  }
  static S(...args){
    return new Shape([ [0,0],    [0,-1],   [-1,0], [1,-1]], ...args);
  }
  static Z(...args){
    return new Shape([ [0,0],    [-1,-1],  [0,-1], [1,0] ], ...args);
  }
  static T(...args){
    return new Shape([ [0,0],    [-1, 0],  [1, 0], [0,-1] ], ...args);
  }
  static random(...args){
    switch(Math.floor(Math.random() * 7)) {
      case 0: return Shape.square(...args);
      case 1: return Shape.straight(...args);
      case 2: return Shape.L(...args);
      case 3: return Shape.J(...args);
      case 4: return Shape.S(...args);
      case 5: return Shape.Z(...args);
      case 6: return Shape.T(...args);
    }
  }
}
var currentShape = null;

document.addEventListener('keydown', e => {
  if(currentShape){
    switch(e.which){
      case 37: // Left arrow
        if(currentShape.canMoveLeft()) currentShape.moveLeft();
        break;
      case 38: // Up arrow
        if(currentShape.canRotate()) currentShape.rotate();
        break;
      case 39: // Right arrow
        if(currentShape.canMoveRight()) currentShape.moveRight();
        break;
      case 40: // Down arrow
        if(currentShape.canMoveDown()) currentShape.moveDown();
        break;
      case 48:
        if(currentShape) currentShape.removeFromDisplay();
        currentShape = Shape.straight(...startingCoordinates,container);
        break;
      case 49:
        if(currentShape) currentShape.removeFromDisplay();
        currentShape = Shape.square(...startingCoordinates,container);
        break;
      case 50:
        if(currentShape) currentShape.removeFromDisplay();
        currentShape = Shape.L(...startingCoordinates,container);
        break;
      case 51:
        if(currentShape) currentShape.removeFromDisplay();
        currentShape = Shape.J(...startingCoordinates,container);
        break;
      case 52:
        if(currentShape) currentShape.removeFromDisplay();
        currentShape = Shape.S(...startingCoordinates,container);
        break;
      case 53:
        if(currentShape) currentShape.removeFromDisplay();
        currentShape = Shape.Z(...startingCoordinates,container);
        break;
      case 54:
        if(currentShape) currentShape.removeFromDisplay();
        currentShape = Shape.T(...startingCoordinates,container);
        break;
      default: break;
    }
  }
});
var score = 0;
function gameLoop(){
  if(currentShape.canMoveDown()){
    currentShape.moveDown();
    setTimeout(gameLoop, moveTime);
  }
  else {
    for(let block of currentShape.blocks)
      restingBlocks.push(block);

    for(let i = 0; i < blocksHigh; i++){
      let row =restingBlocks.filter(block => block.y === i);
      if(row.length == blocksWide){
        score++;
        row.forEach(block => block.removeFromDisplay());
        restingBlocks = restingBlocks.filter(b => !row.includes(b));
        restingBlocks.forEach(block => {
          if(block.y < i)
            block.moveDown();
        })
      }
    }

    currentShape = Shape.random(...startingCoordinates, container);
    if(currentShape.isValid())
      setTimeout(gameLoop, moveTime);
    else
      alert(score);
  }

}

/* Let's test these functions out */

currentShape = Shape.random(...startingCoordinates, container);

gameLoop();