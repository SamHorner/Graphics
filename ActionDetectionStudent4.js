
var deltaTime;
var ClapTimerMaxValue = 0.3;
var ClapTimer = 0;

function GetMoreActions(actions = [], displayString = "", jointMeshes = [], floorHeight = 0, deltaTimeNew = 0)
{
	deltaTime = deltaTimeNew;

	if (GetIsRightArmRaised(jointMeshes, floorHeight))
	{
		actions.push(action.ARMRAISEDRIGHT);
		displayString += "<li>Arm Raised Right</li>";	
	}

    else
	{
		displayString += "<li> - </li>";	
	}

	if (GetIsLeftArmRaised(jointMeshes, floorHeight))
	{
		actions.push(action.ARMRAISEDLEFT);
		displayString += "<li>Arm Raised Left</li>";	
	}

    else
	{
		displayString += "<li> - </li>";	
	}

	if (GetIsClapping(jointMeshes, floorHeight))
	{
		actions.push(action.CLAPPING);
		displayString += "<li>Clapping</li>";	
	}

    else
	{
		displayString += "<li> - </li>";	
	}


	var output = [actions, displayString];
	return output;
}

function GetIsTurnRight(jointMeshes, floorHeight = 0)
{
	return false;
}

function GetIsRightArmRaised(jointMeshes)
{		
    
	var RightArmRaised = Math.abs(jointMeshes[kinectron.HANDRIGHT].position.y - jointMeshes[kinectron.SHOULDERRIGHT].position.y) < 0.2;
    
    var ElbowToHand = new THREE.Vector3(0, 0, 0);
    ElbowToHand.x = jointMeshes[kinectron.ELBOWRIGHT].position.x - jointMeshes[kinectron.HANDRIGHT].position.x;
    ElbowToHand.y = jointMeshes[kinectron.ELBOWRIGHT].position.y - jointMeshes[kinectron.HANDRIGHT].position.y;
    ElbowToHand.z = jointMeshes[kinectron.ELBOWRIGHT].position.z - jointMeshes[kinectron.HANDRIGHT].position.z;
    var ElbowToShoulder = new THREE.Vector3(0, 0, 0);
    ElbowToShoulder.x = jointMeshes[kinectron.ELBOWRIGHT].position.x - jointMeshes[kinectron.SHOULDERRIGHT].position.x;
    ElbowToShoulder.y = jointMeshes[kinectron.ELBOWRIGHT].position.y - jointMeshes[kinectron.SHOULDERRIGHT].position.y;
    ElbowToShoulder.z = jointMeshes[kinectron.ELBOWRIGHT].position.z - jointMeshes[kinectron.SHOULDERRIGHT].position.z;

    var angle = ElbowToHand.angleTo(ElbowToShoulder); 
    return RightArmRaised && Math.abs(angle - 3.14) < 0.3;
}

function GetIsLeftArmRaised(jointMeshes)
{
	var LeftArmRaised = Math.abs(jointMeshes[kinectron.HANDLEFT].position.y - jointMeshes[kinectron.SHOULDERLEFT].position.y) < 0.2;

	var ElbowToHand = new THREE.Vector3(0, 0, 0);
    ElbowToHand.x = jointMeshes[kinectron.ELBOWLEFT].position.x - jointMeshes[kinectron.HANDLEFT].position.x;
    ElbowToHand.y = jointMeshes[kinectron.ELBOWLEFT].position.y - jointMeshes[kinectron.HANDLEFT].position.y;
    ElbowToHand.z = jointMeshes[kinectron.ELBOWLEFT].position.z - jointMeshes[kinectron.HANDLEFT].position.z;
    var ElbowToShoulder = new THREE.Vector3(0, 0, 0);
    ElbowToShoulder.x = jointMeshes[kinectron.ELBOWLEFT].position.x - jointMeshes[kinectron.SHOULDERLEFT].position.x;
    ElbowToShoulder.y = jointMeshes[kinectron.ELBOWLEFT].position.y - jointMeshes[kinectron.SHOULDERLEFT].position.y;
    ElbowToShoulder.z = jointMeshes[kinectron.ELBOWLEFT].position.z - jointMeshes[kinectron.SHOULDERLEFT].position.z;

    var angle = ElbowToHand.angleTo(ElbowToShoulder); 
    return LeftArmRaised && Math.abs(angle - 3.14) < 0.3;
}


function GetIsClapping(jointMeshes)
{
	var DistanceRtoL = jointMeshes[kinectron.HANDRIGHT].position.distanceTo(jointMeshes[kinectron.HANDLEFT].position);
    if (DistanceRtoL < 0.2)
    {
    	ClapTimer = ClapTimerMaxValue;
    }
    if (ClapTimer > 0) {
    	ClapTimer -= deltaTime;
    	return true;
    }
    else {
    	return false;
    }
}

