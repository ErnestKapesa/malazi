const fs = require('fs')
const path = require('path')

function checkEnv() {
  const envPath = path.join(process.cwd(), '.env')
  
  if (!fs.existsSync(envPath)) {
    console.error('❌ .env file not found!')
    process.exit(1)
  }

  const envContent = fs.readFileSync(envPath, 'utf8')
  const requiredVars = ['VITE_SUPABASE_URL', 'VITE_SUPABASE_ANON_KEY']
  const missingVars = []

  requiredVars.forEach(varName => {
    if (!envContent.includes(varName)) {
      missingVars.push(varName)
    }
  })

  if (missingVars.length > 0) {
    console.error('❌ Missing environment variables:', missingVars.join(', '))
    process.exit(1)
  }

  console.log('✅ Environment variables verified')
}

checkEnv() 