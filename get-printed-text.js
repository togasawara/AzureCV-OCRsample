'use strict';

const request = require('request');
const iconv = require("iconv-lite");


let subscriptionKey = 'input your subscriptionKey';
let endpoint = 'input your endpoint';
if (!subscriptionKey) { throw new Error('Set your environment variables for your subscription key and endpoint.'); }

var uriBase = endpoint + 'vision/v2.1/ocr';

const imageUrl = 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/' +
'Atomist_quote_from_Democritus.png/338px-Atomist_quote_from_Democritus.png';

// Request parameters.
const params = {
    'language': 'ja',
    'detectOrientation': 'true',
};

const options = {
    uri: uriBase,
    qs: params,
    body: '{"url": ' + '"' + imageUrl + '"}',
    headers: {
        'Content-Type': 'application/json',
        'Ocp-Apim-Subscription-Key': subscriptionKey
    }
};

request.post(options, (error, response, body) => {
    if (error) {
        console.log('Error: ', error);
        return;
    }
    let jsonResponse = JSON.stringify(JSON.parse(body), null, '  ');
    console.log('JSON Response\n');
    //console.log(jsonResponse);
    let parseJson = JSON.parse(body);
    console.log(parseJson);

    let line;
    let text;
    let lineCount = 0;
    let message ='';

    parseJson.regions[0].lines.forEach(function(line) {
        line.words.forEach(function(text) {
            //console.log(text.text);
            //message += iconv.decode(text.text, 'uft8');
            message += text.text;            
        });
        lineCount++;

        if(lineCount < parseJson.regions[0].lines.length){
            message += '\n';
        }
    });
    console.log(message);

});