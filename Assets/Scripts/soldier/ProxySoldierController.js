#pragma strict
#pragma implicit
#pragma downcast

class ProxySoldierController extends MonoBehaviour
{
	// Public variables shown in inspector
	
	public var runSpeed : float = 4.6;
	public var runStrafeSpeed : float = 3.07;
	public var walkSpeed : float = 1.22;
	public var walkStrafeSpeed : float = 1.22;
	public var crouchRunSpeed : float = 5;
	public var crouchRunStrafeSpeed : float = 5;
	public var crouchWalkSpeed : float = 1.8;
	public var crouchWalkStrafeSpeed : float = 1.8;

    public var radarObject : GameObject;
	
	public var maxRotationSpeed : float = 540;
	
	public var minCarDistance : float;
	public var weaponSystem : GunManager;
	
	static public var dead : boolean;
	
	// Public variables hidden in inspector
	
	@HideInInspector
	public var walk : boolean;
	
	@HideInInspector
	public var crouch : boolean;
	
	@HideInInspector
	public var inAir : boolean;
	
	@HideInInspector
	public var fire : boolean;
	
	@HideInInspector
	public var aim : boolean;
	
	@HideInInspector
	public var reloading : boolean;
	
	@HideInInspector
	public var currentWeaponName : String;
	
	@HideInInspector
	public var currentWeapon : int;
	
	@HideInInspector
	public var grounded : boolean;
	
	@HideInInspector
	public var targetYRotation : float;
	
	// Private variables
	
	private var soldierTransform : Transform;
	
	private var firing : boolean;
	private var firingTimer : float;
	public var idleTimer : float;
	
	private var motor : CharacterMotor;
	
	//public var enemiesRef : Transform;
	//public var enemiesShootRef : Transform;
	
	//static public var enemiesReference : Transform;
	//static public var enemiesShootReference : Transform;
	
	@HideInInspector
	public var moveDir : Vector3;
    
    private var _useIK : boolean;

	function Start()
	{
		idleTimer = 0.0;

		soldierTransform = transform;

		walk = true;
		aim = false;
		reloading = false;
		crouch = false;
		
		motor = gameObject.GetComponent("CharacterMotor");
	}
	
	function OnEnable()
	{
        if(radarObject != null)
        {
            radarObject.SetActiveRecursively(true);
        }

        walk = true;
		aim = false;
		reloading = false;
		crouch = false;
	}
	
	function OnDisable()
	{
        if(radarObject != null)
        {
            radarObject.SetActiveRecursively(false);
        }

        walk = true;
		aim = false;
		reloading = false;
		crouch = false;
	}
	
	function Update()
	{		
		inAir = !motor.grounded;
	}
	
	@RPC
	function Jump(text: String)
	{
		inAir = !inAir;
		motor.inputJump = inAir;
	}
	
	@RPC
	function Crouch(text : String)
	{
		crouch = !crouch;
	}
	
	@RPC
	function Aim(text: String)
	{
		aim = !aim;
	}
	
	@RPC
	function Walk(text: String)
	{
		walk = !walk;
	}
	
	@RPC
	function Fire(text: String)
	{
		fire = !fire;
		
		idleTimer += Time.deltaTime;
		
		if(aim || fire)
		{
			firingTimer -= Time.deltaTime;
			idleTimer = 0.0;
		}
		else
		{
			firingTimer = 0.3;
		}
		
		firing = (firingTimer <= 0.0 && fire);
		
		if(weaponSystem.currentGun != null)
		{
			weaponSystem.currentGun.fire = firing;
			reloading = weaponSystem.currentGun.reloading;
			currentWeaponName = weaponSystem.currentGun.gunName;
			currentWeapon = weaponSystem.currentWeapon;
		}
	}
	
	@RPC
	function Reload(text: String)
	{
		reloading = !reloading;
	}
	
	@RPC
	function Grounded(text: String)
	{
		reloading = !reloading;
	}
	
	@RPC
	function ChangeWeapon(weapon : int)
	{
		currentWeapon = weapon;
	}
}