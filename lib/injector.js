var JSMinjector = (function (w, b){

    var key = "JSMInjector.specs.host";

    var hd = document.getElementsByTagName("head")[0],
        hl = ""; //Library host,
        loc = w.location,
        hc = loc.protocol + "//" + loc.hostname + (loc.port?":" + loc.port:""), //Code host
        hs = localStorage.getItem( key ),
        scriptsQueue = [];
    
    if (true) {

    	//Find script root, and determine library location.
    	var scripts = hd.getElementsByTagName("script");
    	for ( var l = scripts.length; l--; ) {

    		var scr = scripts[l];

    		if ( scr && scr.src.indexOf("/lib/injector.js") >= 0 ) {

    			var src = scr.src;
    			var q = src.indexOf("?");
    			hl = decodeURIComponent( src.slice( q + 1, ( ( q < 0 )?src.indexOf( "/lib/injector.js" ):src.length ) ) );
                console.log( "Fetching lib from: ", hl );
                break;

    		}
    	}

    	//Find out where to load test scripts from, check for existing localStorage, else propose location and prompt...
    	if ( typeof hs !== "string" || JSON.stringify( hs ) === JSON.stringify( null ) ) {

    		hs = prompt( "Please provide a path to your tests for this domain.", hc + "/tests" );
    		localStorage.setItem( key, hs );

    	}

    }

    /**
     * Add a script tag to the page. Any parent can be provided, if none provided
     * the script will be added to the 'head'. Also by default the async property
     * will be set to false, over-ride can of course be provided...
     * 
     * @argument {String}  src     The source-path of the string
     * @argument {Node}    target  The parent-node to which to append the script, default is 'head'
     * @argument {boolean} async   The async property, default is false
     * @argument {boolean} before  Whether to add the end or start of queue, default 'false' (end of queue)
     */    
    function addScript( src, target, async, before ) {
        var t = target||hd,
            s = document.createElement("script"),
            as = (typeof async === "undefined")?false:async;
        s.setAttribute("src", src);
        if ( as ) {
            t.appendChild(s);
        } else {
        	var scr = { script:s, parent: t };
	        if ( before ) {

                //Prepend script to queue
	        	scriptsQueue.unshift( scr );

	        } else {

                //Append the script to our queue
	           scriptsQueue.push( scr );

	        }
        }
        return s;
    }
    
    function addCSS( src ) {
        var l = document.createElement("link");
        l.setAttribute("rel", "stylesheet");
        l.setAttribute("type", "text/css");
        l.setAttribute("href", src);
        
        hd.insertBefore(l, hd.firstChild);
    }
    
    function loadScriptsQueue( queue ) {

    	if ( queue && queue.length ) {

    	   var scr = queue.shift(); //Take of the first element
    	   scr.script.onload = function() {
    	   	   //Next!!
    	       loadScriptsQueue( queue );
    	   };
    	   
    	   scr.parent.appendChild( scr.script );

    	}

    }
    
    var lib = hl + "/lib/jasmine-1.2.0";
    
    //Add Jasmine to the page
    addCSS( lib + "/jasmine.css" );
    addScript( lib + "/jasmine.js" );
    addScript( lib + "/jasmine-html.js" );

    //Add specs to the page
    addScript( hs + "/specs.js", b );
    
    //Run Jasmine
    addCSS( hl + "/lib/customised.css" );
    addScript( lib + "/setup.js", b );
    
    loadScriptsQueue( scriptsQueue );

    var publicAccess = {
    	
    	locations: {

    		lib:      lib,
    		injector: hl,
    		tests:    hs

    	},
    	
    	addCSS: addCSS,

        addScript: addScript,
        
        addSpecs: function( specs ) {

        	for (var i = 0, spec = specs[i]; i < specs.length; spec = specs[i++]) {

                //Injecting at the start of the queue to load the specs before the setup.
        		addScript( hs + spec, b, false, true );

        	}

        }

    };
    
    return publicAccess;

})(window, document.body);
