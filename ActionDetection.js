
var deltaTime;
var timeThisFrame;
var timeLastFrame;

function GetActions(jointMeshes, floorHeight = 0, testPage = false)
{
	var output = [];
	var listOfGestures = "";

	timeLastFrame = timeThisFrame;
	timeThisFrame = Date.now();
	deltaTime = (timeThisFrame - timeLastFrame) / 1000.0;


	if (IsStanding(jointMeshes, floorHeight))
	{
		output.push(action.STANDING);
		listOfGestures += "<li>Standing</li>";
	}
	else
	{
		listOfGestures += "<li> - </li>";	
	}

	if (IsCrouching(jointMeshes, floorHeight))
	{
		output.push(action.Crouching);
		listOfGestures += "<li>Crouching</li>";
	}
	else
	{
		listOfGestures += "<li> - </li>";	
	}

	if (IsWalking(jointMeshes, floorHeight))
	{
		output.push(action.WALKING);
		listOfGestures += "<li>Walking</li>";
	}
	else
	{
		listOfGestures += "<li> - </li>";	
	}

	if (IsRightPunching(jointMeshes))
	{
		output.push(action.PUNCHINGRIGHT);
		listOfGestures += "<li>Right Punch</li>";
	}
	else
	{
		listOfGestures += "<li> - </li>";	
	}

	if (IsLeftPunching(jointMeshes))
	{
		output.push(action.PUNCHINGLEFT);
		listOfGestures += "<li>Left Punch</li>";
	}
	else
	{
		listOfGestures += "<li> - </li>";	
	}






	var moreActions = GetMoreActions(output, listOfGestures, jointMeshes, floorHeight = 0, deltaTime);
	output = moreActions[0];
	listOfGestures = moreActions[1];

	if (testPage)
	{
		document.getElementById("gestures").innerHTML = listOfGestures;
	}

	return output;
}

function IsStanding(jointMeshes, floorHeight = 0)
{
	//console.log(jointMeshes[kinectron.FOOTLEFT].position.y);
	var verticalDistanceBetweenFeet = Math.abs(jointMeshes[kinectron.FOOTLEFT].position.y - jointMeshes[kinectron.FOOTRIGHT].position.y);
	var isLeftFootOnFloor = Math.abs(jointMeshes[kinectron.FOOTLEFT].position.y - floorHeight);
	var isRightFootOnFloor = Math.abs(jointMeshes[kinectron.FOOTRIGHT].position.y - floorHeight);
	return verticalDistanceBetweenFeet < 0.1 && isLeftFootOnFloor < 0.1 && isRightFootOnFloor < 0.1;
}

function IsCrouching(jointMeshes, floorHeight = 0)
{
	// Angle of knees
	
	var leftKneeToHipV = new THREE.Vector3(0,0,0);
	leftKneeToHipV.x = jointMeshes[kinectron.HIPLEFT].position.x - jointMeshes[kinectron.KNEELEFT].position.x;
	leftKneeToHipV.y = jointMeshes[kinectron.HIPLEFT].position.y - jointMeshes[kinectron.KNEELEFT].position.y;
	leftKneeToHipV.z = jointMeshes[kinectron.HIPLEFT].position.z - jointMeshes[kinectron.KNEELEFT].position.z;

	var leftKneeToAnkleV = new THREE.Vector3(0,0,0);
	leftKneeToAnkleV.x = jointMeshes[kinectron.HIPLEFT].position.x - jointMeshes[kinectron.ANKLELEFT].position.x;
	leftKneeToAnkleV.y = jointMeshes[kinectron.HIPLEFT].position.y - jointMeshes[kinectron.ANKLELEFT].position.y;
	leftKneeToAnkleV.z = jointMeshes[kinectron.HIPLEFT].position.z - jointMeshes[kinectron.ANKLELEFT].position.z;

	var leftKneeAngle = AngleBetweenVectors(vec1, vec2);

	
	var rightKneeToHipV = new THREE.Vector3(0,0,0);
	rightKneeToHipV.x = jointMeshes[kinectron.HIPRIGHT].position.x - jointMeshes[kinectron.KNEERIGHT].position.x;
	rightKneeToHipV.y = jointMeshes[kinectron.HIPRIGHT].position.y - jointMeshes[kinectron.KNEERIGHT].position.y;
	rightKneeToHipV.z = jointMeshes[kinectron.HIPRIGHT].position.z - jointMeshes[kinectron.KNEERIGHT].position.z;

	var rightKneeToAnkleV = new THREE.Vector3(0,0,0);
	rightKneeToAnkleV.x = jointMeshes[kinectron.ANKLERIGHT].position.x - jointMeshes[kinectron.KNEERIGHT].position.x;
	rightKneeToAnkleV.y = jointMeshes[kinectron.ANKLERIGHT].position.y - jointMeshes[kinectron.KNEERIGHT].position.y;
	rightKneeToAnkleV.z = jointMeshes[kinectron.ANKLERIGHT].position.z - jointMeshes[kinectron.KNEERIGHT].position.z;

	var rightKneeAngle = AngleBetweenVectors(vec1, vec2);

	return leftKneeAngle < 90 && rightKneeAngle < 90;

}

