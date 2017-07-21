
        <h1>JSBCL <small>v1.0.0 documentation</small></h1>
        <hr>
        <h2>JavaScript Bootstrapped Compression Library</h2>
        
        <h3>Table Of Contents</h3>
        <ul>
            <li><a href="#about">About</a></li>
            <li><a href="#download">Download</a></li>
            <li><a href="#setting-up">Setting Up</a></li>
            <li><a href="#getting-data">Getting Data</a></li>
            <li><a href="#request-json">Making a request For JSON</a></li>
            <li><a href="#request-text">Making a request for TEXT/HTML Files.</a></li>

        </ul>
        
        <hr>
        <a name="about"></a>
        
        <h3>About JSBCL</h3>
        
        <p>JSBCL short for <strong>J</strong>avaScript <strong>B</strong>ootstrapped <strong>C</strong>ompression <strong>L</strong>ibrary, JSBCL is a collection of scripts designed to allow developers easy implementation of compressed archives directly in the browser.
        
        <p>JSBCL currently uses LZMA (Lempel–Ziv–Markov chain Algorithm) format as it's base compression format, developers can implement this advanced compression format, with a few lines of code.
         
        <h3>Setting Up</h3>
        <a name='setting-up'></a>
        <h4>Adding Your Own Scripts</h4>
        <p>You can add your own scripts in the release and debug directories, files stored in the js/release directory MUST be compressed with LZMA format and MUST only contain one file and end in the .js.lzma extension all lowercase.</p>
        <p>Thus files stored in the js/debug directory are uncompressed and generally not minified, to aid autocompletion of your ide.</p>
        <p>file: <strong>public_html/js/init.js</strong></p>
        
        <p></p>
        <pre>
                this.requires = {
                    /* debug/release - these two objects must match */
                    debug:      new Array(
                        "js/debug/app.js"
                    ), 

                    release:    new Array(
                        "js/release/app.js.lzma",
                    ),

                },

        </pre>
        
        <h4>Release/Debug</h4>
        <p>Switching from debug to release when you have completed your project your LZMA compressed scripts should be stored in the release directory this is where the magic takes place </p>
        <p>change this.debug to true or false depending if you are using compressed or decompressed files</p>
        
        <p>file: <strong>public_html/js/init.js</strong></p>
        <pre>
            this.debug = true,  /* which files to load */
        </pre>
        
        <p>Make sure you add at least one object from each file to the if condition below, this will make sure all files have been added before the application continues. Use the || operator.</p>
        <p>NOTE: if you don't do this correctly your application will break</p>
        
        <p>file: <strong>public_html/js/init.js</strong></p>
        <pre>
            
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
        </pre>
        
        <a name="getting-data"></a>
        <h3>Getting Data</h3>
        
        <p>This section dives into the details of the framework</p>
        
        <a name="request-json"></a>
        <h4>Making a request For JSON</h4>

        <p>
        To make a request for a compressed JSON file store it in the arc directory, this is NOT required, JSON files MUST have the .json.lzma file extension for this to work. You can make a request using the following code assuming the file is stored in the appropriate directory or served by some dynamic means.
        </p>
        
        <pre>
            window.loadJSBinary("/arc/jsonTest.json.lzma",'testJson');
        </pre>
        
        <p>
            To get JSON you MUST pass the URL followed by the NAME string which you will need later to retrieve the data as an object. The data retrieved from this line for code will be inserted into the window.json object you can access this object by typing window.json.testJson.
        </p>
        
        <p>
            This JSON data will not be avaliable instantly, you must wait untill it has been loaded using the following function.
        </p>
        
        <pre>
            window.jsonDone(['testJson'], window.calledWhenDone);
        </pre>
        
        <p>
            This function accepts a Array of JSON NAME to test if available as defined previously, The second argument is a function callback which will be executed once complete for example.
        </p>
        
        <pre>
                window.calledWhenDone = function(){
                    console.log(window.json.testJson);
                }
        </pre>
        
        <p>window.json.testJson would be the JSON Object you named above, all JSON Objects you get through loadJSBinary will be added to window.json</p>

        <a name="request-text"></a>
        <h4>Making a request for TEXT/HTML Files.</h4>
        
        <p>
        To make a request for a TEXT file use the following code
        </p>
        
        <pre>
                window.loadText("arc/documentation.html.lzma",".doc", window.const.method.APPEND);
        </pre>
        
        <p>
            This function accepts several parameters the first parameter is the path of the archive, a single compressed file in plain text format using .lzma extension, The second parameter is the selector used to insert the data into and the final parameter is the METHOD of insertion witch currently supports "APPEND", "PREPEND" or you can use the strings stored in window.const.method witch is optional default to "APPEND".
        </p>
            
        <h3>Download</h3>
        <a name="download" href='jsbcl-v1.0.0.tar.bz2'>jsbcl-v1.0.0.tar.bz2</a>
        
        <hr>
