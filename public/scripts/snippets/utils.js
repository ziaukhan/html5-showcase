

( function NamespaceDefiner() {
    "use strict";

    window.util = window.util || {};       //defining NameSpace
    window.util.namespace = namespace;
    window.util.Accessor = Accessor;

    window.util.defineClass = defineClass;

	window.util.Promise = Promise;

    window.util.ArrayIndexOf = ArrayIndexOf;
    window.util.ArrayListOf = ArrayListOf;

    window.util.generateElementID = generateElementID;


    function generateElementID() {
        // always start with a letter (for DOM friendlyness)
        var idstr = String.fromCharCode( Math.floor(( Math.random() * 25 ) + 65 ) );
        do {
            // between numbers and characters (48 is 0 and 90 is Z (42-48 = 90)
            var ascicode = Math.floor(( Math.random() * 42 ) + 48 );
            if ( ascicode < 58 || ascicode > 64 ) {
                // exclude all chars between : (58) and @ (64)
                idstr += String.fromCharCode( ascicode );
            }
        } while ( idstr.length < 8 );


        return ( idstr );
    }



    function defineClass( constructor, prototypes, instanceAttributes, staticAttributes ) {
        instanceAttributes = instanceAttributes || {};
        prototypes = prototypes || {};
        staticAttributes = staticAttributes || {};

        constructor.parentClass = function () { };

        function Class() {
            constructor.parentClass.apply( this, arguments );
            constructor.apply( this, arguments );
            for ( var i in instanceAttributes ) {
                this[i] = instanceAttributes[i];
            }
        };
        Class.prototype = Object.create( prototypes );
        constructor.prototype = Object.create( prototypes );
        Class.prototype.constructor = constructor;
        constructor.prototype.constructor = constructor;

        for ( var i in staticAttributes ) {
            Class[i] = staticAttributes[i];
        }

        Class.inherit = function ( parentClass ) {
            if ( typeof parentClass == "function" ) {
                constructor.parentClass = parentClass;
                var oldPrototypes = this.prototype;
                this.prototype = Object.create( parentClass.prototype );
                for ( var i in oldPrototypes ) {
                    this.prototype[i] = oldPrototypes[i];
                }
                this.prototype.parentConstructor = parentClass;
            }
        }

        return Class;
    }

    // name contains the label of namespace, seperated by dot for attributing, e.g: computer.keyboard.button
    // object contains attributes to define inside namespace
    function namespace( name, object ) {
        //if ( !/[\w$_]*(\..+[^\.]$)?/.test( name ) ) throw new Error( "UnExpected Naming", "UnExpected Naming" );

        var attrs = name.split( "." );
        if ( attrs[attrs.length - 1] == "" ) throw new Error( "Incomplete Naming on " + name, "Incomplete Naming on " + name );

        var currentObject = window[attrs[0]] = window[attrs[0]] || {};
        attrs.shift();
        attrs.forEach( function ( attr ) {
            try{
                currentObject[attr] = currentObject[attr] || {};
            }
            catch ( e ) {
	            console.log( "cannot create " + attr + " from " + name );
                throw new Error( "Namespace Allready aquired by a non-object", "Namespace Allready aquired by non-object" );
            }
            currentObject = currentObject[attr];
        } );
        for ( var i in object ) {
            try {
                if ( typeof object[i] == "object" && object[i] instanceof Accessor ) {
                    Object.defineProperty( currentObject, i, object[i]._accessorProperty );
                } else {
                    currentObject[i] = object[i];
                }
            }
            catch ( e ) {
	            console.log( "cannot create " + i + " from " + name );
                throw new Error( "Namespace Allready aquired by a non-object", "Namespace Allready aquired by non-object" );
            }
        }
    }

    function Accessor(getter, setter) {
        this._accessorProperty = { get: getter };
        if ( setter instanceof Function ) {
            this._accessorProperty.set = setter;
        }
    }

	// ---- context is the context will found in every then ----
	function Promise( worker, context ) {
		var that = this;
		this._thens = [];

		function success( ) {
			var args = arguments;
			for (var i = 0; i < that._thens.length; i++) {
				args = [that._thens[i].success.apply( context, args )];
				that._thens.splice( i--, 1 );
			}
		}
		function failure( ) {
			var args = arguments;
			for ( var i = 0; i < that._thens.length; i++ ) {
				args = [that._thens[i].failure.apply( context, args )];
				that._thens.splice( i--, 1 );
			}
		}
		setTimeout( function () {
			worker.call( context, success, failure );
		}, 0 );
		this.resolve = success;
		this.reject = failure;
	}

	Promise.prototype.then = function ( success, failure ) {
		if ( success instanceof Function ) {
			if ( !(failure instanceof Function) ) {
				failure = function ( arg ) { return arg; };
			}
			this._thens.push( { success: success, failure: failure } );
		}
		return this;
	}


    // **************--- helping Methods ---************** \\
    // *************************************************** \\
    function ArrayIndexOf(a, fnc) { //http://blog.webonweboff.com/2010/05/javascript-search-array-of-objects.html
        if (!fnc || typeof (fnc) != 'function') {
            return -1;
        }
        if (!a || !a.length || a.length < 1) return -1;
        for (var i = 0; i < a.length; i++) {
            if (fnc(a[i])) return i;
        }
        return -1;
    }

    function ArrayListOf(a, fnc) {
        var selected = [];
        if (!fnc || typeof (fnc) != 'function') {
            return selected;
        }
        if (!a || !a.length || a.length < 1) return selected;
        for (var i = 0; i < a.length; i++) {
            if (fnc(a[i])) selected.push(a[i]);
        }
        return selected;
    }

} )();


