#pragma strict
#pragma implicit
#pragma downcast

class SoldierDamageControl extends MonoBehaviour
{	
	// HP related
	public var maxHealthPoint : int = 100;
	public var currentHealthPoint : int = 100;
	public var dyingHealthPoint : int = 20;
	public var hpBar : UI.Slider;
	public var heartImage : UI.Image;
	
	// HP recover
	public var recover : int = 1;
	public var recoverTime : float = 2;
	private var nextRecover : float = 0;
	
	public var hitSound : AudioClip;
	public var dyingSound : AudioClip;
	
	function Update(){
		// HP recover
		if (nextRecover < Time.time){
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
	
	function Destruct(power : int) {
		currentHealthPoint -= power;
		Debug.Log("[Player] Destruct -" + power + " = " + currentHealthPoint);
		updatePlayerStatUI();
		if (currentHealthPoint <= dyingHealthPoint){
			//TODO - play dying audio clip
		}
	}
}