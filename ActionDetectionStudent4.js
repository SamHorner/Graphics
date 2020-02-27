
var deltaTime;

function GetMoreActions(actions = [], displayString = "", jointMeshes = [], floorHeight = 0, deltaTimeNew = 0)
{
	deltaTime = deltaTimeNew;

	if (GetIsTurnRight(jointMeshes, floorHeight))
	{
		actions.push(action.ARMRAISEDRIGHT);
		displayString += "<li>Arm Raised Right</li>";	
	}





	var output = [actions, displayString];
	return output;
}

function GetIsTurnRight(jointMeshes, floorHeight = 0)
{
	return false;
}