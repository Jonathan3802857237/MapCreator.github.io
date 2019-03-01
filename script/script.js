let app = new PIXI.Application({
  width: window.innerWidth,
  height: window.innerHeight,
  antialias: true,
  resolution: 1,
  cacheAsBitmap: true,
});
PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

app.renderer.plugins.interaction.interactionFrequency = 60;

let groundTexture = PIXI.Texture.fromImage('img/grass.jpg');
let wallTexture = PIXI.Texture.fromImage('img/wall.jpg');

document.body.appendChild(app.view);


$(document).ready(function() {
  let animDuration = 200;

  $("#mapUploadFormButton").click(function() {
    $(".popUp").fadeOut(animDuration);
    $(".popUp").removeClass(".popUp");
    $("#uploadMapForm").fadeIn(animDuration);
  });

  $("#mapImportFormButton").click(function() {
    $(".popUp").fadeOut(animDuration);
    $(".popUp").removeClass(".popUp");
    $("#importMapForm").fadeIn(animDuration);
  });

  //Hide popUps (class=popUp)
  $(document).click(function(event) {
    if($(".popUp").is(":visible")){
      if(event.target.id == ""){
        $(".popUp").fadeOut(animDuration);
        $(".popUp").removeClass(".popUp");
      }else if($("#" + event.target.id).hasClass("popUp")){
      }
    }
  });

  $("#uploadMapFormSubmit").click(function() {
    if($("#uploadMapFormName").val() == ""){
      alert("Add Name");
    }else{
      $(".popUp").fadeOut(animDuration);
      $(".popUp").removeClass(".popUp");

      $.ajax({
        url: "json.php",
        type: "POST",
        data: {name : $("#uploadMapFormName").val(), description: $("#uploadMapFormDescription").val() , map : level.join(), mapColumns : level[0].length,},
        // contentType: "application/json",
        success: function(data) {
          console.log(data);
        },
        error: function( xhr, status, error ) {
            //...
        }
      });
    }
  });

  $("#importMapFormSubmit").click(function() {
    $(".popUp").fadeOut(animDuration);
    $(".popUp").removeClass(".popUp");

    $.getJSON("maps/testUser/"+$("#importMapFormSelect option:selected").text(), function(mapImport) {
      level = mapImport.structur;
      levelWidth = mapImport.structur.length;
      levelHeight = mapImport.structur[0].length;

      levelWidthCul =  levelWidth;
      levelHeightCul = levelHeight;

      if(levelHeight>=levelWidth){
        blocksize = (window.innerHeight/levelHeight) - blockDistance;
      }else{
        blocksize = (window.innerWidth/levelWidth) - blockDistance;

      }
      blockWidth = blocksize;
      blockHeight = blocksize;

      zoomLvl = 1;

      for(var i = 0; i < levelContainer.children.length; i++){
        var object = levelContainer.children[i];
        object.renderable = true;
      }

      while(levelContainer.children[0]) { levelContainer.removeChild(levelContainer.children[0]); };

      for(var i = 0; i < levelWidth; i++){
        for(var j = 0; j < levelHeight; j++){

          switch(level[i][j]){
                  case 0:
                  square = new PIXI.Sprite(groundTexture);
                  break;

                  case 1:
                  square = new PIXI.Sprite(wallTexture);
                  break;
                }

          square.width = blockWidth;
          square.height = blockHeight;

          square.position.x = i * (blockWidth + blockDistance);
          square.position.y = j * (blockHeight + blockDistance);

          square.name = j+","+i;
          // square.interactive = true;
          // square.on('pointerdown', squareDown, event);
          // square.on('pointerover', squareDown, event);
          levelContainer.addChild(square);
        }
      }

        levelContainer.pivot.x = levelContainer.width / 2;
        levelContainer.pivot.y = levelContainer.height / 2;

        levelContainer.x = window.innerWidth/2;
        levelContainer.y = window.innerHeight/2;
    });
  });

});

let scaleFactor;
let logicalWidth = window.innerWidth;
let logicalHeight = window.innerHeight;

