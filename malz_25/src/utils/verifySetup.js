export async function verifySetup() {
  const checks = {
    supabase: false,
    auth: false,
    database: false,
    storage: false,
  }

  try {
    // Check Supabase connection
    const { data, error } = await supabase.from('profiles').select('count')
    checks.supabase = !error

    // Check auth
    const { data: session } = await supabase.auth.getSession()
    checks.auth = true

    // Check database access
    const { data: houses } = await supabase
      .from('boarding_houses')
      .select('count')
    checks.database = true

    // Check storage
    const { data: buckets } = await supabase.storage.listBuckets()
    checks.storage = true

    console.log('Setup verification:', checks)
    return checks
  } catch (error) {
    console.error('Setup verification failed:', error)
    return checks
  }
} 