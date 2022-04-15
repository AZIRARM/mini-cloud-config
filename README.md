# mini-cloud-config
Mini cloud config to manage configurations

# Settings
The configuration is very easy to understand, just fill in the settings.json file in the confs/ folder.
You can have several environments (a different name each time), each environment can have several applications (you cannot have the same application name on each environment) and each application has several secerts (you cannot have secrets same name).
```
[
  {
    "environment": "dev",
    "description": "test dev",
    "applications": [
      {
        "name": "users-api",
        "description": "secrets for users api",
        "secrets": [
          {
            "key": "elasticsearch.port",
            "value": "9200",
            "description": "elasticsearch port"
          },
          {
            "key": "elasticsearch.url",
            "value": "https://xxxx",
            "description": "elasticsearch url"
          },
          {
            "key": "elasticsearch.user",
            "value": "admin",
            "description": "elasticsearch user access"
          },
          {
            "key": "elasticsearch.password",
            "value": "password",
            "description": "elasticsearch user password"
          }
        ]
      }
    ]
  }
]
```

# How to use

```
curl --location --request POST 'http://localhost:9000/secrets/dev/users-api/' \
--header 'Accept: application/json' \
--header 'Content-Type: application/json'
```


# Licence
MIT License

Copyright (c) 2022 ITExpert

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
