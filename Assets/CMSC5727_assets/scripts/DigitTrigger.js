#pragma strict

#pragma strict
#pragma implicit
#pragma downcast

class DigitTrigger extends MonoBehaviour
{
	public var observer : SolvePuzzleGreen;

	function Start () {
	}

	function Update () {

	}
	
	// Called by gun's bullet
	function Hit() {
		this.observer.notify(this.name);
	}
}

