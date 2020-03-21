let stage = new Konva.Stage({
    container: 'container',   // id of container <div>
    width: 1400,
    height: 900
});

let docer1;
let docer2;
let ball;
let button;

class RoundSystem{
    constructor() {
        this.counter = 1;
        this.hits = 10;
        this.text = new Konva.Text({
            x: 10,
            y: 260,
            text: "Round  - " + this.counter,
            fontSize: 64,
            fontFamily: 'Calibri',
            fill: 'black'
        });
        this.text2 = new Konva.Text({
            x: 10,
            y: 340,
            text: "Hits  - " + this.hits,
            fontSize: 36,
            fontFamily: 'Calibri',
            fill: 'black'
        });
        background_layer.add(this.text);
        background_layer.add(this.text2);
    }

    new_round(){
        this.hits = 10;
        this.counter++;
        this.update();
        button.setAttrs({
            text: "Start",
            state: false
        });

        ball.anim.stop();
        ball.respawn();
        docer1.respawn();
        docer2.respawn();
        background_layer.draw();
    }

    update(){
        this.text.setAttrs({
            text: "Round  - " + this.counter,
        });
        this.text2.setAttrs({
            text: "Hits  - " + this.hits,
        });
        background_layer.draw();
    }

}

let max_speed = 5;
let min_speed = -5;

// then create layer
let background_layer = new Konva.Layer();
let cells_layer = new Konva.Layer();
let bases_layer = new Konva.Layer();
let mods_layer = new Konva.Layer();
let ball_layer = new Konva.Layer();

let instuctions = new Image();
instuctions.onload = function() {
    let graphic = new Konva.Image({
        x: 750,
        y: 40,
        image: instuctions,
        width: 700,
        height: 400,
    });
    background_layer.add(graphic);
    background_layer.draw();
};
instuctions.src = "res/images/figure_mods.png";


function randomInt(min, max) {
    return min + Math.floor((max - min) * Math.random());
}

round_counter = new RoundSystem();

class Counter {
    constructor(x, y) {
        this.red = 0;
        this.green = 0;
        this.x = x;
        this.y = y;
        this.text = new Konva.Text({
            x: x,
            y: y,
            text: this.red + " - " + this.green,
            fontSize: 72,
            fontFamily: 'Calibri',
            fill: 'white'
        });

        this.xpadding = 20;

        this.bg1 = new Konva.Rect({
            x: x - this.xpadding,
            y: y,
            width: this.xpadding + this.text.textWidth / 2,
            height: this.text.textHeight,
            fill: 'green',
            strokeWidth: 2,
        });

        this.bg2 = new Konva.Rect({
            x: x + this.text.textWidth / 2,
            y: y,
            width: this.text.textWidth / 2 + this.xpadding,
            height: this.text.textHeight,
            fill: 'red',
            strokeWidth: 2,
        });

        background_layer.add(this.bg1);
        background_layer.add(this.bg2);
        background_layer.add(this.text);
    }
    update(){
        this.text.setAttrs({
            text: this.red + " - " + this.green,
        });
        this.bg1.setAttrs({
            x: this.x - this.xpadding,
            y: this.y,
            width: this.text.textWidth / 2 + this.xpadding,
            height: this.text.textHeight,
        });
        this.bg2.setAttrs({
            x: this.x + this.text.textWidth / 2,
            y: this.y,
            width: this.text.textWidth / 2 + this.xpadding,
            height: this.text.textHeight
        });
        // console.log(this.text);
        background_layer.draw();
    }
}

class Cell {

    constructor(x, y, size, color) {
        let tparent = this;
        this.graphic = new Konva.Rect({
            x: x,
            y: y,
            width: size,
            height: size,
            fill: 'white',
            stroke: 'gray',
            strokeWidth: 2,
            parent_class: tparent
        });

        this.graphic.on('click', function() {
            // this.fill("black");
            // cells_layer.draw();
            // console.log(this);
        });
        this.slots = {"mod": null, "base": null};
    }

}
// x: field.pos_x - field.padding + (field.width * field.cell_size + (field.width + 1) * field.padding) / 2,
//     y: field.pos_y - field.padding + (field.height / 2 * field.cell_size + (field.height + 1) / 2 * field.padding)
class Field {

