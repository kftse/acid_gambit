using UnityEngine;
using UnityEditor;
using System.Collections;

[CustomEditor(typeof(Invoker))]
public class InvokerEditor : Editor {

	Invoker invoker;

	void OnEnable()
	{
		invoker = target as Invoker;
	}

	public override void OnInspectorGUI ()
	{
		if(invoker != null)
		{
			EditorGUILayout.BeginVertical("GroupBox");

			EditorGUILayout.BeginHorizontal();

			GUILayout.Label("Reference", EditorStyles.boldLabel);

			GUILayout.Label("Component", EditorStyles.boldLabel);

			GUILayout.Label("Method", EditorStyles.boldLabel);

			if(GUILayout.Button("Add", GUILayout.Width(32)))
			{
				Preferences temp = new Preferences();
				invoker.preferences.Add(temp);
			}

			EditorGUILayout.EndHorizontal();

			EditorGUILayout.Space();

			if(invoker.Count > 0)
			{
				for(int i = 0; i < invoker.Count; i++)
				{
					EditorGUILayout.BeginHorizontal();

					invoker.preferences[i].objectReference = (Transform)EditorGUILayout.ObjectField(invoker.preferences[i].objectReference, typeof(Transform), true);

					if(invoker.preferences[i].objectReference != null)
					{
						invoker.preferences[i].monoIndex = EditorGUILayout.Popup(invoker.preferences[i].monoIndex, invoker.preferences[i].monoNames.ToArray());
						invoker.preferences[i].methodIndex = EditorGUILayout.Popup(invoker.preferences[i].methodIndex, invoker.preferences[i].methodNames.ToArray());
					}

					if(GUILayout.Button("X", GUILayout.Width(16), GUILayout.Height(14)))
					{
						invoker.preferences.RemoveAt(i);
						return;
					}

					EditorGUILayout.EndHorizontal();

					if(GUI.changed)
					{
						invoker.preferences[i].GetMonos();
						invoker.preferences[i].GetMethods();
					}

					EditorGUILayout.Space();

				}
			}

			EditorGUILayout.EndVertical();
		}
	}

}
