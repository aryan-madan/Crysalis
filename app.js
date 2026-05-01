import * as THREE from "three";
 
var gems = [
  { name:"amethyst", latin:"amethystus the third)", color:0x9b59b6, hard:"7.0 mohs ", system:"trigonal",  lustre:"vitreous humor", origin:"brazil", desc:"uh uhhh violet colored ig, and in minecraft so thats cool", x:-3.8, scale:1.05 },
  { name:"ruby",     latin:"rubinus (robin hood)", color:0xb03030, hard:"9.0 mohs ", system:"trigonal",  lustre:"adamantine (wolverine ahh)", origin:"sri lanka", desc:"second hardest (after me)", x:-1.2, scale:0.9  },
  { name:"emerald",  latin:"smaragdus (asparagus)", color:0x27ae60, hard:"7.5 mohs ", system:"hexagonal", lustre:"vitreous humor", origin:"colombia (macondo reference?)", desc:"u trade with villagers for this", x:1.2,  scale:1.0  },
  { name:"sapphire", latin:"caeruleus (bro what)", color:0x2471a3, hard:"9.0 mohs ", system:"trigonal",  lustre:"adamantine (wolverine ahh)", origin:"kashmir (daamin reference)",desc:"name of a discord bot and like my old username", x:3.8,  scale:0.95 }
];

var panel = document.getElementById("panel");
var canvas = document.getElementById("stage");

var renderer = new THREE.WebGLRenderer({ canvas, antialias:true });
renderer.setSize(innerWidth, innerHeight);
renderer.setPixelRatio(devicePixelRatio, 2);
renderer.toneMapping = THREE.ACESFilmicToneMapping;

var scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x0a0a0a, 0.06);

var camera = new THREE.PerspectiveCamera(45, innerWidth/innerHeight, 0.1, 100);
camera.position.set(0, 1.5, 10);

var camPos = new THREE.Vector3(0, 1.5, 10);
var camLook = new THREE.Vector3(0, 0, 0);
var lookNow = new THREE.Vector3(0, 0, 0);
var zoomed = false;

scene.add(new THREE.AmbientLight(0x1a1a1a, 3));
var sun = new THREE.DirectionalLight(0xffffff, 0.7);
sun.position.set(3, 8, 5);
scene.add(sun);

var glows = [];
gems.forEach(function(g) {
    var pt = new THREE.PointLight(g.color, 1.5, 5);
    pt.position.set(g.x, 0, 0);
    scene.add(pt);
    glows.push(pt);
})

var loader = new THREE.TextureLoader();
var stone = loader.load("images/stone.jpg");
stone.wrapS = stone.wrapT = THREE.RepeatWrapping;
stone.repeat.set(2,2);

gems.forEach(function(g) {
    var mesh = new THREE.Mesh(
        new THREE.CylinderGeometry(0.35, 0.42, 1.1, 14),
        new THREE.MeshStandardMaterial({
            map: stone, roughness: 0.4
        })
    );
    mesh.position.set(g.x, -0.95, 0);
    scene.add(mesh);
});

var geos = [
    new THREE.OctahedronGeometry(0.52, 1),
    new THREE.DodecahedronGeometry(0.46, 0),
    new THREE.CylinderGeometry(0.18, 0.40, 0.76, 6),
    new THREE.IcosahedronGeometry(0.50, 0)
]

var crystals = [];
gems.forEach(function(g, i) {
    var mesh = new THREE.Mesh(geos[i], new THREE.MeshPhysicalMaterial({
        color: g.color, roughness: 0.05, transmission: 0.8, thickness: 0.5, ior: 2.1, transparent: true, opacity: 0.9, emissive: g.color, emissiveIntensity: 0.1
    }));
    mesh.position.set(g.x, 0.38, 0);
    mesh.scale.setScalar(g.scale);
    mesh.userData.i = i;
    scene.add(mesh);
    crystals.push(mesh);
});

var floor = new THREE.Mesh(
    new THREE.PlaneGeometry(30,30),
    new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 1})
);
floor.rotation.x = -Math.PI/2;
floor.position.y = -1.5;
scene.add(floor);