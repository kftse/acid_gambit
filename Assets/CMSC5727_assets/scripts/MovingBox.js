#pragma strict

public var min : float = -38f;
public var max : float = -6.5f;
public var speed : float = 2f;
private var moveRight : boolean = true;

function Update () {
	var s : float = speed;
	
	if (moveRight && transform.position.x > max)
		moveRight = false;
	else if (!moveRight && transform.position.x < min)
		moveRight = true;
	
	// speed up
	if (!moveRight && transform.position.x > -34) s *= 5.0f;
	
//	Debug.Log("x: " + transform.position.x + ", moveRight: " + moveRight + ", speed: " + s);
	transform.Translate((moveRight ? Vector3.right :Vector3.left) * Time.deltaTime * s);
}