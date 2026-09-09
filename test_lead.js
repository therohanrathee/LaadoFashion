const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
async function run() {
  const { error, data } = await supabase.from('leads').insert([{
    name: 'Test',
    phone: '123',
    requirements: 'test',
  }]);
  console.log(error);
}
run();
