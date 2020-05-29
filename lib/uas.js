import * as POHON from '../build/three.module.js';
import Stats from '../jsm/libs/stats.module.js';
import { Lensflare, LensflareElement } from '../jsm/objects/lensflare.js';
var scene = new THREE.Scene();
var cam = new THREE.PerspectiveCamera(55,window.innerWidth/window.innerHeight,1,30000);
var renderer = new THREE.WebGLRenderer({antialias:true});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.xr.enabled = true;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.BasicShadowMap;
scene.background = new THREE.Color(0xff0000);
cam.position.z = 40;
document.body.appendChild(renderer.domElement);
var container, stats;
container = document.createElement( 'div' );
document.body.appendChild( container );

var orbit = new THREE.OrbitControls(cam,renderer.domElement);
// lensflares
var textureLoader = new POHON.TextureLoader();

var textureFlare0 = textureLoader.load( 'lensflare/lensflare0_alpha.png' );
var textureFlare3 = textureLoader.load( 'lensflare/lensflare3.png' );

addLight( 0.08, 0.8, 0.5, 0, 0, - 1000 );

function addLight( h, s, l, x, y, z ) {

    var light = new POHON.PointLight( 0xffffff, 0.7, 3000 );
    light.color.setHSL( h, s, l );
    light.position.set( x, y, 0 );
    scene.add( light );

    var lensflare = new Lensflare();
    lensflare.addElement( new LensflareElement( textureFlare0, 500, 100, light.color,) );
    lensflare.addElement( new LensflareElement( textureFlare3, 60, 0.6 ) );
    lensflare.addElement( new LensflareElement( textureFlare3, 70, 0.7 ) );
    lensflare.addElement( new LensflareElement( textureFlare3, 120, 0.9 ) );
    lensflare.addElement( new LensflareElement( textureFlare3, 70, 1 ) );
    light.add( lensflare );

}

stats = new Stats();
container.appendChild( stats.dom );


//roket
let animasi, mixer;
let loader = new THREE.GLTFLoader();
loader.load('models/roket/scene.gltf', function(gltf){
    animasi = gltf.animations;
    mixer = new THREE.AnimationMixer(gltf.scene);
    let action = mixer.clipAction(animasi[0]);
    action.play();
    console.log(gltf);
    let rocket = gltf.scene.children[0];
    rocket.castShadow = true;
    scene.add(rocket);
    rocket.scale.set(0.05,0.05,0.05)
    rocket.position.set(0,-2,35);
    rocket.rotation.z = Math.PI/2;
})
//mouse
let raycast = new THREE.Raycaster();
let mouse = {};
let selected;

let materialArray =[];
let texture_ft = new THREE.TextureLoader().load('skybox/04.jpg');
let texture_bk = new THREE.TextureLoader().load('skybox/02.jpg');
let texture_up = new THREE.TextureLoader().load('skybox/05.jpg');
let texture_dn = new THREE.TextureLoader().load('skybox/06.jpg');
let texture_rt = new THREE.TextureLoader().load('skybox/03.jpg');
let texture_lf = new THREE.TextureLoader().load('skybox/01.jpg');

materialArray.push(new THREE.MeshBasicMaterial({
    map: texture_ft
}));
materialArray.push(new THREE.MeshBasicMaterial({
    map: texture_ft
}));
materialArray.push(new THREE.MeshBasicMaterial({
    map: texture_ft
}));
materialArray.push(new THREE.MeshBasicMaterial({
    map: texture_ft
}));
materialArray.push(new THREE.MeshBasicMaterial({
    map: texture_ft
}));
materialArray.push(new THREE.MeshBasicMaterial({
    map: texture_ft
}));

for (let i = 0; i < 6; i++)
    materialArray[i].side = THREE.BackSide;

let seaGeo = new THREE.BoxGeometry(10000, 10000, 10000);
let seaMat = new THREE.MeshBasicMaterial({color : 0xff0000});
let seabox = new THREE.Mesh(seaGeo, materialArray);
scene.add(seabox);

addEventListener("mousedown",(e)=>{
    mouse.x = (e.clientX/window.innerWidth)*2-1;
    mouse.y = (e.clientY/window.innerHeight)*-2+1;
    console.log(mouse);

    raycast.setFromCamera(mouse,cam);
    let items = raycast.intersectObjects(scene.children);

    items.forEach((i)=>{
        if (i.object.name != ""){
            selected = i.object;
        }
    });
});
// matahari
// var geometry = new THREE.SphereGeometry( 4, 32, 60 );
// var sun = new THREE.TextureLoader().load('texture/8k_sun.jpg');
// var material = new THREE.MeshBasicMaterial( {
//     map : sun
// } );
// var matahari = new THREE.Mesh( geometry, material );
// matahari.name = "matahari";
// scene.add( matahari );