var rightHandPosLastFrame = new THREE.Vector3(0,0,0);
var leftHandPosLastFrame = new THREE.Vector3(0,0,0);
var rightPunchTimer = 0;
var leftPunchTimer = 0;
var punchDelay = 0.5;

function IsRightPunching(jointMeshes)
{
	
	if (VectorDistance(rightHandPosLastFrame, jointMeshes[kinectron.HANDRIGHT].position) > 0.15)
	{
		rightPunchTimer = punchDelay;
	}
	
	rightHandPosLastFrame.x = jointMeshes[kinectron.HANDRIGHT].position.x;
	rightHandPosLastFrame.y = jointMeshes[kinectron.HANDRIGHT].position.y;
	rightHandPosLastFrame.z = jointMeshes[kinectron.HANDRIGHT].position.z;

	if (rightPunchTimer > 0)
	{
		rightPunchTimer -= deltaTime;
		return true;
	}
	else
	{
		return false;
	}
}



function IsLeftPunching(jointMeshes)
{
	
	if (VectorDistance(leftHandPosLastFrame, jointMeshes[kinectron.HANDLEFT].position) > 0.15)
	{
		leftPunchTimer = punchDelay;
	}
	
	leftHandPosLastFrame.x = jointMeshes[kinectron.HANDLEFT].position.x;
	leftHandPosLastFrame.y = jointMeshes[kinectron.HANDLEFT].position.y;
	leftHandPosLastFrame.z = jointMeshes[kinectron.HANDLEFT].position.z;

	if (leftPunchTimer > 0)
	{
		leftPunchTimer -= deltaTime;
		return true;
	}
	else
	{
		return false;
	}
}


var walkingDelay = 1.0;
var walkingTimer = 0;
var previousStep = 0.0;

function IsWalking(jointMeshes, floorHeight = 0)
{
	if (previousStep == 0)
	{
		var nextRaisedLeg = Math.abs(jointMeshes[kinectron.FOOTLEFT].position.y - floorHeight) > 0.1;
		var lastDownLeg = Math.abs(jointMeshes[kinectron.FOOTRIGHT].position.y - floorHeight) < 0.1;
	}
	else if (previousStep == 1)
	{
		var nextRaisedLeg = Math.abs(jointMeshes[kinectron.FOOTRIGHT].position.y - floorHeight) > 0.1;
		var lastDownLeg = Math.abs(jointMeshes[kinectron.FOOTLEFT].position.y - floorHeight) < 0.1;
	}

	if (nextRaisedLeg && lastDownLeg)
	{
		previousStep = previousStep == 0 ? 1 : 0;
		walkingTimer = walkingDelay;
	}

	if (walkingTimer > 0)
	{
		walkingTimer -= deltaTime;
		return true;
	}
	else
	{
		return false;
	}
}

function VectorDistance(vec1, vec2)
{
	var difference = new THREE.Vector3(0,0,0) 
	difference.x = vec1.x - vec2.x;
	difference.y = vec1.y - vec2.y;
	difference.z = vec1.z - vec2.z;
	var distance = Math.abs(Math.sqrt(difference.x*difference.x + difference.y*difference.y + difference.z*difference.z));
	console.log(distance);
	return distance;
}

function AngleBetweenVectors(vec1, vec2)
{
	// cos(a) = (vec1 . vec2) / |vec1| * |vec2|

	var dotProduct = vec1.x * vec2.x + vec1.y * vec2.y + vec1.z * vec2.z;
	var vec1Mag = VectorDistance(vec1, new THREE.Vector3(0,0,0));
	var vec2Mag = VectorDistance(vec2, new THREE.Vector3(0,0,0));

	var a = Math.acos(dotProduct / (vec1Mag * vec2Mag));
	return a;
}