    constructor(pos_x, pos_y, width, height, cell_size, padding, colors) {
        this.pos_x = pos_x;
        this.pos_y = pos_y;
        this.width = width;
        this.height = height;
        this.cell_size = cell_size;
        this.padding = padding;
        this.bacground_colors = colors;
        this.corners = [
            {
                x: this.pos_x - this.padding,
                y: this.pos_y - this.padding,
            },
            {
                x: this.pos_x - this.padding + (this.width * this.cell_size + (this.width + 1) * this.padding),
                y: this.pos_y - this.padding + (this.height * this.cell_size + (this.height + 1) * this.padding)
            }
        ];
        this.center = {
            x: this.pos_x - this.padding + (this.width * this.cell_size + (this.width + 1) * this.padding) / 2,
            y: this.pos_y - this.padding + (this.height / 2 * this.cell_size + (this.height + 1) / 2 * this.padding)
        };
        this.init();
    }

    init(){
        this.cells = [];
        let part1 = new Konva.Rect({
            x: this.pos_x - this.padding,
            y: this.pos_y - this.padding,
            width: this.width * this.cell_size + (this.width + 1) * this.padding,
            height: this.height / 2 * this.cell_size + (this.height + 1) / 2 * this.padding,
            fill: this.bacground_colors[0]
        });
        let part2 = new Konva.Rect({
            x: this.pos_x - this.padding,
            y: this.pos_y - this.padding + this.height / 2 * this.cell_size + (this.height + 1) / 2 * this.padding,
            width: this.width * this.cell_size + (this.width + 1) * this.padding,
            height: this.height / 2 * this.cell_size + (this.height + 1)  / 2 * this.padding,
            fill: this.bacground_colors[1]
        });
        background_layer.add(part1);
        background_layer.add(part2);
        for (let i = 0; i < this.width; i++){
            this.cells.push([]);
            for (let j = 0; j < this.height; j++){
                let x = this.pos_x + i * this.cell_size + this.padding * i;
                let y = this.pos_y + j * this.cell_size + this.padding * j;
                this.cells[i].push(new Cell(x, y, this.cell_size, '#337DFF'));
                cells_layer.add(this.cells[i][j].graphic);
            }
        }
    }
}

class Modifier {

    constructor(size, img_name, docer, type, ability, value, coords) {
        this.imageObj = new Image();
        this.graphic = null;
        this.type = type;
        this.value = value;
        this.ability = ability;
        this.life = 5;
        let tparent = this;
        this.imageObj.onload = function() {
            let graphic = new Konva.Image({
                x: null,
                y: null,
                image: this,
                width: size,
                height: size,
                parent_class: tparent
            });
            if (coords == null) {
                graphic.draggable('true');
                tparent.graphic = graphic;
                docer.push(tparent);
            }else{
                let x = docer.pos_x + coords.x * docer.cell_size + docer.padding * coords.x;
                let y = docer.pos_y + coords.y * docer.cell_size + docer.padding * coords.y;
                docer.cells[coords.x][coords.y].slots['hole'] = tparent;
                // console.log(tparent);
                graphic.setX(x);
                graphic.setY(y);
                graphic.attrs.borderSize = 15;
                graphic.attrs.borderColor = 'red';
                tparent.graphic = graphic;
                mods_layer.add(graphic);
                mods_layer.draw();
            }
            // add the shape to the layer
            // layer.add(this.graphic);
            // layer.batchDraw();
        };
        this.imageObj.src = img_name;
    }
    hit(){
        round_counter.hits--;
        if (round_counter.hits == 0){
            round_counter.new_round();
            return ;
        }
        round_counter.update();
        this.life--;
        if (this.life == 0){
            this.graphic.remove();
            bases_layer.draw();
            return "dead";
        }
        return "alive";
    }

}
// m = new Modifier(100,100, 1000, "res/images/horizontal_color.jpg")
class Docer {

    constructor(pos_x, pos_y, width, height, cell_size, padding, color) {
        this.pos_x = pos_x;
        this.pos_y = pos_y;
        this.width = width;
        this.height = height;
        this.cell_size = cell_size;
        this.padding = padding;
        this.bacground_color = color;
        this.mods = [];
        this.init();
    }

