const fs = require('fs');
const path = require('path');

const mockupsDir = 'Proyecto-Final/docs/mockups';
const appDir = 'Proyecto-Final/frontend/pqrs-app/src/app';

const mappings = [
  { mockup: 'mockup-mobile-detalle.html', dest: 'mobile/detalle/detalle.page.html' },
  { mockup: 'mockup-mobile-historial.html', dest: 'mobile/historial/historial.page.html' },
  { mockup: 'mockup-mobile-login.html', dest: 'mobile/login/login.page.html' },
  { mockup: 'mockup-mobile-radicar.html', dest: 'mobile/radicar/radicar.page.html' },
  { mockup: 'mockup-web-dashboard.html', dest: 'web/dashboard/dashboard.page.html' },
  { mockup: 'mockup-web-login.html', dest: 'web/login/login.page.html' },
  { mockup: 'mockup-web-tramite.html', dest: 'web/tramite/tramite.page.html' }
];

mappings.forEach(mapping => {
  const mockupPath = path.join(mockupsDir, mapping.mockup);
  const destPath = path.join(appDir, mapping.dest);
  
  if (fs.existsSync(mockupPath) && fs.existsSync(destPath)) {
    let content = fs.readFileSync(mockupPath, 'utf8');
    
    // Extract everything inside <body class="..."> and </body>
    const bodyMatch = content.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
    if (bodyMatch) {
      content = bodyMatch[1];
    }
    
    // Replace SVGs without width/height
    content = content.replace(/<svg([^>]+)>/g, (match, attrs) => {
      let newAttrs = attrs;
      if (!/width=/.test(newAttrs)) newAttrs += ' width="24"';
      if (!/height=/.test(newAttrs)) newAttrs += ' height="24"';
      return `<svg${newAttrs}>`;
    });
    
    // Wrap with ion-content
    // Basic heuristic to replace outer div wrappers with Ionic components
    // If it's a mobile view, we should add ion-header and ion-content
    if (mapping.dest.includes('mobile')) {
      // Find header
      const headerMatch = content.match(/<header[^>]*>([\s\S]*?)<\/header>/i);
      let headerStr = '';
      if (headerMatch) {
         headerStr = `<ion-header class="ion-no-border">\n  <ion-toolbar class="bg-primary text-white" style="--background: #D81B60; --color: white;">\n    <ion-title class="text-xl font-bold">App</ion-title>\n  </ion-toolbar>\n</ion-header>\n`;
         content = content.replace(headerMatch[0], '');
      }
      content = `${headerStr}\n<ion-content [fullscreen]="true" style="--background: #f3f4f6;">\n${content}\n</ion-content>`;
    } else {
      content = `<ion-content [fullscreen]="true" style="--background: #f3f4f6;">\n${content}\n</ion-content>`;
    }
    
    fs.writeFileSync(destPath, content, 'utf8');
    console.log(`Updated ${destPath}`);
  }
});
