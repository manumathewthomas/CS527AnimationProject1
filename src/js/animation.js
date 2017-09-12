let Animation = (function() {
    
    let requestAnimFrame = (function(){
        return window.requestAnimationFrame       || 
                window.webkitRequestAnimationFrame || 
                window.mozRequestAnimationFrame    || 
                window.oRequestAnimationFrame      || 
                window.msRequestAnimationFrame     || 
                function( callback ){
                window.setTimeout(callback, 1000 / 60);
                };
    })();

    let simulation;
    let colors = ['#a6cee3', '#1f78b4', '#b2df8a',
                '#33a02c', '#fb9a99', '#e31a1c',
                '#fdbf6f', '#ff7f00', '#cab2d6',
                '#6a3d9a', '#ffff99', '#b15928'];

    let gravity ={basic: 0}
    let selectedGravity =  gravity.basic;
    let balls = [];
    let ground;
    let collisionEpsillon = 1;
    let groundPosition = 650;
    let groundNormal = {x: 0, y: -1};
    let airFriction = 0.48;
    let rect; 
    let massSlider;
    let massLabel;
    let motionBlurSlider;
    let motionBlurLabel;
    let ballRadius = 70;
    let mouseStartVector = {x:0, y:0};
    let mouseEndVector = {x:0, y:0};
    let isClick = false;
    let isDrag = false;
    let isMouseDown = false;
   
    let init = function() {
    

       let airFrictionSlider = document.getElementById("airFrictionRange");
       airFrictionSlider.value = airFriction;
       let airFrictionLabel = document.getElementById("airFrictionLabel");
       airFrictionLabel.innerHTML = "Air Friction Factor(world)- " + airFrictionSlider.value; 

       airFrictionSlider.oninput = function() {
            airFriction = airFrictionSlider.value;
            airFrictionLabel.innerHTML = "Air Friction Factor(world) - " + airFrictionSlider.value; 
       }

       massSlider = document.getElementById("massRange");
       massSlider.value = 10;
       massLabel = document.getElementById("massLabel");
       massLabel.innerHTML = "Mass(next ball)- " + massSlider.value +"Kg"; 

       massSlider.oninput = function() {
            massLabel.innerHTML =  "Mass(next ball)- " + massSlider.value+"Kg";
       }

       bounceSlider = document.getElementById("bounceRange");
       bounceSlider.value = 0.75;
       bounceLabel = document.getElementById("bounceLabel");
       bounceLabel.innerHTML = "Bounce factor(next ball)- " + bounceSlider.value; 

       bounceSlider.oninput = function() {
            bounceLabel.innerHTML =  "Bounce factor(next ball)- " + bounceSlider.value;
       }

       motionBlurSlider = document.getElementById("motionBlurRange");
       motionBlurSlider.value = 1;
       motionBlurLabel = document.getElementById("motionBlurLabel");
       motionBlurLabel.innerHTML = "Motion Blur factor(world)- " + motionBlurSlider.value; 

       motionBlurSlider.oninput = function() {
            motionBlurLabel.innerHTML =  "Motion Blur factor(world)- " + motionBlurSlider.value;
       }

       initSimulation();
       initBallGenerator();
      
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
                let container = document.getElementById("canvasContainter");
                container.appendChild(this.canvas);
                rect = this.canvas.getBoundingClientRect();
                updateSimulation();
            },
            clear : function() {
                this.context.fillStyle = 'rgba(0,0,0,'+motionBlurSlider.value+')';
                this.context.fillRect(0, 0, 1920, 700);
            }

        }
        simulation.start();
    }

    let updateGround = function() {
     
        let context = simulation.context;
        context.save();
        context.beginPath();
        context.rect(0, groundPosition, 1920, 50);
        context.fillStyle = "#404040";
        context.fill();
        context.lineWidth = 0;
        context.restore();
    }

    let initBallGenerator = function() {
      
        
        simulation.canvas.addEventListener("mousedown", function(event) {
            isClick = true;
            isMouseDown = true;
            mouseStartVector = getMousePos(event)
        }, false);

         simulation.canvas.addEventListener("mousemove", function(event){
            
            if(isMouseDown)
            {
                isDrag = true;
                mouseEndVector = getMousePos(event);
            }
               
            isClick = false;
        
        }, false);

         simulation.canvas.addEventListener("mouseup", function(event){
            isMouseDown = false; 
            isDrag = false;
            this.canvas = simulation.canvas;
            if(getMousePos(event).y  < groundPosition-ballRadius)
                balls.push(new ball(event, isClick));
        })
      
    }

    let drawLine = function () {
        if(isMouseDown && isDrag)
        {
            let context = simulation.context;
            context.save();
            context.beginPath();
            context.lineWidth = 2;
            context.moveTo(mouseStartVector.x, mouseStartVector.y);
            context.lineTo(mouseEndVector.x, mouseEndVector.y);
            context.strokeStyle = "white";
            context.stroke();
            context.restore();
        }
 
    }

    let getMousePos = function(evt) {
        this.canvas = simulation.canvas;
        return {
            x: (evt.clientX - rect.left) / (rect.right - rect.left) * this.canvas.width,
            y: (evt.clientY - rect.top) / (rect.bottom - rect.top) * this.canvas.height
        };
    }

    let ball = function(e, isClick) {

        this.getRandomColor = function() {
            return colors[Math.floor(Math.random() * colors.length)];
        }


        this.getMousePos = function(evt) {
            
            return {
                x: (evt.clientX - rect.left) / (rect.right - rect.left) * this.canvas.width,
                y: (evt.clientY - rect.top) / (rect.bottom - rect.top) * this.canvas.height
            };
        }

        this.update = function(i) {

            if(balls[i].checkCollision(i)){
                balls[i].collisionResponse();
            }
            else 
                this.isColliding = false;
            balls[i].updateAccelaration();
            balls[i].updateVelocity();
            balls[i].updatePosition();
           
            balls[i].context.save();
            balls[i].context.beginPath();
            balls[i].context.arc(balls[i].position.x, balls[i].position.y, balls[i].radius, 0, 2 * Math.PI, false);
            balls[i].context.fillStyle = balls[i].color;
            balls[i].context.lineWidth = 0;
            balls[i].context.fill();
            balls[i].context.restore();
        }


        this.checkCollision = function(i) {
            if(balls[i].position.y + collisionEpsillon >= groundPosition - balls[i].radius && !balls[i].isColliding) 
              {
                  balls[i].isColliding = true;
                  return true;
              } 
              return false;
        }

        this.collisionResponse = function() {
             let bounceFactor = this.bounceFactor;
             let vdotn = dotProduct(this.velocity, groundNormal);
             let scalarOp = 2 * vdotn;
             let reflection = scalarVectorProduct(scalarOp, groundNormal);
             let newVelocity = vectorSub(this.velocity, reflection);
             this.velocity = scalarVectorProduct(bounceFactor, newVelocity); 
             if(this.velocity.y >= -1 && this.velocity.y <= 1)
                this.accelerationDueToGravity = 0;
        }

        this.updateAccelaration= function() {
            this.forceDueToGravity.x = this.mass * 0;
            this.forceDueToGravity.y = this.mass * this.accelerationDueToGravity;
            this.dragForce.x = airFriction * this.velocity.x;
            this.dragForce.y = airFriction * this.velocity.y;
        
            this.acceleration.x = (this.forceDueToGravity.x - this.dragForce.x) / this.mass;
            this.acceleration.y = (this.forceDueToGravity.y - this.dragForce.y) / this.mass;
        }

        this.updateVelocity = function() {
            this.velocity.x = this.velocity.x + this.acceleration.x * this.timeStep;
            this.velocity.y = this.velocity.y + this.acceleration.y * this.timeStep;
        }

         this.updatePosition = function() {
            this.position.x = this.position.x + this.velocity.x * this.timeStep + 0.5 * this.acceleration.x * this.timeStep * this.timeStep; 
            this.position.y = this.position.y + this.velocity.y * this.timeStep + 0.5 * this.acceleration.y * this.timeStep * this.timeStep; 
         }

           
        this.mass = massSlider.value;

        this.bounceFactor = bounceSlider.value;
      
        this.accelerationDueToGravity = 9.8;
        
        this.timeStep = 0.1;

        this.isColliding = false;

        this.context = simulation.context;
        this.canvas = simulation.canvas;
        this.mousePos = this.getMousePos(e);

        this.centerX = this.mousePos.x;
        this.centerY = this.mousePos.y;
        
        this.position = {x: this.centerX, y: this.centerY};
        this.velocity = {x: 0 , y:0};
        if(!isClick){
            let mouseVelocity = vectorSub(mouseEndVector, mouseStartVector);
            this.velocity.x = mouseVelocity.x;
            this.velocity.y = mouseVelocity.y;
        }
        this.acceleration = {x: 0 , y:0};
        this.forceDueToGravity = {x: 0 , y:0};
        this.dragForce = {x: 0 , y:0};
       
        this.radius = ballRadius;

        this.color = this.getRandomColor();
   
        this.gravity = getGravity();

    }

    let basicGravity = function(pos) {
        pos.y += 1;
        return pos;
    }

    let dotProduct = function(A, B) {
        return A.x*B.x + A.y*B.y;
    }

    let scalarVectorProduct = function(a, B)
    {
        let C = {x:0, y:0};
        C.x = B.x * a;
        C.y = B.y * a;

        return C;
    }

    let vectorSub = function(A, B) {
        let C ={x:0, y:0};
        C.x = A.x - B.x;
        C.y = A.y - B.y;

        return C;
    }


    let getGravity = function(){
        if(selectedGravity == gravity.basic)
            return basicGravity;
    }


 
    let updateSimulation = function() {
        
        simulation.clear();

        drawLine();

        updateGround();
        
        _.forEach(balls, function(d, i){
                d.update(i);
        });

     

        requestAnimationFrame(updateSimulation);
    }

    return {
        init: init
    }

})();