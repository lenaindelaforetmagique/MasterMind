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

removeChildren = function(dom) {
  while (dom.firstChild) {
    dom.removeChild(dom.firstChild);
  };
};


HTMLView = function(game) {
  this.container = document.querySelector("#container")
  this.topbar = document.querySelector("#topbar");
  this.board = document.querySelector("#board");
  this.pegBank = document.querySelector("#pegBank");
  this.grid = document.querySelector("#grid");
  this.scores = document.querySelector("#scores");

  this.overlay = document.querySelector("#overlay");

  this.game = game;
  this.canPlay = true;

  this.try = [];

  this.setupView();
  this.loadTopBar();
  this.loadPegBank();
  this.freezeMove(this.board);
  // this.setupUpdate();
};

HTMLView.prototype.freezeMove = function(dom) {
  let events = [
    "mousemove",
    "touchmove"
  ];

  for (let i = 0; i < events.length; i++) {
    dom.addEventListener(events[i], function(e) {
      e.preventDefault();
    });
  };
};


HTMLView.prototype.setupView = function() {
  // let a = domWidth(document.getElementById("scores"));
  // let b = domWidth(document.getElementById("grid"));
  // let c = domWidth(document.getElementById("pegBank"));
  // console.log(a, b, c);
  // console.log(a + b + c);
  // console.log(document.body.clientWidth);
  // // document.body.clientWidth = a + b + c;

  var thiz = this;

  window.onload =
    window.onresize = function() {
      var height = window.innerHeight;
      var margin = (height - thiz.container.offsetHeight) / 2;
      if (margin < 0)
        margin = 0;

      thiz.container.style.marginTop = margin + "px";

    };

};


domWidth = function(element) {
  let style = element.currentStyle || window.getComputedStyle(element),
    width = element.offsetWidth, // or use style.width
    margin = parseFloat(style.marginLeft) + parseFloat(style.marginRight),
    padding = parseFloat(style.paddingLeft) + parseFloat(style.paddingRight),
    border = parseFloat(style.borderLeftWidth) + parseFloat(style.borderRightWidth);

  return (width + margin); // - padding - border);
};

HTMLView.prototype.loadTopBar = function() {
  var thiz = this;
  let dom = null;

  // Bouton New Game
  dom = document.createElement("span");
  dom.id = "button";
  dom.innerHTML = "New Game";
  dom.onclick = function() {
    thiz.newGame();
  };
  thiz.topbar.appendChild(dom);

  // Bouton Reset-try
  dom = document.createElement("span");
  dom.id = "button";
  dom.innerHTML = "Clear";
  dom.onclick = function() {
    console.log(thiz.canPlay);
    if (thiz.canPlay) {
      thiz.resetTry();
    };
  };
  thiz.topbar.appendChild(dom);


  // Bouton Essayer
  dom = document.createElement("span");
  dom.id = "button";
  dom.innerHTML = "Play";
  dom.onclick = function() {
    console.log(thiz.canPlay);
    if (thiz.canPlay) {
      thiz.checkTry();
    };
  };
  thiz.topbar.appendChild(dom);

};


HTMLView.prototype.loadPegBank = function() {
  var thiz = this;
  var game = this.game;
  // Boutons de couleur
  for (let i = 0; i < game.nbCol; i++) {
    let dom = document.createElement("div");
    dom.className = "codePeg codePeg-" + i;
    dom.setAttribute("style", "cursor: pointer;");
    /* cursor: pointer; */
    dom.onclick = function() {
      thiz.playPeg(eval(dom.className.split('-').pop()));
    };
    thiz.pegBank.appendChild(dom);
  };
};

HTMLView.prototype.newGame = function() {
  removeChildren(this.scores);
  removeChildren(this.grid);

  removeChildren(this.overlay);
  this.overlay.innerHTML = "";
  this.overlay.id = "overlay";

  this.resetTry();

  this.canPlay = true;
  this.game.init();
};

HTMLView.prototype.resetTry = function() {
  this.try = [];
  this.updateTry();
};

HTMLView.prototype.playPeg = function(color) {
  if (this.try.length < this.game.nbDig) {
    this.try.push(color);
    this.updateTry();
    // console.log(this.try);
  }
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
    dom.className = "oldTry";

    if (a === this.game.nbDig) {
      this.endOfGame();
    } else if (this.game.tryCount === 10) {
      this.gameOver();
    } else {
      this.resetTry();
    }
  }
};


HTMLView.prototype.updateTry = function() {
  let dom = document.getElementById("currentTry");
  if (dom !== null) {
    dom.remove();
  }

  dom = this.showCombination(this.try);
  dom.id = "currentTry";

  this.grid.appendChild(dom);
};


HTMLView.prototype.showCombination = function(table) {
  console.log(table);
  let dom = document.createElement("div");

  for (let i = 0; i < table.length; i++) {
    let dom2 = document.createElement("div");
    dom2.className = "codePeg codePeg-" + table[i];
    dom.appendChild(dom2);
    console.log(table[i]);
  };
  return dom;
};



HTMLView.prototype.printNote = function(note) {
  let dom = document.createElement("div");
  dom.id = "keyPegContainer";

  for (let i = 0; i < this.game.nbDig; i++) {
    let dom2 = document.createElement("div");
    if (note[0] > 0) {
      dom2.className = "keyPeg keyPeg-0";
      note[0] -= 1;
    } else if (note[1] > 0) {
      dom2.className = "keyPeg keyPeg-1";
      note[1] -= 1;
    } else {
      dom2.className = "keyPeg keyPeg-2";
    }
    dom.appendChild(dom2);
  };
  this.scores.appendChild(dom);
};


HTMLView.prototype.endOfGame = function() {
  // overlay End of game
  var a = this.game.tryCount;
  this.overlay.innerHTML = "Trouvé en " + a + (a > 1 ? " coups !" : " coup !!")
  this.overlay.id = "overlay-active";

  this.canPlay = false;
};

HTMLView.prototype.gameOver = function() {
  this.canPlay = false;

  // overlay Game Over
  this.overlay.innerHTML = "Game over!";
  this.overlay.id = "overlay-active";



  let dom = this.showCombination(this.game.solution);
  dom.id = "solution";

  this.overlay.appendChild(dom);


};