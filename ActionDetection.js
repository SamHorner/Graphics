
const action = {
    WALKING: 0,
    TURNRIGHT: 1,
    TURNLEFT: 2
}

function GetActions()
{
	var output = [];

	output.push(action.WALKING);

	return output;
}