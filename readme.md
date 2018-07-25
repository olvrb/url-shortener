# url-shortener
---

# I just want a simple URL Shortener!

https://s.reoo.me


# Selfhost

* make sure you have [node.js](https://nodejs.org/en/) 8.11 or above
* clone this repository like this: 
```bash
$ git clone git@github.com:olvrb/url-shortener.git
$ cd url-shortener
```
* run `npm install` or `yarn`, depending on which one you prefer
* install pm2 using like this: `npm i -g pm2`
* create a `config.json` in the root with the following contents:
```json
{
    "apiKey": "",
    "authDomain": "",
    "databaseURL": "",
    "storageBucket": ""
}
```
* go to [this website](https://console.firebase.google.com), create a new project, and fill in the details in the `config.json` 
* run `pm2 start ./bin/www`
* go [here](http://localhost:3000) and start using it!

# API

POST `/api/v2/generate`
returns: {
    url: String,
    uniq: String
}
# License
GPL-3.0 