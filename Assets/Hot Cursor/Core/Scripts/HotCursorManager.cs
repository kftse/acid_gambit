using UnityEngine;
using System.Collections;
using System.Collections.Generic;

[AddComponentMenu("Hot Cursor/Cursor Manager")]
public class HotCursorManager : MonoBehaviour {
	
	public enum RaycastTo
	{
		MousePosition3D,
		MousePosition2D,
		CameraForwardDirection
	}

	public List<Signs> signs = new List<Signs>();
	public float interactionRange = 1.0f;
	public Texture2D crosshair;
	public Vector2 crosshairWH; //Crosshair texture's width and height.
	public KeyCode useButton; //Use button.


	public RaycastTo raycastTo = RaycastTo.CameraForwardDirection; //State of the raycast modes.

	private Transform hit3D; //The object that we hit in First person or third person mode.
	private Transform hit2D; // The object that we hit in 2D mode.

	public bool DisableCrosshair {get; set;} //To enable or disable the crosshair.
	public bool DisableRaycast {get; set;} //To enable or disable the raycasting.

	void Start () 
	{
		DisableCrosshair = false;
		DisableRaycast = false;
	}
	
	// Update is called once per frame
	void Update () {

		HandleWarnings();

		if(DisableRaycast == false)
		{
			HandleRaycasts();
		}
	}

	/// <summary>
	/// Enables raycasting.
	/// </summary>
	public void Enable()
	{
		DisableRaycast = false;

		if(raycastTo == RaycastTo.CameraForwardDirection)
		{
			DisableCrosshair = false;
		}
	}

	/// <summary>
	/// Disables raycasting.
	/// </summary>
	public void Disable()
	{
		DisableRaycast = true;

		if(raycastTo == RaycastTo.CameraForwardDirection)
		{
			DisableCrosshair = true;
		}
	}

	/// <summary>
	/// Toggles raycasting.
	/// </summary>
	public void Toggle()
	{
		DisableRaycast = !DisableRaycast;

		if(raycastTo == RaycastTo.CameraForwardDirection) //First person mode.
		{
			if(DisableRaycast == false)
			{
				DisableCrosshair = false;
			}
			else
			{
				DisableCrosshair = true;
			}
		}
		else // Third person or 2D mode.
		{
			if(DisableCrosshair == true)
			{
				DisableCrosshair = false;
			}
		}

	}

	private void OnGUI()
	{
		GUI.depth = -1;

		if(DisableCrosshair == false)
		{
			ShowCrosshair(crosshair,crosshairWH.x,crosshairWH.y);
		}

		if(DisableRaycast == false)
		{
			if(raycastTo == RaycastTo.CameraForwardDirection) //First Person mode.
			{
				HandleSigns3D(hit3D);
			}
			else if (raycastTo == RaycastTo.MousePosition3D) //Third Person mode.
			{
				HandleSigns3D(hit3D);
			}
			else //2D mode.
			{
				HandleSigns2D(hit2D);
			}
		}
	}

