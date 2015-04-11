using UnityEngine;
using System.Collections;

public class DestoryByContact : MonoBehaviour {

	// Use this for initialization
	void Start () {}
	
	// Update is called once per frame
	void Update () {}

	void OnTriggerEnter(Collider other) {
		Debug.Log (other.tag.ToString());
		if (other.tag == "grenade") {
			Destroy(gameObject);
		}
		/*
		if (other.tag == "Boundary")
			return;
		
		Instantiate(explosion, transform.position, transform.rotation);
		
		if (other.tag == "Player"){
			Instantiate(playerExplosion, other.transform.position, other.transform.rotation);
			controller.GameOver ();
		}
		
		int baseScore = (int)gameObject.rigidbody.velocity.z * -1;
		Debug.Log ("base score: " + baseScore);
		controller.AddSocre (scoreValue * baseScore);
		
		Destroy(other.gameObject);
		Destroy(gameObject);
		*/
	}
}
