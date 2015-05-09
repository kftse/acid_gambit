#pragma strict

class SolvePuzzle extends MonoBehaviour 
{
    protected var puzzles : int;
    protected var solved : int;
    
    function Start(){
    	solved = 0;
    }
    
    function SolveOne(){
    	solved++;
    	Debug.Log("[SolvePuzzle] solved: " + solved + "/" + puzzles);
    }
}