	/// <summary>
	/// Handles the raycasts to get what we hit.
	/// </summary>
	private void HandleRaycasts()
	{
		if(Camera.main == null) return;

		if(raycastTo == RaycastTo.CameraForwardDirection) //First person mode
		{
			Vector3 direction = Camera.main.transform.TransformDirection(Vector3.forward);
			Vector3 camPos = Camera.main.transform.position;
			RaycastHit hit;
			
			if(Physics.Raycast(camPos, direction, out hit,interactionRange))// To check what we hit.
			{
				hit3D = hit.transform;

				Invoker invoker = hit.transform.GetComponent<Invoker>(); // try's to getcomponent from Invoker script.

				if(Input.GetKeyDown(useButton))
				{
					if(invoker != null) // if the object that we hit have a Invoker component.
					{
						invoker.InvokeMethods(); //Invoke the methods.
					}
				}

			}
			else
			{
				if(hit3D != null)
				{
					hit3D = null;
				}
			}
		}
		else if (raycastTo == RaycastTo.MousePosition3D) // Third person mode.
		{
			Ray ray = Camera.main.ScreenPointToRay(Input.mousePosition); 
			RaycastHit hit;

			if(Physics.Raycast(ray.origin, ray.direction, out hit, interactionRange))// To check what we hit.
			{
				hit3D = hit.transform;

				Invoker invoker = hit.transform.GetComponent<Invoker>(); // try's to getcomponent from Invoker script.
				
				if(Input.GetKeyDown(useButton))
				{
					if(invoker != null) // if the object that we hit have a Invoker component.
					{
						invoker.InvokeMethods(); //Invoke the methods.
					}
				}
			}
			else
			{
				if(hit3D != null)
				{
					hit3D = null;
				}
			}
		}
		else //2D mode
		{
			Ray ray = Camera.main.ScreenPointToRay(Input.mousePosition); 
			
			RaycastHit2D hit = Physics2D.Raycast(ray.origin, ray.direction); // To check what we hit.
			
			if(hit.collider != null)
			{
				hit2D = hit.transform;

				Invoker invoker = hit.transform.GetComponent<Invoker>(); // try's to getcomponent from Invoker script.
				
				if(Input.GetKeyDown(useButton))
				{
					if(invoker != null) // if the object that we hit have a Invoker component.
					{
						invoker.InvokeMethods(); //Invoke the methods.
					}
				}
			}
			else
			{
				if(hit2D != null)
				{
					hit2D = null;
				}
			}
		}



	}

	/// <summary>
	/// Handles the signs on 2D mode. Draws a texture or a hint based on what we hit and it's tag.
	/// </summary>
	private void HandleSigns2D(Transform hit)
	{
		DisableCrosshair = false; //Enables the crosshair.

		if(hit != null)
		{
			if(hit.collider2D != null) //If the object that we hit have a collider.
			{
				for(int i = 0; i < signs.Count; i++) //Loop through to signs list.
				{
					if(hit.collider2D.tag == signs[i].tag) //Checks the hit gameobject's tag exist on the list.
					{
						DisableCrosshair = true; //Disable the crosshair
						
						if(signs[i].show == Signs.Show.Hint) //If hint selected in the inspector.
						{
							//If hint is not null
							if(signs[i].hint != "")
							{
								if(signs[i].hintTextureWH.x != 0 && signs[i].hintTextureWH.y != 0)
								{
									ShowSignHint(signs[i].hint,signs[i].hintTextureWH.x,signs[i].hintTextureWH.y, signs[i].style);
								}
								else
								{
									ShowSignHint(signs[i].hint,100,30, signs[i].style);
								}
							} 
							else // Hint is empty
							{
								Debug.LogWarning(signs[i].tag + " " + "selected as hint but there is no hint to display.");
								return;
							}
						}
						else  //Selected as a texture. show the texture.
						{
							if(signs[i].texture != null) // If the texture is not null.
							{
								ShowSignTexture(signs[i].texture,signs[i].textureWH.x,signs[i].textureWH.y); //Draws the texture.
							}
							else // Texture is not assigned.
							{
								Debug.LogWarning(signs[i].tag + " " + "selected as texture but there is no texture to display.");
								return;
							}
						}

					}// if the tag not exists.

				} //for loop ends

			}// if the collider is null.
		}
	}

	/// <summary>
	/// Handles the signs on 3D mode. Draws a texture or a hint based on what we hit and it's tag.
	/// </summary>
	private void HandleSigns3D(Transform hit)
	{
		DisableCrosshair = false;

		if(hit != null) //If we are hitting a object.
		{
			for(int i = 0; i < signs.Count; i++) //Loop through to list.
			{
				if(hit.tag == signs[i].tag) //Checks the hit gameobject's tag exist on the list.
				{
					DisableCrosshair = true; //Disable the crosshair

					if(signs[i].show == Signs.Show.Hint) //If hint selected in the inspector. show the hint.
					{
						//If hint is not null
						if(signs[i].hint != "")
						{
							if(signs[i].hintTextureWH.x != 0 && signs[i].hintTextureWH.y != 0)
							{
								ShowSignHint(signs[i].hint,signs[i].hintTextureWH.x,signs[i].hintTextureWH.y, signs[i].style);
							}
							else
							{
								ShowSignHint(signs[i].hint,100,30, signs[i].style);
							}
						} 
						else // Hint is empty
						{
							Debug.LogWarning(signs[i].tag + " " + "selected as hint but there is no hint to display.");
							return;
						}
					}
					else //Selected as a texture. show the texture.
					{
						if(signs[i].texture != null) // If the texture is not null.
						{
							ShowSignTexture(signs[i].texture,signs[i].textureWH.x,signs[i].textureWH.y);
						}
						else // Texture is not assigned.
						{
							Debug.LogWarning(signs[i].tag + " " + "selected as texture but there is no texture to display.");
							return;
						}
					}

				}// if the tag not exists.
				
			} //for loop ends
			
		}// if the hit gameobject is null.
	}


