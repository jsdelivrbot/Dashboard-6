      function main() {
        var xobj = new XMLHttpRequest() || new ActiveXObject('MSXML2.XMLHTTP');
	xobj.overrideMimeType("application/json");
        xobj.open('GET', 'config.json', true);
	xobj.onreadystatechange = function() {
	  if(xobj.status == 404) {
            console.log('config.json missing');
	  }
	  
	  if(xobj.readyState == 4) {
            loadPlugins(JSON.parse(xobj.responseText));
	  }
        }
        xobj.send(null);
      }

      function loadPlugins(config) {
        var plugins = "Working plugins: \n";
        
	//For each plugin in config.json, get its name and validate it and then load it
	for(var key in config) {
	  if(config.hasOwnProperty(key) && validatePlugin(key,config[key])) {
	    plugins += key + ' ';
	  }
	}
      }

      function validatePlugin(pluginName, pluginValue) {
        if(pluginValue == false) {
	  console.log(pluginName + " is not enabled");
          return false;
        }
        
        var error = false;

        var xobj = new XMLHttpRequest() || new ActiveXObject('MSXML2.XMLHTTP');
        xobj.overrideMimeType("application/json");
        xobj.open('GET', 'plugins/' + pluginName + '/' + pluginName + '.json', true);
        xobj.onreadystatechange = function() {          
          if(xobj.status == 404) {
            console.log(pluginName + ' is missing a config file');
            error = true;
     	    return;
	  }

	  if(xobj.readyState == 4) {
	    var pluginConfig = JSON.parse(xobj.responseText);
            var checkCounter = 0;
	    for(var key in pluginConfig) {
              if(pluginConfig.hasOwnProperty(key)) {
	        if(key == 'name' || key == 'version' || key == 'license' || key == 'author' || key == 'description' || key == 'settings') {
                  checkCounter++; 
                }
	      }
	    }

	    if(checkCounter == 6) {
	      if(pluginConfig['version'] <= 0) {
	        error = true;
	        console.log(pluginName + '\'s version numer is not positive');
	        return;
	      }

              if(loadPlugin(pluginName, pluginConfig)) {
                error = true;
		return;
	      }
	    }
            else {
	      error = true;
              return;
            }
          } 
        }
        xobj.send(null);

	return !error;
      }

      //Actually load the pluginName.html file
      function loadPlugin(pluginName, pluginConfig) {
        var error = false;
	
	var xobj = new XMLHttpRequest() || new ActiveXObject('MSXML2.XMLHTTP');
        xobj.overrideMimeType("application/json");
        xobj.open('GET', 'plugins/' + pluginName + '/' + pluginName + '.html', true);
	xobj.onreadystatechange = function() {
          if(xobj.status == 404) {
            console.log('Unable to open body file for ' + pluginName + '! Is it there?')
	    error = true;
	    return;
	  }

	  if(xobj.readyState == 4) {
            var pluginText = xobj.responseText;
            var textToInsert = "<div class='plugin card col-md-" + pluginConfig['settings'].width + " id='" + pluginName + "> <span class='title'>" + pluginConfig['name'] + "</span> <div class='content'>" + pluginText + " </div> </div>"
	    $('#plugins').append(textToInsert);
	    console.log("plugin name is _" +pluginName);
          }
        }
        xobj.send(null);

	return error;
      }

      window.onload = main    
