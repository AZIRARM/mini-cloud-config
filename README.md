[![GitHub license](https://img.shields.io/github/license/Naereen/StrapDown.js.svg)](./license.md)
 
# mini-cloud-config
Mini cloud config to manage configurations

# Settings
The configuration is very easy to understand, just fill in the settings.json file in the confs/ folder.
You can have several environments (a different name each time), each environment can have several applications (you cannot have the same application name on each environment) and each application has several secerts (you cannot have secrets same name).

## Configuration
```
[
  {
    "environment": "dev",
    "description": "test dev",
    "authenticationType": "api-key",
    "authenticationSecret": "My-Super-Secret",
    "applications": [
      {
        "name": "users-api",
        "description": "secrets for users api",
        "secrets": [
          { "key": "elasticsearch.port", "value": "9200", "description": "elasticsearch port"},
          { "key": "elasticsearch.url", "value": "https://xxxx", "description": "elasticsearch url"},
          {"key": "elasticsearch.user", "value": "admin", "description": "elasticsearch user access"},
          {"key": "elasticsearch.password", "value": "password", "description": "elasticsearch user password"
          }
        ]
      }
    ]
  }
]
```

## Server parameters
<b>SECRETS_PORT</b>: Server port, default 9000 if not setted in environments variables.<br>
<b>SECRETS_API_TOKEN</b>: Secret key if you want to use Admin Console, if not setted it generated on server started.<br>


# How to use
```
curl --location --request POST 'http://localhost:9000/secrets/dev/users-api/?option=yaml' \
--header 'Accept: application/json' \
--header 'Content-Type: application/json' \
--header 'api-key: My-Super-Secret'
```
2 Options to generate configuration file :
* properties: is a properties files with classical key/value,
* yaml: is a yaml file

If no option in request param, the response is a json file.

Today two authentication : token (in query param of url) and by api-key (in the headers of the request)


## With Docker

For example in a entrypoint.sh, you mut set <b>ENV</b> like : dev, prod, prep, qa... and the <b>API_KEY</b> of your mini-cloud-config 

```
#!/bin/bash

echo "Start retreive secrets"

API_KEY= "api-key: $API_KEY"
ACCEPT= "Accept: application/json"
CONTENT_TYPE= "Content-Type: application/json"
URL= "http://URL-MINI-CLOUD-CONFIG:9000/secrets/$ENV/users-api/?option=properties"

curl -X POST --header "$API_KEY" --header "$ACCEPT" --header "$CONTENT_TYPE" "$URL" >> /apps/myapp/resources/application.properties

#start myapp with external properties in param

..
..
..

```
### Configuration file
The configuration file is in <b>/app/mini-cloud-config/confs</b>.<br>
In this folder is the <b>settings.json</b> file, you can add a shared volume on this folder, which must contain the settings.json json file.<br>
The content of this file is very easy to understand.
```
[
  {
    "environment": "development",
    "description": "development environment for developer",
    "authenticationType": "api-key",
    "authenticationSecret": "My-Super-Secret",
    "applications": [
      {
        "name": "users-api",
        "description": "secrets for users api",
        "secrets": [
          {
            "key": "elasticsearch.port",
            "value": "9200",
            "description": "default elasticsearch port"
          },
          {
            "key": "elasticsearch.url",
            "value": "https://xxxx",
            "description": "elasticsearch url"
          },
        ]
      }
    ]
  }
]
```

## Web App Configuration
A web application is available accessible on the path /manage-secrets/index.html.<br>

To be able to use it you must have the access token, the latter is generated when the application starts:
```
Authorization: XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

Otherwise set the <b>SECRETS_API_TOKEN</b> variable in the environment variables (when launching the Docker container for example on your machine). You can also and on your development computer in the <b>.env</b> (dotenv) file at the root of the project.