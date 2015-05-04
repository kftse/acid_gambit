#pragma strict

public var flightDistance : float;
public var rotationSpeed : float;
public var energy : int;
public var bullet : GameObject;
public var fireRate : float;
public var fireSpeed : int;
//public var soldierController : SoldierController;
private var nextFire : float = 0;
private var dead : boolean;
private var anim : Animator;
private var player : GameObject;

function Awake () {
	anim = GetComponent.<Animator>();
	player = GameObject.FindGameObjectWithTag("Player");
}

function Start () {
	
}

function Update () {
	DetectPlayer(player.transform, gameObject.transform);
}

function DetectPlayer(t1 : Transform, t2 : Transform){
	var v1 : Vector3 = t1.position;
	var v2 : Vector3 = t2.position;
	//Debug.Log("[Enemy] player: " + v1.x + "," + v1.y + "," + v1.z);
	//Debug.Log("[Enemy] enemy: " + v2.x + "," + v2.y + "," + v2.z);
	var d : float = Mathf.Sqrt(Mathf.Pow(v1.x - v2.x, 2) + Mathf.Pow(v1.y - v2.y, 2) + Mathf.Pow(v1.z - v2.z, 2));
	var flight : boolean = d < flightDistance;
	anim.SetBool("flight", flight);
	
	if (flight) {
		var r = Quaternion.LookRotation(v1 - v2);
//		Debug.Log("[Enemy] detected player: " + d + ", r: " + r);
 		t2.rotation = Quaternion.Slerp(t2.rotation, r, rotationSpeed * Time.deltaTime);

 		// fire
 		if (nextFire < Time.time){
 			//TODO
// 			var hit : RaycastHit;
// 			var cameraDirection = soldierController.cameraRotation * Vector3.forward;
//			var camRay2 : Ray = new Ray(soldierController.cameraPosition, cameraDirection);
// 			if (Physics.Raycast(camRay2.origin, camRay2.direction, hit, flightDistance)){
 				Fire(t1);
 				nextFire = Time.time + fireRate;
// 			}
 		}
	}
}

function Fire(t : Transform){
	var grenade : GameObject = GameObject.Instantiate(bullet, t.position, t.rotation);
	var rigidbody : Rigidbody = grenade.rigidbody;
		
	if (grenade.rigidbody == null)
		grenade.AddComponent("Rigidbody");	
	
	grenade.rigidbody.useGravity = true;
	grenade.rigidbody.velocity = t.TransformDirection(Vector3(0, 0, fireSpeed));
}

function EndHitAnimation(){
	anim.SetBool("hit", false);
}

function Hit(power : int) {
	if (dead) return;
	
	// hit animation
	anim.SetBool("hit", true);
	Invoke("EndHitAnimation", 0.5);
	
	// reduce energy
	energy -= power;
	Debug.Log("[Enemy] Hit -" + power + " => " + energy);
	dead = energy < 0;
	
	if (dead){
		// move up a little bit
		var v : Vector3 = gameObject.transform.position;
		gameObject.transform.position = new Vector3(v.x, v.y + 0.25f, v.z);
		anim.SetBool("dead", true);
		
		// disapper after 3.9s
		Destroy(gameObject, 3.9f);
	}
}