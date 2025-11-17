const https = require('https');

/**
 * Check robots.txt for domain.com.au
 */

https.get('https://www.domain.com.au/robots.txt', (res) => {
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('📋 domain.com.au robots.txt:\n');
    console.log('='.repeat(60));
    console.log(data);
    console.log('='.repeat(60));
    
    // Analyze the content
    if (data.includes('User-agent: *')) {
      console.log('\n✅ robots.txt found');
    }
    
    if (data.includes('Disallow: /')) {
      console.log('⚠️  WARNING: Some paths are disallowed');
    }
    
    if (data.includes('Allow:')) {
      console.log('✅ Some paths are explicitly allowed');
    }
    
    if (data.includes('Crawl-delay:')) {
      const delayMatch = data.match(/Crawl-delay:\s*(\d+)/i);
      if (delayMatch) {
        console.log(`⏱️  Crawl delay specified: ${delayMatch[1]} seconds`);
      }
    }
  });
}).on('error', (error) => {
  console.error('❌ Error fetching robots.txt:', error.message);
});

