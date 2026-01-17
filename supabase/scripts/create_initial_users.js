/**
 * Script to create initial users in Supabase
 * Run this using Node.js: node supabase/scripts/create_initial_users.js
 * 
 * Make sure to set these environment variables:
 * - NEXT_PUBLIC_SUPABASE_URL
 * - SUPABASE_SERVICE_ROLE_KEY (for admin operations)
 */

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Error: Missing required environment variables');
  console.error('Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

// Use service role key for admin operations
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function createInitialUsers() {
  console.log('Creating initial users...\n');

  // Create client user
  try {
    console.log('Creating client user (client@gmail.com)...');
    const { data: clientAuth, error: clientAuthError } = await supabase.auth.admin.createUser({
      email: 'client@gmail.com',
      password: '27102006',
      email_confirm: true, // Auto-confirm email
      user_metadata: {
        full_name: 'Client User',
        user_type: 'client'
      }
    });

    if (clientAuthError) {
      if (clientAuthError.message.includes('already registered')) {
        console.log('⚠️  Client user already exists, skipping...');
      } else {
        throw clientAuthError;
      }
    } else {
      console.log('✅ Client user created successfully');
      
      // Insert into users table
      const { error: clientUserError } = await supabase
        .from('users')
        .upsert({
          id: clientAuth.user.id,
          email: 'client@gmail.com',
          full_name: 'Client User',
          restaurant_name: 'Client Restaurant',
          is_active: true
        });

      if (clientUserError) {
        console.error('❌ Error inserting client into users table:', clientUserError);
      } else {
        console.log('✅ Client inserted into users table');
      }
    }
  } catch (error) {
    console.error('❌ Error creating client user:', error.message);
  }

  console.log('\n');

  // Create admin user
  try {
    console.log('Creating admin user (leanmaximsada@gmail.com)...');
    const { data: adminAuth, error: adminAuthError } = await supabase.auth.admin.createUser({
      email: 'leanmaximsada@gmail.com',
      password: 'Max27102006',
      email_confirm: true, // Auto-confirm email
      user_metadata: {
        full_name: 'Admin User',
        user_type: 'admin'
      }
    });

    if (adminAuthError) {
      if (adminAuthError.message.includes('already registered')) {
        console.log('⚠️  Admin user already exists, skipping...');
      } else {
        throw adminAuthError;
      }
    } else {
      console.log('✅ Admin user created successfully');
      
      // Insert into admins table
      const { error: adminUserError } = await supabase
        .from('admins')
        .upsert({
          id: adminAuth.user.id,
          email: 'leanmaximsada@gmail.com',
          full_name: 'Admin User',
          role: 'admin',
          is_active: true
        });

      if (adminUserError) {
        console.error('❌ Error inserting admin into admins table:', adminUserError);
      } else {
        console.log('✅ Admin inserted into admins table');
      }
    }
  } catch (error) {
    console.error('❌ Error creating admin user:', error.message);
  }

  console.log('\n✅ Initial users setup complete!');
}

createInitialUsers();
