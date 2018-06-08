'use strict';

module.exports = function(ApplicationUser) 
{
    ApplicationUser.afterRemote('login', function(context, modelInstance, next) {
        let accessToken = '';
        if (context && context.result.id != undefined) {
          accessToken = context.result;
          console.log(accessToken.userId);
          //console.log(projectList(accessToken.userId,next));
let hw= "hello worls";
          context.result.projects = hw;
          //next(projectList(accessToken.userId))
        //   var promise = new Promise(function(resolve, reject) {
        //let abc =projectList(accessToken.userId);
            
        //        // console.log("resolved called")
        //     resolve(abc);
           
        //   });

        //   promise
        Promise.resolve(projectList(accessToken.userId))
          .then(function(result){
              console.log(`promise result is ${result}`);
              context.result.projects = result;
              next();
          }
          , function(err){
              console.log(err);
          })

   
        }
    });
        
   
    function projectList(userIdValue)
    {
        //find user role
        let promise = [];
        let userRole;
        let aa;
        //var projectNames = [];
        let zz= ApplicationUser.find(
        {where:{id:`${userIdValue}`},}).then(function (results){
        
       userRole = results[0].role;
       console.log(results[0].role);
   
       if (userRole!='admin'){
  
      //Find all projects where user has access to  
      ApplicationUser.app.models.ProjectConfiguration.find(
        {where:{userId:`${userIdValue}`},}).then(function(projectConfig) {
            console.log(projectConfig);
            var projectNames = [];
          projectConfig.forEach(function(project){
            console.log(project.projectName);
            projectNames.push(project.projectName);
          });
          
          console.log(projectNames);
         return(projectNames);
         
});
       }
       else
       {
        console.log(`going in else block`);
        Promise.resolve(projectNames()).then(
            function(projects)
            {
                console.log(`project names are ${projects}`);
                return (projects);
            }
        );
        //promise.push(aa);
         
       
       }
       
       //promise.push(aa);
  
    });  
   
     promise.push(zz);
     return Promise.all(promise);
       
    }

    function projectNames()
    {     
        let promise = [];
        console.log(`going in else block`);
        let pp = ApplicationUser.app.models.ProjectConfiguration.find({}).then(function (projectConfig){
           
        console.log(projectConfig);
                let projectNames=[];
        projectConfig.forEach(function(project){
            console.log(project.projectName);
            projectNames.push(project.projectName);
            });
        //console.log(projectNames(projectConfig, cb));
        return (projectNames);

 
        });
        promise.push(pp);
        return Promise.all(promise);

    }

}
