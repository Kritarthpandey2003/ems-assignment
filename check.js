const https = require('https');
https.get('https://ems-assignment.vercel.app/login', (res) => {
  let html = '';
  res.on('data', d => html += d);
  res.on('end', () => {
    const match = html.match(/src="(\/_next\/static\/chunks\/app\/login\/page-[^"]+\.js)"/);
    if(match) {
      https.get('https://ems-assignment.vercel.app' + match[1], (res2) => {
        let js = '';
        res2.on('data', d => js += d);
        res2.on('end', () => {
          if(js.includes('localhost:5000')) console.log('FOUND LOCALHOST');
          else if(js.includes('ems-assignment-oszn.onrender.com')) console.log('FOUND RENDER');
          else console.log('UNKNOWN');
        });
      });
    } else {
      console.log('no match');
    }
  });
});
