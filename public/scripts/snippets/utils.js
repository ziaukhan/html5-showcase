
( function NamespaceDefiner() {
    "use strict";

    window.util = window.util || {};       //defining NameSpace
    window.util.namespace = namespace;
    window.util.Accessor = Accessor;

    window.util.defineClass = defineClass;
    window.util.ArrayIndexOf = ArrayIndexOf;
    window.util.ArrayListOf = ArrayListOf;

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
    // **************--- Core Methods ---************** \\
    // ************************************************* \\
    

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


