#pragma strict

class SolvePuzzleWhite extends SolvePuzzle
{
	function Start(){
		puzzles = 1;
	}

	function SolveOne(){
		super.SolveOne();
		if (IsSolved() && gameManager) gameManager.GameEnd(true);
	}
}