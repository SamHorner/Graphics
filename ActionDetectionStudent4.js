
function GetMoreActions(actions = [], displayString = "")
{
	if (GetIsTurnRight())
	{
		actions.push(action.TURNRIGHT);
		displayString += "Test";	
	}




	var output = [actions, displayString];
	return output;
}

function GetIsTurnRight()
{
	return true;
}