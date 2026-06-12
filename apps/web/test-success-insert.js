const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://xabqepxryyzxzcutwtsk.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhhYnFlcHhyeXl6eHpjdXR3dHNrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MTE1OTg1MiwiZXhwIjoyMDk2NzM1ODUyfQ.-oFWLRQ32Kbqnsdeog7hGlB52FDN0HI_ut9IHOewnf4';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function testSuccessInsert() {
  try {
    const res = await supabase
      .from('orders')
      .insert({
        customer_name: 'Success Test Client',
        status: 'picked_up',
      })
      .select()
      .single();
    
    console.log('Success insert response:', res);
  } catch (err) {
    console.error('Unexpected error:', err);
    process.exit(1);
  }
}

testSuccessInsert();