    init(){
        this.cells = [];
        let background = new Konva.Rect({
            x: this.pos_x - this.padding,
            y: this.pos_y - this.padding,
            width: this.width * this.cell_size + (this.width + 1) * this.padding,
            height: this.height * this.cell_size + (this.height + 1) * this.padding,
            fill: this.bacground_color
        });
        background_layer.add(background);
        for (let i = 0; i < this.width; i++){
            this.cells.push([]);
            for (let j = 0; j < this.height; j++){
                let x = this.pos_x + i * this.cell_size + this.padding * i;
                let y = this.pos_y + j * this.cell_size + this.padding * j;
                this.cells[i].push(new Cell(x, y, this.cell_size, '#337DFF'));
                cells_layer.add(this.cells[i][j].graphic);
            }
        }
    }
    push(mod){
        this.mods.push(mod);
        top:
        for (let j = 0; j < this.cells[0].length; j++){
            for (let i = 0; i < this.cells.length; i++){
                let cell = this.cells[i][j];
                if (Object.values(cell.slots)[0] == null && Object.values(cell.slots)[1] == null) {
                    mod.graphic.setX(cell.graphic.position().x);
                    mod.graphic.setY(cell.graphic.position().y);
                    cell.slots[mod.type] = mod;
                    break top;
                }
            }
        }
        if (mod.type == "mod"){
            mods_layer.add(mod.graphic);
            mods_layer.draw();
        }else if(mod.type == "base"){
            bases_layer.add(mod.graphic);
            bases_layer.draw();
        }

    }
    clear(){
        for (var mod in this.mods){
            this.mods[mod].graphic.remove();
        }
        for (let j = 0; j < this.cells[0].length; j++) {
            for (let i = 0; i < this.cells.length; i++) {
                let cell = this.cells[i][j];
                    cell.slots["mod"] = {};
            }
        }
    }
    respawn(){
        this.clear();
        let c = 0;
        top:
        for (let j = 0; j < this.cells[0].length; j++) {
            for (let i = 0; i < this.cells.length; i++) {
                let cell = this.cells[i][j];
                let mod = this.mods[c];
                if (mod == null)
                    break top;
                mod.graphic.setX(cell.graphic.position().x);
                mod.graphic.setY(cell.graphic.position().y);
                cell.slots[mod.type] = mod;
                mod.life = 5;
                if (mod.type == "mod"){
                    mods_layer.add(mod.graphic);
                }else if (mod.type == "base"){
                    bases_layer.add(mod.graphic);
                }
                c++;
            }
        }
        bases_layer.draw();
        mods_layer.draw();
    }
}
// def mag(self):
//     return (self.x * self.x + self.y * self.y) ** 0.5
//
// def norm(self):
//     m = self.mag()
//     if (m > 0):
//         self /= m
//
// def limit(self, max_value):
//     if self.mag() > max_value:
//         self.norm()
//         self.mul(max_value)

function mag(vector) {
    return (vector.x * vector.x + vector.y * vector.y) ** 0.5
}

function norm(vector) {
    let m = mag(vector);
    if (m > 0){
        return {x: vector.x / m, y:  vector.y / m}
    }
}

function limit(vector, lim) {
    let v = vector;
    if (mag(vector) > lim){
        v = norm(vector);
        v.x *= lim;
        v.y *= lim;
    }
    return v;
}

