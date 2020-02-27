



// OFFLINE KINECTRON //////////////////////////////////////////////////////////////////////////////////////
// /*
kinectron = new Kinectron(); // Define and create an instance of kinectron

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
readTextFile("Motions/walkSmol.json", function(text)
{
    jsonMotion = JSON.parse(text);
    iJsonFrame = Object.keys(jsonMotion).length;
    console.log("JSON file loaded with " + iJsonFrame + " frames.");
}
);
// */
// END OFFLINE KINECTRON /////////////////////////////////////////////////////////////////////////////////////////


// ONLINE KINECTRON /////////////////////////////////////////////////////////////////////////////////////////
 /*
kinectron = new Kinectron("192.168.60.56"); // Define and create an instance of kinectron
kinectron.makeConnection(); // Create connection between remote and application
kinectron.startTrackedBodies(getBodies); // Start tracked bodies and set callback
// */
// END ONLINE KINECTRON /////////////////////////////////////////////////////////////////////////////////////////


var currentActions = []
var floor = -1;


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

// Add a ball for the left hand
var g = new THREE.SphereGeometry(0.05, 18, 18);
var m = new THREE.MeshPhongMaterial( { color: 0xCCCCCC } ); 

var jointMeshes = [];

for (var i = 0; i < 25; i++)
{
  var mesh = new THREE.Mesh(g, m);
  
  scene.add(mesh);

  jointMeshes.push(mesh);
}







// The getBodies callback function: called once every time kinect obtain a frame
function getBodies(skeleton) 
{ 
  for (var i = 0; i < 25; i++)
  {
    jointMeshes[i].position.x = skeleton.joints[i].cameraX;
    jointMeshes[i].position.y = skeleton.joints[i].cameraY;
    jointMeshes[i].position.z = skeleton.joints[i].cameraZ;  
  }
}




// The animate function: called every frame
var iFrame = 0;
function animate()
{
    requestAnimationFrame(animate);
    iFrame ++;

    currentActions = GetActions(jointMeshes, floor, document.getElementById("gestures") != null);




    // Offline rendering of JSON motion
    var iFrameToRender = iFrame % iJsonFrame; // Keep looping the frame
    if (iJsonFrame>0) // If loading JSON has been successful
    {
        getBodies(jsonMotion[iFrameToRender]);
    }

    renderer.render(scene, camera);
}
animate();
