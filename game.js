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

Game = function(nbDigits, nbColors, limit) {
  this.nbDig = nbDigits;
  this.nbCol = nbColors;
  this.maxCount = limit;

  this.solution = [];
  this.guessCount = 0;

  this.html = new HTMLView(this);

  this.init();
};

Game.prototype.init = function() {
  this.guessCount = 0;
  this.solution = [];
  for (let i = 0; i < this.nbDig; i++) {
    this.solution.push(Math.floor(Math.random() * this.nbCol));
  };
  console.log("Solution :", this.solution);
};

Game.prototype.noteGuess = function(guess) {
  this.guessCount += 1;
  var a = 0;
  var b = 0;
  var sol1 = [];
  var guess1 = [];

  // Count of common colors at same place
  for (let i = 0; i < this.solution.length; i++) {
    if (this.solution[i] === guess[i]) {
      a += 1;
    } else {
      sol1.push(this.solution[i]);
      guess1.push(guess[i]);
    }
  };

  sol1.sort();
  guess1.sort();
  // Count of common colors
  while (sol1.length > 0 && guess1.length > 0) {
    if (sol1[0] < guess1[0]) {
      sol1.shift();
    } else if (sol1[0] > guess1[0]) {
      guess1.shift();
    } else {
      b += 1;
      sol1.shift();
      guess1.shift();
    }
  };
  return [a, b];
};

// console.log(window.location.href);
// console.log(window.location.hostname);
// console.log(window.location.pathname);
// console.log(window.location.protocol);
// console.log(window.location.assign);

function getQueryVariable(variable) {
  var query = window.location.search.substring(1);
  var vars = query.split("&");
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split("=");
    if (pair[0] == variable) {
      return pair[1];
    }
  }
  return (false);
}

// Colors
let nbC = parseInt(getQueryVariable("colors"));
if (!nbC) {
  nbC = 6;
} else if (nbC < 1) {
  nbC = 1;
} else if (nbC > 8) {
  nbC = 8;
}

// Digits
let nbD = parseInt(getQueryVariable("digits"));
if (!nbD) {
  nbD = 4;
} else if (nbD < 1) {
  nbD = 1;
} else if (nbD > 8) {
  nbD = 8;
}

// Limit
let limit = parseInt(getQueryVariable("limit"));
if (!limit) {
  limit = 10;
} else if (limit < 1) {
  limit = 1;
} else if (limit > 20) {
  limit = 20;
}

var game = new Game(nbD, nbC, limit);