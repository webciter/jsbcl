function app(){
    /* start your application here */
    
    /* please read the documentation http://webciter.com/jsbcl/ */
    
    /* jQuery Test Code */
    if (window.jQuery) {  
        console.log("jQuery Loaded");
    } else {
        console.log("jQuery Doesn't Work");
    }
    
    window.loadJSBinary("/arc/jsonTest.json.lzma",'testJson');
    
    window.jsonDone(['testJson'], window.calledWhenDone);
    
    window.loadText("arc/decompressionTest.txt.lzma",".ipsum");

}

    window.calledWhenDone = function(){
        console.log(window.json.testJson);
    }
    
    