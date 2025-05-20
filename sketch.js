let gotas = [];
let solo;
let tipoSolo = "vegetacao";
let animais = [];
let carro;
let predios = [];

function setup() {
  let canvas = createCanvas(600, 400);
  canvas.parent("canvas-holder");
  solo = new Solo(tipoSolo);
  inicializarExtras();
}

function draw() {
  background(200, 220, 255); // céu

  for (let i = gotas.length - 1; i >= 0; i--) {
    gotas[i].cair();
    gotas[i].mostrar();
    if (gotas[i].atingeSolo(solo.altura)) {
      solo.aumentarErosao();
      gotas.splice(i, 1);
    }
  }

  // Mostrar elementos específicos
  if (tipoSolo === "vegetacao") {
    for (let animal of animais) {
      animal.mover();
      animal.mostrar();
    }
  } else if (tipoSolo === "urbanizado") {
    for (let p of predios) p.mostrar();
    carro.mover();
    carro.mostrar();
  }

  solo.mostrar();

  if (frameCount % 5 === 0) {
    gotas.push(new Gota());
  }
}

function setSoilType(tipo) {
  tipoSolo = tipo;
  solo = new Solo(tipoSolo);
  inicializarExtras(); // reinicia carro/animais/prédios
}

function inicializarExtras() {
  // Animais na vegetação
  animais = [];
  if (tipoSolo === "vegetacao") {
    for (let i = 0; i < 3; i++) {
      animais.push(new Animal(random(width), height - 100));
    }
  }

  // Prédios e carro na área urbanizada
  predios = [];
  if (tipoSolo === "urbanizado") {
    predios.push(new Predio(100));
    predios.push(new Predio(250));
    predios.push(new Predio(400));
    carro = new Carro();
  }
}

class Gota {
  constructor() {
    this.x = random(width);
    this.y = 0;
    this.vel = random(4, 6);
  }

  cair() {
    this.y += this.vel;
  }

  mostrar() {
    stroke(0, 0, 200);
    line(this.x, this.y, this.x, this.y + 10);
  }

  atingeSolo(ySolo) {
    return this.y > ySolo;
  }
}

class Solo {
  constructor(tipo) {
    this.tipo = tipo;
    this.altura = height - 80;
    this.erosao = 0;
  }

  aumentarErosao() {
    let taxa = 0.3;
    if (this.tipo === "vegetacao") taxa = 0.1;
    else if (this.tipo === "exposto") taxa = 0.5;
    this.erosao += taxa;
    this.altura += taxa;
  }

  mostrar() {
    noStroke();
    if (this.tipo === "vegetacao") fill(60, 150, 60);
    else if (this.tipo === "exposto") fill(139, 69, 19);
    else if (this.tipo === "urbanizado") fill(120);

    rect(0, this.altura, width, height - this.altura);

    fill(0);
    textSize(14);
    textAlign(LEFT);
    text(`Erosão: ${this.erosao.toFixed(1)}`, 10, 20);
    text(`Tipo de solo: ${this.tipo}`, 10, 40);
  }
}

class Animal {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.direcao = random([1, -1]);
  }

  mover() {
    this.x += this.direcao * 1.5;
    if (this.x > width - 20 || this.x < 0) this.direcao *= -1;
  }

  mostrar() {
    fill(160, 82, 45);
    ellipse(this.x, this.y, 20, 15); // corpo
    ellipse(this.x - 8, this.y - 5, 8, 8); // cabeça
  }
}

class Carro {
  constructor() {
    this.x = 0;
    this.y = height - 50;
  }

  mover() {
    this.x += 2;
    if (this.x > width + 50) this.x = -50;
  }

  mostrar() {
    fill(255, 0, 0);
    rect(this.x, this.y - 20, 40, 20);
    fill(0);
    ellipse(this.x + 10, this.y, 10);
    ellipse(this.x + 30, this.y, 10);
  }
}

class Predio {
  constructor(x) {
    this.x = x;
    this.y = height - 120;
    this.largura = 40;
    this.altura = 100;
  }

  mostrar() {
    fill(80);
    rect(this.x, this.y, this.largura, this.altura);
    fill(255);
    for (let i = 0; i < 3; i++) {
      rect(this.x + 10, this.y + 10 + i * 25, 20, 15);
    }
  }
}