function resize() {
	// Resize the renderer
	app.renderer.resize(window.innerWidth, window.innerHeight);

  levelContainer.x = window.innerWidth/2;
  levelContainer.y = window.innerHeight/2;
  // You can use the 'screen' property as the renderer visible
  // area, this is more useful than view.width/height because
  // it handles resolution
}
window.addEventListener('resize', resize);

//Amount of blocks on x and y axis
let levelWidth  = 250;
let levelHeight = 250;

let level = new Array();
for (var i = 0; i < levelWidth; i++){
  level[i]= new Array(levelHeight).fill(0);
}

let blockDistance = 1;

let blocksize;
if(levelHeight>=levelWidth){
  blocksize = (window.innerHeight/levelHeight) - blockDistance;
}else{
  blocksize = (window.innerWidth/levelWidth) - blockDistance;

}
let blockWidth = blocksize;
let blockHeight = blocksize;
let lineWidth = Math.min(window.innerWidth, window.innerHeight) / 2000;

let square = [];
// let levelContainer = new PIXI.ParticleContainer(maxSize = levelWidth*levelHeight, {scale: true, position: true});
let levelContainer = new PIXI.Container;
let lastPoint = "";

function arrayToInt(arr){
  for(var i = 0; i < arr.length; i++){
    arr[i] = parseInt(arr[i]);
  }
  return arr;
}

function selectByName(inContainer, name){
  for(var i = 0; i < inContainer.children.length; i++){
    // if(levelContainer.children[i].name ==  thisPoint[0]+","+thisPoint[1]){
    if(inContainer.children[i].name ==  name){
      return inContainer.children[i];
    }
  }
}

function mouseDragFill(lastPoint, thisPoint){
  level[thisPoint[1]][thisPoint[0]] = 1;
  if(Math.abs(lastPoint[1] - thisPoint[1]) >= Math.abs(lastPoint[0] - thisPoint[0])){
    if((lastPoint[1] - thisPoint[1]) > 0){
      selectByName(levelContainer, thisPoint[0]+","+thisPoint[1]).setTexture(setTexture);
      thisPoint[1] += 1
      mouseDragFill(lastPoint, thisPoint);
    }else if(lastPoint[1] - thisPoint[1] < 0){
      selectByName(levelContainer, thisPoint[0]+","+thisPoint[1]).setTexture(setTexture);
      thisPoint[1] -= 1;
      mouseDragFill(lastPoint, thisPoint);
    }
  }else if(Math.abs(lastPoint[1] - thisPoint[1]) < Math.abs(lastPoint[0] - thisPoint[0])){
    if((lastPoint[0] - thisPoint[0]) > 0){
      selectByName(levelContainer, thisPoint[0]+","+thisPoint[1]).setTexture(setTexture);
      thisPoint[0] += 1
      mouseDragFill(lastPoint, thisPoint);
    }else if(lastPoint[0] - thisPoint[0] < 0){
      selectByName(levelContainer, thisPoint[0]+","+thisPoint[1]).setTexture(setTexture);
      thisPoint[0] -= 1;
      mouseDragFill(lastPoint, thisPoint);
    }
  }
}

let squareDownActive = 0;
let ctrlDown = 0;

let setPrimTexture = wallTexture;
let setSecTexture = groundTexture;
let setTexture = setPrimTexture;

// function squareDown(e){
//   if(e.data.button == 0){
//     this.setTexture(setTexture);
//     lastPoint = this.name;
//   }else if(mouseDownLeft == 1){
//     squareDownActive = 1;
//     mouseDragFill(arrayToInt(lastPoint.split(",")), arrayToInt(this.name.split(",")));
//     lastPoint = this.name;
//   }else if(mouseDownLeft == 0){
//     lastPoint = "";
//   }
// }

let zoomLvl = 1;
let curzoomLvl;
let blockAmountX;
let blockAmountY;

