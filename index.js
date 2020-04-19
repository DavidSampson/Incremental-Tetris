
/* Grabbing the #tetris container and saving it as a variable
so that we can manipulate it later. */
const container = document.getElementById('tetris');

/* I'm going to create a couple of functions to make blocks and move them
around. Later, I may consolidate these into a class, but for now I'll keep
it simple and just use the bare functions. */


/**
 * makeBlock - A function that creates a DOM element for a block, without
 * displaying it.
 * @param {Number} x The x coordinate for the new block, where 0 is the
 * leftmost position in the display, and increasing values move to the right
 * @param {Number} y The y coordinate for the new block, where 0 is the top of
 * the display, and increasing numbers move down the display to the bottom
 * @returns {Element} The DOM element for the block, which is not yet attached
 * to a parent element.
 */
function makeBlock(x=0, y=0){ // Giving a default value for the x and y coordinates
  let block = document.createElement('div');
  block.classList.add('block'); // I'm using the .block class to style blocks
  setBlockCoordinate(block, x, y); // This function is defined later
  return block;

  /* Notice that I created a DOM element, made some modifications to it, and
  returned it, but I did NOT add it to the container, so it will not be
  displayed at this point. This is important, as I want to be able to create
  blocks without displaying them. */
}

/**
 * setBlockCoordinate - Sets the x and y coordinates for a .block DOM element
 * @param {Element} block A DOM element for a .block
 * @param {Number} x The x coordinate for the block
 * @param {Number} y The y coordinate for the block
 */
function setBlockCoordinate(block, x, y){
  /* We can manipulate CSS properties on a DOM element with
  el.style.setProperty. Here we overwrite the --x-coord and --y-coord values
  for a block */
  block.style.setProperty('--x-coord', x);
  block.style.setProperty('--y-coord', y);
}

/**
 * getBlockCoordinates - Retrieves the x and y coordinates for a .block
 * @param {Element} block A DOM element for a .block
 * @returns {Number[]} [x, y]
 */
function getBlockCoordinate(block){
  /* As far as javascript is concerned, CSS properties are strings, so we
  use the getPropertyValue (the twin of setProperty from above) function and pass the
  value through parseInt to convert it to a number. */
  let x = parseInt(block.style.getPropertyValue('--x-coord'));
  let y = parseInt(block.style.getPropertyValue('--y-coord'));
  return [ x, y ];
}

/* Let's test these functions out */

// Create a block, but do not display it.
let myBlock = makeBlock(7, 3);

// Create a block, display it, change the coordinate, print the coordinate.
let myOtherBlock = makeBlock(2,2);
container.appendChild(myOtherBlock);
setBlockCoordinate(myOtherBlock, 3,3);
console.log(getBlockCoordinate(myOtherBlock));