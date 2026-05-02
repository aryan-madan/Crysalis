import * as THREE from "three";

var gems = [
  { name:"amethyst", color:0x9b59b6, desc:"uh uhhh violet colored ig, and in minecraft so thats cool :P", x:-3.8, scale:1.05 },
  { name:"ruby",     color:0xb03030, desc:"second hardest (after diamond) :D", x:-1.2, scale:0.9  },
  { name:"emerald",  color:0x27ae60, desc:"u trade with villagers for this :O", x:1.2,  scale:1.0  },
  { name:"sapphire", color:0x2471a3, desc:"name of a discord bot and like my old username :)", x:3.8,  scale:0.95 }
];

var bar    = document.getElementById("bar");
var elName = document.getElementById("name");
var elDesc = document.getElementById("desc");
var hint   = document.getElementById("hint");

var renderer = new THREE.WebGLRenderer({ canvas: document.getElementById("stage"), antialias: true });
renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
renderer.setSize(innerWidth, innerHeight);

var scene  = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(45, innerWidth / innerHeight, 0.1, 100);
camera.position.set(0, 1.5, 10);

var camPos  = new THREE.Vector3(0, 1.5, 10);
var camLook = new THREE.Vector3(0, 0, 0);
var lookNow = new THREE.Vector3(0, 0, 0);
var zoomed  = false;

scene.add(new THREE.AmbientLight(0x1a1a2e, 4));
var sun = new THREE.DirectionalLight(0xffeedd, 1);
sun.position.set(3, 8, 5);
scene.add(sun);

var glows = [];
gems.forEach(function(g) {
  var pt = new THREE.PointLight(g.color, 2, 5);
  pt.position.set(g.x, 0, 0);
  scene.add(pt);
  glows.push(pt);
});

var stone = new THREE.TextureLoader().load("/stone.jpg");
stone.wrapS = stone.wrapT = THREE.RepeatWrapping;
stone.repeat.set(2, 2);

gems.forEach(function(g) {
  var mesh = new THREE.Mesh(
    new THREE.CylinderGeometry(0.35, 0.42, 1.1, 14),
    new THREE.MeshStandardMaterial({ map: stone, roughness: 0.8 })
  );
  mesh.position.set(g.x, -0.95, 0);
  scene.add(mesh);
});

var geos = [
  new THREE.OctahedronGeometry(0.52, 1),
  new THREE.DodecahedronGeometry(0.46, 0),
  new THREE.CylinderGeometry(0.18, 0.40, 0.76, 6),
  new THREE.IcosahedronGeometry(0.50, 0)
];

var crystals = [];
gems.forEach(function(g, i) {
  var mesh = new THREE.Mesh(geos[i], new THREE.MeshStandardMaterial({
    color: g.color, roughness: 0.1, metalness: 0.2,
    transparent: true, opacity: 0.82,
    emissive: g.color, emissiveIntensity: 0.25
  }));
  mesh.position.set(g.x, 0.38, 0);
  mesh.scale.setScalar(g.scale);
  mesh.userData.i = i;
  scene.add(mesh);
  crystals.push(mesh);
});

var floorTex = new THREE.TextureLoader().load("/marble.jpg");
floorTex.wrapS = floorTex.wrapT = THREE.RepeatWrapping;
floorTex.repeat.set(6, 6);

var floor = new THREE.Mesh(
  new THREE.PlaneGeometry(30, 30),
  new THREE.MeshStandardMaterial({ map: floorTex, roughness: 0.9 })
);
floor.rotation.x = -Math.PI / 2;
floor.position.y = -1.5;
scene.add(floor);


var ray   = new THREE.Raycaster();
var mouse = new THREE.Vector2();

window.addEventListener("mousemove", function(e) {
  mouse.set((e.clientX / innerWidth) * 2 - 1, -(e.clientY / innerHeight) * 2 + 1);
  ray.setFromCamera(mouse, camera);
  document.body.style.cursor = ray.intersectObjects(crystals).length ? "pointer" : "";
});

window.addEventListener("click", function(e) {
  if (e.target === bar || bar.contains(e.target)) return;
  ray.setFromCamera(mouse, camera);
  var hit = ray.intersectObjects(crystals)[0];
  if (hit) {
    var g = gems[hit.object.userData.i];
    elName.textContent = g.name;
    elDesc.textContent = g.desc;
    bar.classList.add("open");
    hint.style.opacity = "0";
    camPos.set(g.x * 0.3, 1.4, 5.8);
    camLook.set(g.x, 0.38, 0);
    zoomed = true;
  } else {
    bar.classList.remove("open");
    hint.style.opacity = "1";
    camPos.set(0, 1.5, 10);
    camLook.set(0, 0, 0);
    zoomed = false;
  }
});

window.addEventListener("resize", function() {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
});

var clock = new THREE.Clock();
function tick() {
  requestAnimationFrame(tick);
  var t = clock.getElapsedTime();
  crystals.forEach(function(c, i) {
    c.rotation.y += 0.005;
    c.position.y  = 0.38 + Math.sin(t * 0.8 + i) * 0.06;
  });
  glows.forEach(function(pt, i) {
    pt.intensity = 1.8 + Math.sin(t + i) * 0.4;
  });
  if (!zoomed) camPos.x = Math.sin(t * 0.1) * 0.3;
  camera.position.lerp(camPos, 0.05);
  lookNow.lerp(camLook, 0.05);
  camera.lookAt(lookNow);
  renderer.render(scene, camera);
}
tick();