function zoom(){
  window.addEventListener('wheel', function(e) {
    curzoomLvl = zoomLvl;
    if (e.deltaY < 0 && zoomLvl < 15) {
      console.log("+");
      levelContainer.width *= 1.25;
      levelContainer.height *= 1.25;
      zoomLvl *= 1.25;

      blockAmountX = levelContainer.width;
      blockAmountY = levelContainer.height;


      // console.log(blockAmountX);
      // console.log(levelWidthCul);
      // console.log(blockDistance);

      for(var i = 0; i < levelHeight*levelWidth; i++){
        // levelContainer.children[i].x -= (((blockAmountX - (levelWidthCul * blockDistance)) / levelWidthCul)/zoomLvl - levelContainer.children[i].width)/2;
        // levelContainer.children[i].y -= (((blockAmountY - (levelHeightCul * blockDistance)) / levelHeightCul)/zoomLvl - levelContainer.children[i].width)/2;

        levelContainer.children[i].width  =   ((blockAmountX - (levelWidthCul  * blockDistance)) / levelWidthCul) /zoomLvl;
        levelContainer.children[i].height  =  ((blockAmountY - (levelHeightCul * blockDistance)) / levelHeightCul)/zoomLvl;
      }
      viewportCulling(levelContainer);
    }
    if (e.deltaY > 0 && zoomLvl > 1 - (Math.min(levelWidth, levelHeight))/1000) {
      console.log("-");
      yOffsetAcc = 0;
      levelContainer.width /= 1.25;
      levelContainer.height /= 1.25;
      zoomLvl /= 1.25;

      blockAmountX = levelContainer.width;
      blockAmountY = levelContainer.height;

      // console.log(blockAmountX);
      // console.log(levelWidthCul);
      // console.log(blockDistance);

      for(var i = 0; i < levelHeight*levelWidth; i++){
        // levelContainer.children[i].x -= (((blockAmountX - (levelWidthCul * blockDistance)) / levelWidthCul)/zoomLvl - levelContainer.children[i].width)/2;
        // levelContainer.children[i].y -= (((blockAmountY - (levelHeightCul * blockDistance)) / levelHeightCul)/zoomLvl - levelContainer.children[i].width)/2;

        levelContainer.children[i].width  =   ((blockAmountX - (levelWidthCul  * blockDistance)) / levelWidthCul) /zoomLvl;
        levelContainer.children[i].height  =  ((blockAmountY - (levelHeightCul * blockDistance)) / levelHeightCul)/zoomLvl;
      }
      viewportCulling(levelContainer);
    }
  });
}

zoom();

let mousePos = new Array (2);
let panPosStartMouse = new Array (2);
let panPosStartObject = new Array (2);
let panDiff = new Array (2);
let mouseDownMiddle = 0;
let mouseDownLeft = 0;

function isBetween(n, a, b) {
   return (n - a) * (n - b) <= 0
}

function distance(x1, y1, x2, y2){
  return Math.sqrt( Math.pow(x2-x1, 2) + Math.pow(y2-y1, 2));
}

function selectByClosePos(inContainer, mousePosX, mousePosY) {
  var low = 0;
  for(var i = 0; i < inContainer.children.length; i++){
    if( distance(inContainer.children[i].getBounds().x+(inContainer.children[i].getBounds().width/2), inContainer.children[i].getBounds().y+(inContainer.children[i].getBounds().height/2), mousePosX, mousePosY) < distance(inContainer.children[low].getBounds().x+(inContainer.children[low].getBounds().width/2), inContainer.children[low].getBounds().y+(inContainer.children[low].getBounds().height/2), mousePosX, mousePosY) ) low = i;
  }
  levelPos = inContainer.children[low].name.split(",");
  level[levelPos[1]][levelPos[0]] = 1;
  return inContainer.children[low];
}

let curPoint;

let containerBoundsX;
let containerBoundsY;

