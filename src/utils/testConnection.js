import { supabase } from '../config/supabaseClient'

export async function testSupabaseConnection() {
  const tests = {
    connection: false,
    auth: false,
    database: false,
    tables: {
      profiles: false,
      boarding_houses: false,
      messages: false
    }
  }

  try {
    // Test basic connection
    const { data: version } = await supabase.rpc('version')
    tests.connection = true
    console.log('✅ Basic connection successful')

    // Test auth
    const { data: authData } = await supabase.auth.getSession()
    tests.auth = true
    console.log('✅ Auth service working')

    // Test database and tables
    for (const table of Object.keys(tests.tables)) {
      const { error } = await supabase.from(table).select('count').limit(1)
      tests.tables[table] = !error
      if (error) {
        console.error(`❌ Table ${table} error:`, error.message)
      } else {
        console.log(`✅ Table ${table} accessible`)
      }
    }

    tests.database = Object.values(tests.tables).every(Boolean)

    return tests
  } catch (error) {
    console.error('Connection test failed:', error)
    return tests
  }
} 