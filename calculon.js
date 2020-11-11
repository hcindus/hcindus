

app.LoadPlugin("Lodash");
space = app.GetFreeSpace( "internal" );

//Init variables.
var sum = "";

//Called when application is started.
function OnStart()

{

    //Create recognition object and set callbacks.
	speech = app.CreateSpeechRec("NoBeep,Parxtial");
	speech.SetOnResult( speech_OnResult );
	speech.SetOnError( speech_OnError );
	
app.TextToSpeech( "Calculon now online sire.!",  0.1, 1.5, Listen );
    app.ShowProgress();
	//Create a layout with objects vertically centered.
	layMain = app.CreateLayout( "linear", "FillXY" );	

	//Create array to hold number buttons.
	keys = [ 7,8,9,"/", 4,5,6,"*", 1,2,3,"-", 0,".","C","+" ];
	
	//Create text control for displaying sum.
	txtSum = app.CreateText( "", 0.8, 0.1 );
	txtSum.SetTextSize( 42 );
	txtSum.SetBackColor( "#ff222222" );
	txtSum.SetMargins( 0, 0.1, 0, 0.05 );
	layMain.AddChild( txtSum );
	
	//Create first row of buttons.
	lay1st = app.CreateLayout( "linear", "Horizontal" );	
	for( i=0; i<4; i++ ) AddButton( lay1st, keys[i] );
	layMain.AddChild( lay1st );
	
	//Create second row of buttons.
	lay2nd = app.CreateLayout( "linear", "Horizontal" );	
	for( i=4; i<8; i++ ) AddButton( lay2nd, keys[i] );
	layMain.AddChild( lay2nd );
	
	//Create third row of buttons.
	lay3rd = app.CreateLayout( "linear", "Horizontal" );	
	for( i=8; i<12; i++ ) AddButton( lay3rd, keys[i] );
	layMain.AddChild( lay3rd );
	
	//Create fourth row of buttons.
	lay4th = app.CreateLayout( "linear", "Horizontal" );	
	for( i=12; i<16; i++ ) AddButton( lay4th, keys[i] );
	layMain.AddChild( lay4th );
	
	//Create fifth row of buttons.
	lay5th = app.CreateLayout( "linear", "Horizontal" );	
	AddButton( lay5th, "=" );
	layMain.AddChild( lay5th );

	//Add layout to app.	
	app.AddLayout( layMain );
}

//Add a button to a given layout.
function AddButton( lay, name )
{
	if( name=="=" ) w = 0.8; else w=0.2;
	btn = app.CreateButton( name, w, 0.1, "Custom" );
	btn.SetStyle("#000033","#000033",10,"green",1,0);
  btn.SetTextColor("yellow");
	btn.SetOnTouch( btns_OnTouch );
	lay.AddChild( btn );
}

//Called when user presses number buttons.
function btns_OnTouch()
{
	app.Vibrate( "0,100" );
	
	//Get button text.
	btn = app.GetLastButton();
	var txt = btn.GetText();
	
	//Handle equals button.
	if( txt=="=" ) CalcResult();
	
	//Handle clear button.
	else if( txt=="C" ) sum = "";
	
	//Handle other buttons.
	else sum += txt;
	
	//Update display.
	txtSum.SetText( sum );
}

//Calculate sum.
function CalcResult()
{ 
	try {
		//Evaluate sum (and catch errors).
		sum = eval( sum ).toFixed(2);
	}
	catch(e) { sum = "Error" }
}


//Start recognizing.
function Listen()
{
    app.HideProgress();
	speech.Recognize();
}

//Called with the recognition result(s).
function speech_OnResult( results, partial )
{
    //Get result.
    var cmd = results[0].toLowerCase();
    
    //Watch for key phrases.
    if( cmd.indexOf("computer") > -1 )
    {
        //speech.Cancel();
        app.TextToSpeech( "Yes Sire?", 0.1,2, Listen );
    }
    else if( cmd.indexOf("exit")>-1 || cmd.indexOf("quit")>-1 || cmd.indexOf("stop")>-1 )
    {
       	app.TextToSpeech( "Very Good Sire. Calculon now exiting.  Returning control to Myl0n.", 0.1,2 );
	
	app.Exit();
    }
    
    //Restart recognition.
    else speech.Recognize();
}

//	Error Check
//Called if recognition fails.
function speech_OnError( error )
{
    console.log( "Error" + error );
    
    //Restart recognition.
    if( !speech.IsListening() ) speech.Recognize();
}