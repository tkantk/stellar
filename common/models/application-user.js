'use strict';

module.exports = function(ApplicationUser) 
{
    ApplicationUser.afterRemote('login', function(context, modelInstance, next) {
        let accessToken = '';
        if (context && context.result.id != undefined) {
          accessToken = context.result;
          console.log(accessToken.userId);
                
        let role;
        let userRole = getUserRole(accessToken.userId);
        Promise.resolve(userRole)
          .then((results) => {
            console.log(userRole);
            results.forEach(function(result) {
              console.log(`promise result is ${result} --> ${result.role}`);
              //context.result.role = result.role;
              role = result.role;
                        
          });

        let projects = projectList(role,accessToken.userId);
        Promise.resolve(projects)
          .then((results) => {
            console.log(projects);
            results.forEach(function(result) {
              console.log(`promise result is ${result} --> ${result.projects}`);
              context.result.projects = result.projects;
              next();
                        
          });

   
        });
    });
    }
});

    /**
     Get current user role

     */

   
     function getUserRole(userIdValue)
    {
        //find user role
        let promise = [];
               
        let userRole= ApplicationUser.find(
        {where:{id:`${userIdValue}`},}).then(function (results){        
              console.log(results[0].role);
       return {
         role: results[0].role
        };
   
    });
 
promise.push(userRole);
return Promise.all(promise);
     
    }

    /**
     * Get project List given the user role and user ID
     */

    function projectList(userRole,userIdValue)
    {
        var projectNames = [];
        let promise = [];
        console.log(`in projectList method ${userRole}`);
    if (userRole!='admin'){
  
        //Find all projects where user has access to  
        let proj= ApplicationUser.app.models.ProjectConfiguration.find(
          {where:{userId:`${userIdValue}`},}).then(function(projectConfig) {
              console.log(projectConfig);
          
            projectConfig.forEach(function(project){
              console.log(project.projectName);
              projectNames.push(project.projectName);
            });
            
            console.log(projectNames);
            
            return {
              projects: projectNames
                  };
           
  });
  promise.push(proj);
return Promise.all(promise);
  
         }
         else
         {
          console.log(`going in else block`);      
         
          let proj = ApplicationUser.app.models.ProjectConfiguration.find({}).then(function (projectConfig){
             
              console.log(projectConfig);
                     
              projectConfig.forEach(function(project){
                  console.log(project.projectName);
                  projectNames.push(project.projectName);
                  })
                  return {
                      projects: projectNames
                          };
         });
     promise.push(proj);
     return Promise.all(promise);
      }
 }

}