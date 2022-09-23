
  window.onload = () => { //para que hasta que no se cargue la página no aparezca nada.
  
    const canvas = document.getElementById("canvas")
    const ctx = canvas.getContext("2d")
  
    //lo que espera onclick es la definición de una función
  document.getElementById('start-button').onclick = () => {
    startGame();
  };

  

  //otra manera de hacer lo de arriba.
  // const botonInicio = document.getElementById("start-button");
  // botonInicio.addEventListener("click", ()=>{
  //   startGame();
  // });


  //lo primero que tenemos que hacer es crear la imagen que me piden
  //tenemos que manipular el html a través de javascript para que html sea quien pinta. las rutas se hacen siempre desde html.
  //estamos creando una imagen que la va a printear html entonces la ruta es desde html. (ruta relativa desde el fichero donde estás)
  const imgFondo = document.createElement("img");
  imgFondo.setAttribute("src", "images/road.png"); //tb puede ser imgFondo.src = "";

  const imgCoche = document.createElement("img");
  imgCoche.setAttribute("src", "images/car.png"); //tb puede ser imgFondo.src = "";

  let x_coche = (canvas.getAttribute("width") - 60)/2; //igual que x_coche = 220;
  // let widthMaxObstaculo = canvas.getAttribute("width") - 150; lo ponemos dentro de la class porque solo lo vamos a necesitar ahí
  //obstáculo: metemos un math.random, mirar el máx width, hay que dejar espacio mínimo del coche, aumentamos un poco i.e: 100
  // let widthObstaculo = Math.floor(Math.random() * widthMaxObstaculo);
  // let xObstaculo = Math.floor(Math.random() * canvas.getAttribute("width") - widthObstaculo);
  // let yObstaculo = -30; //para que se cree fuera y aparezca como de arriba. 
  let frames = 0; //iteraciones
  // let score = 0; INVESTIGANDO ESTO.

  //array de obstaculos, cada vez que cree uno lo meto aquí. la creamos para tener más de un obstáculo 
  //a la vez (va por la class) entonces comentamos todos los parámetros arriba especificados para el primer obstáculo.
  const obstaculos = [];

  //creo un evento, es del teclado en este caso no depende del documento.
  //cuando le demos a keydown recogemos 
  document.body.addEventListener("keydown", (e)=>{
    if(e.key == "ArrowLeft"){
      x_coche -= 20; //va a mover 20px cada vez
      if(x_coche < 0){
        x_coche = 0;
      }
    } else if(e.key == "ArrowRight"){
      x_coche += 20;
      if(x_coche >= 500 - 60){  //la x 0 del coche está en la esquina superior izquierda, aquí hay que restar el coche
        x_coche = 500 - 60; //o canvas.getAttribute("width") - 60)/2
      }
    }
  });


  let intervalId;

  function startGame() {
  intervalId = setInterval(update, 20); //cada 300 iteraciones que suelte un obstaculo.
  }

  function update() { //esta función se ejecuta cada 20 milisegundos.
    frames ++; //cada vez que ejecutamos un update, recalculamos frames.
    // score ++; //para que vaya contando los puntos INVESTIGANDO ESTO.
    //LIMPIAR
    ctx.clearRect(0, 0, canvas.getAttribute("width"), canvas.getAttribute("height"))//posición 0,0 y ancho del canvas y alto del canvas
    //  RECALCULAR posición obstáculos (en caso de que los obstaculos se muevan o el fondo se mueva, si mueves con el teclado no recalculas)
    // yObstaculo += 5; //estamos desplazando a cada iteración.(lo hemos comentado porque ahora lo haremos con el array)
    //recorrer array de obstaculos y recalcular y para cada obstáculo. 
    obstaculos.forEach((obstaculo)=>{
        obstaculo.y += 5;  //con esto tengo recalculas las y de los obstaculos.
    })

    if(frames % 100 == 0) {//frames empieza en 0 y va subiendo, cada iteración suma 1, cuando lleguemos a 100 vuelve a valer 0, 200-->0 la forma que tenemos de sumar de 100 en 100. 
      //crear obstáculo
      let obstaculo = new Obstaculo();
      obstaculos.push(obstaculo); //que meta un obstáculo (creado con class) dentro del array obstaculos.
    }  
    // if(frames == 200) frames = 0; otra manera de hacerlo.
    // dentro de recalcular: COMPROBAR COLISIONES: recorrer el array para comprobar si colisiona con el coche. ponemos una función choca dentro de la class
    obstaculos.forEach((obstaculo)=>{
      obstaculo.choca();
    })
    //REPINTAR (fondo, coche, obstáculos)
    //Fondo
    // ctx.drawImage(imgFondo, 0, 0, 500, 700); (otra manera pero mejor abajo) drawImage es un método del ctx
    //en el ctx dibujas la imagen de fondo y del coche.
    ctx.drawImage(imgFondo, 0, 0, canvas.getAttribute("width"), canvas.getAttribute("height"));
    //coche
    //orden importa, lo hago después del fondo porque sino no se ve
    //la y siempre va a ser la misma. la x va a ir cambiando con el teclado (mirar eventlistener arriba)
    ctx.drawImage(imgCoche, x_coche, 550, 60, 110)  //y_coche 550 lo podemos definir arriba
    //obstáculos
    //la x se define en xObstaculo arriba
    obstaculos.forEach(obstaculo => {
    // ctx.fillRect(xObstaculo, yObstaculo, widthObstaculo, 30); //30 de height es porque hemos decidido que tengan esas medidas de alto.
      obstaculo.pintar(); //lo hago más bonito en class
    })
  }

  //vamos a tener una array de obstaculos, genero uno a partir de la clase y lo meto en la array, al cabo de 200 iteraciones creo otro...
  //cuando llegue a calcular tendré que ir objeto a objeto recorriendo el array para sumarle

  class Obstaculo { 
    constructor() { //inicializamos el objeto con estas propiedades
      let widthMaxObstaculo = canvas.getAttribute("width") - 150; //ancho max que puede tener un obstaculo(desde fuera no la vamos a necesitar)es una variable auxilia para calcular el max.

      this.width = Math.floor(Math.random() * widthMaxObstaculo); //primero crea el width y cuando tenga un valor calcula this.x con el valor correcto. max. 350(explicado arriba variable)
      this.height = 30;
      this.x = Math.floor(Math.random() * (canvas.getAttribute("width") - this.width));
      this.y = -30;
    }
    pintar(){
      ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    //hacemos un true false en función de si choca o no choca. l
    //as colisiones pueden ser de muchos tipos (por arriba, por abajo, por los lados) 4 comprobaciones.
    //tenemos las medidas del coche y la de los obstaculos. guardamos los datos, los metemos en variables y comparamos, si hay colisión
    //retornamos true, si hay colisión matamos el setInterval con el clearInterval. 
    choca(){ 
      if (!(((x_coche + 60) < this.x) || (550 > (this.y + this.height)) || (x_coche > (this.x + this.width)) || ((550 + 110) < this.y))) {
        clearInterval(intervalId);
      }
    }
  }
};




