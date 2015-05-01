using UnityEngine;
using System.Collections;

public class DestoryByContact : MonoBehaviour {

	// Use this for initialization
	void Start () {}
	
	// Update is called once per frame
	void Update () {}

	void OnTriggerEnter(Collider other) {
		//Debug.Log (other.tag.ToString());
		if (other.tag == "grenade") {
			Destroy(gameObject);
		}
	}
}
