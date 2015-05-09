#pragma strict
#pragma implicit
#pragma downcast

class SoldierDamageControl extends MonoBehaviour
{
	public var controller : SoldierController;
	
	// HP related
	public var maxHealthPoint : int = 100;
	public var currentHealthPoint : int = 100;
	public var dyingHealthPoint : int = 20;
	public var hpBar : UI.Slider;
	public var heartImage : UI.Image;
	public var gameManager : GameManager; 
	
	// HP recover
	public var recover : int = 1;
	public var recoverTime : float = 2;
	private var nextRecover : float = 0;
	
	public var soundSource : AudioSource;
	public var hitSound : AudioClip;
	public var dyingSound : AudioClip;
	
	function Start(){
		updatePlayerStatUI();
	}
	
	function Update(){
		// HP recover
		if (currentHealthPoint < maxHealthPoint && nextRecover < Time.time){
			currentHealthPoint = Mathf.Min(currentHealthPoint + recover, maxHealthPoint);
			Debug.Log("[Player] Recover +" + recover + " = " + currentHealthPoint);
			updatePlayerStatUI();
			nextRecover = Time.time + recoverTime;
		}
	}
	
	// Helper method updates player's hp
	function updatePlayerStatUI() {
		hpBar.value = currentHealthPoint;
	}
	
	// Define API similars to Enemy.js
	function Hit (power : int) {
		currentHealthPoint -= power;
		Debug.Log("[Player] Destruct -" + power + " = " + currentHealthPoint);

		this.soundSource.PlayOneShot(this.hitSound, 1.0);
		this.updatePlayerStatUI();
		
		if (currentHealthPoint <= 0){
			Debug.Log("[Player] Die");

			this.controller.dead = true;
			this.soundSource.PlayOneShot(this.dyingSound, 1.0);

			this.gameManager.GameEnd(false);
		}
	}

	// Adapt explosion API to our Hit()
	function Destruct(power : int) {
		this.Hit(power);
	}
}