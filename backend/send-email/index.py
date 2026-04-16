import json
import urllib.request
import urllib.parse


def handler(event: dict, context) -> dict:
    """Отправка заявки в Telegram"""
    
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
    equipment = body.get('equipment', '')
    
    if not name or not phone:
        return {
            'statusCode': 400,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Name and phone are required'})
        }
    
    # Telegram Bot настройки
    bot_token = '8459653165:AAGtN0j1Yp5pk-RxmJZQsqN-CHw0BVb59TQ'
    chat_ids = ['1156073481']
    
    # Формирование сообщения
    equipment_line = f'\n🔧 Техника: {equipment}' if equipment else '\n📋 Заявка с сайта: Б/у техника и спецпредложение'
    message = f"""🚜 Новая заявка с сайта KGS-Ural

👤 Имя: {name}
📞 Телефон: {phone}
📧 Email: {email}{equipment_line}"""
    
    # Отправка в Telegram всем получателям
    try:
        for chat_id in chat_ids:
            url = f'https://api.telegram.org/bot{bot_token}/sendMessage'
            data = urllib.parse.urlencode({
                'chat_id': chat_id,
                'text': message
            }).encode()
            
            req = urllib.request.Request(url, data=data)
            with urllib.request.urlopen(req) as response:
                result = response.read()
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'success': True, 'message': 'Заявка отправлена'})
        }
    
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': f'Ошибка отправки: {str(e)}'})
        }