// let godrayEffect = new POSTPROCESSING.GodraysEffect(cam,matahari, {
//     resolutionScale: 1,
//     density: 0.6,
//     decay: 0.95,
//     weight: 0.9,
//     samples: 100,
// });

// let renderPass = new POSTPROCESSING.RenderPass(scene,cam);
// let effectPass = new POSTPROCESSING.EffectPass(cam, godrayEffect);
// effectPass.renderToScreen = true;

// composer = new POSTPROCESSING.EffectComposer(renderer);
// composer.addPass(renderPass);
// composer.addPass(effectPass);


//merkurius
var geometry = new THREE.SphereGeometry( 0.45, 32, 60 );
var mercury = new THREE.TextureLoader().load('texture/8k_mercury.jpg');
var material = new THREE.MeshPhongMaterial( {
    map : mercury
} );
var merkurius = new THREE.Mesh( geometry, material );
scene.add( merkurius );
merkurius.position.x += 5.5;
//venus
var geometry = new THREE.SphereGeometry(  0.5, 32, 60  );
var mercury = new THREE.TextureLoader().load('texture/8k_venus_surface.jpg');
var material = new THREE.MeshPhongMaterial( {
    map : mercury
} );
var venus = new THREE.Mesh( geometry, material );
scene.add( venus );
venus.position.x += 7.5;
//bumi
var geometry = new THREE.SphereGeometry(  0.5, 32, 60  );
var mercury = new THREE.TextureLoader().load('texture/8k_earth_daymap.jpg');
var material = new THREE.MeshPhongMaterial( {
    map : mercury
} );
var bumi = new THREE.Mesh( geometry, material );
scene.add( bumi );
bumi.position.x += 10;
//moon
var geometry = new THREE.SphereGeometry(  0.2, 32, 60  );
var mercury = new THREE.TextureLoader().load('texture/2k_moon.jpg');
var material = new THREE.MeshPhongMaterial( {
    map : mercury
} );
var moon = new THREE.Mesh( geometry, material );
scene.add( moon );
moon.position.x += 1;
//mars
var geometry = new THREE.SphereGeometry( 0.45, 32, 60 );
var mercury = new THREE.TextureLoader().load('texture/8k_mars.jpg');
var material = new THREE.MeshPhongMaterial( {
    map : mercury
} );
var mars = new THREE.Mesh( geometry, material );
scene.add( mars );
mars.position.x += 12;
//jupiter
var geometry = new THREE.SphereGeometry( 2.8, 32, 60 );
var mercury = new THREE.TextureLoader().load('texture/8k_jupiter.jpg');
var material = new THREE.MeshPhongMaterial( {
    map : mercury
} );
var jupiter = new THREE.Mesh( geometry, material );
scene.add( jupiter );
jupiter.position.x += 20;
//saturn
var geometry = new THREE.SphereGeometry( 1.8, 32, 60 );
var mercury = new THREE.TextureLoader().load('texture/8k_saturn.jpg');
var material = new THREE.MeshPhongMaterial( {
    map : mercury
} );
var saturn = new THREE.Mesh( geometry, material );
scene.add( saturn );
saturn.position.x += 27.5;
//uranus
var geometry = new THREE.SphereGeometry( 1, 32, 60 );
var mercury = new THREE.TextureLoader().load('texture/2k_uranus.jpg');
var material = new THREE.MeshPhongMaterial( {
    map : mercury
} );
var uranus = new THREE.Mesh( geometry, material );
scene.add( uranus );
uranus.position.x += 32;
//neptune
var geometry = new THREE.SphereGeometry( 0.8, 32, 60 );
var mercury = new THREE.TextureLoader().load('texture/2k_neptune.jpg');
var material = new THREE.MeshPhongMaterial( {
    map : mercury
} );
var neptune = new THREE.Mesh( geometry, material );
scene.add( neptune );
neptune.position.x += 34.5;
//asteroid belt
function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}
var asteroidOrbitStart = 13,
asteroidOrbitEnd = 16;
var asteroidBelt = new THREE.Object3D();
scene.add(asteroidBelt);
var asteroiddd = new THREE.TextureLoader().load('texture/2k_moon.jpg');
for(var x=0; x<500; x++) {
    var asteroidSize = getRandomArbitrary(0.005, 0.1),
        asteroidShape1 = getRandomArbitrary(4, 10),
        asteroidShape2 = getRandomArbitrary(4, 10),
        asteroidOrbit = getRandomArbitrary(asteroidOrbitStart, asteroidOrbitEnd),

    asteroid = new THREE.Mesh( new THREE.SphereGeometry(asteroidSize, asteroidShape1, asteroidShape2),   
    new THREE.MeshPhongMaterial({
        color:0xffffff,
        map: asteroiddd,
    }));

    var radians = getRandomArbitrary(0, 360) * Math.PI / 180;
    asteroid.position.x = Math.cos(radians) * asteroidOrbit;
    asteroid.position.z = Math.sin(radians) * asteroidOrbit;

    asteroidBelt.add(asteroid);
}
//ring
var geometry = new THREE.RingGeometry( 2.3, 3, 60 );
var map = new THREE.TextureLoader().load('texture/ring.png');
var material = new THREE.MeshPhongMaterial( { 
    side: THREE.DoubleSide,
    map : map

} );
var ring = new THREE.Mesh( geometry, material );
scene.add( ring );
ring.position.x += 0;
ring.rotation.x += Math.PI/2;
//cobain pivot
//posisi pivot
var pivot = new THREE.Group();
pivot.position.set(0.0, 0.0, 0);
scene.add(pivot);
pivot.add(asteroidBelt);

