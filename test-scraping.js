// Test scraping locally
fetch('http://localhost:8080/api/enrich-company', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    orgNumber: '559001-4484',
    companyName: 'Spotify',
    website: 'https://spotify.com',
    industry: 'tech'
  })
})
.then(r => r.json())
.then(data => {
  console.log('\n✅ SCRAPING RESULTS:')
  console.log('==================')
  console.log('Auto-fill data:', JSON.stringify(data.autoFill, null, 2))
  console.log('\nAllabolag:', data.rawData?.allabolagData ? '✓ Found' : '✗ Not found')
  console.log('Ratsit:', data.rawData?.ratsitData ? '✓ Found' : '✗ Not found')
  console.log('Proff:', data.rawData?.proffData ? '✓ Found' : '✗ Not found')
  console.log('LinkedIn:', data.rawData?.linkedinData ? '✓ Found' : '✗ Not found')
  console.log('Google:', data.rawData?.googleMyBusinessData ? '✓ Found' : '✗ Not found')
  console.log('Trustpilot:', data.rawData?.trustpilotData ? '✓ Found' : '✗ Not found')
})
.catch(err => console.error('Error:', err))
