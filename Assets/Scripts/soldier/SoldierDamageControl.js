#pragma strict
#pragma implicit
#pragma downcast

class SoldierDamageControl extends MonoBehaviour
{	
	// HP related
	public var maxHealthPoint : int = 100;
	public var currentHealthPoint : int = 100;
	public var hpBar : UI.Slider;
	public var heartImage : UI.Image;
	
	// HP regeneration
	public var regenBase : int = 50;
	public var recoverTime : float;
	
	public var hitSound : AudioClip;
	public var dyingSound : AudioClip;
	
	function HitSoldier(hit : String)
	{
		if(GameManager.receiveDamage)
		{
			/*
			life -= 0.05;
			
			if(!audio.isPlaying)
			{
				if(life < 0.5 && (Random.Range(0, 100) < 30))
				{
					audio.clip = dyingSound;
				}
				else
				{
					audio.clip = hitSounds[Random.Range(0, hitSounds.length)];
				}
				
				audio.Play();
			}
			
			recoverTime = (1.0 - life) * 10.0;
			
			if(hit == "Dummy")
			{
				TrainingStatistics.dummiesHit++;
			}
			else if(hit == "Turret")
			{
				TrainingStatistics.turretsHit++;
			}
			
			if(life <= 0.0)
			{
				SoldierController.dead = true;
			}
			*/
		}
	}
	
	function Update()
	{
		if(this.recoverTime <= 0.0)
		{
			// Regenerate HP slowly
			this.currentHealthPoint += this.regenBase * Time.deltaTime;
			
			// Make sure HP within [0, this.maxHealthPoint]
			this.currentHealthPoint = Mathf.Clamp(
				this.currentHealthPoint,
				0.0,
				this.maxHealthPoint
			);
		} else {
			this.recoverTime -= Time.deltaTime;
		}
		
		this.updatePlayerStatUI();
	}
	
	
	// Helper method updates player's hp
	function updatePlayerStatUI() {
		this.hpBar.value = this.currentHealthPoint;
	}
}