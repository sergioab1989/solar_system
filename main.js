import * as THREE from "./js/three.module.js";
import { OrbitControls } from "./js/OrbitControls.js";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 300000);
const renderer = new THREE.WebGLRenderer({ antialias: true, logarithmicDepthBuffer: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const textureLoader = new THREE.TextureLoader();

// Base de datos de planetas
const planetsData = [
    { name: "mercury", radius: 10, texture: 'assets/text_mercury.jpg', orbitDist: 400, speed: 0.008 },
    { name: "venus",   radius: 15, texture: 'assets/text_venus.jpg',   orbitDist: 650, speed: 0.007 },
    { name: "earth",   radius: 35, texture: 'assets/text_earth_daymap.jpg', orbitDist: 900, speed: 0.005 },
    { name: "mars",    radius: 15, texture: 'assets/text_mars.jpg',    orbitDist: 1150, speed: 0.003 },
    { name: "jupiter", radius: 70, texture: 'assets/text_jupiter.jpg', orbitDist: 1400, speed: 0.002 },
    
];

// Arreglo para guardar las referencias a los objetos 3D y poder animarlos luego
const planets = [];

// Función para generar un planeta y su línea de órbita
function createPlanet(data) {
    // Planeta
    const geometry = new THREE.SphereGeometry(data.radius, 64, 64); // <- Mejor rendimiento
    const material = new THREE.MeshBasicMaterial({ map: textureLoader.load(data.texture) });
    const mesh = new THREE.Mesh(geometry, material);
    
    // Línea de órbita (TorusGeometry)
    const orbitGeo = new THREE.TorusGeometry(data.orbitDist, 0.2, 5, 100);
    const orbitMat = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide });
    const orbitMesh = new THREE.Mesh(orbitGeo, orbitMat);
    orbitMesh.rotation.x = Math.PI / 2; // Equivalente a tu 1.5708

    // Agregamos a la escena
    scene.add(mesh);
    scene.add(orbitMesh);

    // Retornamos un objeto con la malla y sus datos de movimiento
    return {
        mesh: mesh,
        orbitDist: data.orbitDist,
        speed: data.speed,
        angle: Math.random() * Math.PI * 2 // Empiezan en posiciones aleatorias de su órbita
    };
}

// Construir el sistema solar iterando sobre la "base de datos"
planetsData.forEach(data => {
    const newPlanet = createPlanet(data);
    planets.push(newPlanet);
});

// El Sol se crea aparte porque no orbita
const sunGeo = new THREE.SphereGeometry(250, 64, 64);
const sunMat = new THREE.MeshBasicMaterial({ map: textureLoader.load('assets/text_sun.jpg') });
const sun = new THREE.Mesh(sunGeo, sunMat);
scene.add(sun);

function animate() {
    requestAnimationFrame(animate);

    // Rotación del Sol
    sun.rotation.y += 0.01;

    // Movimiento automático de todos los planetas
    planets.forEach(planet => {
        // Rotación sobre su propio eje
        planet.mesh.rotation.y += 0.01; 

        // Actualizar el ángulo para el movimiento orbital
        planet.angle += planet.speed;

        // Posición en la órbita (Movimiento circular)
        planet.mesh.position.x = planet.orbitDist * Math.sin(planet.angle);
        planet.mesh.position.z = planet.orbitDist * Math.cos(planet.angle);
    });

    // Nota: El código original de Saturno y la Luna necesita lógica adicional 
    // porque dependen de la posición de otro planeta, puedes tratarlos como "Hijos" (Object3D) 
    // o calcularlos manualmente aquí.

    controls.update();
    renderer.render(scene, camera);
}

animate();