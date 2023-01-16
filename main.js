import './style.css'
import * as THREE from 'three'
import { OrbitControls } from './../node_modules/three/examples/jsm/controls/OrbitControls'
import {RenderPass} from './../node_modules/three/examples/jsm/postprocessing/RenderPass'
import {EffectComposer} from './../node_modules/three/examples/jsm/postprocessing/EffectComposer'
import {UnrealBloomPass} from './../node_modules/three/examples/jsm/postprocessing/UnrealBloomPass'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry'
import { MeshPhongMaterial, MeshStandardMaterial } from 'three'
import { MSDFTextGeometry, MSDFTextMaterial } from "three-msdf-text";
import png from './public/fonts/HACKED.png'
import fnt from './public/fonts/HACKED-msdf.json'



var stars =[];
console.log(stars)
const scene = new THREE.Scene();
const scene2 = new THREE.Scene();

// const scene = scene1

//setting up the camera position
const camera = new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight,0.1,1000);
camera.position.setZ(30);

//setting up the canvas
const renderer = new THREE.WebGLRenderer({
  canvas:document.querySelector('#bg')
});
renderer.setSize(window.innerWidth,window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

//background
const space = new THREE.TextureLoader().load('space.jpg')
scene.background = space;

//3d model initiating
const moonTexture = new THREE.TextureLoader().load('moon_texture.webp')
const surface = new THREE.TextureLoader().load('surface_texture.webp')
const moon =new THREE.Mesh(
 new THREE.SphereGeometry(10,32,32),
 new THREE.MeshStandardMaterial({
  map:moonTexture,
  // normalMap:surface
  
 })
);
//setting up the renderpass to setup glowing effect
const renderscene = new RenderPass(scene,camera);
const composer = new EffectComposer(renderer);
composer.addPass(renderscene);

const bloompass = new UnrealBloomPass(
  new THREE.Vector2(window.innerWidth,window.innerHeight),
  1,
  0.1,
  0.1
)
composer.addPass(bloompass);


//setting up the text
const text = new TextGeometry('Eby Stephen ',{
  size:80,

})
const textMaterial = new MeshStandardMaterial({color:0xffff})
const mytext = new THREE.Mesh(text,textMaterial)
// scene.add(mytext)
//setting up the lighting 
const pointLight = new THREE.PointLight(0xffffff)
pointLight.position.set(50,20,50)
scene.add(pointLight)

//orbitcontrols pan the camera 
const controls = new OrbitControls(camera,renderer.domElement)

//setting up the animation 
function animate(){
  requestAnimationFrame(animate);
  // renderer.render(scene,camera);
  composer.render();
  animateStars()
  // sphere.rotation.y+=0.0005
  controls.update();

  let time = 0;
 for(let i=0; i<10; i++) {
     
    //  setTimeout(function() { 
    //      scene=scene1
    //  },1);
 }
  
}
function addSphere(){

  // The loop will move from z position of -1000 to z position 1000, adding a random particle at each position. 
  for ( var z= -1000; z < 1000; z+=20 ) {

    // Make a sphere (exactly the same as before). 
    var geometry   = new THREE.SphereGeometry(0.5, 32, 32)
    var material = new THREE.MeshBasicMaterial( {color: 0xffffff} );
    var sphere = new THREE.Mesh(geometry, material)

    // This time we give the sphere random x and y positions between -500 and 500
    sphere.position.x = Math.random() * 1000 - 500;
    sphere.position.y = Math.random() * 1000 - 500;

    // Then set the z position to where it is in the loop (distance of camera)
    sphere.position.z = z;

    // scale it up a bit
    sphere.scale.x = sphere.scale.y = 2;

    //add the sphere to the scene
    scene.add( sphere );

    //push it to the stars array 
    stars.push(sphere); 
  }
}
function animateStars() { 
				
  // loop through each star
  for(var i=0; i<stars.length; i++) {
    
    const star = stars[i]; 
    
      
    // and move it forward dependent on the mouseY position. 
    star.position.z +=  i/10;
      
    // if the particle is too close move it to the back
    if(star.position.z>1000) star.position.z-=2000; 
    
  }

}
function addText(){
  Promise.all([
    loadFontAtlas(png),
    loadFont(fnt),
]).then(([atlas, font]) => {
    const geometry = new MSDFTextGeometry({
        text: "Hello World",
        font: font.data,
    });

    const material = new MSDFTextMaterial();
    material.uniforms.uMap.value = atlas;

    const mesh = new THREE.Mesh(geometry, material);
});

function loadFontAtlas(path) {
    const promise = new Promise((resolve, reject) => {
        const loader = new THREE.TextureLoader();
        loader.load(path, resolve);
    });

    return promise;
}

function loadFont(path) {
    const promise = new Promise((resolve, reject) => {
        const loader = new FontLoader();
        loader.load(path, resolve);
    });

    return promise;
}
}
// addText();
addSphere();
animate();
