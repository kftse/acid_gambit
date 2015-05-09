#pragma strict
#pragma implicit
#pragma downcast

class SoldierController extends /*uLink.*/MonoBehaviour
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
	public var weaponSystem : GunManager;
	public var minCarDistance : float;
	public var soldierCamera : Camera;	
//	public var chat : uLinkChatGUI;
	public var gameManager : GameManager;

	static public var dead : boolean;
	
	// Public variables hidden in inspector
	
	@HideInInspector
	public var walk : boolean;
	
	@HideInInspector
	public var alwaysRun : boolean;
	
	private var alwaysRunTimer : float;
	
	@HideInInspector
	public var crouch : boolean;
	
	@HideInInspector
	public var inAir : boolean;
	
	@HideInInspector
	public var fire : boolean;
	
	@HideInInspector
	public var fireReleased : boolean;

	@HideInInspector
	public var aim : boolean;
	
	@HideInInspector
	public var reloading : boolean;
	
	@HideInInspector
	public var jump : boolean;
	
	@HideInInspector
	public var currentWeaponName : String;
	
	@HideInInspector
	public var currentWeapon : int;
	
	@HideInInspector
	public var grounded : boolean;
	
	@HideInInspector
	public var targetYRotation : float;
	
	@HideInInspector
	public var cameraPosition : Vector3;
	
	@HideInInspector
	public var cameraRotation : Quaternion;
	
	// Private variables
	
	private var soldierTransform : Transform;
	private var controller : CharacterController;
	private var headLookController : HeadLookController;
	private var motor : CharacterMotor;
	
	private var firing : boolean;
	private var firingTimer : float;
	public var idleTimer : float;

	@HideInInspector
	public var isFiringAutomatic : boolean;
	
	public var enemiesRef : Transform;
	public var enemiesShootRef : Transform;
	
	static public var enemiesReference : Transform;
	static public var enemiesShootReference : Transform;
	
	@HideInInspector
	public var moveDir : Vector3;

    private var _useIK : boolean;

	function Awake()
	{   
		if(enemiesRef != null) enemiesReference = enemiesRef;
		if(enemiesShootRef != null) enemiesShootReference = enemiesShootRef;
	}
	
	function Start()
	{
		idleTimer = 0.0;

		soldierTransform = transform;

		walk = true;
		alwaysRun = !walk;
		alwaysRunTimer = 0;
		aim = false;
		reloading = false;

		controller = gameObject.GetComponent("CharacterController");
		motor = gameObject.GetComponent("CharacterMotor");

//		GetComponent.<uLinkSmoothCharacter>().arrivalSpeed = 0;
	}
	
	function OnEnable()
	{		
//		if (uLink.Network.status != uLink.NetworkStatus.Connected || networkView.isMine) // Might want to check if client is disconnecting
//		{
		if(radarObject != null)
		{
			radarObject.SetActiveRecursively(true);
		}
//		}

		headLookController = gameObject.GetComponent("HeadLookController");
		headLookController.enabled = true;
		
        moveDir = Vector3.zero;
        walk = true;
		aim = false;
		reloading = false;
	}
	
	function OnDisable()
	{
//		if (uLink.Network.status != uLink.NetworkStatus.Connected || networkView.isMine)
//		{
		if(radarObject != null)
		{
			radarObject.SetActiveRecursively(false);
		}
//		}
		
		headLookController.enabled = false;

        moveDir = Vector3.zero;
        walk = true;
		aim = false;
		reloading = false;		
	}
	/*
	function uLink_OnSerializeNetworkView(stream : uLink.BitStream, info : uLink.NetworkMessageInfo)
	{
		stream.Serialize(walk);
		stream.Serialize(crouch);
		stream.Serialize(inAir);
		stream.Serialize(fire);
		stream.Serialize(fireReleased);
		stream.Serialize(isFiringAutomatic);
		stream.Serialize(aim);
		stream.Serialize(reloading);
		stream.Serialize(currentWeapon);
		stream.Serialize(grounded);
		stream.Serialize(jump);
		stream.Serialize(targetYRotation);
		stream.Serialize(cameraPosition);
		stream.Serialize(cameraRotation);
	}
	*/
	function Update()
	{
		if(!enabled || GameManager.pause || GameManager.scores || GameManager.end)
		{
			moveDir = Vector3.zero;
			motor.canControl = false;
		}
		else
		{
			if(!motor.canControl)
			{
				motor.canControl = true;
			}
			
			if(!dead)
			{
//				if (networkView.isMine){
//					if (chat.isTyping){
//						moveDir = Vector3.zero;
//						motor.canControl = false;
//					} else {

				GetUserInputs();
				moveDir = transform.TransformDirection(new Vector3(Input.GetAxis("Horizontal"), 0, Input.GetAxis("Vertical")));
				jump = Input.GetButton("Jump");
				cameraPosition = soldierCamera.transform.position;
				cameraRotation = soldierCamera.transform.rotation;
//					}
//				}
//				else
//				{
//					moveDir = GetComponent.<uLinkSmoothCharacter>().velocity;
//				}

				if(weaponSystem.currentGun != null)
				{
					weaponSystem.currentGun.fire = firing;
					currentWeaponName = weaponSystem.currentGun.gunName;
					currentWeapon = weaponSystem.currentWeapon;
					reloading = weaponSystem.currentGun.reloading;
				}
			}
			else
			{
				moveDir = Vector3.zero;
				motor.canControl = false;
			}
		}
		
		//Check the soldier move direction
		if (moveDir.sqrMagnitude > 1)
			moveDir = moveDir.normalized;
		
		motor.inputMoveDirection = moveDir;
		motor.inputJump = jump && !crouch;
		
		motor.movement.maxForwardSpeed = ((walk) ? ((crouch) ? crouchWalkSpeed : walkSpeed) : ((crouch) ? crouchRunSpeed : runSpeed));
		motor.movement.maxBackwardsSpeed = motor.movement.maxForwardSpeed;
		motor.movement.maxSidewaysSpeed = ((walk) ? ((crouch) ? crouchWalkStrafeSpeed : walkStrafeSpeed) : ((crouch) ? crouchRunStrafeSpeed : runStrafeSpeed));
		
		if(moveDir != Vector3.zero)
		{
			idleTimer = 0.0;
		}
		
		inAir = !motor.grounded;
		
		var currentAngle = soldierTransform.localRotation.eulerAngles.y;		
		var delta = Mathf.Repeat ((targetYRotation - currentAngle), 360);
		if (delta > 180)
			delta -= 360;
		var asdf : float = Mathf.MoveTowards(currentAngle, currentAngle + delta, Time.deltaTime * maxRotationSpeed);
		soldierTransform.localRotation.eulerAngles.y = asdf;
	}
	
	function GetUserInputs()
	{
		//Check if the user if firing the weapon
		fire = Input.GetButton("Fire1") && weaponSystem.currentGun.freeToShoot && !dead && !inAir;
		
		//Check if the user is aiming the weapon
		aim = Input.GetButton("Fire2") && !dead;
//		Debug.Log("fire: " + fire + ", aim: " + aim);
		fireReleased = !fire && Input.GetButtonUp("Fire1");

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
		
		//Check if the user wants the soldier to crouch
		if(Input.GetKeyDown(KeyCode.LeftControl))
		{
			crouch = !crouch;
			idleTimer = 0.0;
		}
		
		crouch |= dead;
		
		// trigger always run
		if (Input.GetKey(KeyCode.Z)){
			if (alwaysRunTimer < Time.time){
				// it will triggle many times in one press, skip them
				alwaysRunTimer = Time.time + 0.5; 
				alwaysRun =! alwaysRun;
				Debug.Log("[SoldierController] alwaysRun: " + alwaysRun);
			}
		}
		
		// Check if the user wants the soldier to walk
		walk = (!alwaysRun && !Input.GetKey(KeyCode.LeftShift) && !dead) || moveDir == Vector3.zero || crouch;
	}

	@RPC
	function Reload()
	{
		if (weaponSystem.currentGun != null)
			weaponSystem.currentGun.Reload();
	}

	@RPC
	function FireProjectile()
	{
		if (weaponSystem.currentGun != null)
			weaponSystem.currentGun.Shoot();
	}
}

//@script RequireComponent (uLink.NetworkView)
