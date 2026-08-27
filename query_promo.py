import urllib.request
import json
import os

from dotenv import load_dotenv
load_dotenv('.env.local')

SUPABASE_URL = os.environ.get('NEXT_PUBLIC_SUPABASE_URL')
SUPABASE_KEY = os.environ.get('SUPABASE_SERVICE_ROLE_KEY')

url = f"{SUPABASE_URL}/rest/v1/promo_codes?select=*"
req = urllib.request.Request(url, headers={
    'apikey': SUPABASE_KEY,
    'Authorization': f'Bearer {SUPABASE_KEY}',
    'Content-Type': 'application/json'
})

try:
    with urllib.request.urlopen(req) as response:
        print(json.loads(response.read().decode()))
except Exception as e:
    print(e)
