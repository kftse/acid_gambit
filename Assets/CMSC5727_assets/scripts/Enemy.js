#pragma strict

var isDead : boolean;
var anim : Animator;
//var deadHash : int = Animator.StringToHash("dead");

function Start () {
	anim = GetComponent("Animator");
}

function Update () {

}

function Hit() {
	if (isDead) return;
	Debug.Log("[Enemy] Hit: " + anim);
	isDead = true;
	
	if (anim) {
		//anim.SetTrigger(deadHash);
		
		// move up a little bit
		var v : Vector3 = gameObject.transform.position;
		gameObject.transform.position = new Vector3(v.x, v.y + 0.25f, v.z);
		anim.SetBool("dead", true);
		
		// disapper after 3.9s
		Destroy(gameObject, 3.9f);
	}
}