const express = require('express');
const router = express.Router();

const fs = require('fs');

let jsonContent = fs.readFileSync('confs/settings.json');
let settings = JSON.parse(jsonContent);

console.log(settings);


router.post('/secrets/*', (req, resp) => {

    let url = req.protocol + '://' + req.get('host') + req.originalUrl;

    url = url.split('/secrets')[1]

    let environment = url.split('/')[1];
    let applicationName = url.split('/')[2];
    console.debug("Environment  : " + environment);
    console.debug("Application  : " + applicationName);

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
            resp.statusCode = 404;
            resp.json(JSON.parse('{"message": "resource not found"}'));
            return ;
        }
    );

    resp.statusCode = 404;
    resp.json(JSON.parse('{"message": "resource not found"}'));
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

module.exports = router;