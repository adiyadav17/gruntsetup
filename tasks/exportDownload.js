/*jshint forin:true, noarg:true, noempty:true, eqeqeq:true, bitwise:true, strict:true, undef:true, unused:true, curly:true, browser:true, indent:2, node:true, jquery:true */

module.exports = function (grunt) {
  "use strict";

  grunt.registerMultiTask('exportDownload', 'downloading files for app export', function (param) {
    
    var opts = this.options({
      'url': '',
      'dest': '',
      'silent': false
    });

    var request = require("request");
    var done = this.async();
    var url = opts.url;

    var log = function (message) {
      if(!opts.silent) {
        grunt.log.write(message);
      }
    };

    // get URL
    if(param) {
      url = url + param;
    }
    request.get(url, function (error, response, body) {
      if (!error && response.statusCode === 200) {
        var resJson = convertXml2json(body);  // FIXME error handling
        log('file list received \n');
        fetchFiles(resJson.issue.files.file, opts.dest, done);
      } else {
        grunt.fail.fatal("could not fetch content from url '" + opts.url + "' " + error);
      }
    });

    // convert xml response to json
    function convertXml2json (xml) {
      var parser = require("xml2json");
      return parser.toJson(xml, {object: true});
    }
    
    // fetch files and save to disk
    function fetchFiles(tasks, destination, doneCallback) {
      var fetched = 0;
      var toFetch = tasks.length;
      tasks.forEach(function (entry) {
        log('fetching ' + entry.source + "\n");
        request.get({ uri: entry.source, encoding: null }, function(error, response, body) {
          fetched++;
          grunt.file.write(destination + "/" + entry.destination , body);
          if(fetched === toFetch) {
            doneCallback();
          }
        });
      });

    }
      
  });
};