
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

	if (IsJumping(jointMeshes, floorHeight))
	{
		output.push(action.JUMPING);
		listOfGestures += "<li>Jumping</li>";
	}
	else
	{
		listOfGestures += "<li> - </li>";	
	}

	if (IsStatuePose1(jointMeshes, floorHeight))
	{
		output.push(action.STATUE1);
		listOfGestures += "<li>Statue 1</li>";
	}
	else
	{
		listOfGestures += "<li> - </li>";	
	}

	if (IsStatuePose2(jointMeshes, floorHeight))
	{
		output.push(action.STATUE2);
		listOfGestures += "<li>Statue 2</li>";
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

function IsStatuePose2(jointMeshes, floorHeight = 0)
{
	var distanceBetweenFeet = VectorDistance(jointMeshes[kinectron.FOOTRIGHT].position, jointMeshes[kinectron.FOOTLEFT].position);
	var leftFootToFloor = Math.abs(jointMeshes[kinectron.FOOTLEFT].position.y - floorHeight);
	var rightFootToFloor = Math.abs(jointMeshes[kinectron.FOOTRIGHT].position.y - floorHeight);

	var rightShoulderToElbowForwardDot = DotProductWithForwardVector(MinusVector(jointMeshes[kinectron.SHOULDERRIGHT].position, jointMeshes[kinectron.ELBOWRIGHT].position));
	var rightShoulderToElbowUpDot = DotProductWithUpVector(MinusVector(jointMeshes[kinectron.SHOULDERRIGHT].position, jointMeshes[kinectron.ELBOWRIGHT].position));
	var leftShoulderToElbowForwardDot = DotProductWithForwardVector(MinusVector(jointMeshes[kinectron.SHOULDERLEFT].position, jointMeshes[kinectron.ELBOWLEFT].position));
	var leftShoulderToElbowUpDot = DotProductWithUpVector(MinusVector(jointMeshes[kinectron.SHOULDERLEFT].position, jointMeshes[kinectron.ELBOWLEFT].position));

	var rightElbowToHandForwardDot = DotProductWithForwardVector(MinusVector(jointMeshes[kinectron.ELBOWRIGHT].position, jointMeshes[kinectron.HANDRIGHT].position));
	var rightElbowToHandRightDot = DotProductWithRightVector(MinusVector(jointMeshes[kinectron.ELBOWRIGHT].position, jointMeshes[kinectron.HANDRIGHT].position));
	var rightElbowToHandUpDot = DotProductWithUpVector(MinusVector(jointMeshes[kinectron.ELBOWRIGHT].position, jointMeshes[kinectron.HANDRIGHT].position));
	var leftElbowToHandForwardDot = DotProductWithForwardVector(MinusVector(jointMeshes[kinectron.ELBOWLEFT].position, jointMeshes[kinectron.HANDLEFT].position));
	var leftElbowToHandRightDot = DotProductWithRightVector(MinusVector(jointMeshes[kinectron.ELBOWLEFT].position, jointMeshes[kinectron.HANDLEFT].position));
	var leftElbowToHandUpDot = DotProductWithUpVector(MinusVector(jointMeshes[kinectron.ELBOWLEFT].position, jointMeshes[kinectron.HANDLEFT].position));

	var angleRightKnee = AngleBetweenVectors(MinusVector(jointMeshes[kinectron.HIPRIGHT].position, jointMeshes[kinectron.KNEERIGHT].position),MinusVector(jointMeshes[kinectron.ANKLERIGHT].position, jointMeshes[kinectron.KNEERIGHT].position));
	var angleRightKnee = AngleBetweenVectors(MinusVector(jointMeshes[kinectron.HIPLEFT].position, jointMeshes[kinectron.KNEELEFT].position),MinusVector(jointMeshes[kinectron.ANKLELEFT].position, jointMeshes[kinectron.KNEELEFT].position));

	var isStandingCorrect = distanceBetweenFeet < 0.3 && leftFootToFloor < 0.2 && rightFootToFloor < 0.2 && Math.abs(angleRightKnee) - 1.57 < 0.3 && Math.abs(angleLeftKnee) - 1.57 < 0.3;
	var isRightArmInPosition = Math.abs(rightShoulderToElbowForwardDot) < 0.1 && Math.abs(rightShoulderToElbowUpDot) < 0.1;
	var isRightHandInPosition = Math.abs(rightElbowToHandForwardDot) < 0.1 && Math.abs(rightElbowToHandRightDot) < 0.1 && rightElbowToHandUpDot > 0.5;
	var isLeftArmInPosition = Math.abs(leftShoulderToElbowForwardDot) < 0.1 && Math.abs(leftShoulderToElbowUpDot) < 0.1;
	var isLeftHandInPosition = Math.abs(leftElbowToHandForwardDot) < 0.1 && Math.abs(leftElbowToHandRightDot) < 0.1 && leftElbowToHandUpDot > 0.5; 

	return isStandingCorrect && isRightArmInPosition && isRightHandInPosition && isLeftArmInPosition && isLeftHandInPosition;
}

function IsStatuePose1(jointMeshes, floorHeight = 0)
{
	var distanceLeftHandToHead = VectorDistance(jointMeshes[kinectron.HANDLEFT].position, jointMeshes[kinectron.HEAD].position);
	var distanceRightHandToHead = VectorDistance(jointMeshes[kinectron.HANDRIGHT].position, jointMeshes[kinectron.HEAD].position);
	var rightElbowForwardDot = DotProductWithForwardVector(MinusVector(jointMeshes[kinectron.ELBOWRIGHT].position, jointMeshes[kinectron.SHOULDERRIGHT].position));
	var leftElbowForwardDot = DotProductWithForwardVector(MinusVector(jointMeshes[kinectron.ELBOWLEFT].position, jointMeshes[kinectron.SHOULDERLEFT].position));

	var leftFootToFloor = Math.abs(jointMeshes[kinectron.FOOTLEFT].position.y - floorHeight);
	var rightKneeToRightHipUpDot = DotProductWithRightVector(MinusVector(jointMeshes[kinectron.KNEERIGHT].position, jointMeshes[kinectron.HIPRIGHT].position));
	var rightKneeToRightHipRightDot = DotProductWithRightVector(MinusVector(jointMeshes[kinectron.KNEERIGHT].position, jointMeshes[kinectron.HIPRIGHT].position));
	var rightFootToRightKneeForwardDot = DotProductWithForwardVector(MinusVector(jointMeshes[kinectron.FOOTRIGHT].position, jointMeshes[kinectron.KNEERIGHT].position));
	var rightFootToRightKneeRightDot = DotProductWithRightVector(MinusVector(jointMeshes[kinectron.FOOTRIGHT].position, jointMeshes[kinectron.KNEERIGHT].position));

	var isHandsOnHead = distanceLeftHandToHead < 0.2 && distanceRightHandToHead < 0.2;
	var isElbowsOutwards = Math.abs(rightElbowForwardDot) < 0.2 && Math.abs(leftElbowForwardDot) < 0.2;
	var isLeftFootOnFloor = leftFootToFloor < 0.2;
	var isRightKneeForwards = Math.abs(rightKneeToRightHipUpDot) < 0.2 && Math.abs(rightKneeToRightHipRightDot) < 0.2;
	var isRightFootDown = Math.abs(rightFootToRightKneeForwardDot) < 0.1 && Math.abs(rightFootToRightKneeRightDot) < 0.2;

	return isHandsOnHead && isElbowsOutwards && isLeftFootOnFloor && isRightKneeForwards && isRightFootDown;
}

function IsJumping(jointMeshes, floorHeight = 0)
{
	var isLeftFootOnFloor = Math.abs(jointMeshes[kinectron.FOOTLEFT].position.y - floorHeight);
	var isRightFootOnFloor = Math.abs(jointMeshes[kinectron.FOOTRIGHT].position.y - floorHeight);
	return isLeftFootOnFloor > 0.1 && isRightFootOnFloor > 0.1;
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
	leftKneeToAnkleV.x = jointMeshes[kinectron.ANKLELEFT].position.x - jointMeshes[kinectron.KNEELEFT].position.x;
	leftKneeToAnkleV.y = jointMeshes[kinectron.ANKLELEFT].position.y - jointMeshes[kinectron.KNEELEFT].position.y;
	leftKneeToAnkleV.z = jointMeshes[kinectron.ANKLELEFT].position.z - jointMeshes[kinectron.KNEELEFT].position.z;

	var leftKneeAngle = AngleBetweenVectors(leftKneeToHipV, leftKneeToAnkleV);
	
	var rightKneeToHipV = new THREE.Vector3(0,0,0);
	rightKneeToHipV.x = jointMeshes[kinectron.HIPRIGHT].position.x - jointMeshes[kinectron.KNEERIGHT].position.x;
	rightKneeToHipV.y = jointMeshes[kinectron.HIPRIGHT].position.y - jointMeshes[kinectron.KNEERIGHT].position.y;
	rightKneeToHipV.z = jointMeshes[kinectron.HIPRIGHT].position.z - jointMeshes[kinectron.KNEERIGHT].position.z;

	var rightKneeToAnkleV = new THREE.Vector3(0,0,0);
	rightKneeToAnkleV.x = jointMeshes[kinectron.ANKLERIGHT].position.x - jointMeshes[kinectron.KNEERIGHT].position.x;
	rightKneeToAnkleV.y = jointMeshes[kinectron.ANKLERIGHT].position.y - jointMeshes[kinectron.KNEERIGHT].position.y;
	rightKneeToAnkleV.z = jointMeshes[kinectron.ANKLERIGHT].position.z - jointMeshes[kinectron.KNEERIGHT].position.z;

	var rightKneeAngle = AngleBetweenVectors(rightKneeToHipV, rightKneeToAnkleV);

	var isLeftFootOnFloor = Math.abs(jointMeshes[kinectron.FOOTLEFT].position.y - floorHeight);
	var isRightFootOnFloor = Math.abs(jointMeshes[kinectron.FOOTRIGHT].position.y - floorHeight);

	return leftKneeAngle < 1.5 && rightKneeAngle < 1.5 && isLeftFootOnFloor < 0.1 && isRightFootOnFloor < 0.1;
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



// Maths

function MinusVector(vec1, vec2)
{
	var output = new THREE.Vector3(0,0,0);
	output.x = vec1.x - vec2.x;
	output.y = vec1.y - vec2.y;
	output.z = vec1.z - vec2.z;
	return output;
}

function VectorDistance(vec1, vec2)
{
	var difference = new THREE.Vector3(0,0,0); 
	difference.x = vec1.x - vec2.x;
	difference.y = vec1.y - vec2.y;
	difference.z = vec1.z - vec2.z;
	var distance = VectorMagnitude(difference);
	
	return distance;
}

function VectorMagnitude(vec)
{
	return Math.abs(Math.sqrt(vec.x*vec.x + vec.y*vec.y + vec.z*vec.z));
}

function AngleBetweenVectors(vec1, vec2)
{
	// cos(a) = (vec1 . vec2) / |vec1| * |vec2|

	var dotProduct = DotProduct(vec1, vec2);
	var vec1Mag = VectorDistance(vec1, new THREE.Vector3(0,0,0));
	var vec2Mag = VectorDistance(vec2, new THREE.Vector3(0,0,0));

	var a = Math.acos(dotProduct / (vec1Mag * vec2Mag));
	return a;
}

function DotProduct(vec1, vec2)
{
	return vec1.x * vec2.x + vec1.y * vec2.y + vec1.z * vec2.z;
}

function DotProductWithForwardVector(vec)
{
	vec.x /= VectorMagnitude(vec);
	vec.y /= VectorMagnitude(vec);
	vec.z /= VectorMagnitude(vec);

	var upVector = new THREE.Vector3(0,0,0);
	upVector.x = jointMeshes[kinectron.SPINESHOULDER].position.x - jointMeshes[kinectron.SPINEMID].position.x;
	upVector.y = jointMeshes[kinectron.SPINESHOULDER].position.y - jointMeshes[kinectron.SPINEMID].position.y;
	upVector.z = jointMeshes[kinectron.SPINESHOULDER].position.z - jointMeshes[kinectron.SPINEMID].position.z;

	upVector.x /= VectorMagnitude(upVector);
	upVector.y /= VectorMagnitude(upVector);
	upVector.z /= VectorMagnitude(upVector);

	var rightVector = new THREE.Vector3(0,0,0);
	rightVector.x = jointMeshes[kinectron.SHOULDERRIGHT].position.x - jointMeshes[kinectron.SHOULDERLEFT].position.x;
	rightVector.y = jointMeshes[kinectron.SHOULDERRIGHT].position.y - jointMeshes[kinectron.SHOULDERLEFT].position.y;
	rightVector.z = jointMeshes[kinectron.SHOULDERRIGHT].position.z - jointMeshes[kinectron.SHOULDERLEFT].position.z;

	rightVector.x /= VectorMagnitude(rightVector);
	rightVector.y /= VectorMagnitude(rightVector);
	rightVector.z /= VectorMagnitude(rightVector);

	var crossProduct = new THREE.Vector3(0,0,0);
	crossProduct.x = upVector.y*rightVector.z - upVector.z*rightVector.y;
	crossProduct.y = upVector.x*rightVector.z - upVector.z*rightVector.x;
	crossProduct.z = upVector.x*rightVector.y - upVector.y*rightVector.x;

	return DotProduct(vec, crossProduct);
}

function DotProductWithUpVector(vec)
{
	vec.x /= VectorMagnitude(vec);
	vec.y /= VectorMagnitude(vec);
	vec.z /= VectorMagnitude(vec);

	var upVector = new THREE.Vector3(0,0,0);
	upVector.x = jointMeshes[kinectron.SPINESHOULDER].position.x - jointMeshes[kinectron.SPINEMID].position.x;
	upVector.y = jointMeshes[kinectron.SPINESHOULDER].position.y - jointMeshes[kinectron.SPINEMID].position.y;
	upVector.z = jointMeshes[kinectron.SPINESHOULDER].position.z - jointMeshes[kinectron.SPINEMID].position.z;

	upVector.x /= VectorMagnitude(upVector);
	upVector.y /= VectorMagnitude(upVector);
	upVector.z /= VectorMagnitude(upVector);

	return DotProduct(vec, upVector);
}

function DotProductWithRightVector(vec)
{
	vec.x /= VectorMagnitude(vec);
	vec.y /= VectorMagnitude(vec);
	vec.z /= VectorMagnitude(vec);

	var upVector = new THREE.Vector3(0,0,0);
	upVector.x = jointMeshes[kinectron.SPINESHOULDER].position.x - jointMeshes[kinectron.SPINEMID].position.x;
	upVector.y = jointMeshes[kinectron.SPINESHOULDER].position.y - jointMeshes[kinectron.SPINEMID].position.y;
	upVector.z = jointMeshes[kinectron.SPINESHOULDER].position.z - jointMeshes[kinectron.SPINEMID].position.z;

	upVector.x /= VectorMagnitude(upVector);
	upVector.y /= VectorMagnitude(upVector);
	upVector.z /= VectorMagnitude(upVector);

	return DotProduct(vec, upVector);
}

function DotProductWithForwardVector(vec)
{
	vec.x /= VectorMagnitude(vec);
	vec.y /= VectorMagnitude(vec);
	vec.z /= VectorMagnitude(vec);

	var rightVector = new THREE.Vector3(0,0,0);
	rightVector.x = jointMeshes[kinectron.SHOULDERRIGHT].position.x - jointMeshes[kinectron.SHOULDERLEFT].position.x;
	rightVector.y = jointMeshes[kinectron.SHOULDERRIGHT].position.y - jointMeshes[kinectron.SHOULDERLEFT].position.y;
	rightVector.z = jointMeshes[kinectron.SHOULDERRIGHT].position.z - jointMeshes[kinectron.SHOULDERLEFT].position.z;

	rightVector.x /= VectorMagnitude(rightVector);
	rightVector.y /= VectorMagnitude(rightVector);
	rightVector.z /= VectorMagnitude(rightVector);

	return DotProduct(vec, rightVector);
}