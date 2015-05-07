#pragma strict

class SolvePuzzle extends MonoBehaviour 
{
    var puzzles : int;
    var solved : int;
    
    function Start(){
    	solved = 0;
    }
    
    function SolveOne(){
    	solved++;
    	Debug.Log("[SolvePuzzle] solved: " + solved + "/" + puzzles);
    }
}