class Ball{
    constructor(pos_x, pos_y, radius, color, vector, field) {
        this.pos_x = pos_x;
        this.pos_y = pos_y;
        this.radius = radius;
        this.color = color;
        this.in_cell = false;
        this.timer = null;
        this.inviz = false;
        this.inviz_count = 0;
        this.actions = {"fast" : function(vector){vector.x*=2; vector.y*=2; return vector},
                        "slow" : function(vector){vector.x/=2; vector.y/=2; return vector},
                        "vector" : function(vector){vector.y*=-1; return vector},
                        };
        if (vector != null){
            this.vector = vector;
        }else{
            this.random_vector();
        }

        this.field = field;
        let tparent = this;
        this.graphic = new Konva.Circle({
            x: pos_x,
            y: pos_y,
            radius: radius,
            fill: color,
            stroke: 'black',
            strokeWidth: 4,
            parent_class: tparent
        });
        ball_layer.add(this.graphic);
        tparent.anim = new Konva.Animation(function(frame) {
            var pos = {x: tparent.graphic.position().x + tparent.radius, y: tparent.graphic.position().y + tparent.radius};
            let cell = cells_layer.getIntersection(pos);
            let base = null;
            let mod = null;
            let hole = null;
            if (cell != null){
                cell = cell.attrs.parent_class;
                base = cell.slots["base"];
                mod = cell.slots["mod"];
                hole = cell.slots["hole"];
            }
            // if (shape!=null){
            //     shape.attrs.fill = "black";
            //     cells_layer.draw();
            // }
            if (base != null){
                if (!tparent.in_cell) {
                    if (!tparent.inviz) {
                        tparent.in_cell = true;
                        let base_result = {type: "vector", vector: {x: 0, y: 0}};
                        let mod_result = {type: "vector", vector: {x: 0, y: 0}};
                        let temp_vector = {x:tparent.vector.x, y:tparent.vector.y};
                        switch (base.ability) {
                            case "etheral":
                                base_result.type = "no_hit";
                                break;
                            case "fast":
                                tparent.actions.fast(temp_vector);
                                base_result.func = tparent.actions.fast;
                                // temp_vector.x *= 2;
                                // temp_vector.y *= -2;
                                break;
                            case "magnet":
                                break;
                            case "slow":
                                tparent.actions.slow(temp_vector);
                                base_result.func = tparent.actions.slow;
                                // temp_vector.x /= 2;
                                // temp_vector.y /= -2;
                                break;
                            case "vector":
                                tparent.actions.vector(temp_vector);
                                base_result.func = tparent.actions.vector;
                                // temp_vector.y *= -1;
                                break;
                        }


                        if (mod != null) {
                            // 'etheral' 'fast', 'magnet', 'slow', 'vector'
                            switch (mod.ability) {
                                case "etheral":
                                    mod_result.type = "no_hit";
                                    break;
                                case "fast":
                                    temp_vector.x *= 2;
                                    temp_vector.y *= 2;
                                    break;
                                case "magnet":
                                    break;
                                case "slow":
                                    temp_vector.x /= 2;
                                    temp_vector.y /= 2;
                                    break;
                                case "vector":
                                    temp_vector.y *= -1;
                                    break;
                                case "random":
                                    temp_vector.y *= -1;
                                    break;

                                case "fake":
                                    break;
                                case "wallbreaker":
                                    console.log("on");
                                    tparent.inviz_count = 0;
                                    tparent.inviz = true;
                                    break;
                                case "portal":
                                    let x = null;
                                    let y = null;
                                    if (tparent.graphic.position().y > tparent.field.center.y){
                                        x = randomInt(tparent.field.corners[0].x, tparent.field.corners[1].x);
                                        y = randomInt(tparent.field.pos_y, tparent.field.center.y);
                                    }else{
                                        x = randomInt(tparent.field.corners[0].x, tparent.field.corners[1].x);
                                        y = randomInt(tparent.field.center.y, tparent.field.corners[1].y);
                                    }
                                    tparent.in_cell = false;
                                    tparent.graphic.setX(x);
                                    tparent.graphic.setY(y);
                                    ball_layer.draw();
                                case "timer":
                                    tparent.timer = {state:true, time: performance.now() / 1000};
                                    console.log(temp_vector);
                                    console.log(tparent.vector);
                                    if (base_result.type == "vector"){
                                        tparent.timer.storage =  base_result.func;
                                    }
                                    break;
                            }
                            mod.graphic.remove();
                            cell.slots["mod"] = null;
                            mods_layer.draw();
                        }



                        /// Удар
                        if (base_result.type != "no_hit" && mod_result.type != "no_hit") {
                            let status = base.hit();
                            if (status == "dead") {
                                if (mod != null) {
                                    mod.graphic.remove();
                                    mods_layer.draw();
                                }
                                cell.slots["base"] = null;
                                cell.slots["mod"] = null;
                            }
                        }
                        if (tparent.timer != null && tparent.timer.state){
                            tparent.vector = limit(tparent.vector, 15);
                        }else{
                            tparent.vector = limit(temp_vector, 15);
                        }
                    }else if(mod!= null && mod.ability=="wallbreaker") {

                    }else{
                        tparent.in_cell = true;
                        tparent.inviz_count++;
                        // console.log(tparent.inviz_count);
                    }


                    if (tparent.inviz_count == 1){
                        tparent.inviz = false;
                        console.log("off");
                    }
                }

            }else if(hole != null){
                if (hole.ability == "red")
                    counter.red++;
                else
                    counter.green++;
                tparent.respawn();
                counter.update();
            }else{
                tparent.in_cell = false;
                if (tparent.timer && tparent.timer.state) {

                    if ((performance.now() / 1000 - tparent.timer.time) > 2) {
                        if (tparent.timer.storage != null){
                            console.log("start " + tparent.timer.time + " end " + performance.now() / 1000);
                            console.log((performance.now() / 1000 - tparent.timer.time));
                            tparent.timer.storage(tparent.vector);
                            tparent.timer = null;
                        }
                    }

                }
            }
            if (!tparent.inviz){
                tparent.borders();
            }else{
                tparent.magic_borders();
            }

            tparent.graphic.x(
                tparent.graphic.position().x + tparent.vector.x,
        );
            tparent.graphic.y(
                tparent.graphic.position().y + tparent.vector.y,
            );
        }, ball_layer);
        // tparent.anim.start();
    }
    random_vector(){
        let x = randomInt(min_speed, max_speed);
        let y = randomInt(min_speed, max_speed);
        while (x==0 || y==0){
            x = randomInt(min_speed, max_speed);
            y = randomInt(min_speed, max_speed);
        }
        this.vector = {x: x, y: y};
    }
    respawn(){
        this.random_vector();
        this.graphic.setX(this.pos_x);
        this.graphic.setY(this.pos_y);
        ball_layer.draw();
    }
    borders(){
        if (this.graphic.position().x <= this.field.corners[0].x || this.graphic.position().x + this.radius*2 >= this.field.corners[1].x){
            this.vector.x = this.vector.x * -1;
            // if (this.vector.x < 0)
            //     this.vector.x-=0.05;
            // else
            //     this.vector.x+=0.05;
            // console.log(this.vector.x);
        }
        if (this.graphic.position().y <= this.field.corners[0].y || this.graphic.position().y + this.radius*2 >= this.field.corners[1].y){
            this.vector.y = this.vector.y * -1;
            // if (this.vector.x < 0)
            //     this.vector.x-=0.05;
            // else
            //     this.vector.x+=0.05;
        }
    }

