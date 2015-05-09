#pragma strict
#pragma implicit
#pragma downcast

class GameManager extends MonoBehaviour
{
//	public var gamePlaySoldier : GameObject;
//	public var soldierSmoke : ParticleEmitter;
//	public var sarge : SargeManager;

//	static public var receiveDamage : boolean;
	static public var pause : boolean;
	static public var scores : boolean;
	static public var time : float;
	static public var running;
	
	public var messageText : GUIText;
	public var gameText : GUIText;
	public var tipText : GUIText;
	public var duration : float = 3.0f;
	private var messages : Array;
	private var tips : Array;
	private var mtime : float = .0f;
	private var ttime : float = .0f;
//	public var menu : MainMenuScreen;

	public var PauseEffectCameras : Camera[];
	private var _paused : boolean;

	function Start(){
		messages = new Array();
		tips = new Array();
		
		PuzzleSolved([
			"I am so lucky, I can jump off from the helicopter",
			"But wait... where am I?",
			"Maybe it's better for me to look around"]);
		
		AddTip("Press Z to enable / disable Auto-Run Mode");
		AddTip("Press Space to jump");
		AddTip("Right click to aim");
		AddTip("Left click to shoot");
		
//		TrainingStatistics.ResetStatistics();
//		
//		Screen.lockCursor = true;
//		
//		running = false;
//		pause = false;
		scores = false;
//		_paused = false;
//		time = 0.0;
//
//        var auxT : Transform;
//        var hasCutscene : boolean = false;
//        for(var i : int = 0; i < transform.childCount; i++)
//        {
//            auxT = transform.GetChild(i);
//
//            if(auxT.name == "Cutscene")
//            {
//                if(auxT.gameObject.active)
//                {
//                    hasCutscene = true;
//                    break;
//                }
//            }
//        }
//
//        if(!hasCutscene)
//        {
            StartGame();
//        }
	}
	
//	function CutsceneStart(){
//		gamePlaySoldier.SetActiveRecursively(false);
//	}
	
	function Update(){
	
		if (!pause && running) time += Time.deltaTime;
		
		if (Input.GetKeyDown(KeyCode.M) || Input.GetKeyDown(KeyCode.Escape) || Input.GetKeyDown(KeyCode.P)){
			pause = !pause;
//			menu.visible = pause;
			
            if(pause)
            {
                Time.timeScale = 0.00001;
            }
            else
            {
                Time.timeScale = 1.0;
            }
		}

        if (_paused != pause){
            _paused = pause;
            CameraBlur(pause);
            
        	for (var i : int = 0; i < PauseEffectCameras.Length; i++){
        		var cam : Camera = PauseEffectCameras[i];
            	if (cam == null) continue;
            	if (cam.name != "radar_camera") continue;
            	
            	cam.enabled = !pause;
        	}      
        }
		
		Screen.lockCursor = !pause && !scores;
		
		ShowMessage();
		ShowTip();
	}
	
	function ShowMessage(){
//		Debug.Log("messages: " + messages.length + ", showing: " + (mtime > time));
		if (mtime > time) 
			return; // keep showing message
		
		messageText.text = "";
		var t : float;
		if (messages.length > 0){
			mtime = time + duration;
			messageText.text = messages[0];
			messages.RemoveAt(0);
		}
	}
	
	function ShowTip(){
//		Debug.Log("tips: " + tips.length + ", showing: " + (ttime > time));
		if (ttime > time) 
			return; // keep showing tip
		
		tipText.text = "";
		var t : float;
		if (tips.length > 0){
			ttime = time + duration * 3.5;
			tipText.text = tips[0];
			tips.RemoveAt(0);
		}
	}
	
	function AddTip(tip : String){
		tips.Add(tip);
	}
	
	function StartGame(){
		running = true;

//        if (gamePlaySoldier != null){
//            if (!gamePlaySoldier.active)
//            	gamePlaySoldier.SetActiveRecursively(true);
//            
//        if (soldierSmoke != null)
//            if (GameQualitySettings.ambientParticles)
//                soldierSmoke.emit = true;

//        if (sarge != null && Application.loadedLevelName == "demo_forest"){
//            sarge.ShowInstruction("instructions");
//		    sarge.ShowInstruction("instructions2");
//		    sarge.ShowInstruction("instructions3");
//		    sarge.ShowInstruction("instructions4");
//		    sarge.ShowInstruction("instructions5");
//		    sarge.ShowInstruction("additional_instructions");
//        }
	}

    function CameraBlur(state : boolean){
//        if (PauseEffectCameras == null) return;
//        if (PauseEffectCameras.Length <= 0) return;
//
//        var blurEffect : BlurEffect;
//
//        for (var i : int = 0; i < PauseEffectCameras.Length; i++){
//        	var cam : Camera = PauseEffectCameras[i];
//            if (cam == null) continue;
//
//            blurEffect = cam.GetComponent("BlurEffect") as BlurEffect;
//            
//            if (blurEffect == null)
//            {
//                blurEffect = cam.gameObject.AddComponent("BlurEffect") as BlurEffect;
//                blurEffect.iterations = cam.gameObject.name.IndexOf("radar") != -1 ? 1 : 2;
//                blurEffect.blurSpread = 0.4;
//            }    
//
//            blurEffect.enabled = state;
//        }
    }
    
    function PuzzleSolved(message : String){
    	messages.Push(message);
    }
    
    function PuzzleSolved(message : String[]){
    	for (var msg: String in message)
    		PuzzleSolved(msg);
    }
    
    function GameEnd(win : boolean){
    	gameText.text = win? "Congratulations! You Win!": "Game Over!";
    }
}
