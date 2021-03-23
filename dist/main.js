const scripts = [
  'global',
  'sidebar',
  'toggle'
]

scripts.forEach((script) => {
  require(script)
});

// FUNCTIONS
function require(src) {  
  const script = document.createElement('script');
  // script.type = 'module';
  script.src = '../src/assets/js/' + src + '.js';
  document.body.appendChild(script);
}