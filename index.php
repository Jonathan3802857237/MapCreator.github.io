<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <title>Map Creator</title>
    <script type="text/javascript" src="script/pixi.min.js"></script>
    <script type="text/javascript" src="script/jquery-3.3.1.min.js"></script>
    <link rel="stylesheet" type="text/css" href="style/style.css" ></link>
  </head>
  <body>
<script>
  javascript:(function(){
    var script=document.createElement('script');
    script.onload=function(){
      var stats=new Stats();
      console.log(stats);
      stats.dom.id = "stats";
      document.body.appendChild(stats.dom);
      $("#stats").css({left: 50, top: 50});
      requestAnimationFrame(function loop(){
        stats.update();requestAnimationFrame(loop)});
      };
      script.src='//mrdoob.github.io/stats.js/build/stats.min.js';document.head.appendChild(script);
    })();
</script>

    <script type="text/javascript" src="script/script.js"></script>

    <img id="mapUploadFormButton" class="overlay" src="img/upload.jpg"></img>
    <img id="mapImportFormButton" class="overlay" src="img/import.jpg"></img>

    <div id="uploadMapForm" class="popUp">
      <input type="text" id="uploadMapFormName" class="uploadMapFormElements" name="mapName" placeholder="Name"></input>
      <textarea id="uploadMapFormDescription" class="uploadMapFormElements" name="description" placeholder="Description" style="width:350px;height:100px;"></textarea>
      <input type="button" id="uploadMapFormSubmit" class="uploadMapFormElements" name="input" value="Upload Map"></input>
    </div>

    <div id="importMapForm" class="popUp">
      <select id="importMapFormSelect" class="uploadMapFormElements" name="mapFile" style="-webkit-filter: blur(0.0000001px);">
        <?php
        $directoryMaps = scandir("maps/testUser");

        unset($directoryMaps[0]);
        unset($directoryMaps[1]);
        $directoryMaps = array_values($directoryMaps);

          foreach($directoryMaps as $directoryMapsEntry) {
              echo '<option value="$directoryMapsEntry">'. $directoryMapsEntry .'</option>';
          }
         ?>
       </select>
       <input type="button" id="importMapFormSubmit" class="uploadMapFormElements" name="input" value="import Map"></input>
    </div>
  </body>
</html>
