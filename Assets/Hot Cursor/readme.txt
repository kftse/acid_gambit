******************************MUST HAVE******************************************
									   
*The gameobjects you want to show cursor on it must have a COLLIDER component and must be tagged properly, otherwise it will not work. 
										                
									    
*Method you want to invoke must be public with no parameters and return type of void.           
*Example								    
									    
public void OpenShop()				                      
{
     //Stuff
}						    
									    								    *
									    	
otherwise method will not show up on the inspector.                                                                           
                                                                                                                                                                      
************************************************************************************
Cursor Manager

First add the hot cursor manager to player object.(not necessary you can add any gameobject)
Select the gameobject you want to add from hierarchy panel. Go to Component -> Hot Cursor -> Cursor Manager and script should be added to selected gameobject.

Select the gameobject Cursor Manager script attached to and fill the blanks.

INVOKER

Select the gameobject from hierarchy panel go to Component -> Hot Cursor -> Invoker script should be added to selected gameobject.

Go to inspector find the invoker script, click Add button to add new method. You can add multiple methods.

Drag and drop gameobject you want to invoke to reference object field in the inspector panel.  Select components and methods, ready to go!.



See the demos for more detailed setup.