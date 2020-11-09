import json
import boto3
import base64
from datetime import datetime

s3 = boto3.client('s3')

def saveAudio(bucket,image):
    now = datetime.now()
    name = now.strftime("%d-%m-%Y-%H:%M:%S")
    
    dec = base64.b64decode(image + "===")
    
    s3.put_object(Bucket=bucket, Key=name, Body=dec)

    return name

def getAudioText(bucket,name, lang):

    transcribe=boto3.client('transcribe')
    file_bucket = '201503595'
    file_name = 'audio_translate'
    object_url='https://s3.amazonaws.com/{0}/{1}'.format(file_bucket, file_name)
    response = transcribe.start_transcription_job(
            TranscriptionJobName="audio_translate",
            LanguageCode=lang,
            MediaFormat='wav',
            Media={
                'MediaFileUri': object_url
            })
    uri= response['TranscriptionJob']['Transcript']['TranscriptFileUri']
    content = urlib.request.urlopen(uri).read().decode('UTF-8')
    
    data =  json.loads(content)
    transcribed_text = data['results']['transcripts'][0]['transcript']
    return transcribed_text

def translate(text,languageFrom,langruageDestiny):
    translate = boto3.client('translate')
    result = translate.translate_text(Text=text,
                                    SourceLanguageCode=languageFrom,
                                    TargetLanguageCode=langruageDestiny)
    return result["TranslatedText"]

def lambda_handler(event, context):
    record = event['foto']
    languageFrom = event['languageFrom']
    langruageDestiny = event['langruageDestiny']
    bucket = '201503595'
   
    texto_resultante = getAudioText(bucket,saveAudio(bucket,record, languageFrom))
    result = translate(texto_resultante,languageFrom,langruageDestiny)
    return {
        'statusCode': 200,
        'body': result
    }