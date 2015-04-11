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
	
//	private var uLinkNetworkView : uLinkNetworkView;

	function Start()
	{
//		uLinkNetworkView = transform.parent.GetComponent.<uLinkNetworkView>();

		for(var i : int = 0; i < guns.length; i++)
		{
			guns[i].gun.enabled = false;
		}
		currentWeapon = 0;
		guns[0].gun.enabled = true;
		currentGun = guns[0].gun;
	}
	
	function Update()
	{
//		if (uLinkNetworkView.isMine)
//		{
		for(var i : int = 0; i < guns.length; i++)
		{
			if(Input.GetKeyDown(guns[i].keyToActivate))
			{
//				uLinkNetworkView.RPC("ChangeWeapon", uLink.RPCMode.Others, i);
				soldier.ChangeWeapon(i);
				ChangeToGun(i);
			}
		}
		
//		hud.selectedWeapon = currentWeapon;
//		hud.ammoRemaining[currentWeapon] = guns[currentWeapon].gun.currentRounds;
//		}
	}
	
	function ChangeToGun(gunIndex : int)
	{
		var cGun : Gun = guns[gunIndex].gun;
		
		if(cGun.enabled)
		{
			if(guns[gunIndex].switchModesOnKey)
			{
				switch(cGun.fireMode)
				{
					case FireMode.SEMI_AUTO:
						cGun.fireMode = FireMode.FULL_AUTO;
						break;
					case FireMode.FULL_AUTO:
						cGun.fireMode = FireMode.BURST;
						break;
					case FireMode.BURST:
						cGun.fireMode = FireMode.SEMI_AUTO;
						break;
				}
			}
		}
		else
		{
			for(var j : int = 0; j < guns.length; j++)
			{
				guns[j].gun.enabled = false;
			}
					
			cGun.enabled = true;
			currentGun = cGun;
			currentWeapon = gunIndex;
		}
	}
}
