require('dotenv').config({ path: '.env.local' });
global.WebSocket = require('ws');
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function test() {
  const { data, error } = await supabase.from('catalog_items').select('name, image_url, is_active').eq('category', 'Women');
  if (error) {
    console.error(error.message);
  } else {
    console.log(data);
  }
}
test();
