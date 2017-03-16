
var socket = io.connect("http://76.28.150.193:8888");
var gameEngine = new GameEngine();

socket.on("load", function (data) {
    for (i= 0; i< gameEngine.entities.length; i++){
        gameEngine.entities[i].x = data.data[i]
        gameEngine.entities[i].y = data.data[i+6]
        gameEngine.entities[i].velocity.x = data.data[i+12]
        gameEngine.entities[i].velocity.y = data.data[i+18]
    }
    console.log("Loaded")
    console.log(data.data);
});

//socket.emit("save", { studentname: "Alexandria Reynolds", statename: "myState", data: [] });
//socket.emit("load", { studentname: "Alexandria Reynolds", statename: "myState" });
//socket.emit("load", { studentname: "Chris Marriott", statename: "theState" });
//            socket.emit("load", { studentname: "Alexandria Reynolds", statename: "myEntities"});
//            socket.emit("load", { studentname: "Alexandria Reynolds", statename: "myEntityY"});
//            socket.emit("load", { studentname: "Alexandria Reynolds", statename: "myEntityXVel"});
//            socket.emit("load", { studentname: "Alexandria Reynolds", statename: "myEntityXVel"});


window.onload = function () {
//    console.log("here")
//    console.log(data);
    console.log("starting up da sheild");
    var messages = [];
    var field = document.getElementById("field");
    var username = document.getElementById("username");
    var content = document.getElementById("content");

    socket.on("ping", function (ping) {
//        console.log("ping")
        console.log(ping);
        socket.emit("pong");
    });

    socket.on("sync", function (data) {
        messages = data;
        var html = '';
        for (var i = 0; i < messages.length; i++) {
            html += '<b>' + (messages[i].username ? messages[i].username : "Server") + ": </b>";
            html += messages[i].message + "<br />";
        }
        content.innerHTML = html;
        content.scrollTop = content.scrollHeight;
        console.log("sync " + html);
    });

    socket.on("message", function (data) {
        if (data.message) {
            console.log("Message.");
            messages.push(data);
            var html = '';
            for (var i = 0; i < messages.length; i++) {
                html += '<b>' + (messages[i].username ? messages[i].username : "Server") + ": </b>";
                html += messages[i].message + "<br />";
            }
            content.innerHTML = html;
            content.scrollTop = content.scrollHeight;
        } else {
            console.log("No message.");
        }

    });

    this.onkeydown = function (e) {
        if (e.keyCode === 83) {
//            var text = field.value;
//            var name = username.value;
            console.log("Saved");
            entityxvals = []
            entityyvals = []
            entityxvel = []
            entityyvel = []
            gameEngine.entities.forEach(function (entity){
                entityxvals.push(entity.x)
                entityyvals.push(entity.y)
                entityxvel.push(entity.velocity.x)
                entityyvel.push(entity.velocity.y)
                
            })
            myEntities = entityxvals.concat(entityyvals, entityxvel, entityyvel);
            socket.emit("save", { studentname: "Alexandria Reynolds", statename: "myEntities", data: myEntities });

//            socket.emit("save", { studentname: "Alexandria Reynolds", statename: "myEntityX", data: entityxvals });
//            socket.emit("save", { studentname: "Alexandria Reynolds", statename: "myEntityY", data: entityyvals });
//            socket.emit("save", { studentname: "Alexandria Reynolds", statename: "myEntityXVel", data: entityxvel });
//            socket.emit("save", { studentname: "Alexandria Reynolds", statename: "myEntityXVel", data: entityxvel });
//            socket.emit("send", { message: text, username: name });
//            field.value = "";
        } else if (e.keyCode === 76){
            socket.emit("load", { studentname: "Alexandria Reynolds", statename: "myEntities"});
        }
    };

    socket.on("connect", function () {
        console.log("Socket connected.")
    });
    socket.on("disconnect", function () {
        console.log("Socket disconnected.")
    });
    socket.on("reconnect", function () {
        console.log("Socket reconnected.")
    });

};
// GameBoard code below
function Animation(spritesheets, frameWidth, frameHeight, sheetWidth, frameDuration, frames, loop, scale) {
    this.spritesheets = spritesheets;
    this.spritesheet = spritesheets[0];
    this.frameWidth = frameWidth;
    this.frameDuration = frameDuration;
    this.frameHeight = frameHeight;
    this.sheetWidth = sheetWidth;
    this.frames = frames;
    this.totalTime = frameDuration * frames;
    this.elapsedTime = 0;
    this.loop = loop;
    this.scale = scale;
}
Animation.prototype.drawFrame = function (tick, ctx, x, y) {
    
    this.elapsedTime += tick;
    if (this.isDone()) {
        if (this.loop) this.elapsedTime = 0;
    }
    var frame = this.currentFrame();
    var xindex = 0;
    var yindex = 0;
    xindex = frame % this.sheetWidth;
    yindex = Math.floor(frame / this.sheetWidth);

    ctx.drawImage(this.spritesheet,
                 xindex * this.frameWidth, yindex * this.frameHeight,  // source from sheet
                 this.frameWidth, this.frameHeight,
                 x, y,
                 this.frameWidth * this.scale,
                 this.frameHeight * this.scale);
}

