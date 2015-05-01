#pragma strict
#pragma implicit
#pragma downcast

enum FireType
{
	RAYCAST,
	PHYSIC_PROJECTILE,
}

enum FireMode
{
	SEMI_AUTO,
	FULL_AUTO,
	BURST
}

class Gun extends MonoBehaviour
{
	public var gunName : String;
	public var bulletMark : GameObject;
	public var projectilePrefab : GameObject;
	
	public var weaponTransformReference : Transform;
	
	public var hitLayer : LayerMask;
	
	public var woodParticle : GameObject;
	public var metalParticle : GameObject;
	public var concreteParticle : GameObject;
	public var sandParticle : GameObject;
	public var waterParticle : GameObject;

	//How many shots the gun can take in one second
	public var fireRate : float;
	public var useGravity : boolean;
	protected var fireType : FireType;
	public var fireMode : FireMode;
	
	//Number of shoots to fire when on burst mode
	public var burstRate : int;
	
	//Range of fire in meters
	public var fireRange : float;
	
	//Speed of the projectile in m/s
	public var projectileSpeed : float;
	
	public var clipSize : int;
	public var totalClips : int;
	
	//Time to reload the weapon in seconds
	public var reloadTime : float;
	public var autoReload : boolean;
	public var currentRounds : int;
	
	public var shootVolume : float = 0.4;
	public var shootSound : AudioClip;
	protected var shootSoundSource : AudioSource;
	
	public var reloadSound : AudioClip;
	protected var reloadSoundSource : AudioSource;
	
	public var outOfAmmoSound : AudioClip;
	protected var outOfAmmoSoundSource : AudioSource;
	
	protected var reloadTimer : float;
	
	@HideInInspector
	public var freeToShoot : boolean;
	
	@HideInInspector
	public var reloading : boolean;
	protected var lastShootTime : float;
	protected var shootDelay : float;
	protected var cBurst : int;
	
	@HideInInspector
	public var fire : boolean;
	public var hitParticles : GameObject;
	
	public var shotingEmitter : GunParticles;
	protected var shottingParticles : Transform;
	
	public var capsuleEmitter : ParticleEmitter[];
	
	public var shotLight : ShotLight;
	
	public var unlimited : boolean = true;
	
	protected var timerToCreateDecal : float;
	
	public var pushPower : float = 3.0;
	
	private var soldierCamera : SoldierCamera;
	public var soldierController : SoldierController;

	function Start()
	{
		soldierCamera = GameObject.Find("Soldier Camera").GetComponent.<SoldierCamera>();
	}

	function OnDisable()
	{
		if(shotingEmitter != null)
		{
			shotingEmitter.ChangeState(false);
		}
		
		if(capsuleEmitter != null)
		{
			for(var i : int = 0; i < capsuleEmitter.Length; i++)
			{
				if (capsuleEmitter[i] != null)
                    capsuleEmitter[i].emit = false;
			}
		}
		
		if(shotLight != null)
		{
			shotLight.enabled = false;
		}
	}
	
	function OnEnable()
	{
		reloadTimer = 0.0;
		reloading = false;
		freeToShoot = true;
		shootDelay = 1.0 / fireRate;
		
		cBurst = burstRate;
		
		totalClips--;
		currentRounds = clipSize;
		
		if(projectilePrefab != null)
		{
			fireType = FireType.PHYSIC_PROJECTILE;
		}
		
		if(shotLight != null)
		{
			shotLight.enabled = false;
		}
		
		shottingParticles = null;
		if(shotingEmitter != null)
		{
			for(var i : int = 0; i < shotingEmitter.transform.childCount; i++)
			{
				if(shotingEmitter.transform.GetChild(i).name == "bullet_trace")
				{
					shottingParticles = shotingEmitter.transform.GetChild(i);
					break;
				}
			}
		}
	}
	
	function HandleShooting()
	{
		if(fire && !reloading)
		{
			if(currentRounds > 0)
			{
				if(Time.time > lastShootTime && freeToShoot && cBurst > 0)
				{
					lastShootTime = Time.time + shootDelay;
			
					switch(fireMode)
					{
						case FireMode.SEMI_AUTO:
							freeToShoot = false;
							break;
						case FireMode.BURST:
							cBurst--;
							break;
					}
					
					Shoot();

					switch(fireType)
					{
						case FireType.RAYCAST:
							soldierController.isFiringAutomatic = true;
							TrainingStatistics.shootsFired++;
							break;
						case FireType.PHYSIC_PROJECTILE:
//							soldierController.networkView.RPC("FireProjectile", uLink.RPCMode.Others);
							TrainingStatistics.grenadeFired++;
							break;
					}
					
					currentRounds--;
					
					if(currentRounds <= 0)
					{
						TryToReload();
					}
				}
			}
			else if(autoReload && freeToShoot)
			{
				if(shotingEmitter != null)
				{
					shotingEmitter.ChangeState(false);
				}
				
				if(shotLight != null)
				{
					shotLight.enabled = false;
				}
				
				if(!reloading)
				{
					TryToReload();
				}
			}
		}
		else
		{
			if(shotingEmitter != null)
			{
				shotingEmitter.ChangeState(false);
			}
			
			if(shotLight != null)
			{
				shotLight.enabled = false;
			}
		}

//		if (!soldierController.networkView.isMine && soldierController.isFiringAutomatic)
		if (soldierController.isFiringAutomatic)
		{
			if(Time.time > lastShootTime)
			{
				lastShootTime = Time.time + shootDelay;

				Shoot();
			}
		}
	}

