//
// SockSort by Elizabeth Rives & Charles Gust
//

var gridSize = 4;                     // length of the socks gridSize
var nMaxSocks = gridSize * gridSize;  // total number of socks is gridSize * gridSize
var nMaxScores = 4;                   // how many distinct scores are there?
var sockHolder = [];                  // [nMaxSocks];
var sockDisplayOrder = [];            // [nMaxSocks];
var matchLists;
var numeralToWord = ["zero", "one", "two", "three", "four",
                     "five", "six", "seven", "eight", "nine"];
var gridColumns = "four";   // numeralToWord[16/gridSize] ??
var canvasPrefix = "canvas";
var tupleRow = "data-row";
var tupleCol = "data-col";
var sockColorMapping = [
      "black", //hsl(  0,100,  0)", // black
      "black", //hsl(  0,100,  0)", // black
      "white", //hsl(  0,100,100)", // white
      "white", //hsl(  0,100,100)", // white
      "yellow", //hsl(  0,100, 50)", // color1
      "red",  //hsl( 90,100, 50)", // color2
      "pink", //hsl(180,100, 50)", // color3
      "blue", //hsl(270,100, 50)"  // color4
];

function toNumber(sbNumber) {
  return parseInt(sbNumber,10);
}

//
// a Sock has two attributes, but could have more
// currently:
//    color: the sock color
//    stripeColor: the stripe color
// for instance: size, pattern, material, soil, holes
//
function Sock(sockColor, stripeColor, displayOrder) {
  this.sockColor = sockColor;
  this.stripeColor = stripeColor;
  this.displayOrder = displayOrder;
  this.paired = false;      // a sock may only be matched if not already paired

/*
Sock.draw = function(ctx) {

  }
  */
}
//
// We use O(n^2) space to generate a grid that will give us how closely matched we are
// With such a small number of attributes, it's clear that the sequence of best matches
// is:
//    matchExact        sockColor && stripeColor
//    matchClose        sockColor
//    matchTechnical     stripeColor
//    matchImpossible
//
// For now, these will be represented in ascending order. That is, an exact match will
// have the smallest number at x,y. Also, we only have to calculate half of the grid, so
// we will only fill in the grid where column < row.
//
var matchExact = 0;
var matchClose = 1;
var matchTechnical = 2;
var matchImpossible = 3;
var matchGrid = [[matchImpossible, matchTechnical],[matchClose, matchExact]];

function initializeGrid() {
  matchLists = document.createElement("matchLists");  // maybe needs to be in function?
  var $ml = $(matchLists);
  var $j;

  for (var iScore=0; iScore < nMaxScores-1; iScore++) {
    $j = $("<ul>");
    $ml.append($j);
  }

  for (var iRow = 1; iRow < nMaxSocks; iRow++) {
    for (var iCol = 0; iCol < iRow; iCol++) {
      var iMGRow = (sockHolder[iRow].sockColor == sockHolder[iCol].sockColor) ? 1:0;
      var iMGCol = (sockHolder[iRow].stripeColor == sockHolder[iCol].stripeColor) ? 1:0;
      var nScore = matchGrid[iMGRow][iMGCol];

      if (nScore < nMaxScores-1) {
        // anything with nMaxScore is a leftover, so don't need a list
        var $jLi = $("<li>{" + iRow + "," + iCol + "}</li>");
        $jLi.attr(tupleRow, iRow);
        $jLi.attr(tupleCol, iCol);

        $j = $ml;
        $j = $j.find(" ul:eq(" + nScore + ")");
        $j = $j.append($jLi);
      }
    }
  }
}

function randomSockColor() {
  return sockColorMapping[Math.floor(Math.random() * 8)];
}



function laundryBasket(laundryBasketPrefix) {
  this.laundryBasketPrefix = laundryBasketPrefix;

  for (var i = 0; i < nMaxSocks; i++) {
    var $j;

    // make Div to hold canvas elements
    var $newDiv = $('<div class="' + gridColumns + ' columns ' + laundryBasketPrefix + '__sock"></div>');
    var $newCanvas = $('<canvas id="' + canvasPrefix + i + '">' + '</canvas>');

    $j = $newDiv.append($newCanvas);

    $j = $('#' + laundryBasketPrefix).append($j);

    // make canvas element

    //$j = $j.append($newCanvas);

    // create sock
    sockHolder[i] = new Sock(randomSockColor(), randomSockColor(), i);

    // initialize the display order
    sockDisplayOrder[i] = i;

    // create sock drawing
    var elSock = document.getElementById(canvasPrefix + i);
    var ctx = elSock.getContext('2d');

    ctx.fillStyle = sockHolder[i].sockColor;

    ctx.fillRect(100, 10, 65, 75);

    ctx.fillStyle = sockHolder[i].stripeColor;
    ctx.fillRect(100, 20, 65, 10);

    ctx.moveTo(165, 85);
    ctx.lineTo(100, 65);
    ctx.strokeStyle = sockHolder[i].sockColor;
    ctx.stroke();
    ctx.lineTo(65, 110);
    ctx.stroke();
    ctx.lineTo(130, 115);
    ctx.stroke();
    ctx.lineTo(165, 85);
    ctx.fillStyle = sockHolder[i].sockColor;
    ctx.fill();

    ctx.beginPath();
    ctx.arc(98, 110, 33, 6, Math.PI, false);
    ctx.closePath();
    ctx.lineWidth = 2;
    ctx.fillStyle = sockHolder[i].sockColor;
    ctx.fill();
    //Sock.draw(sockHolder[i],ctx);
  }
}

