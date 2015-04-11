using UnityEngine;
using System.Collections;
using UnityEditor;

[CustomEditor(typeof(HotCursorManager))]
public class HotCursorManagerEditor : Editor {
	
	public override void OnInspectorGUI ()
	{
		HotCursorManager signManager = target as HotCursorManager;

		EditorGUILayout.BeginVertical("GroupBox");

		EditorGUILayout.LabelField("Options", EditorStyles.boldLabel);

		EditorGUILayout.Space();

		signManager.raycastTo = (HotCursorManager.RaycastTo)EditorGUILayout.EnumPopup("Raycast To :", signManager.raycastTo);

		EditorGUILayout.Space();

		signManager.useButton = (KeyCode)EditorGUILayout.EnumPopup("Use button :", signManager.useButton);

		EditorGUILayout.Space();

		if(signManager.raycastTo != HotCursorManager.RaycastTo.MousePosition2D)
		{
			signManager.interactionRange = EditorGUILayout.Slider("Interaction Range :",signManager.interactionRange, 1.0f, 100.0f);

			EditorGUILayout.Space();
		}

		EditorGUILayout.BeginHorizontal();

		GUILayout.Label("Crosshair :");

		signManager.crosshair = (Texture2D)EditorGUILayout.ObjectField(signManager.crosshair,typeof(Texture2D),allowSceneObjects:false);

		EditorGUILayout.EndHorizontal();

		EditorGUILayout.Space();

		if(signManager.crosshair != null)
		{
			if(signManager.crosshairWH == Vector2.zero)
			{
				signManager.crosshairWH = new Vector2(signManager.crosshair.width,signManager.crosshair.height);
			}

			signManager.crosshairWH = EditorGUILayout.Vector2Field("Texture Size :", signManager.crosshairWH);

		}

		EditorGUILayout.Space();EditorGUILayout.Space();

		EditorGUILayout.BeginHorizontal();
		GUILayout.FlexibleSpace();
		if(GUILayout.Button("Add New Cursor", "PreButton", GUILayout.Width(150)))
		{
			Signs sign = new Signs();
			sign.tag = "Untagged";
			signManager.signs.Add(sign);
		}
		GUILayout.FlexibleSpace();

		EditorGUILayout.EndHorizontal();

		EditorGUILayout.EndVertical();

		if(signManager.signs.Count > 0)
		{
			for(int i = 0; i < signManager.signs.Count; i++)
			{

				EditorGUILayout.BeginHorizontal();

				signManager.signs[i].showToggle = GUILayout.Toggle(signManager.signs[i].showToggle, signManager.signs[i].tag, "OL Title");

				GUI.color = Color.red;
				if(GUILayout.Button("Remove", "OL Title", GUILayout.Width(100)))
				{
					signManager.signs.RemoveAt(i);
					return;
				}
				GUI.color = Color.white;

				EditorGUILayout.EndHorizontal();

				if(signManager.signs[i].showToggle)
				{
					EditorGUILayout.BeginVertical("ScriptText");

					EditorGUI.indentLevel++;

					EditorGUILayout.Space();

					EditorGUILayout.Space();

					signManager.signs[i].tag = EditorGUILayout.TagField("Tag :",signManager.signs[i].tag, "PreDropDown");

					EditorGUILayout.Space();

					signManager.signs[i].show = (Signs.Show) EditorGUILayout.EnumPopup("Show :", signManager.signs[i].show , "PreDropDown");

					EditorGUILayout.Space();

					if(signManager.signs[i].show == Signs.Show.Texture)
					{
						if(!string.IsNullOrEmpty(signManager.signs[i].hint))
						signManager.signs[i].hint = "";

						signManager.signs[i].texture = (Texture2D)EditorGUILayout.ObjectField("Texture:",signManager.signs[i].texture,typeof(Texture2D),allowSceneObjects:false);

						EditorGUILayout.Space();

						if(signManager.signs[i].texture != null)
						{
							if(signManager.signs[i].textureWH == Vector2.zero)
							{
								signManager.signs[i].textureWH = new Vector2(signManager.signs[i].texture.width,signManager.signs[i].texture.height);
							}

							signManager.signs[i].textureWH = EditorGUILayout.Vector2Field("Texture Size :",signManager.signs[i].textureWH);
						}
					}
					else
					{
						if(signManager.signs[i].texture != null)
						signManager.signs[i].texture = null;

						signManager.signs[i].hint = EditorGUILayout.TextField("Hint :",signManager.signs[i].hint);

						EditorGUILayout.Space();

						signManager.signs[i].style.font = (Font)EditorGUILayout.ObjectField("Font :",signManager.signs[i].style.font,typeof(Font),allowSceneObjects:false);

						EditorGUILayout.Space();

						signManager.signs[i].style.fontSize = EditorGUILayout.IntField("Font Size :",signManager.signs[i].style.fontSize);

						EditorGUILayout.Space();

						signManager.signs[i].style.alignment = (TextAnchor)EditorGUILayout.EnumPopup("Alignment :",signManager.signs[i].style.alignment, "PreDropDown");

						EditorGUILayout.Space();

						if(signManager.signs[i].style.font != null)
						{
							signManager.signs[i].style.normal.textColor = EditorGUILayout.ColorField("Font Color : ",signManager.signs[i].style.normal.textColor);
						}

						signManager.signs[i].style.normal.background = (Texture2D)EditorGUILayout.ObjectField("Background :",signManager.signs[i].style.normal.background, typeof(Texture2D), false);

						if(signManager.signs[i].style.normal.background != null)
						{
							signManager.signs[i].hintTextureWH = EditorGUILayout.Vector2Field("Label W&H :", signManager.signs[i].hintTextureWH);
						}

						EditorGUILayout.Space();
					}

					EditorGUI.indentLevel--;
					EditorGUILayout.EndVertical();

				}

				EditorGUILayout.Space();EditorGUILayout.Space();
			}
		}

		EditorGUILayout.Space();
	}


}
