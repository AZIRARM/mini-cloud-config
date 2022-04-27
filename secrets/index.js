const express = require('express');
const router = express.Router();

const fs = require('fs');


router.post('/secrets/*', (req, resp) => {

    let url = req.protocol + '://' + req.get('host') + req.originalUrl;

    url = url.split('/secrets')[1]

    let environment = url.split('/')[1];
    let applicationName = url.split('/')[2];
    console.debug("Environment  : " + environment);
    console.debug("Application  : " + applicationName);

    let settings =  readConfiguration();

    settings.filter(setting => setting.environment ===  environment).map(
        setting => {
            console.debug("Environment name : "+ setting.environment);
            console.debug("Environment description : "+ setting.description);

            let authenticationSuccess = false;

            if(setting.authenticationType === 'token') {
                console.debug("Token Authentication");
                authenticationSuccess = checkAuthentication(req.query.token, setting, resp);
            }
            if(setting.authenticationType === 'api-key') {
                console.debug("Api-Key Authentication");
                authenticationSuccess = checkAuthentication(req.header('api-key'), setting, resp);
            }

            setting.applications.filter(app => app.name === applicationName).map(
                application => {
                    console.debug("Application name : "+ application.name);
                    console.debug("Application description : "+ application.description);
                    resp.statusCode = 200;
                    resp.json(application.secrets);
                    return ;
                }
            );
        }
    );

    return ;
} );

const checkAuthentication = ((secret, setting, response) => {
     console.error("Client-secret : " + secret);

     if(!setting || secret !== setting.authenticationSecret) {
             console.error("You do not have the necessary permissions to access this resource");
             response.statusCode = 401;
             response.send("You do not have the necessary permissions to access this resource");
             return ;
     }
    return true;
});

/****************************
*        Statics pages      *
*****************************/
router.get('/manage-secrets', function(req,res){
    res.redirect("/manage-secrets/index.html");
    return ;
});


/****************************
*        Environments       *
*****************************/
router.get('/manage-secrets/environments', function(req,res){
    res.statusCode = 200;
    res.send(readConfiguration().map(env => {
        console.debug("-->"+env.environment)
        return env.environment;
        }
    ));
    return ;
});
router.get('/manage-secrets/environments/:environmentName', function(req,res){
    var environmentName = req.params['environmentName'];

    console.debug("Get Environment by name : "+environmentName );

    res.statusCode = 200;
    res.send(readConfiguration().filter(setting=>setting.environment === environmentName).map(environment => environment));
    return ;
});
router.post('/manage-secrets/environments/:environmentName', function(req,res){
    var environmentName = req.params['environmentName'];

    console.debug("Save new Environment : "+environmentName+", content :"+JSON.stringify(req.body) );

    var configuration = readConfiguration();

    var environments = configuration.filter(env => env.environment === environmentName );

    if(environments && environments !== null && environments.length > 0) {
        res.statusCode = 409;
        res.send( "Environment already exist" );
    } else {
        console.log( "Process saving new environment : " + environmentName);
        configuration.push({
            "environment": environmentName,
            "description": req.body.environmentDescription,
            "authenticationType": req.body.authenticationType,
            "authenticationSecret": req.body.authenticationSecret,
            "applications":[]
        });

        this.writConfiguration(configuration);

        res.statusCode = 200;
        res.json( environmentName );
    }
    return ;
});
router.put('/manage-secrets/environments/:environmentName', function(req,res){
    var environmentName = req.params['environmentName'];

    console.debug("Save Environment : "+environmentName+", content :"+JSON.stringify(req.body) );

    var configuration = readConfiguration();

    return configuration.filter(env => env.environment === environmentName ).map(environment => {
        environment.environment = req.body.environment;
        environment.description = req.body.description;
        environment.authenticationType = req.body.authenticationType;
        environment.authenticationSecret = req.body.authenticationSecret;

        this.writConfiguration(configuration);
        res.statusCode = 200;
        res.json( environment.environment );

    });
    return ;
});
router.delete('/manage-secrets/environments/:environmentName', function(req,res){
    var environmentName = req.params['environmentName'];

    console.debug("Remove Environment by name : "+environmentName );

    res.statusCode = 200;
    let configuration = readConfiguration();
    let environments = configuration.filter(environment=>environment.environment !== environmentName);
    this.writConfiguration(environments);
    res.json(environmentName);
    return ;
});


