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
    dom.className = "codePeg codePeg-" + i;

    dom.onclick = function() {
      thiz.addPeg(eval(dom.className.split('-').pop()));
    };
    thiz.palette.appendChild(dom);
  };

  let dom = null;
  let dom2 = null;

  // Bouton Reset-try
  dom = document.createElement("li");
  dom2 = document.createElement("span"); //span
  dom2.id = "topright-button";
  dom2.innerHTML = "ResetTry";
  dom2.onclick = function() {
    thiz.resetTry();
  };
  dom.appendChild(dom2);
  thiz.palette.appendChild(dom);


  // Bouton Essayer
  dom = document.createElement("li");
  dom2 = document.createElement("span"); //span
  dom2.id = "topright-button";
  dom2.innerHTML = "Essayer";
  dom2.onclick = function() {
    thiz.checkTry();
  };
  dom.appendChild(dom2);
  thiz.palette.appendChild(dom);

};

HTMLView.prototype.addPeg = function(color) {
  if (this.try.length < this.game.nbDig) {
    this.try.push(color);
    this.updateTry();
    // console.log(this.try);
  }
};

HTMLView.prototype.resetTry = function() {
  this.try = [];
  this.updateTry();
};


HTMLView.prototype.checkTry = function() {
  if (this.try.length === this.game.nbDig) {
    let note = this.game.noteTry(this.try);
    console.log("Current Try :", this.try);
    // console.log("checkNote", note);
    let a = note[0];
    this.printNote(note);

    let dom = document.getElementById("currentTry");
    dom.id = "oldTry";

    if (a === this.game.nbDig) {
      this.endOfGame();
    } else {
      this.resetTry();
    }
  }
};


HTMLView.prototype.updateTry = function() {
  let dom = document.getElementById("currentTry");
  if (dom !== null) {
    this.grid.removeChild(dom);
  }

  dom = document.createElement("div");
  dom.id = "currentTry";

  // Played pegs
  for (let i = 0; i < this.try.length; i++) {
    let dom2 = document.createElement("div");
    dom2.className = "codePeg codePeg-" + this.try[i];
    let width = 40; //dom2.offsetWidth;
    let height = 40; //dom2.offsetHeight;
    // console.log(width, height);
    dom2.style.position = "absolute";
    dom2.style.left = i * width + "px";
    dom2.style.top = this.game.tryCount * height + "px";
    dom.appendChild(dom2);
  };
  this.grid.appendChild(dom);
};

HTMLView.prototype.printNote = function(note) {
  let dom = document.getElementById("currentTry");
  if (dom === null) {
    return;
  }
  let dom2 = document.createElement("div");
  dom2.id = "keyPegContainer";

  for (let i = 0; i < this.game.nbDig; i++) {
    let u = Math.floor(i / 2);
    let v = i % 2;
    let dom3 = document.createElement("div");
    if (note[0] > 0) {
      dom3.className = "keyPeg keyPeg-0";
      note[0] -= 1;
    } else if (note[1] > 0) {
      dom3.className = "keyPeg keyPeg-1";
      note[1] -= 1;
    } else {
      dom3.className = "keyPeg keyPeg-2";
    }
    let width = 20; //dom3.offsetWidth;
    let height = 20; //dom3.offsetHeight;
    dom3.style.left = (this.game.nbDig * 40 + u * width) + "px";
    dom3.style.top = ((this.game.tryCount - 1) * 40 + v * height) + "px";
    dom2.appendChild(dom3);
  };
  dom.appendChild(dom2);
  //this.grid.appendChild(dom);

};


HTMLView.prototype.endOfGame = function() {
  this.overlay.innerHTML = "Trouvé en " + this.game.tryCount + " coups !";
  this.overlay.style.left = "0px";

  // this.toprightButton.innerHTML = "Restart";
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