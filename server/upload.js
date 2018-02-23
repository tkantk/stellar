var csv = require('fast-csv');
var mongoose = require('mongoose');
var ImportedData = require('./csvUploadSchema');
 
exports.post = function (req, res) {
    if (!req.files)
        return res.status(400).send('No files were uploaded.');
     
    var authorFile = req.files.file;
 
    var authors = [];
	var upd;
         
    csv
     .fromString(authorFile.data.toString(), {
         headers: true,
         ignoreEmpty: true
     })
     .on("data", function(data){
		//data['_id'] = data.TicketID;
		console.log(">>>>>>");
		console.log(data.TicketID);
		authors.push(data);
		//upd = data;
		//delete upd._id;
		//console.log(upd);
     })
     .on("end", function(){
		console.log("authorslength>>>>>>>"+authors.length);
		var totalRecs=0;
		var insertedRecs = 0;
		for (let row of authors) {
			console.log("saving>>>>>>"+row.TicketID);
			//insert into mongodb
			ImportedData.update({_id: row.TicketID}, row, {upsert: true, new: true, setDefaultsOnInsert: true}, function(err, docs){
				if(err){
						console.log("found error while updating");
						console.log(docs);
				}
				else{
					//console.log("everything went fine");
					//console.log(docs);
					totalRecs = totalRecs + 1;
					if(((docs.nModified>0) || (undefined!=docs.upserted)) && docs.ok>0){
						insertedRecs = insertedRecs+1;
					}
					if(totalRecs==authors.length){
						//console.log(">>>>>>"+insertedRecs);
						res.send(insertedRecs + ' records have been successfully uploaded/modified');
					}
				}
			});
		}
	 });
     //});
};