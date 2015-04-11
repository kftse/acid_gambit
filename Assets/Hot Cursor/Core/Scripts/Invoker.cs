using UnityEngine;
using System.Collections.Generic;

[AddComponentMenu("Hot Cursor/Invoker")]
public class Invoker : MonoBehaviour {

	public List<Preferences> preferences = new List<Preferences>();

	/// <summary>
	/// Gets the count of the preferences list.
	/// </summary>
	public int Count {get {return preferences.Count;}} 

	/// <summary>
	/// Invokes the methods.
	/// </summary>
	public void InvokeMethods()
	{
		if(preferences.Count > 0)
		{
			for(int i = 0; i < preferences.Count; i++)
			{
				int monoIndex = preferences[i].monoIndex; //Get the index from dropdown menu.
				int methodIndex = preferences[i].methodIndex; //Get the index from dropdown menu.
				MonoBehaviour mono = preferences[i].monos[monoIndex]; //Get the monobehaviour from list with selected index.
				string selectedMethod = preferences[i].methodNames[methodIndex]; //Get the method from list with selected index.

				if(mono != null)
				{
					if(!string.IsNullOrEmpty(selectedMethod))
					{
						Debug.Log("Invoke Call :" + " " + mono.GetType().ToString() + " is invoking" + " " + selectedMethod );
						mono.Invoke(selectedMethod, 0); //Invoke the methods.
					}
					else
					{
						Debug.LogWarning("One of the method name is null or empty.");
						return;
					}
				}
				else
				{
					Debug.LogWarning("One of the component is a null.");
					return;
				}

			}
		}
	}

}
