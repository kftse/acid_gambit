#pragma strict
#pragma implicit
#pragma downcast

class GunManager extends MonoBehaviour
{
	public var guns : GunKeyBinder[];
	
	@HideInInspector
	public var currentGun : Gun;
	
	@HideInInspector
	public var currentWeapon : int;
	
	public var soldier : SoldierController;
	
	public var hud : HudWeapons;
	
	public var currentRoundTextUI : UI.Text;
	public var clipSizeTextUI : UI.Text;
	
//	private var uLinkNetworkView : uLinkNetworkView;

	function Start()
	{
//		uLinkNetworkView = transform.parent.GetComponent.<uLinkNetworkView>();

		// Disable all guns first
		for(var i : int = 0; i < guns.length; i++)
		{
			guns[i].gun.enabled = false;
		}

		// Set M4 to be our weapon
		currentWeapon = 0;
		guns[0].gun.enabled = true;
		currentGun = guns[0].gun;
		
		// Update UI
		this.updateCurrentGunUI();
	}
	
	function Update()
	{
		// Update UI
		this.updateCurrentGunUI();
	}

	// Helper method updates weapon UI
	function updateCurrentGunUI() {
		// Get currentRounds and clipSize from currentGun
		var currentRounds : int = this.currentGun.currentRounds;
		var clipSize : int = this.currentGun.clipSize;
	
		// Update rounds left and clipsize
		this.currentRoundTextUI.text = String.Format("{0}", currentRounds);
		this.clipSizeTextUI.text = String.Format("/ {0}", clipSize);
		
		// Change color to red if currentRounds is lower than certain percentage
		var threshold : float;
		threshold = parseFloat(currentRounds) / clipSize * 100;
		
		if (threshold < 30) {
			this.currentRoundTextUI.color = Color.red;
		} else {
			this.currentRoundTextUI.color = Color.white;
		}
	}
}
