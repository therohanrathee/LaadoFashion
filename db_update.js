const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function run() {
  const { data, error } = await supabase.from('catalog_items').select('*');
  if (error) {
    console.error(error);
    return;
  }

  for (const item of data) {
    if (item.image && item.image.includes('.webp')) {
      const newImage = item.image.replace('.webp', '.png');
      await supabase.from('catalog_items').update({ image: newImage }).eq('id', item.id);
      console.log(`Updated ${item.name} image to ${newImage}`);
    }
  }
  console.log("Database extensions updated successfully");
}

run();
