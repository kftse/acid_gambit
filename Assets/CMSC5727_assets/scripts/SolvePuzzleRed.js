#pragma strict
#pragma implicit
#pragma downcast

class SolvePuzzleRed extends SolvePuzzle
{
	public var audioSource : AudioSource;
	public var explodeSound : AudioClip;
	public var aliens : GameObject[];
	public var obstacle : GameObject;
	public var gameManager: GameManager;

	function Start(){
		puzzles = aliens.Length;
	}
	
	function SolveOne(){
		super.SolveOne();
		if (solved == puzzles)
			Solved();
	}
	
	function Solved(){
		Debug.Log("[SolvePuzzleRed] Solved");
		
		// play sound and remove obstacle
		audioSource.PlayOneShot(explodeSound, 1.0);
		Destroy(obstacle, explodeSound.length);
		Destroy(this, explodeSound.length);
		
		// notify game manager puzzle solved
		if (gameManager) gameManager.PuzzleSolved("Something happen at the back, let's go back to check!");
	}
}

