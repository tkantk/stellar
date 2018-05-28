'use strict';

const sampleData = require('./createProjectList.json');

module.exports = function(app, cb) {
  const promises = [];

  Object.keys(sampleData).forEach(modelName => {
    const Model = app.models[modelName];
    const modelItems = sampleData[modelName];

    modelItems.forEach(modelItem => {
      promises.push(Model.upsertWithWhere({'projectName': modelItem.name}, modelItem));
    });
  });

  Promise.all(promises.map(p => p.catch(() => undefined)))
    .then((res) => {
      console.log('Project is set up', res.length);
      return cb();
    });
};
 
