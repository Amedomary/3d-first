// var renderer,
//     	scene,
//     	camera,
//     	myCanvas = document.getElementById('myCanvas');

//     //RENDERER
//     renderer = new THREE.WebGLRenderer({
//       canvas: myCanvas,
//       antialias: true
//     });
//     renderer.setClearColor(0x000000);
//     renderer.setPixelRatio(window.devicePixelRatio);
//     renderer.setSize(window.innerWidth, window.innerHeight);

//     //CAMERA
//     camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.1, 1000 );

//     //SCENE
//     scene = new THREE.Scene();

//     //LIGHTS
//     var light = new THREE.AmbientLight(0xffffff, 0.5);
//     scene.add(light);

//     var light2 = new THREE.PointLight(0xffffff, 0.5);
//     scene.add(light2);

//     var loader = new THREE.GLTFLoader();

//     loader.load('coin-2.glb', handle_load);

//     var mesh;

//     function handle_load(gltf) {

//         console.log(gltf);
//         mesh = gltf.scene;
//         console.log(mesh.children[0]);
//         mesh.children[0].material = new THREE.MeshPhongMaterial({ color: 0xdddddd, specular: 0x009900, shininess: 30, flatShading: true }) ;
// 		scene.add( mesh );
//         mesh.position.z = -20;
//     }


//     //RENDER LOOP
//     render();

//     var delta = 0;
//     var prevTime = Date.now();

//     function render() {

//         delta += 0.1;

//         if (mesh) {

//             mesh.rotation.x += 0.01;

//             //animation mesh
//             // mesh.morphTargetInfluences[ 0 ] = Math.sin(delta) * 20.0;
//         }

//     	renderer.render(scene, camera);

//     	requestAnimationFrame(render);
//     }


// import * as THREE from '../build/three.module.js';
// import Stats from './jsm/libs/stats.module.js';
// var container, stats;
var camera, scene, renderer;
var pointLight;
var objects = [], materials = [];
init();
animate();
function init() {
    container = document.createElement('div');
    document.body.appendChild(container);
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 2000);
    camera.position.set(0, 200, 800);
    scene = new THREE.Scene();
    // Grid
    var helper = new THREE.GridHelper(1000, 40, 0x303030, 0x303030);
    helper.position.y = - 75;
    scene.add(helper);
    // Materials
    var texture = new THREE.Texture(generateTexture());
    texture.needsUpdate = true;
    materials.push(new THREE.MeshLambertMaterial({ map: texture, transparent: true }));
    materials.push(new THREE.MeshLambertMaterial({ color: 0xdddddd }));
    materials.push(new THREE.MeshPhongMaterial({ color: 0xdddddd, specular: 0x009900, shininess: 30, flatShading: true }));
    materials.push(new THREE.MeshNormalMaterial());
    materials.push(new THREE.MeshBasicMaterial({ color: 0xffaa00, transparent: true, blending: THREE.AdditiveBlending }));
    materials.push(new THREE.MeshLambertMaterial({ color: 0xdddddd }));
    materials.push(new THREE.MeshPhongMaterial({ color: 0xdddddd, specular: 0x009900, shininess: 30, map: texture, transparent: true }));
    materials.push(new THREE.MeshNormalMaterial({ flatShading: true }));
    materials.push(new THREE.MeshBasicMaterial({ color: 0xffaa00, wireframe: true }));
    materials.push(new THREE.MeshDepthMaterial());
    materials.push(new THREE.MeshLambertMaterial({ color: 0x666666, emissive: 0xff0000 }));
    materials.push(new THREE.MeshPhongMaterial({ color: 0x000000, specular: 0x666666, emissive: 0xff0000, shininess: 10, opacity: 0.9, transparent: true }));
    materials.push(new THREE.MeshBasicMaterial({ map: texture, transparent: true }));
    // Spheres geometry
    var geometry = new THREE.SphereBufferGeometry(70, 32, 16);
    for (var i = 0, l = materials.length; i < l; i++) {
        addMesh(geometry, materials[i]);
    }
    // Lights
    scene.add(new THREE.AmbientLight(0x111111));
    var directionalLight = new THREE.DirectionalLight(0xffffff, 0.125);
    directionalLight.position.x = Math.random() - 0.5;
    directionalLight.position.y = Math.random() - 0.5;
    directionalLight.position.z = Math.random() - 0.5;
    directionalLight.position.normalize();
    scene.add(directionalLight);
    pointLight = new THREE.PointLight(0xffffff, 1);
    scene.add(pointLight);
    pointLight.add(new THREE.Mesh(new THREE.SphereBufferGeometry(4, 8, 8), new THREE.MeshBasicMaterial({ color: 0xffffff })));
    //
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);
    //
    // // stats = new Stats();
    // container.appendChild(stats.dom);
    //
    window.addEventListener('resize', onWindowResize, false);
}
function addMesh(geometry, material) {
    var mesh = new THREE.Mesh(geometry, material);
    mesh.position.x = (objects.length % 4) * 200 - 400;
    mesh.position.z = Math.floor(objects.length / 4) * 200 - 200;
    mesh.rotation.x = Math.random() * 200 - 100;
    mesh.rotation.y = Math.random() * 200 - 100;
    mesh.rotation.z = Math.random() * 200 - 100;
    objects.push(mesh);
    scene.add(mesh);
}
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}
function generateTexture() {
    var canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    var context = canvas.getContext('2d');
    var image = context.getImageData(0, 0, 256, 256);
    var x = 0, y = 0;
    for (var i = 0, j = 0, l = image.data.length; i < l; i += 4, j++) {
        x = j % 256;
        y = x == 0 ? y + 1 : y;
        image.data[i] = 255;
        image.data[i + 1] = 255;
        image.data[i + 2] = 255;
        image.data[i + 3] = Math.floor(x ^ y);
    }
    context.putImageData(image, 0, 0);
    return canvas;
}
//
function animate() {
    requestAnimationFrame(animate);
    render();
    // stats.update();
}
function render() {
    var timer = 0.0001 * Date.now();
    camera.position.x = Math.cos(timer) * 1000;
    camera.position.z = Math.sin(timer) * 1000;
    camera.lookAt(scene.position);
    for (var i = 0, l = objects.length; i < l; i++) {
        var object = objects[i];
        object.rotation.x += 0.01;
        object.rotation.y += 0.005;
    }
    materials[materials.length - 2].emissive.setHSL(0.54, 1, 0.35 * (0.5 + 0.5 * Math.sin(35 * timer)));
    materials[materials.length - 3].emissive.setHSL(0.04, 1, 0.35 * (0.5 + 0.5 * Math.cos(35 * timer)));
    pointLight.position.x = Math.sin(timer * 7) * 300;
    pointLight.position.y = Math.cos(timer * 5) * 400;
    pointLight.position.z = Math.cos(timer * 3) * 300;
    renderer.render(scene, camera);
}