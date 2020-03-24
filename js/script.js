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
        this.counter = 0;
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


        // field.clear();

        ball.anim.stop();
        ball.respawn();
        ball.draw_vector();
        ball_layer.draw();
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
        this.nominal_width = this.width * this.cell_size + (this.width + 1) * this.padding;
        this.nominal_height = this.height * this.cell_size + (this.height + 1) * this.padding;
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
    clear(){
        for (let i = 0; i < this.width; i++){
            for (let j = 0; j < this.height; j++) {
                this.cells[i][j].slots["mod"] = null;
                this.cells[i][j].slots["base"] = null;
            }
        }
    }
}

class Modifier {

    constructor(size, img_name, docer, type, ability, is_long, coords) {
        this.imageObj = new Image();
        this.graphic = null;
        this.type = type;
        this.is_long = is_long;
        this.ability = ability;
        this.life = 5;
        this.rotation = 1;
        this.rotation_storage = null;
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
    // hit(){
    //     round_counter.hits--;
    //     if (round_counter.hits == 0){
    //         round_counter.new_round();
    //         return ;
    //     }
    //     round_counter.update();
    //     // this.life--;
    //     if (this.life == 0){
    //         this.graphic.remove();
    //         bases_layer.draw();
    //         return "dead";
    //     }
    //     return "alive";
    // }
    hit(){
        round_counter.hits--;
        if (round_counter.hits == 0){
            round_counter.new_round();
            return "stop";
        }
        round_counter.update();
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
    constructor(pos_x, pos_y, radius, color, speed, vector, field) {
        this.pos_x = pos_x;
        this.pos_y = pos_y;
        this.radius = radius;
        this.color = color;
        this.speed = speed;
        this.last_cell = null;
        let tparent = this;

        this.actions = {
            "etheral" : function(vector, angle){
                if ((angle >= 45 && angle <= 135) || (angle >= 225 && angle <= 315)){
                    vector.x*=-1;
                }else{
                    vector.y*=-1;
                }
            },
            "straight" : function(vector, angle){
                angle = Math.round(angle);
                if (angle > 45 && angle < 135){
                    vector.x = 0;
                    vector.y = -tparent.speed;
                }else if (angle > 225 && angle < 315){
                    vector.x = 0;
                    vector.y = tparent.speed;
                }else if (angle > 135 && angle < 225){
                    vector.x = -tparent.speed;
                    vector.y = 0;
                }else if ((angle > 0 && angle < 45) || (angle > 315 && angle < 0)){
                    vector.x = tparent.speed;
                    vector.y = 0;
                }else{
                    vector.x *=-1;
                    vector.y *=-1;
                }
                return vector;
            },
            "mirror" : function(vector){vector.x*=-1; vector.y*=-1; return vector},
            "normal" : function(vector, angle){
                angle = Math.round(angle);
                if ((angle > 45 && angle < 135) || (angle > 225 && angle < 315)){
                    vector.y*=-1;
                }else if(angle > 135 && angle < 225 || (angle > 0 && angle < 45) || (angle > 315 && angle < 0)){
                    vector.x*=-1;
                }else{
                    vector.x *=-1;
                    vector.y *=-1;
                }
                return vector
            },
            "rotating" : function(vector, angle, rotation, cell){
                console.log(cell);
                tparent.graphic.setX(cell.graphic.getX() + cell.graphic.getWidth());
                tparent.graphic.setX(cell.graphic.getY() + cell.graphic.getHeight());
                let z = tparent.speed * tparent.speed;
                let factor = z / 2;
                let x = factor ** 0.5;
                let y = factor ** 0.5;
                if (rotation == 1){
                    y *= -1;
                }else if (rotation == 2){

                }else if (rotation == 3){
                    x *=-1;
                }else if (rotation == 4){
                    x *=-1;
                    y *=-1;
                }
                tparent.vector.x = x;
                tparent.vector.y = y;
                return vector
            },
        };
        if (vector != null){
            this.vector = vector;
        }else{
            this.vector = this.random_vector();
        }
        this.default_vector = {x: this.vector.x, y: this.vector.y};

        this.field = field;
        this.in_fly = false;
        this.graphic = new Konva.Circle({
            x: pos_x,
            y: pos_y,
            radius: radius,
            fill: color,
            // stroke: 'black',
            // strokeWidth: 4,
            parent_class: tparent
        });

        ball_layer.add(this.graphic);
        tparent.anim = new Konva.Animation(function(frame) {
            let pos = tparent.graphic.getPosition();
            let cell = cells_layer.getIntersection(pos);
            let base = null;
            let mod = null;
            let hole = null;

            let extra_pos = [
                {x: pos.x + tparent.graphic.getRadius(), y: pos.y},
                {x: pos.x, y: pos.y + tparent.graphic.getRadius()},
                {x: pos.x - tparent.graphic.getRadius(), y: pos.y},
                {x: pos.x, y: pos.y - tparent.graphic.getRadius()}
            ];

            if (cell==null || base == null){
                for (let i = 0; i < extra_pos.length; i++){
                    cell = cells_layer.getIntersection(extra_pos[i]);
                    if (cell!= null){
                        let temp_cell = cell.attrs.parent_class;
                        base = temp_cell.slots["base"];
                        mod = temp_cell.slots["mod"];
                        hole = temp_cell.slots["hole"];
                        if (base!= null || hole != null){
                            break;
                        }
                    }
                }
            }

            if (cell != null){
                cell = cell.attrs.parent_class;
                base = cell.slots["base"];
                mod = cell.slots["mod"];
                hole = cell.slots["hole"];
                if (cell != tparent.last_cell){
                    if (base != null){
                        if (tparent.in_fly && base.is_long){
                            tparent.make_ground();
                            tparent.in_fly = false;
                            if (base.hit() == "stop")
                                return;
                        }else if(tparent.in_fly && !base.is_long){

                        }else{
                            let probability = randomInt(1, 100);
                            if (probability <= 15) {
                                tparent.in_fly = true;
                            }
                            let angle = tparent.get_angle(pos, cell);
                            if (mod != null) {
                                tparent.actions[mod.ability](tparent.vector, angle, mod.rotation, cell);
                            } else {
                                tparent.actions["normal"](tparent.vector, angle);
                            }
                            if (base.hit() == "stop")
                                return;
                        }

                    }
                }
                tparent.last_cell = cell;
            }


            if(hole != null){
                if (hole.ability == "red")
                    counter.red++;
                else
                    counter.green++;
                tparent.make_ground();
                tparent.in_fly = false;
                round_counter.new_round();
                counter.update();
                return;
            }

            if (tparent.in_fly){
                tparent.make_fly();
            }else{
                tparent.make_ground();
            }

            tparent.graphic.setAttrs({
                x: pos.x + tparent.vector.x,
                y: pos.y + tparent.vector.y
            });
            tparent.borders();

        }, ball_layer);
    }
    make_fly(){
        this.graphic.setAttrs({
            radius: this.radius * 1.5,
            fill: "#4E63FF"
        });
        ball_layer.draw();
    }
    make_ground(){
        this.graphic.setAttrs({
            radius: this.radius,
            fill: this.color
        });
        ball_layer.draw();
    }

    get_angle(p1, cell){
        // this.anim.stop();
        let p2 = cell.graphic.getPosition();
        p2.x += cell.graphic.getWidth() / 2;
        p2.y += cell.graphic.getHeight() / 2;
        // var redLine = new Konva.Line({
        //     points: [p1.x, p1.y, p2.x, p2.y],
        //     stroke: 'black',
        //     strokeWidth: 1,
        //     lineCap: 'round',
        //     lineJoin: 'round'
        // });
        // ball_layer.add(redLine);
        // ball_layer.draw();
        let dy = p2.y - p1.y;
        let dx = p2.x - p1.x;
        let angleDeg = Math.atan2(-dy, -dx) * 180 / Math.PI;
        angleDeg *= -1 ;
        if (angleDeg < 0) angleDeg = 360 + angleDeg;
        return angleDeg;
    }
    random_vector(){
        let z = this.speed * this.speed;
        let factor = z / 2;
        let x = factor ** 0.5;
        let y = factor ** 0.5;
        if (Math.random() > 0.5)
            x = -x;
        if (Math.random() > 0.5)
            y = -y;
        return {x: x, y: y}
    }

    respawn(){
        this.vector = this.random_vector();
        this.graphic.setAttrs({
            x: this.pos_x,
            y: this.pos_y,
            radius: this.radius,
            fill: this.color
        });
        ball_layer.draw();
    }
    borders(){
        if (this.graphic.position().x - this.graphic.getRadius() <= this.field.corners[0].x || this.graphic.position().x + this.graphic.getRadius() >= this.field.corners[1].x){
            this.vector.x = this.vector.x * -1;
        }
        if (this.graphic.position().y - this.graphic.getRadius() <= this.field.corners[0].y || this.graphic.position().y + this.graphic.getRadius() >= this.field.corners[1].y){
            this.vector.y = this.vector.y * -1;
        }
    }
    draw_vector(){
        this.arrow = new Konva.Arrow({
            pointerLength: 4,
            pointerWidth: 4,
            fill: 'black',
            stroke: 'black',
            strokeWidth: 4
        });
        this.arrow.setAttrs({
            x: this.graphic.getPosition().x,
            y: this.graphic.getPosition().y,
            points: [0, 0, ball.vector.x * 10, ball.vector.y * 10]
        });
        ball_layer.add(this.arrow);
        ball_layer.draw();
    }
    wipe_vector(){
        if (this.arrow != null){
            this.arrow.remove();
            ball_layer.draw();
        }
    }
}

// stage.on('mousemove', function(evt) {
//     var pos = stage.getPointerPosition();
//     console.log(pos);
//
// });

// stage.on('click', function(evt) {
//     var pos = stage.getPointerPosition();
//     var shape = cells_layer.getIntersection(pos);
//     if (shape!=null){
//         console.log(shape);
//         if (shape.attrs.parent_class!=null){
//             console.log(shape.attrs.parent_class);
//         }
//     }
// });

counter = new Counter(300, 600);

last_place = null;
stage.on('dragstart', function(evt) {
    var pos = stage.getPointerPosition();
    var shape = cells_layer.getIntersection(pos);
    if (shape)
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
            if (evt.target.attrs.parent_class.type == "mod" && base!=null && base.attrs.parent_class.is_long){
                return_to_place();
            }else{
                //если место свободно то ставить
                cell = cell.attrs.parent_class;
                let ability1 = evt.target.attrs.parent_class.ability;
                let ability2 = null;
                if (cell.slots['mod'] != null) {
                    ability2 = cell.slots['mod'].ability;
                } else if (cell.slots['base'] != null) {
                    ability2 = cell.slots['base'].ability;
                }
                if (ability1 == ability2) {
                    return_to_place();
                } else {
                    evt.target.setX(cell.graphic.position().x);
                    evt.target.setY(cell.graphic.position().y);
                    last_place.slots[type] = null;
                    cell.slots[type] = evt.target.attrs.parent_class;
                    bases_layer.draw();
                    mods_layer.draw();
                    last_place = null;
                }
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

stage.on('contextmenu', function(e) {
    e.evt.preventDefault();
    var pos = stage.getPointerPosition();
    var mod = mods_layer.getIntersection(pos);
    if (mod != null){
        mod = mod.attrs.parent_class;
        if (mod.ability == "rotating"){
            if (mod.rotation == 1){
                mod.graphic.setAttrs({
                    x: mod.graphic.getX() + mod.graphic.width() / 2,
                    y: mod.graphic.getY() + mod.graphic.height() / 2,
                });
            }
            mod.rotation++;
            // mod.graphic.setAttrs({
            //     x: mod.graphic.getX() + mod.graphic.width() / 2 ,
            //     y: mod.graphic.getY() + mod.graphic.height() / 2 ,
            // });

            mod.graphic.offsetX(mod.graphic.width() / 2);
            mod.graphic.offsetY(mod.graphic.height() / 2);


            mod.graphic.rotate(90);

            if (mod.rotation == 5){
                mod.rotation = 1;
                mod.graphic.offsetX(0);
                mod.graphic.offsetY(0);
                mod.graphic.setAttrs({
                    x: mod.graphic.getX() - mod.graphic.width() / 2,
                    y: mod.graphic.getY() - mod.graphic.height() / 2,
                });
            }
            mods_layer.draw();
        }
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
        ball.wipe_vector();
    }
    button.attrs.state = !button.attrs.state;
    button.setAttrs({
        text: text,
    });
    background_layer.draw();
    // alert('clicked on canvas button');
});

background_layer.add(button);


let field = new Field(320,40,8, 10, 40, 6, ['green', 'red']);

docer1 = new Docer(40,40,5, 4, 40, 12, 'green');
docer2 = new Docer(760,450,5, 4, 40, 12, 'red');



new Modifier(40, "res/images_v2/add_etheral.png", docer1, 'mod','etheral');
new Modifier(40, "res/images_v2/add_straight_reflect.png", docer1, 'mod','straight');
new Modifier(40, "res/images_v2/add_interceptor.png", docer1, 'mod','mirror');

new Modifier(40, "res/images_v2/rotate.png", docer1, 'mod','rotating');

new Modifier(40, "res/images_v2/base_short.png", docer1, 'base',false, false);
new Modifier(40, "res/images_v2/base_short.png", docer1, 'base',false, false);
new Modifier(40, "res/images_v2/base_short.png", docer1, 'base',false, false);
new Modifier(40, "res/images_v2/base_long.png", docer1, 'base',false, true);
new Modifier(40, "res/images_v2/base_long.png", docer1, 'base',false, true);
new Modifier(40, "res/images_v2/base_long.png", docer1, 'base',false, true);


new Modifier(40, "res/images_v2/add_etheral.png", docer2, 'mod','etheral');
new Modifier(40, "res/images_v2/add_straight_reflect.png", docer2, 'mod','straight');
new Modifier(40, "res/images_v2/add_interceptor.png", docer2, 'mod','mirror');

new Modifier(40, "res/images_v2/rotate.png", docer2, 'mod','rotating');

new Modifier(40, "res/images_v2/base_short.png", docer2, 'base',false, false);
new Modifier(40, "res/images_v2/base_short.png", docer2, 'base',false, false);
new Modifier(40, "res/images_v2/base_short.png", docer2, 'base',false, false);
new Modifier(40, "res/images_v2/base_long.png", docer2, 'base',false, true);
new Modifier(40, "res/images_v2/base_long.png", docer2, 'base',false, true);
new Modifier(40, "res/images_v2/base_long.png", docer2, 'base',false, true);

new Modifier(40, "res/images_v2/hole.png", field, 'hole','red', false, {x: 4, y: 0});
new Modifier(40, "res/images_v2/hole.png", field, 'hole','green', false,{x: 3, y: 9});


// ball = new Ball(field.center.x - 90, field.center.y + 10, 10, "blue", {x: -2,y: 0}, field);
ball = new Ball(field.center.x + 20, field.center.y, 10, "blue", 5, null, field);

stage.add(background_layer);
stage.add(cells_layer);
stage.add(bases_layer);
stage.add(mods_layer);
stage.add(ball_layer);

round_counter.new_round();

background_layer.draw();
cells_layer.draw();
bases_layer.draw();
mods_layer.draw();
ball_layer.draw();