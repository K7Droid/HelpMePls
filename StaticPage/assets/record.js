//webkitURL is deprecated but nevertheless
URL = window.URL || window.webkitURL;

var gumStream; 						//stream from getUserMedia()
var rec; 							//Recorder.js object
var input; 							//MediaStreamAudioSourceNode we'll be recording

// shim for AudioContext when it's not avb. 
var AudioContext = window.AudioContext || window.webkitAudioContext;
var audioContext //audio context to help us record

function startRecording() {
    var constraints = { audio: true, video:false }
	navigator.mediaDevices.getUserMedia(constraints).then(function(stream) {
		audioContext = new AudioContext();
		document.getElementById("formats").innerHTML="Format: 1 channel pcm @ "+audioContext.sampleRate/1000+"kHz"
		gumStream = stream;
		input = audioContext.createMediaStreamSource(stream);
		rec = new Recorder(input,{numChannels:1})
		rec.record()
	}).catch(function(err) {
	  	//enable the record button if getUserMedia() fails
	  	$('#errortext').html(error );
        alerta.click()
	});
}


function stopRecording() {
	//tell the recorder to stop the recording
	rec.stop();
	//stop microphone access
	gumStream.getAudioTracks()[0].stop();
	//create the wav blob and pass it on to createDownloadLink
	rec.exportWAV(createDownloadLink);
}

function createDownloadLink(blob) {
	
	var url = URL.createObjectURL(blob);
	var au = document.createElement('audio');
	var li = document.createElement('div');
	var link = document.createElement('a');

	var filename = "record_translate";
	au.controls = true;
	au.src = url;

	li.className = "lin";

	//add the new audio element to li
	li.appendChild(au);
	
	//upload link
	var upload = $('<a class="btn btn-info btn-block"></a>');
	var dots = $('<span class="stage dot-hidden"><i class="dot-flashing"></i></span>')
	upload.append(dots);
	
	//upload.attr('href',"#");
	upload.html("Translate");
	upload.on("click", function(event){
		var btn = $(this)
		btn.attr('disabled','disabled')
		$(this).html('');
		$('.stage').removeClass('dot-hidden');
		var xhr=new XMLHttpRequest();
		xhr.onload=function(e) {
		    if(this.readyState === 4) {
		        console.log("Server returned: ",e.target.responseText);
		    }
	  	};

	  	xhr.onerror = function(e){
	  		$('#errortext').html("Error uploading file"  );
        	alerta.click()
			$('.stage').addClass('dot-hidden');
			btn.html('Translate');
			btn.removeAttr('disabled')
	  	}

	  	var fd=new FormData();
	  	fd.append("audio_data",blob, filename);
	  	xhr.open("POST",lambda_base_url_pao,true);
	  	xhr.send(fd);
	})
	li.appendChild(document.createTextNode (" "))//add a space in between
	$(li).append(upload)//add the upload link to li

	//add the li element to the ol
	$('#recordingsList').empty();
	recordingsList.appendChild(li);
}