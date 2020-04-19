
const blocksHigh = 20;
const blocksWide = 10;
const moveTime = 1000;
/* Grabbing the #tetris container and saving it as a variable
so that we can manipulate it later. */
const container = document.getElementById('tetris');
container.style.setProperty('--blocks-high', blocksHigh);
container.style.setProperty('--blocks-wide', blocksWide);

class Block {
  constructor(x=0, y=0, container){
    this.el = document.createElement('div');
    this.el.classList.add('block');
    this.x = x;
    this.y = y;

    if(container)
      this.addToDisplay(container);

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

  lower(){
    this.y++;
  }

  addToDisplay(container){
    container.appendChild(this.el);
    return this;
  }
}

const movingBlocks = [];

function gameLoop(){
  for(let block of movingBlocks){
    if(block.y < blocksHigh - 1)
      block.lower();
  }
  setTimeout(gameLoop, moveTime);
}

/* Let's test these functions out */

movingBlocks.push(new Block(2,2, container));
movingBlocks.push(new Block(7,3, container));

gameLoop();