#pragma strict

class DigitBoard extends MonoBehaviour
{
	public var soundSource : AudioSource;
	public var soundClips : AudioClip[];
	public var boardTitle : Renderer;
	public var boardTextures : Texture[];
	
	// API changes board's texture
	function ChangeTexture(index : int) {
		var t : Texture;
		t = this.boardTextures[index];
		this.boardTitle.material.mainTexture = t;
	}
	
	// Play a sound clip from the given sound source
	//
	// return AudioClip
	function PlaySoundClip(clipName : String) {
		var clipIndex : int;
		if (clipName.Equals("explosion")) {
			clipIndex = 0;
		} else if (clipName.Equals("correct")) {
			clipIndex = 1;
		} else if (clipName.Equals("wrong")) {
			clipIndex = 2;
		}
		
		var clip : AudioClip;
		clip = soundClips[clipIndex];
		this.soundSource.PlayOneShot(clip, 1.0);
	
		return clip;
	}
	
	// Destroy this digitBoard gameObject
	function Destroy() {
		// Ignite the flames
		var flames : GameObject;
		flames = this.transform.Find("flames").gameObject;
		flames.SetActive(true);
		
		// Play explosion and destroy ourselves
		var clip : AudioClip;
		clip = this.PlaySoundClip("explosion");
		Destroy(this.gameObject, clip.length);
	}
}