var pivotB = new THREE.Group();
pivotB.position.set(0.0, 0.0, 0);
scene.add(pivotB);
pivotB.add(bumi);

var pivotJ = new THREE.Group();
pivotJ.position.set(0.0, 0.0, 0);
scene.add(pivotJ);
pivotJ.add(jupiter);

var pivotM = new THREE.Group();
pivotM.position.set(0.0, 0.0, 0);
scene.add(pivotM);
pivotM.add(merkurius);

var pivotV = new THREE.Group();
pivotV.position.set(0.0, 0.0, 0);
scene.add(pivotV);
pivotV.add(venus);

var pivotMa = new THREE.Group();
pivotMa.position.set(0.0, 0.0, 0);
scene.add(pivotMa);
pivotMa.add(mars);

var pivotU = new THREE.Group();
pivotU.position.set(0.0, 0.0, 0);
scene.add(pivotU);
pivotU.add(uranus);

var pivotN = new THREE.Group();
pivotN.position.set(0.0, 0.0, 0);
scene.add(pivotN);
pivotN.add(neptune);

var light = new THREE.AmbientLight(0xffffff, 0.7);
scene.add( light );
var angle = 0;

var star = new THREE.Geometry();
for(var i = 0;i<10000;i++){
    var bintang = new THREE.Vector3(
        Math.random() * 600 - 300,
        Math.random() * 600 - 300,
        Math.random() * 600 - 300,
    );
    bintang.velocity = 0;
    bintang.acceleration = 0.00002;
    star.vertices.push(bintang);
}
var sprite = new THREE.TextureLoader().load('texture/full.png');
sprite.repeat.set(1/8,1);
var mat = new THREE.PointsMaterial({
    color: 0xffffff,
    size : 0.3,
    map : sprite,
    depthTest:false
});
var stars = new THREE.Points(star,mat);
scene.add(stars);

var pivotmoon = new THREE.Group();
scene.add(pivotmoon);
pivotmoon.position.set(10,0,0);
pivotmoon.add(moon);

var pivotS = new THREE.Group();
scene.add(pivotS);
pivotS.position.set(0,0,0);
pivotS.add(saturn);

var pivotr = new THREE.Group();
scene.add(pivotr);
pivotr.position.set(27.5,0,0);
pivotr.add(ring);


var pivotbaru = new THREE.Group();
scene.add(pivotbaru);
pivotbaru.position.set(0,0,0);
pivotbaru.add(pivotmoon);
pivotbaru.add(bumi);

var pivotbaru2 = new THREE.Group();
scene.add(pivotbaru2);
pivotbaru2.position.set(0,0,0);
pivotbaru2.add(pivotr);
pivotbaru2.add(saturn);

let curFrame = 0;
let clock = new THREE.Clock();
let accu = 0;



function animate() {
    accu += clock.getDelta();
    if (accu >0.1){
        curFrame += 1;
        if (curFrame > 7 ){
            curFrame = 0;
        }
        sprite.offset.x = curFrame/8;
        accu = 0;
    }
    
   

    //mouse
    if (selected != undefined){
        selected.rotation.y -= 0.002;
    }
    pivotmoon.rotation.y += 0.05;
    pivotr.rotation.y += 0.0010;
    pivot.rotation.y -= 0.0010;
    pivotM.rotation.y += 0.005;
    pivotJ.rotation.y -= 0.0005;
    pivotV.rotation.y -= 0.005;
    pivotMa.rotation.y += 0.005;
    pivotU.rotation.y -= 0.003;
    pivotN.rotation.y -= 0.0035;
    pivotbaru.rotation.y -= 0.010;
    pivotbaru2.rotation.y += 0.0010;

    

    //bintang
    star.vertices.forEach(p=>{
        p.velocity -= p.acceleration;
        p.y -= p.velocity;
        if (p.y > 200){
            p.y = 200;
            p.velocity = 0;
        }
    });
    star.verticesNeedUpdate = true;
    renderer.render( scene, cam );
    requestAnimationFrame( animate );
    stats.update();

}

animate();

renderer.setAnimationLoop(()=> {
     renderer.render( scene, cam ); 
} );