/****************************
*        Applications       *
*****************************/
router.get('/manage-secrets/environments/:environmentName/applications', function(req,res){
    var environmentName = req.params['environmentName'];

    console.debug("Get application of environment: "+environmentName )
    res.statusCode = 200;
    res.send(readConfiguration().filter(env => env.environment === environmentName ).map(environment => {
            return environment.applications.map(app => app.name);
        }
    ));
    return ;
});
router.get('/manage-secrets/environments/:environmentName/applications/:applicationName', function(req,res){
    var applicationName = req.params['applicationName'];
    var environmentName = req.params['environmentName'];

    console.debug("Get Application by name : "+applicationName+" of environment : "+environmentName );

    let configuration = readConfiguration();

    let applications = configuration.filter(environment => environment.environment === environmentName )
        .flatMap(environment => environment.applications).filter(application => application.name === applicationName)
      .map(application => {
                return application
        });
        console.debug("Applications "+JSON.stringify(applications))

    res.statusCode = 200;
    res.send(applications[0]);
    return ;
});
router.post('/manage-secrets/environments/:environmentName/applications', function(req,res){
    var environmentName = req.params['environmentName'];

    console.debug("Add new Application : "+JSON.stringify(req.body));

    var configuration = readConfiguration();

    configuration.filter(env => env.environment === environmentName ).map(environment => {
         environment.applications.push({
                    "name": req.body.name,
                    "description": req.body.description,
                    "secrets":[]
                });

        this.writConfiguration(configuration);

        res.statusCode = 200;
        res.json( req.body.name );
    });
    return ;
});
router.put('/manage-secrets/environments/:environmentName/applications/:applicationName', function(req,res){
    var applicationName = req.params['applicationName'];
    var environmentName = req.params['environmentName'];

    console.debug("Update  Application : "+applicationName+" on environment : "+environmentName);

    var configuration = readConfiguration();
    configuration.filter(environment => environment.environment === environmentName )
            .flatMap(environment => environment.applications).filter(application => application.name === applicationName)
          .map(application => {
           console.debug("Process Update  Application : "+JSON.stringify(req.body))
                application.name =  req.body.name;
                application.description = req.body.description;

                this.writConfiguration(configuration);

                res.statusCode = 200;
                res.json( req.body.name );
            });
    return ;
});
router.delete('/manage-secrets/environments/:environmentName/applications/:applicationName', function(req,res){
    var applicationName = req.params['applicationName'];
    var environmentName = req.params['environmentName'];

    console.debug("Remove Application by name : "+applicationName+" of environment : "+environmentName );

    let configuration = this.readConfiguration();
    let applications = configuration.filter(env => env.environment === environmentName ).map(environment => {
            return environment.applications.filter(application => application.name !== applicationName);

        }
    );

    configuration.filter( env => env.environment === environmentName ).map(environment => {
        environment.applications = null;
        environment.applications = applications[0];

        this.writConfiguration(configuration);

        res.statusCode = 200;
        res.json( applicationName );
    } );


    return ;
});