function distance(a, b) {
    var dx = a.x - b.x;
    var dy = a.y - b.y;
    return Math.sqrt(dx * dx + dy * dy);
}

function Circle(game, sheep) {
    this.player = 1;
    this.radius = 30;
    this.sprite = sheep;
    this.visualRadius = 10;
    this.colors = ["Red", "Green", "Blue", "White"];
    
    this.setNotIt();
    Entity.call(this, game, this.radius + Math.random() * (800 - this.radius * 2), this.radius + Math.random() * (800 - this.radius * 2));

    this.velocity = { x: Math.random() * 1000, y: Math.random() * 1000 };
    var speed = Math.sqrt(this.velocity.x * this.velocity.x + this.velocity.y * this.velocity.y);
    if (speed > maxSpeed) {
        var ratio = maxSpeed / speed;
        this.velocity.x *= ratio;
        this.velocity.y *= ratio;
    }
};

Circle.prototype = new Entity();
Circle.prototype.constructor = Circle;

Circle.prototype.setIt = function () {
    this.it = true;
    //this.color = 0;
    this.visualRadius = 500;
};

Circle.prototype.setNotIt = function () {
    this.it = false;
    this.color = 3;
    this.visualRadius = 200;
};

Circle.prototype.collide = function (other) {        
    return distance(this, other) < this.radius + other.radius;
};

Circle.prototype.collideLeft = function () {
    return (this.x - this.radius) < 0;
};

Circle.prototype.collideRight = function () {
    return (this.x + this.radius) > 1000;
};

Circle.prototype.collideTop = function () {
    return (this.y - this.radius) < 0;
};

Circle.prototype.collideBottom = function () {
    return (this.y + this.radius) > 600;
};

