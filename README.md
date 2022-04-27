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
you can change the server port by setting the environment variable: SECRETS_PORT

# How to use
```
curl --location --request POST 'http://localhost:9000/secrets/dev/users-api/' \
--header 'Accept: application/json' \
--header 'Content-Type: application/json' \
--header 'api-key: My-Super-Secret'
```

Today two authentication : token (in query param of url) and by api-key (in the headers of the request)

## With Docker

For example in a entrypoint.sh, you mut set <b>ENV</b> like : dev, prod, prep, qa... and the <b>API_KEY</b> of your mini-cloud-config 



```
#!/bin/bash

echo "Start retreive secrets"

API_KEY= "api-key: $API_KEY"
ACCEPT= "Accept: application/json"
CONTENT_TYPE= "Content-Type: application/json"
URL= "http://URL-MINI-CLOUD-CONFIG:9000/secrets/$ENV/users-api/"

curl -X POST --header "$API_KEY" --header "$ACCEPT" --header "$CONTENT_TYPE" "$URL" >> properties.json

echo "Start replace secrets in conf file"

..
..
..

```


