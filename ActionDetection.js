
function GetActions(jointMeshes, floorHeight = 0, testPage = false)
{
	var output = [];
	var listOfGestures = "";



	if (IsStranding(jointMeshes, floorHeight))
	{
		output.push(action.STANDING);
		listOfGestures += "Standing, \n";
	}






	var moreActions = GetMoreActions(output, listOfGestures);
	output = moreActions[0];
	listOfGestures = moreActions[1];

	if (testPage)
	{
		document.getElementById("gestures").innerHTML = listOfGestures;
	}

	return output;
}

function IsStranding(jointMeshes, floorHeight = 0)
{
	//console.log(jointMeshes[kinectron.FOOTLEFT].position.y);
	var verticalDistanceBetweenFeet = Math.abs(jointMeshes[kinectron.FOOTLEFT].position.y - jointMeshes[kinectron.FOOTRIGHT].position.y);
	return verticalDistanceBetweenFeet < 0.2;
}