	function Shoot()
	{
		if(capsuleEmitter != null)
		{
			for(var i : int = 0; i < capsuleEmitter.Length; i++)
			{
				capsuleEmitter[i].Emit();
			}
		}
					
		PlayShootSound();
					
		if(shotingEmitter != null)
		{
			shotingEmitter.ChangeState(true);
		}
					
		if(shotLight != null)
		{
			shotLight.enabled = true;
		}
					
		switch(fireType)
		{
			case FireType.RAYCAST:
				CheckRaycastHit();
				break;
			case FireType.PHYSIC_PROJECTILE:
				LaunchProjectile();
				break;
		}

	}
	
	function LaunchProjectile()
	{
		//Get the launch position (weapon related)
		var startPosition : Vector3;
		
		if(weaponTransformReference != null)
		{
			startPosition = weaponTransformReference.position;
		}
		else
		{
			startPosition = soldierController.cameraPosition + soldierController.cameraRotation * Vector3.forward;
		}
		
		var projectile : GameObject = GameObject.Instantiate(projectilePrefab, startPosition, Quaternion.identity);
		
		var grenadeObj : Grenade = projectile.GetComponent("Grenade") as Grenade;
		grenadeObj.soldierCamera = soldierCamera;
		
		projectile.transform.rotation = soldierController.cameraRotation;
		
		var projectileRigidbody : Rigidbody = projectile.rigidbody;
		
		if(projectile.rigidbody == null)
		{
			projectileRigidbody = projectile.AddComponent("Rigidbody");	
		}
		projectileRigidbody.useGravity = useGravity;
		
		var hit : RaycastHit;

		var cameraDirection = soldierController.cameraRotation * Vector3.forward;
		
		var camRay2 : Ray = new Ray(soldierController.cameraPosition, cameraDirection);

		if(Physics.Raycast(camRay2.origin, camRay2.direction, hit, fireRange, hitLayer))
		{
			projectileRigidbody.velocity = (hit.point - weaponTransformReference.position).normalized * projectileSpeed;
		}
		else
		{
			projectileRigidbody.velocity = ((soldierController.cameraPosition + cameraDirection * 40) - weaponTransformReference.position).normalized * projectileSpeed;
		}
	}
	
	function CheckRaycastHit()
	{
		var hit : RaycastHit;
		var glassHit : RaycastHit;
		var camRay : Ray;
		var origin : Vector3;
		var glassOrigin : Vector3;
		var dir : Vector3;
		var glassDir : Vector3;
		
		camRay = new Ray(soldierController.cameraPosition, soldierController.cameraRotation * Vector3.forward);

		// added by Carlos
		if (Physics.Raycast(camRay.origin + camRay.direction * 0.1, camRay.direction, hit, fireRange)){
			Debug.Log("hit " + hit.collider.tag);
			if (hit.collider.tag == "alien"){
				Destroy(hit.collider.gameObject);
				return;
			}
		}

		if(weaponTransformReference == null)
		{
			origin = camRay.origin;
			dir = camRay.direction;
			origin += dir * 0.1;
		}
		else
		{
			origin = weaponTransformReference.position + (weaponTransformReference.right * 0.2);
			
			if(Physics.Raycast(camRay.origin + camRay.direction * 0.1, camRay.direction, hit, fireRange, hitLayer))
			{
				dir = (hit.point - origin).normalized;
				
				if(hit.collider.tag == "glass")
				{
					glassOrigin = hit.point + dir * 0.05;
					
					if(Physics.Raycast(glassOrigin, camRay.direction, glassHit, fireRange - hit.distance, hitLayer))
					{
						glassDir = glassHit.point - glassOrigin;
					}
				}
			}
			else
			{
				dir = weaponTransformReference.forward;
			}
		}
		
		if(shottingParticles != null)
		{
			shottingParticles.rotation = soldierController.cameraRotation;
		}

		if(Physics.Raycast(origin, dir, hit, fireRange, hitLayer))
		{
			hit.collider.gameObject.SendMessage("Hit", hit, SendMessageOptions.DontRequireReceiver);
			GenerateGraphicStuff(hit);
			
			if(hit.collider.tag == "glass")
			{
				if(Physics.Raycast(glassOrigin, glassDir, glassHit, fireRange - hit.distance, hitLayer))
				{
					glassHit.collider.gameObject.SendMessage("Hit", glassHit, SendMessageOptions.DontRequireReceiver);
					GenerateGraphicStuff(glassHit);
				}
			}
		}
	}
	
