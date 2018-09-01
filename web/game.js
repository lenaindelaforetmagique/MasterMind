// The MIT License (MIT)
//
// Copyright (c) 2018 Xavier Morin
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.


Block = function(value) {
  this.value = value;
  this.u = null;
  this.v = null;

  this.lastFall = 0;
};

Game = function(nbDigits, nbColors) {
  // some info

  this.nbDig = nbDigits;
  this.nbCol = nbColors;

  this.target = [];
  this.tryCount = 0;

  this.html = new HTMLView(this);

  this.init();
};

Game.prototype.init = function() {
  this.tryCount = 0;
  this.target = [];
  for (let i = 0; i < this.nbDig; i++) {
    this.target.push(Math.floor(Math.random() * this.nbCol));
  };

  console.log("Solution :", this.target);
};

Game.prototype.noteTry = function(try_) {
  this.tryCount += 1;
  var a = 0;
  var b = 0;
  var tar1 = [];
  var try1 = [];
  // Count of common colors at same place
  for (let i = 0; i < this.target.length; i++) {
    if (this.target[i] === try_[i]) {
      a += 1;
    } else {
      tar1.push(this.target[i]);
      try1.push(try_[i]);
    }
  };

  tar1.sort();
  try1.sort();

  while (tar1.length > 0 && try1.length > 0) {
    if (tar1[0] < try1[0]) {
      tar1.shift();
    } else if (tar1[0] > try1[0]) {
      try1.shift();
    } else {
      b += 1;
      tar1.shift();
      try1.shift();
    }
  };
  return [a, b];
};


Game.prototype.makeNextBlock = function() {
  this.nextValue = this.startValues[Math.floor(Math.random() * this.startValues.length)];
  this.html.updateNextBlock();
};

Game.prototype.spawnBlock = function() {
  var value = this.nextValue;
  var block = new Block(value);

  var su = 0;
  var sv = Math.floor(this.w / 2);

  var existing = this.getBlock(su, sv);
  if (existing != null) {
    this.html.gameOver();
    return;
  }

  block.u = 0;
  block.v = Math.floor(this.w / 2);
  block.lastFall = this.fallCount;

  this.grid[block.u][block.v] = block;
  this.lastSpawned = block;

  this.html.makeBlock(block);

  // start falling

  this.html.setNextFall(this.fallDelay);

  // prepare next

  this.makeNextBlock();
};

Game.prototype.getBlock = function(u, v) {
  if (u < 0 || u >= this.h || v < 0 || v >= this.w)
    return null;

  return this.grid[u][v];
};

Game.prototype.moveBlock = function(u, v, block, merge) {
  this.grid[block.u][block.v] = null;
  block.u = u;
  block.v = v;

  if (!merge)
    this.grid[block.u][block.v] = block;

  this.html.placeBlock(block, merge);
};

Game.prototype.getMergeableNeighbors = function(b) {
  var res = [];
  var block;

  block = this.getBlock(b.u, b.v - 1);
  if (block != null && block.value == b.value && block.lastFall <= b.lastFall)
    res.push(block);

  block = this.getBlock(b.u, b.v + 1);
  if (block != null && block.value == b.value && block.lastFall <= b.lastFall)
    res.push(block);

  var block = this.getBlock(b.u + 1, b.v);
  if (block != null && block.value == b.value && block.lastFall <= b.lastFall)
    res.push(block);

  return res;
};

Game.prototype.canFall = function(block) {
  if (block.u == this.h - 1)
    return false;

  var down = this.getBlock(block.u + 1, block.v);
  return down == null;
};

Game.prototype.stepFalling = function() {
  var moved = false;
  var merged = false;

  this.fallCount++;

  // check merges first

  for (var u = this.h - 1; u >= 0; u--) {
    for (var v = 0; v < this.w; v++) {
      var block = this.getBlock(u, v);
      if (block == null)
        continue;

      if (!this.canFall(block)) {
        if (block == this.lastSpawned)
          this.lastSpawned = null;

        if (this.checkMerge(block))
          merged = true;
      }
    }
  }

  if (merged) {
    this.fastMode = true;
    this.html.setNextFall(this.fastDelay);

    return;
  }

  // if there was no merges, check moves

  for (var u = this.h - 1; u >= 0; u--) // go bottom up for easier grid manipulation (hole propagation)
  {
    for (var v = 0; v < this.w; v++) {
      var block = this.getBlock(u, v);
      if (block == null)
        continue;

      if (this.canFall(block)) {
        this.moveBlock(u + 1, v, block);
        block.lastFall = this.fallCount;
        moved = true;
      }
    }
  }

  // if something moved, fall again
  if (moved) {
    this.html.setNextFall(this.fastMode ? this.fastDelay : this.fallDelay);
  }

  // if nothing moved, spawn a new block!
  else {
    this.fastMode = false;
    this.spawnBlock();
  }
};

Game.prototype.slide = function(dir) // -1, +1 (left, right)
{
  if (this.lastSpawned == null)
    return;

  var u = this.lastSpawned.u;
  var v = this.lastSpawned.v;

  if (v + dir < 0 || v + dir >= this.w)
    return;

  var side = this.getBlock(u, v + dir);
  if (side == null) {
    this.moveBlock(u, v + dir, this.lastSpawned);
  }
};

Game.prototype.drop = function() {
  var block = this.lastSpawned;
  if (block == null)
    return;

  this.fallCount++;

  var lastFree = -1;
  for (var u = block.u + 1; u < this.h; u++) {
    if (this.getBlock(u, block.v) == null)
      lastFree = u;
    else
      break;
  }

  if (lastFree > 0) {
    this.moveBlock(lastFree, block.v, block);
    block.lastFall = this.fallCount;
    this.html.setNextFall(this.fastDelay);
  }
};

Game.prototype.blockMoved = function(block) {
  if (block.merging) {
    this.html.removeBlock(block);
  }
};

Game.prototype.checkMerge = function(block) {
  var n = this.getMergeableNeighbors(block);

  if (n.length == 0)
    return false;

  for (var i = 0; i < n.length; i++) {
    this.moveBlock(block.u, block.v, n[i], true); // true for merge (don't replace destination)
    n[i].merging = true;

    block.value *= 2;
  }

  this.score += block.value;
  this.html.updateValue(block);
  this.html.updateScore();
  this.html.bounce(block);
  this.updateFallingSpeed();

  return true;
};

Game.prototype.updateFallingSpeed = function() {
  var bpm = 100 + 200 * this.score / 200000;
  this.fallDelay = 60 / bpm * 1000;
};

var game = new Game(4, 6);