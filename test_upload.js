require('dotenv').config({ path: '.env.local' });
global.WebSocket = require('ws');
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function test() {
  const { data, error } = await supabase.storage.from('catalog').upload('test.txt', 'hello', { upsert: true });
  if (error) {
    console.error("Bucket doesn't exist or error:", error.message);
  } else {
    console.log("Success!", data);
  }
}
test();
