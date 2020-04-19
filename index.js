
const blocksHigh = 20;
const blocksWide = 10;
const moveTime = 1000;
/* Grabbing the #tetris container and saving it as a variable
so that we can manipulate it later. */
const container = document.getElementById('tetris');
container.style.setProperty('--blocks-high', blocksHigh);
container.style.setProperty('--blocks-wide', blocksWide);

class MovableObject {
  init(x, y, container){
    this.x = x;
    this.y = y;

    if(container)
      this.addToDisplay(container);
  }
  canMoveDown(){
    return this.y < blocksHigh - 1
  }
  moveDown(){
    if(this.canMoveDown())
      this.y++;
  }
  canMoveLeft(){
    return this.x > 0;
  }
  moveLeft(){
    if(this.canMoveLeft())
      this.x--;
  }
  canMoveRight(){
    return this.x < blocksWide - 1;
  }
  moveRight(){
    if(this.canMoveRight())
      this.x++;
  }
}
class Block extends MovableObject {
  constructor(...args){
    super();
    this.el = document.createElement('div');
    this.el.classList.add('block');
    this.init(...args);

    /* Notice that I created a DOM element, made some modifications to it, and
    returned it, but I did NOT add it to the container, so it will not be
    displayed at this point. This is important, as I want to be able to create
    blocks without displaying them. */
  }
  get x(){
     /* As far as javascript is concerned, CSS properties are strings, so we
    use the getPropertyValue (the twin of setProperty from below) function and pass the
    value through parseInt to convert it to a number. */
    return parseInt(this.el.style.getPropertyValue('--x-coord'));
  }
  set x(v){
    /* We can manipulate CSS properties on a DOM element with
    el.style.setProperty. Here we overwrite the --x-coord value
    for a block */
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
  canMoveLeft(){
    return this.blocks.every(block => block.canMoveLeft());
  }
  canMoveRight(){
    return this.blocks.every(block => block.canMoveRight());
  }
  canMoveDown(){
    return this.blocks.every(block => block.canMoveDown());
  }
  rotate(){
    for(let block of this.blocks){
      block.x += block.localY - block.localX;
      block.y += -block.localX - block.localY;
      ([block.localX, block.localY] = [block.localY, -block.localX]);
    }
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
}
var currentShape = null;

document.addEventListener('keydown', e => {
  if(currentShape){
    switch(e.which){
      case 37: // Left arrow
        currentShape.moveLeft();
        break;
      case 38: // Up arrow
        currentShape.rotate();
        break;
      case 39: // Right arrow
        currentShape.moveRight();
        break;
      case 40: // Down arrow
        currentShape.moveDown();
        break;
      case 48:
        currentShape.removeFromDisplay();
        currentShape = Shape.straight(0,0,container);
        break;
      case 49:
        currentShape.removeFromDisplay();
        currentShape = Shape.square(0,0,container);
        break;
      case 50:
        currentShape.removeFromDisplay();
        currentShape = Shape.L(0,0,container);
        break;
      case 51:
        currentShape.removeFromDisplay();
        currentShape = Shape.J(0,0,container);
        break;
      case 52:
        currentShape.removeFromDisplay();
        currentShape = Shape.S(0,0,container);
        break;
      case 53:
        currentShape.removeFromDisplay();
        currentShape = Shape.Z(0,0,container);
        break;
      case 54:
        currentShape.removeFromDisplay();
        currentShape = Shape.T(0,0,container);
        break;
      default: break;
    }
  }
});

function gameLoop(){
  console.log(JSON.stringify(currentShape,null,2));
  currentShape.moveDown();
  setTimeout(gameLoop, moveTime);
}

/* Let's test these functions out */

currentShape = Shape.straight(0,0,container);

gameLoop();