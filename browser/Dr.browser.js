var script_element = document.getElementsByTagName('script')[0];
var callback = script_element.onload;
script_element.onload = null;

console.log('[Dr.browser] Redirect to "../Dr.browser.js"');
// redirect
Dr.loadLocalScript('../Dr.browser.js', callback);