    magic_borders(){
        let w = this.field.corners[1].x - this.field.corners[0].x;
        let h = this.field.corners[1].y - this.field.corners[0].y;
        // var ad = new Konva.Rect({
        //     x:this.field.corners[0].x,
        //     y:this.field.corners[0].y,
        //     width: w,
        //     height: h,
        //     fill: 'red',
        //     stroke: 'black',
        //     strokeWidth: 2,
        //     opacity: 0.5
        // });
        // background_layer.add(ad);
        // background_layer.draw();

        // width: this.width * this.cell_size + (this.width + 1) * this.padding,
        //     height: this.height / 2 * this.cell_size + (this.height + 1) / 2 * this.padding,
        let c = 0;
        if (this.graphic.position().x < this.field.corners[0].x){
            this.graphic.setX(this.field.corners[1].x - this.radius*2);
            c++;
        }
        if (this.graphic.position().x + this.radius*2 > this.field.corners[1].x){
            this.graphic.setX(this.field.corners[0].x + this.radius);
            c++;
        }
        if (this.graphic.position().y < this.field.corners[0].y){
            this.graphic.setY(this.field.corners[1].y - this.radius*2);
            c++;
        }
        if (this.graphic.position().y + this.radius*2 > this.field.corners[1].y){
            this.graphic.setY(this.field.corners[0].y + this.radius);
            c++;
        }

        if (c!=0){
            // this.anim.stop();
            this.inviz = false;
        }
    }
}

// stage.on('mousemove', function(evt) {
//     var pos = stage.getPointerPosition();
//     console.log(pos);
// });

counter = new Counter(300, 600);

last_place = null;
stage.on('dragstart', function(evt) {
    var pos = stage.getPointerPosition();
    var shape = cells_layer.getIntersection(pos);
    last_place = shape.attrs.parent_class;
    // console.log("start");
});


stage.on('dragend', function(evt) {
    if (last_place != null) {
        var pos = stage.getPointerPosition();
        var cell = cells_layer.getIntersection(pos);
        var base = bases_layer.getIntersection(pos);
        var mod = mods_layer.getIntersection(pos);

        let type = evt.target.attrs.parent_class.type;
        if (cell != null && cell.attrs.parent_class.slots[type] == null) {
            //если место свободно то ставить
            cell = cell.attrs.parent_class;
            let ability1 = evt.target.attrs.parent_class.ability;
            let ability2 = null;
            if (cell.slots['mod'] != null){
                ability2 = cell.slots['mod'].ability;
            }else if (cell.slots['base'] != null){
                ability2 = cell.slots['base'].ability;
            }
            if (ability1 == ability2){
                return_to_place();
            }else {
                evt.target.setX(cell.graphic.position().x);
                evt.target.setY(cell.graphic.position().y);
                last_place.slots[type] = null;
                cell.slots[type] = evt.target.attrs.parent_class;
                bases_layer.draw();
                mods_layer.draw();
                last_place = null;
            }
        } else {
            // если место занято то вернуть на место
            return_to_place();
        }
    }
    function return_to_place(){
        evt.target.setX(last_place.graphic.attrs.x);
        evt.target.setY(last_place.graphic.attrs.y);
        last_place = null;
        bases_layer.draw();
        mods_layer.draw();
    }
});

