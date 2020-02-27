
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

	if (IsWalking(jointMeshes, floorHeight))
	{
		output.push(action.WALKING);
		listOfGestures += "<li>Walking</li>";
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



var walkingDelay = 0.5;
var walkingTimer;
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