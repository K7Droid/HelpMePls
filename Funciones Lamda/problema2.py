import json
import boto3
import base64
from datetime import datetime
from collections import defaultdict

def subirAS3(bucket,image):
    s3 = boto3.client('s3')
    now = datetime.now()
    name = now.strftime("%d-%m-%Y-%H:%M:%S")
    
    dec = base64.b64decode(image + "===")
    
    s3.put_object(Bucket=bucket, Key=name, Body=dec)

    return name

def detect_text(bucket,name):

    client=boto3.client('rekognition')
    response=client.detect_text(Image={'S3Object':{'Bucket':bucket,'Name':'prueba'}})                  
    textDetections=response['TextDetections']
    
    sentence = []

    for text in textDetections:
        if text['Confidence'] > 90:
            sentence.append({texto: text['DetectedText'], idpadre: text['ParentId']})

    return sentence

def SentenceArraytoString(sentence):
    groups = defaultdict(list)

    for obj in sentence:
        groups[obj.idpadre].append(obj)

    return groups.values()

def lambda_handler(event, context):
    image = event['foto']
    bucket = 'helpmepls-max'
   
    texto_resultante = detect_text(bucket,subirAS3(bucket,image))
    texto = SentenceArraytoString(texto_resultante)

    return {
        'statusCode': 200,
        'body': json.dumps(texto_resultante)
    }

# def traducir(sentence,idiomaorigen,idiomadestino):
#     translate = boto3.client('translate')

#     result = translate.translate_text(Text=sentence,
#                                   SourceLanguageCode=idiomaorigen,
#                                   TargetLanguageCode=idiomadestino)
#     return result["TranslatedText"]