button = new Konva.Text({
    x: 40,
    y: 500,
    text: "Start",
    fontSize: 72,
    fontFamily: 'Calibri',
    fill: 'Black',
    state: false
});

button.on('click', () => {
    let text = "";
    if (button.attrs.state){
        text = "Start";
        ball.anim.stop();

    }else{
        text = "Stop";
        ball.anim.start();
    }
    button.attrs.state = !button.attrs.state;
    button.setAttrs({
        text: text,
    });
    background_layer.draw();
    // alert('clicked on canvas button');
});

background_layer.add(button);


let field = new Field(320,40,8, 10, 40, 12, ['green', 'red']);

docer1 = new Docer(40,40,5, 4, 40, 12, 'green');
docer2 = new Docer(760,450,5, 4, 40, 12, 'red');



new Modifier(40, "res/images/add_etheral.png", docer1, 'mod','etheral');
new Modifier(40, "res/images/add_fake.png", docer1, 'mod','fake');
new Modifier(40, "res/images/add_fast.png", docer1, 'mod','fast');
new Modifier(40, "res/images/add_slow.png", docer1, 'mod','slow');
new Modifier(40, "res/images/add_magnet.png", docer1, 'mod','magnet');
new Modifier(40, "res/images/add_portal.png", docer1, 'mod','portal');
new Modifier(40, "res/images/add_random.png", docer1, 'mod','random');
new Modifier(40, "res/images/add_timer.png", docer1, 'mod','timer');
new Modifier(40, "res/images/add_vector.png", docer1, 'mod','vector');
new Modifier(40, "res/images/add_wallbreaker.png", docer1, 'mod','wallbreaker');

new Modifier(40, "res/images/base_etheral.png", docer1, 'base','etheral');
new Modifier(40, "res/images/base_fast.png", docer1, 'base','fast');
new Modifier(40, "res/images/base_magnet.png", docer1, 'base','magnet');
new Modifier(40, "res/images/base_slow.png", docer1, 'base','slow');
new Modifier(40, "res/images/base_vector.png", docer1, 'base','vector');


new Modifier(40, "res/images/add_etheral.png", docer2, 'mod','etheral');
new Modifier(40, "res/images/add_fake.png", docer2, 'mod','fake');
new Modifier(40, "res/images/add_fast.png", docer2, 'mod','fast');
new Modifier(40, "res/images/add_slow.png", docer2, 'mod','slow');
new Modifier(40, "res/images/add_magnet.png", docer2, 'mod','magnet');
new Modifier(40, "res/images/add_portal.png", docer2, 'mod','portal');
new Modifier(40, "res/images/add_random.png", docer2, 'mod','random');
new Modifier(40, "res/images/add_timer.png", docer2, 'mod','timer');
new Modifier(40, "res/images/add_vector.png", docer2, 'mod','vector');
new Modifier(40, "res/images/add_wallbreaker.png", docer2, 'mod','wallbreaker');

new Modifier(40, "res/images/base_etheral.png", docer2, 'base','etheral');
new Modifier(40, "res/images/base_fast.png", docer2, 'base','fast');
new Modifier(40, "res/images/base_magnet.png", docer2, 'base','magnet');
new Modifier(40, "res/images/base_slow.png", docer2, 'base','slow');
new Modifier(40, "res/images/base_vector.png", docer2, 'base','vector');

new Modifier(40, "res/images/hole.png", field, 'hole','red', null, {x: 4, y: 0});
new Modifier(40, "res/images/hole.png", field, 'hole','green', null,{x: 3, y: 9});

// ball = new Ball(field.center.x - 90, field.center.y + 10, 10, "blue", {x: -2,y: 0}, field);
ball = new Ball(field.center.x, field.center.y, 10, "blue", null, field);


stage.add(background_layer);
stage.add(cells_layer);
stage.add(bases_layer);
stage.add(mods_layer);
stage.add(ball_layer);

background_layer.draw();
cells_layer.draw();
bases_layer.draw();
mods_layer.draw();
ball_layer.draw();