import json
import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart


def handler(event: dict, context) -> dict:
    """Отправка email через SMTP Яндекс с данными формы заявки"""
    
    method = event.get('httpMethod', 'POST')
    
    # CORS preflight
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            'body': ''
        }
    
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    # Парсинг данных формы
    body_str = event.get('body', '{}')
    if isinstance(body_str, str):
        try:
            body = json.loads(body_str)
        except json.JSONDecodeError:
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': 'Invalid JSON'})
            }
    else:
        body = body_str
    
    name = body.get('name', '')
    phone = body.get('phone', '')
    email = body.get('email', 'не указан')
    
    if not name or not phone:
        return {
            'statusCode': 400,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Name and phone are required'})
        }
    
    # Получение SMTP настроек
    smtp_host = os.environ.get('SMTP_HOST')
    smtp_port = int(os.environ.get('SMTP_PORT', '465'))
    smtp_user = os.environ.get('SMTP_USER')
    smtp_password = os.environ.get('SMTP_PASSWORD')
    
    if not all([smtp_host, smtp_user, smtp_password]):
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'SMTP configuration missing'})
        }
    
    # Формирование письма
    msg = MIMEMultipart()
    msg['From'] = smtp_user
    msg['To'] = 'marketing@kgs-ural.ru'
    msg['Subject'] = 'Заявка на Yongan DZJ-90'
    
    email_body = f"""
Новая заявка с сайта KGS-Ural

Имя: {name}
Телефон: {phone}
Email: {email}
Предложение: Yongan DZJ-90 - 8 150 000 ₽
    """.strip()
    
    msg.attach(MIMEText(email_body, 'plain', 'utf-8'))
    
    # Отправка письма
    try:
        with smtplib.SMTP_SSL(smtp_host, smtp_port) as server:
            server.login(smtp_user, smtp_password)
            server.send_message(msg)
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'success': True, 'message': 'Email sent successfully'})
        }
    
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': f'Failed to send email: {str(e)}'})
        }