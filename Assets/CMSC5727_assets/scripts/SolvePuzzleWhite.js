#pragma strict

public var gameManager: GameManager;

class SolvePuzzleWhite extends SolvePuzzle
{
	function Start(){
		puzzles = 1;
	}

	function SolveOne(){
		super.SolveOne();
		if (solved == puzzles)
			gameManager.GameEnd(true);
	}
}