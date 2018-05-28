'use strict';

const sampleData = require('./createUserList.json');

module.exports = function(app) {
  const promises = [];
  

  Object.keys(sampleData).forEach(modelName => {
    const Model = app.models[modelName];

    //console.log(`model name is ${Model}`);
    const modelItems = sampleData[modelName];


    modelItems.forEach(modelItem => {
      promises.push(Model.upsertWithWhere({'username': modelItem.username}, modelItem));
    });
    });
  
    
  };
   
  