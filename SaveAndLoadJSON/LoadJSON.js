// Scene
var scene = new THREE.Scene();

// Camera
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.x = -4;
camera.position.z = 4;
camera.position.y = 2;

// Render
var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
container.appendChild( renderer.domElement );

// Add the ambient light
var lightAmbient = new THREE.AmbientLight( 0x888888 ); 
scene.add(lightAmbient);

// Add mouse/camera controls
var controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.target.set(0, 0, 0);
controls.update();

// Floor
var g1 = new THREE.PlaneGeometry(16, 12);
var m1 = new THREE.MeshPhongMaterial( { color: 0x777777, side: THREE.DoubleSide } );
var meshFloor = new THREE.Mesh(g1, m1);
meshFloor.rotation.x = Math.PI / 2;
meshFloor.position.y = -1.5;
scene.add(meshFloor);









// Initialize kinectron
kinectron = new Kinectron(); // Define and create an instance of kinectron

// Add a ball for the left hand
var gLH= new THREE.SphereGeometry(0.1, 18, 18);
var mLH = new THREE.MeshPhongMaterial( { color: 0xCCCCCC } ); 
var meshLH = new THREE.Mesh(gLH, mLH);
scene.add(meshLH);

// Add a ball for the right hand
var gRH= new THREE.SphereGeometry(0.1, 18, 18);
var mRH = new THREE.MeshPhongMaterial( { color: 0x00CCCC } ); 
var meshRH = new THREE.Mesh(gRH, mRH);
scene.add(meshRH);

// The function to read a text file
function readTextFile(file, callback) 
{
    var rawFile = new XMLHttpRequest();
    rawFile.overrideMimeType("application/json");
    rawFile.open("GET", file, true);
    rawFile.onreadystatechange = function() 
    {
        if (rawFile.readyState === 4) 
        {
            callback(rawFile.responseText);
        }
    }
    rawFile.send(null);
}

// JSON variables
var iJsonFrame = 0;
var jsonMotion = null;

// Read the JSON file motion.json
readTextFile("motion.json", function(text)
{
    jsonMotion = JSON.parse(text);
    iJsonFrame = Object.keys(jsonMotion).length;
    console.log("JSON file loaded with " + iJsonFrame + " frames.");
}
);

// The getBodies callback function: called once every time kinect obtain a frame
function getBodies(skeleton) 
{ 
  meshLH.position.x = skeleton.joints[kinectron.HANDLEFT].cameraX;
  meshLH.position.y = skeleton.joints[kinectron.HANDLEFT].cameraY;
  meshLH.position.z = skeleton.joints[kinectron.HANDLEFT].cameraZ;
  meshRH.position.x = skeleton.joints[kinectron.HANDRIGHT].cameraX;
  meshRH.position.y = skeleton.joints[kinectron.HANDRIGHT].cameraY;
  meshRH.position.z = skeleton.joints[kinectron.HANDRIGHT].cameraZ;
}

// The animate function: called every frame
var iFrame = 0;
function animate()
{
    requestAnimationFrame(animate);
    iFrame ++;

    // Offline rendering of JSON motion
    var iFrameToRender = iFrame % iJsonFrame; // Keep looping the frame
    if (iJsonFrame>0) // If loading JSON has been successful
    {
        getBodies(jsonMotion[iFrameToRender]);
    }

    renderer.render(scene, camera);
}
animate();
