#pragma strict
#pragma implicit
#pragma downcast

class GameManager extends MonoBehaviour
{
	public var gamePlaySoldier : GameObject;
//	public var soldierSmoke : ParticleEmitter;
//	public var sarge : SargeManager;

//	static public var receiveDamage : boolean;
	static public var pause : boolean;
	static public var scores : boolean;
	static public var time : float;
	static public var running;
	static public var end : boolean;
	
	public var greenSolved : boolean;
	public var messageText : GUIText;
	public var gameText : GUIText;
	public var tipText : GUIText;
	public var duration : float = 4.5f;
	private var messages : Array;
	private var tips : Array;
	private var mtime : float = .0f;
	private var ttime : float = .0f;
//	public var menu : MainMenuScreen;

	public var gamePlayClip : AudioClip;
	public var gameOverClip : AudioClip;
	private var bgm : AudioSource;

	public var PauseEffectCameras : Camera[];
	private var _paused : boolean;

	function Awake(){
		bgm = GetComponent.<AudioSource>();
	}

	function Start(){
		messages = new Array();
		tips = new Array();
		
		AddMessage([
			"I am so lucky, I can jump off from the helicopter",
			"But wait... where am I?",
			"Maybe it's better for me to look around",
			"The road is blocked by a gaint red wall...",
			"It seems I can jump on the floating red box"]);
		
		AddTip([
			"Press A/W/S/D to move",
			"Press Z to enable / disable Auto-Run Mode",
			"Press Space to jump",
			"Right click to aim",
			"Left click to shoot",
			"Press R to reload",
			"Press Escape / P to pause / resume",
			"Weapon has fire range"]);
		
//		TrainingStatistics.ResetStatistics();
//		
		Screen.lockCursor = true;		
		running = false;
		pause = false;
		scores = false;
		_paused = false;
		time = 0.0;
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
	
		if (!pause && running && !end) time += Time.deltaTime;
		
		if (end && Input.GetKeyDown(KeyCode.R)){
			Application.LoadLevel(Application.loadedLevel);
			end = false;
			return;
		}
		
		if (/*Input.GetKeyDown(KeyCode.M) || */Input.GetKeyDown(KeyCode.Escape) || Input.GetKeyDown(KeyCode.P)){
			pause = !pause;
//			menu.visible = pause;
			Time.timeScale = pause ? 0.00001 : 1.0;
		}

        if (_paused != pause){
            _paused = pause;
            // CameraBlur(pause); only available in Unity Pro
            
//        	for (var i : int = 0; i < PauseEffectCameras.Length; i++){
//        		var cam : Camera = PauseEffectCameras[i];
//            	if (cam == null) continue;
//            	if (cam.name != "radar_camera") continue;
//            	cam.enabled = !pause;
//        	}      
        }
		
		Screen.lockCursor = !pause && !scores;
		
		if (!end){
			ShowMessage();
			ShowTip();
		}
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
	
	function AddMessage(message : String){
    	messages.Push(message);
    }
    
    function AddMessage(messages : String[]){
    	for (var message: String in messages)
    		AddMessage(message);
    }
    
	function ShowTip(){
//		Debug.Log("tips: " + tips.length + ", showing: " + (ttime > time));
		if (ttime > time) 
			return; // keep showing tip
		
		tipText.text = "";
		var t : float;
		if (tips.length > 0){
			ttime = time + duration * 1.8;
			tipText.text = tips[0];
			tips.RemoveAt(0);
		}
	}
	
	function AddTip(tips : String[]){
    	for (var tip: String in tips)
    		AddTip(tip);
    }
	
	function AddTip(tip : String){
		tips.Add(tip);
	}
	
	function StartGame(){
		running = true;
		end = false;
		greenSolved = false;
		bgm.Stop();
		bgm.clip = gamePlayClip;
		bgm.Play();

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

	/*
	 * As with the other image effects, this effect is only available in Unity Pro
	 */
    function CameraBlur(state : boolean){
    	var PauseEffectCamerasLen : int = PauseEffectCameras == null? 0: PauseEffectCameras.Length;
    	Debug.Log("[GameManager] state: " + state + ", cams: " + PauseEffectCamerasLen);
        if (PauseEffectCamerasLen < 1) return;
		
        var blurEffect : BlurEffect;
        
        for (var i : int = 0; i < PauseEffectCameras.Length; i++){
        	var cam : Camera = PauseEffectCameras[i];
            if (cam == null) continue;

            blurEffect = cam.GetComponent("BlurEffect") as BlurEffect;
            if (blurEffect == null){
                blurEffect = cam.gameObject.AddComponent("BlurEffect") as BlurEffect;
                blurEffect.iterations = /*cam.gameObject.name.IndexOf("radar") != -1 ? 1 : 2*/ 3;
                blurEffect.blurSpread = 0.6;
            }
            blurEffect.enabled = state;
        }
    }
    
    function GameEnd(win : boolean){
    	bgm.Stop();
    	bgm.clip = gameOverClip;
		bgm.Play();
    	end = true;
    	pause = true;
    	if (!win){
    		gamePlaySoldier.transform.rotation.x = 90;
    		gamePlaySoldier.transform.position.y = -100;
    	}
    	gameText.text = win? "Congratulations! You Win!": "Game Over!";
    	messageText.text = "Press R to retry";
    }
}