	private void ShowSignTexture(Texture2D texture,float width,float height)
	{
		if(raycastTo == RaycastTo.CameraForwardDirection) // We are in first person mode draw texture to middle of the screen.
		{
			GUI.DrawTexture(new Rect((Screen.width - width) * 0.5f,(Screen.height - height) * 0.5f,width,height),texture);
		}
		else if (raycastTo == RaycastTo.MousePosition2D || raycastTo == RaycastTo.MousePosition3D) // We are in third person or 2d mode draw texture to  mouse position.
		{
			GUI.DrawTexture (new Rect(Event.current.mousePosition.x-(width * 0.5f), (Event.current.mousePosition.y)- (height * 0.5f), width, height),texture);
		}
	}
	
	private void ShowSignHint(string hint, float width, float height, GUIStyle style)
	{
		if(raycastTo == RaycastTo.CameraForwardDirection) // We are in first person mode draw texture to middle of the screen.
		{
			GUI.Label(new Rect((Screen.width -width) * 0.5f,(Screen.height - height) * 0.5f,width,height),hint,style);
		}
		else if (raycastTo == RaycastTo.MousePosition2D || raycastTo == RaycastTo.MousePosition3D)  // We are in third person or 2d mode draw texture to  mouse position.
		{
			GUI.Label (new Rect(Event.current.mousePosition.x-(width * 0.5f), (Event.current.mousePosition.y)- (height * 0.5f), width, height),hint, style);
		}
	}

	private void ShowCrosshair(Texture2D texture,float width,float height)
	{
		if(crosshair != null)
		{
			if(raycastTo == RaycastTo.CameraForwardDirection) // We are in first person mode draw texture to middle of the screen.
			{
				GUI.DrawTexture(new Rect((Screen.width - width) * 0.5f,(Screen.height - height) * 0.5f,width,height),texture);
			}
			else if (raycastTo == RaycastTo.MousePosition2D || raycastTo == RaycastTo.MousePosition3D)  // We are in third person or 2d mode draw texture to  mouse position.
			{
				GUI.DrawTexture (new Rect(Event.current.mousePosition.x-(width * 0.5f), (Event.current.mousePosition.y)- (height * 0.5f), width, height),texture);
			}
		}

	}

	private void HandleWarnings()
	{
		if(Camera.main == null)
		{
			Debug.LogWarning("Main Camera cannot be found. Select you camera and change tag to MainCamera.");
			return;
		}

		if(raycastTo == RaycastTo.CameraForwardDirection || raycastTo == RaycastTo.MousePosition3D)
		{
			if(interactionRange <= 0)
			{
				Debug.LogWarning("Interaction range must be greater than zero.");
				return;
			}
		}

		if(crosshair == null)
		{
			Debug.LogWarning("Crosshair texture is null.Assign one.");
			return;
		}

	}

	
}

[System.Serializable]
public class Signs
{
	public enum Show
	{
		Hint,
		Texture
	}
	
	public string tag;
	public Texture2D texture = null;
	public Show show = Show.Texture;
	public string hint = "";
	public GUIStyle style = new GUIStyle();
	public Vector2 textureWH = Vector2.zero;
	public bool showToggle = false;
	public Vector2 hintTextureWH = Vector2.zero;
}

