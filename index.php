<?php 
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Max-Age: 1000");
header("Access-Control-Allow-Headers: X-Requested-With, Content-Type, Origin, Cache-Control, Pragma, Authorization, Accept, Accept-Encoding");
header("Access-Control-Allow-Methods: PUT, POST, GET, OPTIONS, DELETE");
?>


<!DOCTYPE html>
<html lang="en">

  <head>

    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <meta name="description" content="">
    <meta name="author" content="">

    <title>CS527 - Asignment #1</title>

    <!-- Bootstrap core CSS -->
    <link href="vendor/bootstrap/css/bootstrap.min.css" rel="stylesheet">

    <!-- Custom styles for this template -->
    <link href="css/half-slider.css" rel="stylesheet">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.13.1/lodash.min.js"></script>

  </head>

  <body>

    <!-- Navigation -->
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
      <div class="container">
        <a class="navbar-brand" href="#">CS 527 Assignment #1</a>
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarResponsive" aria-controls="navbarResponsive" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
      </div>
    </nav>

    <header>
       
    </header>

    <!-- Page Content -->
    <section class="py-5">
        <div id="canvasContainter"></div>

        <div class="row">
          <div class="col-sm-4">  
            <h3 id="airFrictionLabel">Air Friction</h3>
            <input type="range" min="0" max="5" step=0.01 class="slider" id="airFrictionRange">
          </div>
          <div class="col-sm-4">  
            <h3 id="massLabel">Mass</h3>
            <input type="range" min="1" max="1000" step=1 class="slider" id="massRange">
          </div>
          <div class="col-sm-4">  
            <h3 id="bounceLabel">Bounce</h3>
            <input type="range" min="0" max="1" step=0.01 class="slider" id="bounceRange">
          </div>
        </div>

        <div class="row">
          <div class="col-sm-4">  
            <h3 id="motionBlurLabel">Motion Blur</h3>
            <input type="range" min="0.05" max="1" step=0.01 class="slider" id="motionBlurRange">
          </div>
        </div>
    </section>

    <!-- Bootstrap core JavaScript -->
    <script src="vendor/jquery/jquery.min.js"></script>
    <script src="vendor/popper/popper.min.js"></script>
    <script src="vendor/bootstrap/js/bootstrap.min.js"></script>
    <script src='src/js/animation.js'></script>
    <script src='src/js/controller.js'></script>

  </body>

</html>