
import * as THREE from './js/three.module.js';
import { OrbitControls} from "./js/OrbitControls.js";

let camera, scene, renderer;
let mesh;

init();

function init() {

    camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.1, 1000000 );
    camera.position.z = 2;

    scene = new THREE.Scene();

    const texture = new THREE.TextureLoader().load( 'textures/crate.gif' );
    texture.colorSpace = THREE.SRGBColorSpace;

    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshBasicMaterial( { map: texture } );

    mesh = new THREE.Mesh( geometry, material );
    scene.add( mesh );

    const geometrySky = new THREE.SphereGeometry(350000, 64, 64);
    const textureLoader = new THREE.TextureLoader();
    const materialSky = new THREE.MeshBasicMaterial({
        map: textureLoader.load('assets/sky360.jpg'),
        side: THREE.BackSide
    });
    const skydome = new THREE.Mesh(geometrySky, materialSky);
    scene.add(skydome);

    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.setAnimationLoop( animate );
    document.body.appendChild( renderer.domElement );

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.mouseButtons = {
        LEFT: THREE.MOUSE.ROTATE,
        MIDDLE: THREE.MOUSE.DOLLY,
        RIGHT: THREE.MOUSE.PAN
    }

    window.addEventListener( 'resize', onWindowResize );

}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}

function animate() {

    mesh.rotation.x += 0.005;
    mesh.rotation.y += 0.01;

    renderer.render( scene, camera );

}