#pragma strict

#pragma strict
#pragma implicit
#pragma downcast

class SolvePuzzleGreen extends MonoBehaviour
{
	public var obstacle : GameObject;
	public var torches : GameObject[];
	public var digitTrigger : GameObject;
	
	public var soundSource : AudioSource;
	public var correctSoundEffect : AudioClip;
	public var incorrectSoundEffect : AudioClip;

	function Start () {
		// Disable all the flames first
		for (torch in this.torches) {
			var flameTransform : GameObject = torch.transform.Find("flames").gameObject;
			var flame : GameObject = flameTransform.gameObject;
			flame.SetActive(false);
		}
	}

	function Update () {
		// The activity of obstacle indicate whether the puzzle has been solved or not
		if (this.obstacle.activeInHierarchy) {		
			if (this.isPuzzleSolved()) {
				// Player solves the puzzle
				this.clear();
			}
		}
	}
	
	// Helper method checks whether this puzzle had been solved or not
	function isPuzzleSolved() {
		// Checkout whether all flames are enabled or not
		var ret : boolean = true;

		for (torch in this.torches) {
			var flameTransform : GameObject = torch.transform.Find("flames").gameObject;
			var flame : GameObject = flameTransform.gameObject;
			if (!flame.activeInHierarchy) {
				ret = false;
				break;
			}
		}
		
		Debug.Log("isFlamesDisabled: " + ret.ToString());
		
		return ret;
	}
	
	// Help method handles what will be done after player solving the puzzle
	function clear() {
		// Destroy the obstacle
		this.obstacle.SetActive(false);
	}
}
