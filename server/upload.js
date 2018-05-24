var parse = require('csv-parse');


exports.post = function (req, res)
    {    //console.log(req.file.buffer.toString());
    if (!req.file){
        return res.status(400).send('No files were uploaded.');
    }else{
        var file = req.file;
        var output = [];
        var record;
         // Create the parser
        var parser = parse({delimiter: ','});

        parser.on('readable', function(){
            while((record = parser.read())){
              output.push(record);
            }
          });

        // Catch any error
        parser.on('error', function(err){
            console.log(err.message);
        });
        // When we are done, test that the parsed output matched what expected
        parser.on('finish', function(){
            console.log(output);
        });
        parser.write(file.buffer)
        parser.end();
        res.status(200).send(`File uploaded ${file.originalname}`);
    }    
}
