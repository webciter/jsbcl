/**
 *    JSBCL - JavaScript Bootstrapped Compression Library
 *    
 *    This program is free software: you can redistribute it and/or modify
 *    it under the terms of the GNU General Public License as published by
 *    the Free Software Foundation.
 *
 *    This program is distributed in the hope that it will be useful,
 *    but WITHOUT ANY WARRANTY; without even the implied warranty of
 *    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *    GNU General Public License for more details.
 *
 *    You should have received a copy of the GNU General Public License
 *    along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 *
 * @license GNU General Public License v3, https://www.gnu.org/licenses/gpl.html
 * @version 1.0.0
 * @author  David Clews
 * @updated 20-07-2017
 * @link    https://webciter.com/jsbcl/1.0.0/
 *
 *
 */

window.onload = function(e){
    
    this.debug = true,  /* which files to load */
    
    this.requires = {
        /* debug/release - these two objects must match */
        debug:      new Array(
            "js/debug/app.js"
        ), 

        release:    new Array(
            "js/release/app.js.lzma",
        ),
                
    },
    
    
    /* jquery plugin */
    $.getMultiScripts = function(arr, path) {
        var _arr = $.map(arr, function(scr) {
            return $.getScript( (path||"") + scr );
        });

        _arr.push($.Deferred(function( deferred ){
            $( deferred.resolve );
        }));

        return $.when.apply($, _arr);
    }
    
    this.json = new Array();
    
    
    this.const = {  
        type: {
            JAVASCRIPT: "JAVASCRIPT",
            TEXT: "TEXT",
        },
        method: {
            APPEND: "append", /* translates to jquery function append */
            PREPEND: "prepend",
            ATTRIBUTE: "attr",
            PARSEJSON: "parseJSON",
            GLOBALEVAL: "globalEval"
        },
        
    },
            
    this.jsDone = 0, /* incrementing variable for number of js files loaded */

    this.jsMax = this.requires.release.length, /* used for the progress bar */
            
    this.loadJS = function(files){
        /* loads an array of uncompress js files */
        return $.getMultiScripts(files);
        
    },
            
    this.requestBinary = function(file){
        var jqxhr = $.ajax({
            url: file,
            type: "GET",
            dataType: "binary",
            responseType:'arraybuffer',
            processData: false,
        });
        
        return jqxhr;
    },
            
    this.loadJSBinary = function(file, name = ''){
        jqxhr = window.requestBinary(file);
        
        jqxhr.done(function(data){
            if(file.substr(-8) === '.js.lzma'){
                window.lzma.decompress(data, window.const.type.JAVASCRIPT, '', window.const.method.GLOBALEVAL);
            }else if(file.substr(-10) === '.json.lzma'){
                window.lzma.decompress(data, window.const.type.JAVASCRIPT, '', window.const.method.PARSEJSON, name);
            }else{
                /* regular js file */
                window.loadJS([file]);
            }
        });
    },
            
    this.loadText = function(file, selector, method){
        
        jqxhr = window.requestBinary(file, selector);
        
        jqxhr.done(function(data){
            if(file.substr(-5) === '.lzma'){
                window.lzma.decompress(data, window.const.type.TEXT, selector, method);
            }else{
                
            }
        });
        
    },
            
    this.lzma = { 
        decompress: function(byteArray, type, selector = ".text", method = "append", name = 'ss'){
            switch(type){
                case window.const.type.JAVASCRIPT:
                    if(method === window.const.method.PARSEJSON){
                        window.lzma._decompressJavascript(byteArray, method, name); /* parse json string insert into variable */
                    }else if(method === window.const.method.GLOBALEVAL){
                        window.lzma._decompressJavascript(byteArray, method); /* run in global scope */
                    }
                    break;
                case window.const.type.TEXT:
                    window.lzma._decompressText(byteArray, selector, method);
                    break;                 
            }
                
        },
        _decompress: function(byteArray){

            var view = new jDataView(byteArray);
            var int_arr = new Array;

            while (view.tell() < view.length) {
                int_arr.push(view.getUint8(view.tell()));
            }
            
            return int_arr;
        },
        _decompressText: function(byteArray, selector, method){

            int_arr = this._decompress(byteArray);
            
            function onTextFinished(result, error){
                $(selector)[method](result);

            }
            
            function onTextProgress(progress){
                
            }
            
            window.lzma_worker.decompress(int_arr, onTextFinished, onTextProgress);
            
        },
        _decompressJavascript: function(byteArray, method, name){

            int_arr = this._decompress(byteArray);
            window.lzma_worker.decompress(int_arr, onJavaScriptFinished, onJavaScriptProgress);
            method = method;
            name = name;
            function onJavaScriptFinished(result, error){
                switch(method){
                    case window.const.method.GLOBALEVAL:
                        $.globalEval(result); // Works
                        window.jsDone +=1;
                        break;
                    case window.const.method.PARSEJSON:
                        
                        var tmp = {[name]: $.parseJSON(result)};
                        
                        window.json = Object.assign(window.json, tmp);
                        
                        break;
                }

            }
            
            function onJavaScriptProgress(progress){
                
            }
        },

        /* generic onfinished */
        onTextFinished: function(result, error, extra){
        },
        /* generic onerror */
        onError: function(progress){
            $("body").append(progress);
        },
    
    }
    
    /* load lzma compression libraries */
    this.loadJS(["js/lzma.js","js/jquery.plugins.collective.min.js"]).done(function(){
        
        /* init lzma worker async processing */
        window.lzma_worker = new LZMA('js/lzma_worker-min.js');

        if(window.debug === false){
            for(i = 0; i < window.requires.release.length; i++){
                /* Compressed Release Files */
                window.loadJSBinary(window.requires.release[i]);
            }
        }else{
            /* Debug Uncompressed Files */
            for(i = 0; i < window.requires.debug.length; i++){
                window.loadJSBinary(window.requires.debug[i]);
            }
        }

    });
    
    /* check if loaded */
    this.initTimer = setInterval(function(){
            /* Make sure all new scripts are added to the loader */
            if(
                    typeof window.app === 'undefined'
                    ){
                
            }else{
                start(this.initTimer);
            }
        }
    , 300);
    
    /* make sure all files are completed */
    this.jsonDone = function(names, doneCallback){
    
        var checkExist = setInterval(function() {
        
        items = [];
        for(i=0;i<names.length;i++){
            items.push(typeof window.json[names[i]]);
                
                if(items.every(window.checkUndefined)){
                    clearInterval(checkExist);
                    doneCallback();
                }else{
                    
                }
        }
        }, 100); 

    }
    
    /* */
    window.checkUndefined = function(val) {
        return val !== 'undefined';
    }

}

function start(timer){
    clearInterval(timer);
    app();
}


