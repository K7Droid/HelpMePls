const AWS = require('aws-sdk');
const polly = new AWS.Polly();
const s3 = new AWS.S3();
const bucket_name = 'prou-mp3-polly'
    
exports.handler =  async (event, context) => {
    const data = event;
    const params = {
        OutputFormat: "mp3", 
        Text: data.text, 
        TextType: "text", 
        VoiceId: data.voice
    };
    polly.synthesizeSpeech(params).on('success', function(response){
        const data = response.data
        /*
        data = {
            AudioStream: <Binary String>, 
            ContentType: "audio/mpeg", 
            RequestCharacters: 37
        }*/
        const params = {
            Bucket: bucket_name,
            Key: 'test' + '.mp3', // File name you want to save as in S3,
            Body: data.AudioStream,
            ContentType: data.ContentType
        }
        s3.putObject(params)
            .on('success', function(response) {
                console.log('S3 Put Success!')
            })
            .on('complete', function(response){
                console.log('S3 Put Complete!')
            })
        
    });
  
    return context.logStreamName
};
