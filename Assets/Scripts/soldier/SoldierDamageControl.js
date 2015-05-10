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
	public var heartMask : UI.Image;
	public var deathMask : UI.Image;
	protected var deathMaskAlpha : float;
	
	// HP recover
	public var recover : int = 1;
	public var recoverTime : float = 2;
	private var nextRecover : float = 0;
	
	public var soundSource : AudioSource;
	public var hitSound : AudioClip;
	public var dyingSound : AudioClip;
	
	function Start(){
		deathMaskAlpha = 0;
		updatePlayerStatUI();
	}
	
	function Update(){
		// HP recover
		if (!this.controller.dead) {
			if (currentHealthPoint < maxHealthPoint && nextRecover < Time.time) {
				currentHealthPoint = Mathf.Min(currentHealthPoint + recover, maxHealthPoint);
				Debug.Log("[Player] Recover +" + recover + " = " + currentHealthPoint);			
				nextRecover = Time.time + recoverTime;
			}
		} else {
			this.deathMaskAlpha += Time.deltaTime;
			this.deathMaskAlpha = this.deathMaskAlpha > 1 ? 1 : this.deathMaskAlpha;
		}
		
		updatePlayerStatUI();
	}
	
	// Helper method updates player's hp
	function updatePlayerStatUI() {
		hpBar.value = currentHealthPoint;
		
		if (!this.controller.dead) {
			// Interpolate alphaRate by using remaining hpPercent
			var hpPercent : float;
			hpPercent= parseFloat(this.currentHealthPoint) / this.maxHealthPoint;
			
			var alphaValue : float;
			alphaValue = 1 - hpPercent;
			// this.heartMask.color.a = alphaValue;
		} else {
			// this.deathMask.color.a = this.deathMaskAlpha;
		}
	}
	
	// Wrap calls for killing player
	function killPlayer() {
		this.controller.dead = true;
		this.soundSource.PlayOneShot(this.dyingSound, 1.0);

		this.heartMask.color = Color.clear;

		this.gameManager.GameEnd(false);		
	}
	
	// Define API similars to Enemy.js
	function Hit (power : int) {
		this.currentHealthPoint -= power;
		this.currentHealthPoint = this.currentHealthPoint < 0 ? 0 : this.currentHealthPoint;
		Debug.Log("[Player] Destruct -" + power + " = " + currentHealthPoint);

		this.soundSource.PlayOneShot(this.hitSound, 1.0);
		this.updatePlayerStatUI();
		
		if (currentHealthPoint <= 0){
			Debug.Log("[Player] Die");

			this.killPlayer();
		}
	}

	// Adapt explosion API to our Hit()
	function Destruct(power : int) {
		this.Hit(power);
	}
}