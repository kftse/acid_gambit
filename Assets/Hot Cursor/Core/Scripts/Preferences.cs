using UnityEngine;
using System.Collections;
using System.Collections.Generic;
using System.Reflection;

[System.Serializable]
public class Preferences 
{
	public Transform objectReference = null;
	public List<MonoBehaviour> monos = new List<MonoBehaviour>();
	public List<string> methodNames = new List<string>();
	public List<string> monoNames = new List<string>();

	public int monoIndex = 0;
	public int methodIndex = 0;

	public void GetMonos()
	{
		monos.Clear();
		monoNames.Clear();

		if(objectReference != null)
		{
			foreach(MonoBehaviour mono in objectReference.GetComponentsInChildren<MonoBehaviour>())
			{
				if(mono.GetType() == typeof(Invoker)) continue;

				monos.Add(mono);
				monoNames.Add(mono.GetType().ToString());

			}
		}

		if(monoIndex > monos.Count) monoIndex = 0;
	}

	public void GetMethods()
	{
		methodNames.Clear();

		if(objectReference != null)
		{
			if(monos.Count > 0)
			{
				MonoBehaviour mono = monos[monoIndex];

				if(mono != null)
				{
					MethodInfo[] methods = mono.GetType().GetMethods(BindingFlags.Instance | BindingFlags.Public | BindingFlags.DeclaredOnly);
					
					foreach(MethodInfo method in methods)
					{
						if(method.GetParameters().Length == 0 && method.ReturnType.Equals(typeof(void)))
							methodNames.Add(method.Name);
						
					}
				}
			}
		}

		if(methodIndex > methodNames.Count) methodIndex = 0;

	}


}
