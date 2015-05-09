#pragma strict
#pragma implicit
#pragma downcast

class SolvePuzzleRed extends SolvePuzzle
{
	public var audioSource : AudioSource;
	public var explodeSound : AudioClip;
	public var aliens : GameObject[];
	public var obstacle : GameObject;

	function Start(){
		this.puzzleName = "PuzzleRed";
		puzzles = aliens.Length;
	}
	
	function SolveOne(){
		super.SolveOne();
		if (this.IsSolved()) {
			Solved();
		}		
	}
	
	function Solved(){
		super.Solved();
		
		// play sound and remove obstacle
		audioSource.PlayOneShot(explodeSound, 1.0);
		Destroy(obstacle, explodeSound.length);
		Destroy(this, explodeSound.length);
		
		// notify game manager puzzle solved
		gameManager.PuzzleSolved("Something happen at the back, let's go back to check!");
	}
}

