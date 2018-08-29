// The MIT License (MIT)
//
// Copyright (c) 2015 Noé Falzon
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

HTMLView = function(game) {
  // this.topbar = document.querySelector("#topbar");
  this.palette = document.querySelector("#palette");
  // this.toprightButton = document.querySelector("#topright-button");
  this.grid = document.querySelector("#grid");
  this.overlay = document.querySelector("#overlay");

  this.game = game;

  this.try = [];

  this.loadTopBar();
  // this.setupUpdate();
};


HTMLView.prototype.loadTopBar = function() {
  var thiz = this;
  var game = this.game;
  // Boutons de couleur
  for (let i = 0; i < game.nbCol; i++) {
    let dom = document.createElement("li");
    dom.className = "block block-" + i;
    // dom.style.left = i * 100 + "px";
    // dom.style.top = i * width + "px";

    dom.onclick = function() {
      thiz.addPawn(i);
    };
    thiz.palette.appendChild(dom);
  };

  let dom = null;
  let dom2 = null;

  // Bouton Reset
  dom = document.createElement("li");
  dom2 = document.createElement("span"); //span
  dom2.id = "topright-button";
  dom2.innerHTML = "Reset";
  dom.onclick = function() {
    thiz.resetAction();
  };
  dom.appendChild(dom2);
  thiz.palette.appendChild(dom);


  // Bouton Essayer
  dom = document.createElement("li");
  dom2 = document.createElement("span"); //span
  dom2.id = "topright-button";
  dom2.innerHTML = "Essayer";
  dom.onclick = function() {
    thiz.tryAction();
  };
  dom.appendChild(dom2);

  thiz.palette.appendChild(dom);

};

HTMLView.prototype.addPawn = function(color) {
  if (this.try.length < this.game.nbDig) {
    this.try.push(color);
    // console.log(this.try);
    this.updateTry();
  }

};

HTMLView.prototype.resetAction = function() {
  this.try = [];
  this.updateTry();
};


HTMLView.prototype.tryAction = function() {
  console.log("coucou");
  if (this.try.length === this.game.nbDig) {
    console.log("check!");
    let note = this.game.noteTry(this.try);
    console.log(note);
    let dom = document.getElementById("currentTry");
    dom.id = "oldTry";
    this.resetAction();
  }
};


HTMLView.prototype.updateTry = function() {

  let dom = document.getElementById("currentTry");
  if (dom !== null) {
    this.grid.removeChild(dom);
  }

  dom = document.createElement("ul");
  dom.id = "currentTry";

  // Boutons de couleur
  for (let i = 0; i < this.try.length; i++) {
    let dom2 = document.createElement("li");
    dom2.className = "block block-" + this.try[i];
    dom.appendChild(dom2);
  };
  this.grid.appendChild(dom);


};



HTMLView.prototype.makeBlock = function(block) {
  var game = this.game;


  this.updateValue(block);
  this.placeBlock(block);
};

HTMLView.prototype.placeBlock = function(block, merge) {
  var firstTime = block.dom.style.left == "";

  var width = block.dom.offsetWidth;
  block.dom.style.left = block.v * width + "px";
  block.dom.style.top = block.u * width + "px";

};

HTMLView.prototype.removeBlock = function(block) {
  this.grid.removeChild(block.dom);
};

HTMLView.prototype.updateValue = function(block) {
  block.dom.className = "block block-" + (block.value <= 2048 ? block.value : "over");
  block.dom.innerHTML = block.value;
};

HTMLView.prototype.bounce = function(block) {
  block.dom.classList.add("bouncing");
};

HTMLView.prototype.setupUpdate = function() {
  var thiz = this;

  var updateCB = function(timestamp) {
    thiz.update(timestamp);
    window.requestAnimationFrame(updateCB);
  };

  updateCB(0);
};

HTMLView.prototype.update = function(ts) {
  this.now = ts;

  if (!this.running || this.pause)
    return;

  if (this.nextFall != null && ts >= this.nextFall) {
    this.nextFall = null;
    this.game.stepFalling();
  }
};

HTMLView.prototype.setNextFall = function(ms) {
  this.nextFall = this.now + ms;
};

HTMLView.prototype.updateScore = function() {
  this.score.innerHTML = this.game.score;
};

HTMLView.prototype.updateNextBlock = function() {
  this.nextBlock.innerHTML = this.game.nextValue;
  this.nextBlock.className = "block-" + this.game.nextValue;
  this.nextBlock.style.visibility = "visible";
};

HTMLView.prototype.togglePause = function() {
  if (!this.pause) {
    this.pause = true;
    this.overlay.innerHTML = "Paused...";
    this.overlay.style.left = "0px";
    this.toprightButton.innerHTML = "Resume";
  } else {
    this.pause = false;
    this.overlay.style.left = "110%";
    this.toprightButton.innerHTML = "Pause";
  }
};

HTMLView.prototype.gameOver = function() {
  this.running = false;
  this.overlay.innerHTML = "Game over!";
  this.overlay.style.left = "0px";

  this.toprightButton.innerHTML = "Restart";
};

function isFullScreen() {
  return document.fullscreenElement ||
    document.mozFullScreenElement ||
    document.webkitFullscreenElement ||
    document.msFullscreenElement;
};

function goFullScreen() {
  var doc = document.documentElement;

  if (doc.requestFullscreen)
    doc.requestFullscreen();
  else if (doc.mozRequestFullScreen)
    doc.mozRequestFullScreen();
  else if (doc.webkitRequestFullScreen)
    doc.webkitRequestFullScreen();
  else if (doc.msRequestFullScreen)
    doc.msRequestFullScreen();
};

function setStyle(name) {
  var links = document.getElementsByTagName("link");
  for (var i = 0; i < links.length; i++) {
    if (links[i].rel.indexOf("stylesheet") != -1 && links[i].title) {
      links[i].disabled = (links[i].title != name);
    }
  }
};