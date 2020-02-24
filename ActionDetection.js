
const action = {
    STANDING: 0,
    WALKING: 1,
    TURNRIGHT: 2,
    TURNLEFT: 3
}

function GetActions(jointMeshes)
{
	var output = [];

	if (IsStranding(jointMeshes))
	{
		output.push(action.WALKING);
	}

	return output;
}

function IsStranding(jointMeshes)
{
	return Math.abs(jointMeshes[kinectron.FOOTLEFT].position.y - jointMeshes[kinectron.FOOTRIGHT].position.y) < 0.2;
}