﻿#pragma strict

public var flightDistance : float;
public var rotationSpeed : float;
public var energy : int;
private var dead : boolean;
private var anim : Animator;
private var player : GameObject;

function Start () {
	anim = GetComponent("Animator");
	player = GameObject.FindGameObjectWithTag ("Player");
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
	}
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