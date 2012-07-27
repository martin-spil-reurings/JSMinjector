JSMinjector
===========

Jasmin unit-testing injection scriptlet for running unit-tests in an environment that isn't quite up to the task of being tested stand-alone.

Quick and dirty, add a bookmarklet for (function(hd,h){var s=document.createElement("script");s.src=h+"/lib/injector.js";hd.appendChild(s);})(document.getElementsByTagName("head")[0],"http://martin-spil-reurings.github.com/JSMinjector") to your browser, browse to the page you want to run unit-tests on and run the bookmarklet, it will ask for the location of your specs...
