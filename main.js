const WIDTH = 1200;
const HEIGHT = 800;


class InputHandler {
    constructor() {
        this.keys = new Set();
        window.addEventListener("keydown", e => {
            this.keyDown(e);
        });
        window.addEventListener("keyup", e => {
            this.keyUp(e);
        });
    }
    
    keyDown(e) {
        this.keys.add(e.key);
    }
    
    keyUp(e) {
        this.keys.delete(e.key);
    }
}

class V2 {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    
    add(that) {
        return new V2(this.x + that.x, this.y + that.y);
    }
    
    sub(that) {
        return new V2(this.x - that.x, this.y - that.y);
    }
    
    scale(s) {
        return new V2(this.x * s, this.y * s);
    }
}

directionMap = {
    "a": new V2(-1, 0),
    "d": new V2(1, 0),
    "s": new V2(0, 1),
    "w": new V2(0, -1),
}

class Tile {
    constructor(width, height) {
        this.image = 
        this.width = width;
        this.height = height;
        this.x = x;
        this.y = y;
        
    }
    update() {
        
    }
    draw(ctx) {
        
    }
}


class Map {
    constructor(game, tiles) {
        this.game = game;
        this.tiles = tiles;
    }
    update() {
        
    }
    draw(ctx) {
        
    }
}


const states = {
    IDLE: 0,
    RUNNING: 1,
    JUMPING: 2,
    FALLING: 3,
};

class State {
    constructor(state) {
        this.state = state;
    }
}

class Idle extends State {
    constructor(player) {
        super("IDLE");
        this.player = player;
    }
    enter() {
        this.player.frameY = 6;
        // 11 images
    }
    handleInput(keys) {
        for (let key of keys) {
            if (key === "d" || key === "a") {
                this.player.setState(states.RUNNING);
            }
            if (key === "w") {
                this.player.setState(states.JUMPING);
            }
        }
        
    }
}


class Running extends State {
    constructor(player) {
        super("RUNNING");
        this.player = player;
    }
    enter() {
        this.player.frameY = 4;
        // 12 images
    }
    handleInput(keys) {
        for (let key of keys) {
            if (key === "s") {
                this.player.setState(states.IDLE);
            }
            if (key === "w") {
                this.player.setState(states.JUMPING);
            }
        }
        
    }
}


class Jumping extends State {
    constructor(player) {
        super("JUMPING");
        this.player = player;
    }
    enter() {
        if (this.player.onGround()) { 
            this.player.vy = -this.player.jumpSpeed
        }
        this.player.frameY = 3;
        // 1 images
    }
    handleInput(keys) {
        for (let key of keys) {
        }
    
        if (this.player.vy > this.player.weight) {
            this.player.setState(states.FALLING);
        }
        
    }
}

class Falling extends State {
    constructor(player) {
        super("FALLING");
        this.player = player;
    }
    enter() {
        this.player.frameY = 1;
        // 1 images
    }
    handleInput(keys) {
        for (let key of keys) {
        }
    
        if (this.player.onGround()) {
            this.player.setState(states.IDLE);
        }
        
    }
}

class Player {
    constructor(game) {
        this.game = game;
        this.width = 32;
        this.height = 32;
        this.frameX = 0;
        this.frameY = 3;
        this.x = 0;
        this.vx = 0;
        this.speed = 0.5;
        this.y = this.game.height - this.height;
        this.vy = 0;
        this.friction = this.speed / 3;
        this.weight = 0.4;
        this.image = document.getElementById("frog");
        this.maxSpeed = 12;
        this.jumpSpeed = 22;
        this.ground = this.game.height - this.height;
        this.states = [
            new Idle(this),
            new Running(this),
            new Jumping(this),
            new Falling(this),
        ];
        this.currentState = this.states[0];
        
        // methods to run
        this.currentState.enter();
    }
    update(keys) {
        // states
        this.currentState.handleInput(keys);
        
        // vertical
        
        // horizontal
        // left
        this.x += this.vx;
        if (this.vx <= 0) {
            this.vx += this.friction;
            if (this.vx <= -this.maxSpeed) this.vx = -this.maxSpeed;
        }
        // right
        if (this.vx >= 0) {
            this.vx -= this.friction;
            if (this.vx >= this.maxSpeed) this.vx = this.maxSpeed;
        }
        
        for (let key of keys) {
            // horizontal
            if (key === "d") {
                this.vx += this.speed;
            }
            if (key === "a") {
                this.vx += -this.speed;
            }
            // vertical
        }
        
        
        // vertical
        this.y += this.vy;
        if (!this.onGround()) {
            this.vy += this.weight;
        }
        if (this.y > this.ground) {
            this.y = this.ground;
            this.vy = 0;
        }
        if (this.onGround()) {
            this.jumpCounter = 0;
        }
        
        // horizontal boundries
        if (this.x <= 0) {
            this.x = 0;
        }
        if (this.x >= this.game.width - this.width) {
            this.x = this.game.width - this.width;
        }    
        
    }
    
    onGround() {
        return this.y >= this.game.height - this.height;
    }
    
    draw(ctx) {
        ctx.drawImage(
            this.image, 
            this.frameX * this.width,
            this.frameY * this.height,
            this.width,
            this.height,
            this.x, 
            this.y,
            this.width, 
            this.height
        )
    }
    
    setState(state) {
        this.currentState = this.states[state];
        this.currentState.enter();
    }
}

class Game {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.player = new Player(this);
        this.map = new Map(this);
        this.input = new InputHandler();
        
    }
    update() {
        this.player.update(this.input.keys);
    }
    draw(ctx) {
        this.player.draw(ctx);
        this.map.draw(ctx);
    }
}

window.addEventListener("load", event => {
    const canvas = document.getElementById("canvas1");
    const ctx = canvas.getContext("2d");
    
    canvas.width = WIDTH;
    canvas.height = HEIGHT;
    
    const game = new Game(WIDTH, HEIGHT);
    
    animate = () => {
        ctx.clearRect(0, 0, WIDTH, HEIGHT);
        game.update();
        game.draw(ctx);
        requestAnimationFrame(animate);
    }
    animate()
});