	function GenerateGraphicStuff(hit : RaycastHit)
	{
		var hitType : HitType;
		
		var body : Rigidbody = hit.collider.rigidbody;
		if(body == null)
		{
			if(hit.collider.transform.parent != null)
			{
				body = hit.collider.transform.parent.rigidbody;
			}
		}
		
		if(body != null)
		{
			if(body.gameObject.layer != 10 && !body.gameObject.name.ToLower().Contains("door"))
			{
				body.isKinematic = false;
			}
		
			if(!body.isKinematic)
			{
    			var direction : Vector3 = hit.collider.transform.position - weaponTransformReference.position;
				body.AddForceAtPosition(direction.normalized * pushPower, hit.point, ForceMode.Impulse);
			}
		}
		
		var go : GameObject;
		
		var delta : float = -0.02;
		var hitUpDir : Vector3 = hit.normal;
		var hitPoint : Vector3 = hit.point + hit.normal * delta;
		
		switch(hit.collider.tag)
		{
			case "wood":
				hitType = HitType.WOOD;
				go = GameObject.Instantiate(woodParticle, hitPoint, Quaternion.FromToRotation(Vector3.up, hitUpDir)) as GameObject;
				break;
			case "metal":
				hitType = HitType.METAL;
				go = GameObject.Instantiate(metalParticle, hitPoint, Quaternion.FromToRotation(Vector3.up, hitUpDir)) as GameObject;
				break;
			case "car":
				hitType = HitType.METAL;
				go = GameObject.Instantiate(metalParticle, hitPoint, Quaternion.FromToRotation(Vector3.up, hitUpDir)) as GameObject;
				break;
			case "concrete":
				hitType = HitType.CONCRETE;
				go = GameObject.Instantiate(concreteParticle, hitPoint, Quaternion.FromToRotation(Vector3.up, hitUpDir)) as GameObject;
				break;
			case "dirt":
				hitType = HitType.CONCRETE;
				go = GameObject.Instantiate(sandParticle, hitPoint, Quaternion.FromToRotation(Vector3.up, hitUpDir)) as GameObject;
				break;
			case "sand":
				hitType = HitType.CONCRETE;
				go = GameObject.Instantiate(sandParticle, hitPoint, Quaternion.FromToRotation(Vector3.up, hitUpDir)) as GameObject;
				break;
			case "water":
				go = GameObject.Instantiate(waterParticle, hitPoint, Quaternion.FromToRotation(Vector3.up, hitUpDir)) as GameObject;
				break;
			default:
				return;
		}
		
		go.layer = hit.collider.gameObject.layer;
		
		if(hit.collider.renderer == null) return;
		
		if(timerToCreateDecal < 0.0 && hit.collider.tag != "water")
		{
			go = GameObject.Instantiate(bulletMark, hit.point, Quaternion.FromToRotation(Vector3.forward, -hit.normal));
			var bm : BulletMarks = go.GetComponent("BulletMarks");
			bm.GenerateDecal(hitType, hit.collider.gameObject);
			timerToCreateDecal = 0.02;
		}
	}
	
	function Update()
	{
		timerToCreateDecal -= Time.deltaTime;
		
		if(Input.GetButtonDown("Fire1") && currentRounds == 0 && !reloading && freeToShoot)
		{
			PlayOutOfAmmoSound();
		}
		
		if (soldierController.fireReleased)
		{
			soldierController.isFiringAutomatic = false;
			freeToShoot = true;
			cBurst = burstRate;
		}

		HandleReloading();
		HandleShooting();
	}
	
	function HandleReloading()
	{
		if(Input.GetKeyDown(KeyCode.R) && !reloading)
		{
			TryToReload();
		}
		
		if(reloading)
		{
			reloadTimer -= Time.deltaTime;
			
			if(reloadTimer <= 0.0)
			{
				reloading = false;
				if(!unlimited)
				{
					totalClips--;
				}
				currentRounds = clipSize;
			}
		}
	}
	
	function TryToReload()
	{
		if(totalClips > 0 && currentRounds < clipSize)
		{
//			soldierController.networkView.RPC("Reload", uLink.RPCMode.All);
			Reload();
		}
	}
	
	function Reload()
	{
		PlayReloadSound();
		reloading = true;
		reloadTimer = reloadTime;
		soldierController.isFiringAutomatic = false;
	}

	//---------------AUDIO METHODS--------
	function PlayOutOfAmmoSound()
	{
		audio.PlayOneShot(outOfAmmoSound, 1.5);
	}
	
	function PlayReloadSound()
	{
		audio.PlayOneShot(reloadSound, 1.5);
	}
	
	function PlayShootSound()
	{
		audio.PlayOneShot(shootSound);
	}
}
