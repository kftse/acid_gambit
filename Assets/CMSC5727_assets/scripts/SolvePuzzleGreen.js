#pragma strict

#pragma strict
#pragma implicit
#pragma downcast

class SolvePuzzleGreen extends SolvePuzzle
{
	public var obstacle : GameObject;
	public var digitBoard : DigitBoard;
	public var torches : GameObject[];
	
	protected var answers : Array;

	function Start () {
		this.puzzleName = "PuzzleGreen";
	
		// Disable all the flames first
		this.resetPuzzles();
		
		// Define number of puzzles
		this.puzzles = this.torches.Length;
		
		// Initialize number of solved puzzles
		this.solved = 0;
		
		// Define answers of this puzzles
		this.answers = new Array();
		this.answers.Push("five");
		this.answers.Push("seven");
		this.answers.Push("two");
		this.answers.Push("seven");
	}
	
	// Disable all the flames
	function resetPuzzles() {
		for (torch in this.torches) {
			var flameTransform : GameObject = torch.transform.Find("flames").gameObject;
			var flame : GameObject = flameTransform.gameObject;
			flame.SetActive(false);
		}	
		this.solved = 0;
	}
	
	// Helper method lights up a torch
	function lightUpTorch(index : int) {
		var torch : GameObject;
		torch = this.torches[index];
		var flameTransform : GameObject = torch.transform.Find("flames").gameObject;
		var flame : GameObject = flameTransform.gameObject;
		flame.SetActive(true);		
	}
	
	// A entry for checking out whether player hit a correct answer or not
	function checkAnswer (answer : String) {
		var expect : String;
		expect = this.answers[this.solved];
		
		if (expect.Equals(answer)) {
			this.digitBoard.PlaySoundClip("correct");
			this.lightUpTorch(this.solved);
			this.solved++;
		} else {
			this.digitBoard.PlaySoundClip("wrong");
			this.solved = 0;
			this.resetPuzzles();
		}
		
		if (this.IsSolved()) {
			this.Solved();
		}
	}
	
	// Help method handles what will be done after player solving the puzzle
	function Solved() {
		super.Solved();
		
		// Destroy the obstacle
		this.obstacle.SetActive(false);
		
		// Destroy digitBoard
		this.digitBoard.Destroy();
				
		// notify game manager puzzle solved
		gameManager.PuzzleSolved("Let's go ahead!");
	}

	// An API for digitTriggers to notify this script
	function notify(digitName : String) {
		if (!this.IsSolved()) {
			this.checkAnswer(digitName);
		}
	}
}
