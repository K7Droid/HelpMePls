import json
import boto3
import base64
from datetime import datetime

s3 = boto3.client('s3')

def subirAS3(bucket,image):
    now = datetime.now()
    name = now.strftime("%d-%m-%Y-%H:%M:%S")
    
    dec = base64.b64decode(image + "===")
    
    s3.put_object(Bucket=bucket, Key=name, Body=dec)

    return name

def detect_text(bucket,name):

    client=boto3.client('rekognition')
    response=client.detect_text(Image={'S3Object':{'Bucket':bucket,'Name':name}})                  
    textDetections=response['TextDetections']
    
    sentence_array = []

    for text in textDetections:
        if text['Confidence'] > 90 and text['Type'] == 'LINE':
            sentence_array.append(text['DetectedText'])

    sentence = ""

    for words in sentence_array:
        sentence += words
        sentence += "\n"
    
    return sentence

def traducir(texto,idiomaorigen,idiomadestino):
    translate = boto3.client('translate')
    result = translate.translate_text(Text=texto,
                                    SourceLanguageCode=idiomaorigen,
                                    TargetLanguageCode=idiomadestino)
    return result["TranslatedText"]

def lambda_handler(event, context):
    image = event['foto']
    idiomaorigen = event['idiomaorigen']
    idiomadestino = event['idiomadestino']
    bucket = 'helpmepls-max'
   
    texto_resultante = detect_text(bucket,subirAS3(bucket,image))
    result = traducir(texto_resultante,idiomaorigen,idiomadestino)
    return {
        'statusCode': 200,
        'body': result
    }