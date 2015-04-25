#pragma strict
#pragma implicit
#pragma downcast

class AimingRaycast extends MonoBehaviour
{
	// Source location of our aiming ray
	public var fromLocation : Transform;
	
	// How far the ray can go
	public var rayRange : float = 0f;
	
	// A reference of LineRendere which is responsible for drawing the visual ray
	public var rayLine : LineRenderer;
	
	// This controller gives a information like whether solider are aiming and where is the camera
	public var controller : SoldierController;
	
	// Since Gun shooting at where camera focusing on, we need this reference for calculating another end point
	// of our aiming ray
	protected var gameCamera : Camera;
	
	function Start() {
		// Setup camera reference
		this.gameCamera = this.controller.soldierCamera;
	}

	// Update the aiming ray
	function Update () {
		// Determine wheter soldier is aiming or not	
		if (
			this.controller.aim &&
			!this.controller.reloading &&
			!this.controller.inAir
		) {
			// Set the aiming ray starting at our source point
			var source : Vector3;

			source = this.fromLocation.position;
			this.rayLine.SetPosition(0, source);

			// We are going to determine where is the ending point
			var end : Vector3;
			
			// Get a ray from gameCamera
			var cameraRay : Ray;
			var cameraDirection : Vector3;
			var cameraPosition : Vector3;
			
			cameraPosition = this.gameCamera.transform.position;
			cameraDirection = this.gameCamera.transform.rotation * Vector3.forward;	
			cameraRay = new Ray(cameraPosition, cameraDirection);		
			
			// Get what camera ray hit with rayRange
			var hit : RaycastHit;
			if (Physics.Raycast(cameraRay.origin, cameraDirection, hit, this.rayRange)) {
				// End at the object hitted by the ray
				end = hit.point;
			} else {
				// End at the farest point of the camera within rayRange
				end = cameraPosition + cameraDirection * this.rayRange;
			}
			
			this.rayLine.SetPosition(1, end);
			
			// Enable the ray line
			this.rayLine.enabled = true;
		} else {
			// Disable the ray line if soldier is not aiming
			this.rayLine.enabled = false;
		}
	}
}
