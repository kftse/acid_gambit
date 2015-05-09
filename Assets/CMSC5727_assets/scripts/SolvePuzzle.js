#pragma strict

class SolvePuzzle extends MonoBehaviour 
{
	protected var puzzleName : String;
    protected var puzzles : int;
    protected var solved : int;
    public var gameManager : GameManager;    
    
    function Start(){
    	solved = 0;
    	this.puzzleName = "Puzzle";
    }
    
    function SolveOne(){
    	solved++;
    	Debug.Log("[SolvePuzzle] solved: " + solved + "/" + puzzles);
    }
    
    // Returns whether this puzzle has been solved or not
    function IsSolved() {
    	return this.puzzles == this.solved;
    }
    
    // Handle logics after solving puzzles
    function Solved() {
    	Debug.Log(String.Format("[{0}] Solved", this.puzzleName));
    	
    	// Client specific implementation
    }
}
