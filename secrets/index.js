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

            let applications = setting.applications;
            console.debug("Applications  : "+ JSON.stringify(applications));

            applications.filter(app => app.name === applicationName).map(
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


module.exports = router;