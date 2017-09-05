let Animation = (function() {

    let simulation;
    let myGamePiece; 
    let colors = ['#a6cee3', '#1f78b4', '#b2df8a',
                '#33a02c', '#fb9a99', '#e31a1c',
                '#fdbf6f', '#ff7f00', '#cab2d6',
                '#6a3d9a', '#ffff99', '#b15928'];

    let gravity ={basic: 0}
    let selectedGravity =  gravity.basic;
    let balls = [];

    let init = function() {

       initSimulation();
       document.addEventListener("click", function(e){
           return balls.push(new ball(e));
       });
       
       
    }

    let initSimulation = function() {
        simulation = {
            canvas: document.createElement('canvas'),
            start: function() {
                this.canvas.width = 1920;
                this.canvas.height = 700;
                this.context = this.canvas.getContext("2d");
                this.context.fillStyle = "#000";
                this.context.fillRect(0, 0, 1920, 700);
                this.interval = setInterval(updateSimulation, 30); 
                let container = document.getElementById("canvasContainter");
                container.appendChild(this.canvas);
            },
            clear : function() {
                this.context.clearRect(0, 0, 1920, 700);
            }

        }
        simulation.start();
    }

    let ball = function(e) {
        this.context = simulation.context;
        this.canvas = simulation.canvas;
        this.mousePos = getMousePos(this.canvas, e);

        this.centerX = this.mousePos.x;
        this.centerY = this.mousePos.y;
        this.pos = {x: this.centerX, y: this.centerY}
       
        this.radius = 70;

        this.color = getRandomColor();
   
        this.gravity = getGravity();

        this.update = function(i) {
            pos = balls[i].gravity(balls[i].pos);

            balls[i].context.fillStyle = balls[i].color;
            balls[i].context.beginPath();
            balls[i].context.arc(balls[i].pos.x, balls[i].pos.y, balls[i].radius, 0, 2 * Math.PI, false);
            balls[i].context.fill();
            balls[i].context.lineWidth = 5;
        }
    }

    let getRandomColor = function() {
        return colors[Math.floor(Math.random() * colors.length)];
    }

    let getMousePos = function(canvas, evt) {
        let rect = canvas.getBoundingClientRect();
        return {
            x: (evt.clientX - rect.left) / (rect.right - rect.left) * canvas.width,
            y: (evt.clientY - rect.top) / (rect.bottom - rect.top) * canvas.height
        };
    }

    let basicGravity = function(pos) {
        pos.y += 1;
        return pos;
    }


    let getGravity = function(){
        if(selectedGravity == gravity.basic)
            return basicGravity;
    }

 
    let updateSimulation = function() {
      
      simulation.clear();
        _.forEach(balls, function(d, i){
            d.update(i);
        });

    }

    return {
        init: init
    }

})();