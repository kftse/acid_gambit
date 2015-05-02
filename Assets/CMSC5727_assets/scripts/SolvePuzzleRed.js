#pragma strict

#pragma strict
#pragma implicit
#pragma downcast

class SolvePuzzleRed extends MonoBehaviour
{
	public var audioSource : AudioSource;
	public var explodeSound : AudioClip;
	public var aliens : GameObject[];
	public var obstacle : GameObject;
	

	function Start () {
	}

	function Update () {
		var killed : int = 0;
		var i : int;
	
		// Checkout whether there are any alients left
		for(i = 0; i < aliens.Length; i++) 
         {
             if (aliens[i] == null) {
             	killed++;
             }
         }
         
         // No more enemy left
         if (killed == aliens.Length) {
         	audioSource.PlayOneShot(this.explodeSound, 1.0);
         	Destroy(this.obstacle, this.explodeSound.length);
         	Destroy(this, this.explodeSound.length);
         }
	}
}

