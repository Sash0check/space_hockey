let stage = new Konva.Stage({
    container: 'container',   // id of container <div>
    width: 1400,
    height: 900
});

let max_speed = 5;
let min_speed = -5;

// then create layer
let background_layer = new Konva.Layer();
let cells_layer = new Konva.Layer();
let bases_layer = new Konva.Layer();
let mods_layer = new Konva.Layer();
let ball_layer = new Konva.Layer();

let instuctions  = new Image();
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
            x: this.x,
            y: this.y,
            width: this.text.textWidth / 2,
            height: this.text.textHeight,
        });
        this.bg2.setAttrs({
            x: this.x + this.text.textWidth / 2,
            y: this.y,
            width: this.text.textWidth / 2,
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
        this.slots = {"mod": 0, "base": 0};
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
// 'etheral' 'fast', 'magnet', 'slow', 'vector'
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
                docer.cells[coords.x][coords.y].slots['mod'] = true;
                docer.cells[coords.x][coords.y].slots['base'] = true;
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
        this.life--;
        if (this.life == 0){
            this.graphic.destroy();
            bases_layer.draw();
        }
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
        this.prototypes = [];
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

        // top:
        // for (let row in this.cells){
        //     row = this.cells[row];
        //     for (let cell in row) {
        //         cell = row[cell];
        //         if (Object.values(cell.slots).reduce((a, b) => a + b, 0) == 0) {
        //             mod.graphic.setX(cell.graphic.position().x);
        //             mod.graphic.setY(cell.graphic.position().y);
        //             cell.slots[mod.type] = 1;
        //             break top;
        //         }
        //     }
        // }
        top:
        for (let j = 0; j < this.cells[0].length; j++){
            for (let i = 0; i < this.cells.length; i++){
                let cell = this.cells[i][j];
                if (Object.values(cell.slots).reduce((a, b) => a + b, 0) == 0) {
                    mod.graphic.setX(cell.graphic.position().x);
                    mod.graphic.setY(cell.graphic.position().y);
                    cell.slots[mod.type] = 1;
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
}

class Ball{
    constructor(pos_x, pos_y, radius, color, vector, field) {
        this.pos_x = pos_x;
        this.pos_y = pos_y;
        this.radius = radius;
        this.color = color;
        this.in_cell = false;
        if (vector != null){
            this.vector = vector;
        }else{
            let x = randomInt(-min_speed, max_speed);
            let y = randomInt(-min_speed, max_speed);
            while (x==0 || y==0){
                x = randomInt(-min_speed, max_speed);
                y = randomInt(-min_speed, max_speed);
            }
            this.vector = {x: x, y: y};
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
            let base = bases_layer.getIntersection(pos);
            let mod = mods_layer.getIntersection(pos);
            // if (shape!=null){
            //     shape.attrs.fill = "black";
            //     cells_layer.draw();
            // }
            if (base != null){
                if (!tparent.in_cell) {
                    tparent.in_cell = true;
                    let base_parent = base.attrs.parent_class;
                    if (mod != null) {
                        let mod_parent = mod.attrs.parent_class;
                        if (mod_parent.type == "hole") {
                            if (mod_parent.ability == "red")
                                counter.red++;
                            else
                                counter.green++;
                            tparent.respawn();
                            counter.update();
                        }
                    }else{
                        base_parent.hit();
                    }
                }
            }else{
                tparent.in_cell = false;
            }


            tparent.borders();
        }, ball_layer);
        tparent.anim.start();
    }
    respawn(){
        let x = randomInt(-10, 10);
        let y = randomInt(-10, 10);
        while (x==0 || y==0){
            x = randomInt(-min_speed, max_speed);
            y = randomInt(-min_speed, max_speed);
        }
        this.vector = {x: x, y: y};
        this.graphic.setX(this.pos_x);
        this.graphic.setY(this.pos_y);
    }
    borders(){
        if (this.graphic.position().x <= this.field.corners[0].x || this.graphic.position().x >= this.field.corners[1].x){
            this.vector.x = this.vector.x * -1;
        }
        if (this.graphic.position().y <= this.field.corners[0].y || this.graphic.position().y >= this.field.corners[1].y){
            this.vector.y = this.vector.y * -1;
        }
        this.graphic.x(
            this.graphic.position().x + this.vector.x,
        );
        this.graphic.y(
            this.graphic.position().y + this.vector.y,
        );
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
        // console.log("end");
        // console.log(cell);
        // console.log(evt.target);
        // console.log(shape.attrs.parent_class.status);
        // if (cell!=null)
        //     console.log(cell.attrs.parent_class);
        // console.log(evt.target.attrs.parent_class.type);
        if (cell != null && cell.attrs.parent_class.slots[evt.target.attrs.parent_class.type] == 0) {
            //если место свободно то ставить
            // console.log(cell);
            // console.log(shape.position());
            evt.target.setX(cell.position().x);
            evt.target.setY(cell.position().y);
            last_place.slots[evt.target.attrs.parent_class.type] = 0;
            cell.attrs.parent_class.slots[evt.target.attrs.parent_class.type] = 1;
            bases_layer.draw();
            mods_layer.draw();
            last_place = null;
        } else {
            // если место занято то вернуть на место
            // console.log(evt.target);
            evt.target.setX(last_place.graphic.attrs.x);
            evt.target.setY(last_place.graphic.attrs.y);
            last_place = null;
            bases_layer.draw();
            mods_layer.draw();
        }
    }
});


let field = new Field(320,40,8, 10, 40, 12, ['green', 'red']);

let docer1 = new Docer(40,40,5, 4, 40, 12, 'green');
let docer2 = new Docer(760,450,5, 4, 40, 12, 'red');

new Modifier(40, "res/images/add_etheral.png", docer1, 'mod','etheral');
new Modifier(40, "res/images/add_fake.png", docer1, 'mod','fake');
new Modifier(40, "res/images/add_fast.png", docer1, 'mod','fast');
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

ball = new Ball(field.center.x - 90, field.center.y, 10, "blue", {x: 0, y: 10}, field);



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