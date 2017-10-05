let fs = require('fs');

// task list
// ===========================================
// get data
// --> read dir
// --> get file content
// --> do also for template files
// write contents of txt file to new html file
// --> get path of new file
// --> write file
//   |--> chain template file content to body
// create index.html file & link to posts
//   |--> asynchronous - need to resolve w/ callback
//   |--> consider for later: organize list in creation date chronological order?

let postDir = "./posts/";
let buildDir = "./build/";
let tempDir = "./templates/";
let header;
let body;
let footer;
let listItem = [];

function output(callback){
    fs.readFile((tempDir+"header.html"), 'utf8', function(error, data){
        if (error) return console.error(error);
        else header = data;
        
        fs.readFile((tempDir+"footer.html"), 'utf8', function(error, data){
            if (error) return console.error(error);
            else footer = data;
        
            if (typeof callback === "function"){
                callback(header, footer);
            }
        });
    });
}

// create .html files, this function is the callback
function makeFiles(header, footer){
    fs.readdir(postDir, function(error, files){ // get list of files from directory
        if (error) 
            return console.error(error);
        else {
            for (let i = 0; i < files.length; i++){           
                fs.readFile(postDir+files[i], function(err, data){ // get txt file content
                    if (error) 
                        return console.error(error);
                    else
                        body = data;
                        fs.writeFile((buildDir+files[i].substr(0, files[i].lastIndexOf('.'))+".html"), header+body+footer, "utf8", function(error, data){ //create post html file
                            if (error)
                                return console.error(error);
                            else
                                console.log(files[i].substr(0, files[i].lastIndexOf('.'))+".html created");
                        });
                });
            }
            listItem.push("<ul>");
            for (let i = 0; i < files.length; i++){
                listItem.push("<li><a href=\"" + files[i].substr(0, files[i].lastIndexOf('.'))+".html" + "\">" + files[i] + "</a></li>");
            }
            listItem.push("</ul>");
            fs.writeFile((buildDir+"index.html"), header+(listItem.join(" "))+footer, "utf8", function(error, data){
                if (error)
                    return console.error(error);
                else
                    console.log("index.html created");
            });
        }
    });
}

output(makeFiles);