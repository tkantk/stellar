var mongoose = require('mongoose');
 
var importCSVSchema = mongoose.Schema({
	_id: String,
	'Business Unit':{
		type: String,
		alias: 'BU',
		required: true
	},
	'Project':{
		type: String,
		alias: 'project',
		required: true
	},
	'Account':{
		type: String,
		alias: 'account',
		required: true
	},
	'Category':{
		type: String,
		alias: 'category',
		required: true
	},
	'Priority':{
		type: String,
		alias: 'priority',
		required: true
	},
	'TicketID':{
		type: String,
		alias: 'ticketId',
		"id":"true"
	},
	'Ticket Description':{
		type: String,
		alias: 'ticketTitle'
	},
	'Resolved On':{
		type: String,
		alias: 'resolvedOn',
		required: true,
	},
	'Response Time':{
		type: String,
		alias: 'responseTime',
		required: true,
	},
	'Resolution Time':{
		type: String,
		alias: 'resolutionTime',
		required: true,
	}
});
 
var ImportedData = mongoose.model('ImportedData', importCSVSchema);
 
module.exports = ImportedData;