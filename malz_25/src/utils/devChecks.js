export const runDevChecks = () => {
  // Check environment variables
  const requiredEnvVars = [
    'VITE_SUPABASE_URL',
    'VITE_SUPABASE_ANON_KEY'
  ]

  const missingVars = requiredEnvVars.filter(
    varName => !import.meta.env[varName]
  )

  if (missingVars.length > 0) {
    console.error('❌ Missing environment variables:', missingVars)
    return false
  }

  // Check required dependencies
  const requiredDeps = [
    '@supabase/supabase-js',
    '@chakra-ui/react',
    'react-router-dom'
  ]

  try {
    requiredDeps.forEach(dep => require.resolve(dep))
  } catch (error) {
    console.error('❌ Missing dependencies:', error.message)
    return false
  }

  console.log('✅ Development checks passed')
  return true
} 