Circle.prototype.update = function () {
    Entity.prototype.update.call(this);
 //  console.log(this.velocity);

    this.x += this.velocity.x * this.game.clockTick;
    this.y += this.velocity.y * this.game.clockTick;

    if (this.collideLeft() || this.collideRight()) {
        this.velocity.x = -this.velocity.x * friction;
        if (this.collideLeft()) this.x = this.radius;
        if (this.collideRight()) this.x = 1000 - this.radius;
        this.x += this.velocity.x * this.game.clockTick;
        this.y += this.velocity.y * this.game.clockTick;
    }

    if (this.collideTop() || this.collideBottom()) {
        this.velocity.y = -this.velocity.y * friction;
        if (this.collideTop()) this.y = this.radius;
        if (this.collideBottom()) this.y = 600 - this.radius;
        this.x += this.velocity.x * this.game.clockTick;
        this.y += this.velocity.y * this.game.clockTick;
    }

    for (var i = 0; i < this.game.entities.length; i++) {
        var ent = this.game.entities[i];
        if (ent !== this && this.collide(ent)) {
            var temp = { x: this.velocity.x, y: this.velocity.y };

            var dist = distance(this, ent);
            var delta = this.radius + ent.radius - dist;
            var difX = (this.x - ent.x)/dist;
            var difY = (this.y - ent.y)/dist;
            this.x += difX * delta / 2;
            this.y += difY * delta / 2;
            ent.x -= difX * delta / 2;
            ent.y -= difY * delta / 2;

            this.velocity.x = ent.velocity.x * friction;
            this.velocity.y = ent.velocity.y * friction;
            ent.velocity.x = temp.x * friction;
            ent.velocity.y = temp.y * friction;
            this.x += this.velocity.x * this.game.clockTick;
            this.y += this.velocity.y * this.game.clockTick;
            ent.x += ent.velocity.x * this.game.clockTick;
            ent.y += ent.velocity.y * this.game.clockTick;
            if (this.it) {
                this.setNotIt();
                ent.setIt();
            }
            else if (ent.it) {
                this.setIt();
                ent.setNotIt();
            }
        }

        if (ent != this && this.collide({ x: ent.x, y: ent.y, radius: this.visualRadius + 70})) {
            var dist = distance(this, ent);
            if (dist > this.radius + ent.radius + 223) {
                var difX = (ent.x - this.x)/dist;
                var difY = (ent.y - this.y)/dist;
                this.velocity.x += difX * acceleration / (dist*dist);
                this.velocity.y += difY * acceleration / (dist * dist);
                var speed = Math.sqrt(this.velocity.x*this.velocity.x + this.velocity.y*this.velocity.y);
                if (speed > maxSpeed) {
                    var ratio = maxSpeed / speed;
                    this.velocity.x *= ratio;
                    this.velocity.y *= ratio;
                }
            } else {
                randX = Math.random()*this.game.ctx.canvas.width;
                randY = Math.random()*this.game.ctx.canvas.height;
                dist = Math.sqrt((ent.x - randX) * (ent.x - randX) + (ent.x - randY) * (ent.x - randY));
                var difX = (ent.x - randX) / dist;
                var difY = (ent.x - randX) / dist;
                this.velocity.x += difX * acceleration / (dist*dist*dist);
                this.velocity.y += difY * acceleration / (dist * dist*dist);
                var speed = Math.sqrt(this.velocity.x * this.velocity.x + this.velocity.y * this.velocity.y);
                if (speed > maxSpeed) {
                    var ratio = maxSpeed / speed;
                    this.velocity.x *= ratio;
                    this.velocity.y *= ratio;
                }
            }
        }
    }


    this.velocity.x -= (1 - friction) * this.game.clockTick * this.velocity.x;
    this.velocity.y -= (1 - friction) * this.game.clockTick * this.velocity.y;
};

Circle.prototype.draw = function (ctx) {
    delta = Math.atan2(this.velocity.y, this.velocity.x);
    ctx.clearRect(this.x - this.radius - 2, this.y - this.radius - 2, 60, 60);
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(delta +90);
    ctx.translate(0,0);
    ctx.drawImage(this.sprite, -(this.radius), -(this.radius));
    ctx.restore();

};



// the "main" code begins here
var friction = 1;
var acceleration = 1000000;
var maxSpeed = 200;

var ASSET_MANAGER = new AssetManager();

ASSET_MANAGER.queueDownload("./img/960px-Blank_Go_board.png");
ASSET_MANAGER.queueDownload("./img/black.png");
ASSET_MANAGER.queueDownload("./img/white.png");
ASSET_MANAGER.queueDownload("./img/sheep.png");

ASSET_MANAGER.downloadAll(function () {
    console.log("starting up da sheild");
    var canvas = document.getElementById('gameWorld');
    var ctx = canvas.getContext('2d');

    sheep = ASSET_MANAGER.getAsset("./img/sheep.png");

//    var gameEngine = new GameEngine();
    for (var i = 0; i < 6; i++) {
        circle = new Circle(gameEngine, sheep);
        gameEngine.addEntity(circle);
    }
    gameEngine.init(ctx);
    gameEngine.start();
});