window.addEventListener("mousemove", function (e){
  // console.log(e.button);
  // console.log(e.ctrlKey);
  mousePos[0] = event.clientX;
  mousePos[1] = event.clientY;
  if(mouseDownMiddle == 1){
    panDiff = panPosStartMouse.map(function(item, index) {
                                    return item - mousePos[index];
                                  });
    // console.log(panDiff);
    levelContainer.pivot.x =  panPosStartObject[0] + (panDiff[0]/zoomLvl);
    levelContainer.pivot.y =  panPosStartObject[1] + (panDiff[1]/zoomLvl);
    // console.log(panDiff[0]);
    // console.log(panDiff[1]);
    viewportCulling(levelContainer);
  }
  if(e.buttons == 1){
    if(e.ctrlKey == true){
      setTexture = setSecTexture;
    }else{
      setTexture = setPrimTexture;
    }
  // if(squareDownActive == 1){
    // if(false == isBetween(mousePos[0], levelContainer.getBounds().x, levelContainer.getBounds().x + levelContainer.getBounds().width) || false == isBetween(mousePos[1], levelContainer.getBounds().y, levelContainer.getBounds().y + levelContainer.getBounds().height) ){
      console.log("x");
      curPoint = selectByClosePos(levelContainer, mousePos[0], mousePos[1]).name;
      mouseDragFill(arrayToInt(lastPoint.split(",")), arrayToInt(curPoint.split(",")));
      lastPoint = curPoint;
    // }
  }
});



window.addEventListener("mousedown", function(e) {
  if(e.button == 1){
    panPosStartMouse[0] = e.clientX;
    panPosStartMouse[1] = e.clientY;

    panPosStartObject[0] = levelContainer.pivot.x;
    panPosStartObject[1] = levelContainer.pivot.y;

    mouseDownMiddle = 1;
  }else if (e.button == 0) {
    if(e.ctrlKey == true){
      setTexture = setSecTexture;
    }else{
      setTexture = setPrimTexture;
    }
    mouseDownLeft = 1;
    selectByClosePos(levelContainer, e.clientX, e.clientY).setTexture(setTexture);
    curPoint = selectByClosePos(levelContainer, e.clientX, e.clientY).name;
    lastPoint = curPoint;
  }
});

window.addEventListener("mouseup", function(e) {
  if(e.button == 1){
    mouseDownMiddle = 0;
  }else if (e.button == 0) {
    mouseDownLeft = 0;
    squareDownActive = 0;
  }
});

setup();
function setup(){
  app.stage.addChild(levelContainer);
  for(var i = 0; i < levelWidth; i++){
    for(var j = 0; j < levelHeight; j++){
      square = new PIXI.Sprite(groundTexture);
      square.width = blockWidth;
      square.height = blockHeight;

      square.position.x = i * (blockWidth + blockDistance);
      square.position.y = j * (blockHeight + blockDistance);

      square.name = j+","+i;
      // square.interactive = true;
      // square.on('pointerdown', squareDown, event);
      // square.on('pointerover', squareDown, event);
      levelContainer.addChild(square);
    }
  }
  levelContainer.pivot.x = levelContainer.width / 2;
  levelContainer.pivot.y = levelContainer.height / 2;

  levelContainer.x = window.innerWidth/2;
  levelContainer.y = window.innerHeight/2;

  app.ticker.add(delta => gameLoop(delta));
}

let levelWidthCul =  levelWidth;
let levelHeightCul = levelHeight;

function viewportCulling(container){
  for(var i = 0; i < container.children.length; i++){
    var object = container.children[i];
    var bounds = object.getBounds();
    object.renderable = bounds.x >= -bounds.width &&
                        bounds.y>= -bounds.height &&
                        bounds.x+bounds.width <= window.innerWidth+bounds.width &&
                        bounds.y+bounds.height <= window.innerHeight+bounds.height;
    // object.renderable = bounds.x >= 0 &&
    //                     bounds.y >= 0 &&
    //                     bounds.x + bounds.width  <= window.innerWidth &&
    //                     bounds.y + bounds.height <= window.innerHeight;
  }
  levelWidthCul =  Math.round(container.width  / ((container.children[1].width * zoomLvl)+1));
  levelHeightCul = Math.round(container.height / ((container.children[1].height * zoomLvl)+1));
  console.log("WCul:"+levelWidthCul);
  console.log("HCul:"+levelHeightCul);
  console.log("WC:"+container.width);
  console.log("WSQ:"+container.children[1].width);
  console.log("ZL:"+zoomLvl);
}

let timeStepGL = 0;

function gameLoop(delta){
  // console.log(ctrlDown);
  // console.log(squareDownActive);

  // console.log(Math.round(new PIXI.ticker.Ticker().FPS));
  // console.log(new PIXI.ticker.Ticker().speed);
  timeStepGL++;
}
