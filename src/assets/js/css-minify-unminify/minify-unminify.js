const cssEditorCssInput = CodeMirror.fromTextArea(
    document.getElementById('cssInput'),
    {
      mode: 'css',
      lineNumbers: true,
      theme: 'default',
      lint: true,
      lineWrapping: true,
    }
  );
  
  function minifyCSS(input) {
    if (!input) return '';
  
    return input
      // Remove comments (safe)
      .replace(/\/\*[\s\S]*?\*\//g, '')
  
      // Remove whitespace around symbols
      .replace(/\s*([{}:;,>+~])\s*/g, '$1')
  
      // Remove unnecessary semicolons
      .replace(/;}/g, '}')
  
      // Collapse multiple spaces
      .replace(/\s+/g, ' ')
  
      // Remove space before !important
      .replace(/\s*!important/g, '!important')
  
      // Trim
      .trim();
  }
  
  
  function unminifyCSS(input) {
    if (!input) return '';
  
    let output = input
      // Ensure proper spacing before processing
      .replace(/\s*{\s*/g, ' {\n')
      .replace(/\s*}\s*/g, '\n}\n')
      .replace(/\s*;\s*/g, ';\n')
  
      // Fix colon spacing (avoid pseudo selectors)
      .replace(
        /:(?!hover|active|focus|visited|before|after|first-child|last-child|nth-child|not)/g,
        ': '
      )
  
      // Remove extra empty lines
      .replace(/\n\s*\n/g, '\n')
      .replace(/: :/g, '::')
      .replace(/: root/g, ':root')
      .trim();
  
    let indentLevel = 0;
  
    output = output
      .split('\n')
      .map(line => {
        line = line.trim();
  
        // Decrease indent BEFORE applying
        if (line.startsWith('}')) indentLevel--;
  
        const indentedLine =
          '  '.repeat(Math.max(indentLevel, 0)) + line;
  
        // Increase indent AFTER {
        if (line.endsWith('{')) indentLevel++;
  
        return indentedLine;
      })
      .join('\n');
  
    detectNestedBraces(output);
  
    return output;
  }
  
  
  // ✅ Vanilla JS Event Listeners
  document.getElementById('minifyBtn').addEventListener('click', function () {
    const code = cssEditorCssInput.getValue();
    cssEditorCssInput.setValue(minifyCSS(code));
  });
  
  document.getElementById('unminifyBtn').addEventListener('click', function () {
    const code = cssEditorCssInput.getValue();
    cssEditorCssInput.setValue(unminifyCSS(code));
  });
  
  function detectNestedBraces(cssCode) {
    if (!cssCode) return;
  
    let depth = 0;
    let maxDepth = 0;
  
    for (let char of cssCode) {
      if (char === '{') {
        depth++;
        maxDepth = Math.max(maxDepth, depth);
      } else if (char === '}') {
        depth--;
      }
    }
  
    if (maxDepth > 1) {
      console.log('Nested CSS detected (depth:', maxDepth, ')');
    } else {
      console.log('No nested CSS detected');
    }
  }
  
  
  


  var css = `/* =========================
  Global Styles
========================= */

:root {
 --primary-color: #3498db;
 --secondary-color: #2ecc71;
 --font-stack: 'Segoe UI', Arial, sans-serif;
}

*,
*::before,
*::after {
 box-sizing: border-box;
}

/* =========================
  Body & Typography
========================= */

body {
 margin: 0;
 padding: 0;
 font-family: var(--font-stack);
 background: #f5f5f5;
 color: #333;
}

/* =========================
  Container
========================= */

.container {
 width: 90%;
 max-width: 1200px;
 margin: 0 auto;
}

/* =========================
  Navigation
========================= */

.navbar > ul li + li {
 margin-left: 15px;
}

.navbar a:hover,
.navbar a:focus {
 color: var(--primary-color);
}

.navbar a::after {
 content: '';
 display: block;
 width: 0;
 height: 2px;
 background: var(--primary-color);
 transition: width 0.3s ease;
}

.navbar a:hover::after {
 width: 100%;
}

/* =========================
  Buttons
========================= */

.btn {
 padding: 10px 20px;
 border: none;
 cursor: pointer;
}

.btn-primary {
 background: var(--primary-color);
 color: #fff !important;
}

.btn-primary:hover {
 background: #2980b9;
}

/* =========================
  Cards (Nested Example)
========================= */

.card {
 background: #fff;
 padding: 20px;
 border-radius: 5px;

 /* Nested (modern CSS / preprocessor style) */
 .card-title {
   font-size: 20px;
   margin-bottom: 10px;
 }

 .card-content {
   font-size: 14px;
   line-height: 1.5;
 }

 &:hover {
   box-shadow: 0 5px 15px rgba(0,0,0,0.1);
 }
}

/* =========================
  Grid Layout
========================= */

.grid {
 display: grid;
 grid-template-columns: repeat(3, 1fr);
 gap: 15px;
}

/* =========================
  Animation
========================= */

@keyframes fadeIn {
 0% {
   opacity: 0;
 }
 100% {
   opacity: 1;
 }
}

.fade-in {
 animation: fadeIn 1s ease-in-out;
}

/* =========================
  Media Queries
========================= */

@media screen and (max-width: 768px) {
 .grid {
   grid-template-columns: 1fr;
 }

 .navbar {
   display: none;
 }
}

/* =========================
  Complex Selectors
========================= */

ul li:first-child,
ul li:last-child {
 font-weight: bold;
}

input[type="text"]:focus {
 border-color: var(--secondary-color);
}

/* =========================
  Edge Cases
========================= */

/* Comment to be removed */
.box {
 margin: 0px  10px  20px  30px ;
 padding : 10px ;
 background : url("image.png") no-repeat center center / cover ;
}`;
//$("#cssInput").val(css);
cssEditorCssInput.setValue(css);



document.getElementById('clearCSSBtn').addEventListener('click', function () {
    cssEditorCssInput.setValue('');
  });
  
  document.getElementById('copyCSSBtn').addEventListener('click', function () {
    const code = cssEditorCssInput.getValue();
  
    if (!code) return;
  
    // Modern clipboard API
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(code)
        .then(() => console.log('Copied to clipboard'));
    } 
  });
  