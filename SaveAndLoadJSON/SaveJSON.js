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

// Add mouse/camera controls
var controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.target.set(0, 0, 0);
controls.update();

// Add the ambient light
var lightAmbient = new THREE.AmbientLight( 0x888888 ); 
scene.add(lightAmbient);

// Floor
var g1 = new THREE.PlaneGeometry(16, 12);
var m1 = new THREE.MeshPhongMaterial( { color: 0x777777, side: THREE.DoubleSide } );
var meshFloor = new THREE.Mesh(g1, m1);
meshFloor.rotation.x = Math.PI / 2;
meshFloor.position.y = -1.5;
scene.add(meshFloor);










// Initialize kinectron
kinectron = new Kinectron("192.168.60.56"); // Define and create an instance of kinectron
kinectron.makeConnection(); // Create connection between remote and application
kinectron.startTrackedBodies(getBodies); // Start tracked bodies and set callback

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

// The function to allow chrome downloading a file
function download(content, fileName, contentType) {
    var a = document.createElement("a");
    var file = new Blob([content], {type: contentType});
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
}

// JSON variables
var dataSkeleton = {};
var iFrameCounter = 0;
var iMaxFrame = 200; // Maximum number of frames to be saved

// The getBodies callback function: called once every time kinect obtain a frame
function getBodies(skeleton) 
{
	meshLH.position.x = skeleton.joints[kinectron.HANDLEFT].cameraX;
	meshLH.position.y = skeleton.joints[kinectron.HANDLEFT].cameraY;
	meshLH.position.z = skeleton.joints[kinectron.HANDLEFT].cameraZ;
	meshRH.position.x = skeleton.joints[kinectron.HANDRIGHT].cameraX;
	meshRH.position.y = skeleton.joints[kinectron.HANDRIGHT].cameraY;
	meshRH.position.z = skeleton.joints[kinectron.HANDRIGHT].cameraZ;

	//  The .json file will be automatically saved to the Download folder after 'iMaxFrame' frames
	//  Please check if your browser blocks any popup and/or download events
	//  The output filename is 'motion.json'
	if (iFrameCounter<iMaxFrame) 
	{
		dataSkeleton[iFrameCounter] = skeleton;
		iFrameCounter++;
		console.log("Frame " + iFrameCounter + " detected.");

    	if (iFrameCounter==iMaxFrame) 
    	{
    		download(JSON.stringify(dataSkeleton), 'motion.json', 'text/plain');
    	    console.log("JSON file saved with " + iMaxFrame + " frames.");
    	}
    }
}

// The animate function: called every frame
var iFrame = 0;
function animate()
{
	requestAnimationFrame(animate);
    iFrame ++;
   	renderer.render(scene, camera);
}
animate();
