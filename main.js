// Pista
const carCanvas = document.getElementById("carCanvas");
carCanvas.width = 200;

const networkCanvas = document.getElementById("networkCanvas");
networkCanvas.width = 300;

// Contexto do carro e da rede neural
const carCtx = carCanvas.getContext("2d");
const networkCtx = networkCanvas.getContext("2d");

// Criação da pista
const road = new Road(carCanvas.width / 2, carCanvas.width * 0.9);

const N = 100;
const cars = generateCars(N);
let bestCar = cars[0];

// Verifica se há a melhor rede neural armazenada no localStorage
if (localStorage.getItem("bestBrain")) {
    for (let i = 0; i < cars.length; i++) {
        cars[i].brain = JSON.parse(localStorage.getItem("bestBrain"));
        if (i != 0) {
            NeuralNetwork.mutate(cars[i].brain, 0.2);
        }
    }
}

// Carros de tráfego
const traffic = [
    new Car(road.getLaneCenter(1), -100, 30, 50, "DUMMY", 2, getRandomColor()),
    new Car(road.getLaneCenter(0), -300, 30, 50, "DUMMY", 2, getRandomColor()),
    new Car(road.getLaneCenter(2), -300, 30, 50, "DUMMY", 2, getRandomColor()),
    new Car(road.getLaneCenter(0), -500, 30, 50, "DUMMY", 2, getRandomColor()),
    new Car(road.getLaneCenter(1), -500, 30, 50, "DUMMY", 2, getRandomColor()),
    new Car(road.getLaneCenter(1), -700, 30, 50, "DUMMY", 2, getRandomColor()),
    new Car(road.getLaneCenter(2), -700, 30, 50, "DUMMY", 2, getRandomColor()),
];

animate();

function save() {
    localStorage.setItem("bestBrain", JSON.stringify(bestCar.brain));
}

function discard() {
    localStorage.removeItem("bestBrain");
}

function generateCars(N) {
    const cars = [];
    for (let i = 1; i <= N; i++) {
        cars.push(new Car(road.getLaneCenter(1), 100, 30, 50, "AI"));
    }
    return cars;
}

function animate(time) {
    // Atualiza o movimento dos carros de tráfego
    for (let i = 0; i < traffic.length; i++) {
        traffic[i].update(road.borders, []);
    }

    // Atualiza o movimento dos carros controlados pela IA
    for (let i = 0; i < cars.length; i++) {
        cars[i].update(road.borders, traffic);
    }

    // Encontra o carro com a menor posição Y (melhor carro)
    bestCar = cars.find(c => c.y == Math.min(...cars.map(c => c.y)));

    // Ajusta a altura do canvas do carro e do canvas da rede neural
    carCanvas.height = window.innerHeight;
    networkCanvas.height = window.innerHeight;

    carCtx.save();
    carCtx.translate(0, -bestCar.y + carCanvas.height * 0.7);

    // Desenha a pista
    road.draw(carCtx);

    // Desenha os carros de tráfego
    for (let i = 0; i < traffic.length; i++) {
        traffic[i].draw(carCtx, "MediumSeaGreen");
    }

    carCtx.globalAlpha = 0.2;

    // Desenha os carros controlados pela IA
    for (let i = 0; i < cars.length; i++) {
        cars[i].draw(carCtx, "MediumPurple");
    }

    carCtx.globalAlpha = 1;

    // Desenha o melhor carro com destaque
    bestCar.draw(carCtx, "MediumPurple", true);

    carCtx.restore();

    // Desenha a visualização da rede neural
    networkCtx.lineDashOffset = -time / 80;
    Visualizer.drawNetwork(networkCtx, bestCar.brain);

    requestAnimationFrame(animate);
}
