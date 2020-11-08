const lambda_base_url_cas = 'https://821smf0hk9.execute-api.us-east-1.amazonaws.com/helpmepls'
const lambda_base_url_pao = 'https://5kqbiloijh.execute-api.us-east-1.amazonaws.com/uAttendance'
const lambda_base_url_max = 'https://5kqbiloijh.execute-api.us-east-1.amazonaws.com/uAttendance'

var player = document.getElementById('player'); 
var snapshotCanvas = document.getElementById('snapshot');
var captureButton = document.getElementById('capture');
var videoTracks;
var alerta = $('#alert');
let changeText = true

$('#modal_basic').on('hidden.bs.modal', function () {
    stopCamera();
})

function stopCamera(){
    videoTracks.forEach(function(track) {track.stop()});
}

function startCamera(){
    $('#showResult').css('display','none');
    $('#result_div').html('')


    $('#modal_basic').modal('show', {backdrop: 'static', keyboard: false});
    $('#player').css('display', 'inherit');
    $('#snapshot').css('display', 'none');
    $('#menus').css('display', 'none');
    $('#signal').css('display', 'none');
    $('#repeat').css('display', 'none');
    $('#capture').css('display', '');
    navigator.mediaDevices.getUserMedia({video: true})
    .then(handleSuccess);
}

var handleSuccess = function(stream) {
    // Attach the video stream to the video element and autoplay.
    player.srcObject = stream;
    videoTracks = stream.getVideoTracks();
};

function showRecordingModal() {
    $('#modal_record').modal('show', {backdrop: 'static', keyboard: false})
}

captureButton.addEventListener('click', function() {
    $('#player').css('display', 'none');
    $('#snapshot').css('display', '');
    $('#capture').css('display', 'none');
    $('#menus').css('display', '');
    $('#signal').css('display', '');
    $('#repeat').css('display', '');
    var context = snapshot.getContext('2d');
    context.drawImage(player, 0, 0, snapshotCanvas.width, snapshotCanvas.height);
    videoTracks.forEach(function(track) {track.stop()});
});


function getText(option){
    var canvas = document.getElementById('snapshot');
    var imgData = canvas.toDataURL();
    const endpoint = ''; // <============================================================== agregar lo que complementa la "lambda_url_base" por ejemplo /estudiante, /publicar

    switch(option){
        case 1:
            endpoint = "/endpoint de menu";
            break;
        case 2:
            endpoint = "/endpoint de senal";
            break;
        default:
            return;
    }

    $.ajax({
        type: 'POST',
        url: lambda_base_url_max + endpoint, //<=============================================== agregar la "lambda_base_url" correcta
        crossDomain: true,
        dataType: 'json',
        data: {
            tipo : 1,
            foto : imgData,
            extension: 'png'
        },
    }).done((data)=>{
        if(data.error != 0 ){
            $('#errortext').html(data.message );
            alerta.click()
        }else{
            $('#showResult').css('display','inherit');
            $('#result_div').html('<p>'+data.message+'</p>')
            $('#modal_basic').modal('hide');
        }
    }).fail(error => {
        $('#errortext').html(error );
        alerta.click()
    })
}


function send_text() {
    const audio = $('#audio-result'); 
    if(changeText){
        $.ajax({
            type: 'POST',
            url: lambda_base_url_cas,
            crossDomain: true,
            data: JSON.stringify({
            
                text: $('#textr').val(), 
                voice: $('#voice').val(),
                langcode: $('#language').val()
                
            }),
            contentType: 'application/json',
            dataType: 'json'
        }).done((data)=>{
            // decimos que el texto no ha cambiado, hasta que se escriba nuevamente en el textAreas
            changeText = false
            //aca no se que harias con la respuesta :'v     
            $("#ogg_src").attr("src", data.body.url);
            audio[0].pause();
            audio[0].load();//suspends and restores all audio element
            // attach `canplay` event to `player`
            audio[0].addEventListener("canplay", function handleEvent(e) {
                audio[0].play()
            });
        }).fail(error => {
            console.log('error')
            $('#errortext').html(error );
            alerta.click()
        })
    } else {
        audio[0].play()
    }

}

function textHasChanged(){
    if(!changeText) changeText = true
}



$('#recButton').addClass("notRec");

$('#recButton').click(function(){
    if($('#recButton').hasClass('notRec')){
        $('#recButton').removeClass("notRec");
        $('#recButton').addClass("Rec");
        $('#recording-text').html('Stop Recording')
        startRecording();
    }
    else{
        $('#recButton').removeClass("Rec");
        $('#recButton').addClass("notRec");
        $('#recording-text').html('Start Recording')
        stopRecording();
    }
}); 