function performVisualSwap(iSockIndex, iSockIndexEvicted, iDisplayOrder, iDisplaySoonVacant) {
    // Understanding the model
    // We have a tag "laundrybasket" which has a list of unnamed divs under
    // it and each unnamed div has a named ("canvas1, canvas2, etc") canvas
    // element underneath it.
    // So, in order to exchange two socks, we have to find the canvas element
    // and then switch it

    var $laundrybasket = $("#laundrybasket");
    var $canvasSrc = $laundrybasket.find("#" + canvasPrefix + iSockIndex);
    var $canvasDest = $laundrybasket.find("#" + canvasPrefix + iSockIndexEvicted);
    var $divSrc = $canvasSrc.parent();
    var $divDest = $canvasDest.parent();

    $canvasSrc.fadeOut("slow");
    $canvasDest.fadeOut("slow");
    $canvasSrc = $canvasSrc.detach();
    $canvasDest = $canvasDest.detach();

    $divSrc.append($canvasDest);
    $divDest.append($canvasSrc);

    $canvasSrc.fadeIn("slow");
    $canvasSrc.removeAttr("style");
    $canvasDest.fadeIn("slow");
    $canvasDest.removeAttr("style");
}

function changeDisplayOrder(iSockIndex, iDisplayOrder) {
  // only move the sock if the sock's order changes
  if (sockHolder[iSockIndex].displayOrder != iDisplayOrder) {
    // save the index to be evicted and the display soon vacant for the swap
    var iSockIndexEvicted = sockDisplayOrder[iDisplayOrder];
    var iDisplaySoonVacant = sockHolder[iSockIndex].displayOrder;

    performVisualSwap(iSockIndex, iSockIndexEvicted, iDisplayOrder, iDisplaySoonVacant);

    // swap the global display order
    sockDisplayOrder[iDisplayOrder] = iSockIndex;
    sockDisplayOrder[iDisplaySoonVacant] = iSockIndexEvicted;

    // swap each socks recording of it's display position
    sockHolder[iSockIndex].displayOrder = iDisplayOrder;
    sockHolder[iSockIndexEvicted].displayOrder = iDisplaySoonVacant;
  }
}

//
//  The matchLists element is the root of the jQuery data structure that has tallied
//  which tuples correspond to which distinct scores.
//  It has as many <ul> lists as we have distinct scores, and the <li>'s in each
//  list has data-row and data-col set to indicate which tuple is represented.
//  If any sock that is already paired appears in another tuple, it must be
//  skipped and cannot be paired again.
//
function sockMatch() {
  var nCurSockCount = 0;
  var $ml = $(matchLists);
  var $j;

  // process all the possible scores, but we don't have to process the last
  // one because all of those are the left overs.
  for( var iScores = 0; iScores < nMaxScores-1; iScores++) {
      $j = $ml;
      $j = $j.find(" ul:eq(" + iScores + ")");
      $j = $j.find("li");
      $j.each(function() {
        if (nCurSockCount == nMaxSocks) {
          // early exit when no more socks to move
          return;
        }

        var iFirst = toNumber($(this).attr(tupleRow));
        var iSecond = toNumber($(this).attr(tupleCol));
        if ( (!sockHolder[iFirst].paired) && (!sockHolder[iSecond].paired)) {
          // we've got the next pair!!!
          sockHolder[iFirst].paired = true;
          sockHolder[iSecond].paired = true;

          // why is the order reversed? Because the tuples are calculated
          // to always have the smaller number second in the tuple
          // if 0 and 2 are the first match, we want to swap 0,0 and 2,1
          // because if you do 2,0 and 0,1 you very likely won't have a
          // match because the sock at 0 will be the sock originally at 1.
          changeDisplayOrder(iSecond, nCurSockCount++);
          changeDisplayOrder(iFirst, nCurSockCount++);
        }
      });

      if (nCurSockCount == nMaxSocks) {
        // early exit when no more socks can match
        break;
      }
  }
}

//generateSocksRandom();
laundryBasket("laundrybasket");
//makeDivs();
//makeCanvasElems();
//drawSocks();
//alert("Socks are in the basket!")
initializeGrid();
document.getElementById("sortsocks").addEventListener('click', sockMatch, false);
//sockMatch();
//alert("Socks are sorted!");