/****************************
*           Secrets         *
*****************************/
router.get('/manage-secrets/environments/:environmentName/applications/:applicationName/secrets', function(req,res){
    var applicationName = req.params['applicationName'];
    var environmentName = req.params['environmentName'];
    console.debug("Get application : "+applicationName+" of environment: "+environmentName )
    res.statusCode = 200;
    res.send(readConfiguration().filter(env => env.environment === environmentName ).map(environment => {
            return environment.applications.filter(app=>app.name === applicationName).map(app => {
                return app.secrets.map(secret => {
                    console.debug("Secret -->"+JSON.stringify(secret))
                    return secret;
                });
            })
        }
    ));
    return ;
});
router.get('/manage-secrets/environments/:environmentName/applications/:applicationName/secrets/:secretKey', function(req,res){
    var secretKey = req.params['secretKey']
    var environmentName = req.params['environmentName'];
    var applicationName = req.params['applicationName'];

    console.debug("Get secret by key : "+secretKey+",  Application : "+req.query.application+" of environment -->"+req.query.environment );

    res.statusCode = 200;
    res.send(readConfiguration().filter(env => env.environment === environmentName ).map(environment => {
            return environment.applications.filter(app=>app.name === applicationName).map(app => {
                return app.secrets.map(secret => {
                   if(secretKey === secret.key) {
                        return secret;
                   }
                });
            })
        }
    ));
    return ;
});
router.post('/manage-secrets/environments/:environmentName/applications/:applicationName/secrets', function(req,res){
    var secretKey = req.params['secretKey']
    var environmentName = req.params['environmentName'];
    var applicationName = req.params['applicationName'];

    console.debug("Get secret by key : "+secretKey+",  Application : "+req.query.application+" of environment -->"+req.query.environment );

    res.statusCode = 200;
    var configuration = readConfiguration();


    configuration.filter(env => env.environment === environmentName )
            .flatMap(environment => environment.applications)
            .filter(app=>app.name ===  applicationName)
            .map(app => {

                app.secrets.push({key: req.body.key, value: req.body.value, description: req.body.description});

                this.writConfiguration(configuration);

                res.statusCode = 200;
                res.json(req.body.key);
            });

    return;
});
router.put('/manage-secrets/environments/:environmentName/applications/:applicationName/secrets/:secretKey', function(req,res){
    var secretKey = req.params['secretKey']
    var environmentName = req.params['environmentName'];
    var applicationName = req.params['applicationName'];

    res.statusCode = 200;

    console.debug("Update secret : "+secretKey+",  Application: "+applicationName+" of environment: "+environmentName );

    var configuration = readConfiguration();

    configuration.filter(env => env.environment === environmentName )
            .flatMap(environment => environment.applications)
            .filter(app=>app.name ===  applicationName)
            .map(app => app.secrets)
                .flatMap(secret => secret)
                .filter(secret => secret.key === secretKey)
                .flatMap(secret => {
                    secret.key = req.body.key
                    secret.value = req.body.value;
                    secret.description = req.body.description;

                    this.writConfiguration(configuration);

                    res.statusCode = 200;
                    res.json(req.body.key);
                 });
    return ;
});
router.delete('/manage-secrets/environments/:environmentName/applications/:applicationName/secrets/:secretKey', function(req,res){
    var secretKey = req.params['secretKey']
    var environmentName = req.params['environmentName'];
    var applicationName = req.params['applicationName'];

    console.debug("Save new secret secret: "+secretKey+",  Application: "+applicationName+" of environment: "+environmentName );

    var configuration = readConfiguration();
    configuration.filter(env => env.environment === environmentName ).map(environment => {
        return environment.applications.filter(app=>app.name === applicationName).map(app => {
           var secrets = app.secrets.filter(secret => secret.key !== secretKey);
           app.secrets = secrets;

           this.writConfiguration(configuration);

           res.statusCode = 200;
           res.json(secretKey);
        });
    });
    return ;
});


/****************************
*           Commons         *
*****************************/
writConfiguration = ((data) => {
    fs.writeFileSync('confs/settings.json', JSON.stringify(data,null, 2));
});

readConfiguration = (() => {
    let jsonContent = fs.readFileSync('confs/settings.json');
    let settings = JSON.parse(jsonContent);

    console.debug(settings);

    return settings;
});



module.exports = router;