//file management
  const fs = require('fs');
  const https = require('https');
//discord
  const Discord = require('discord.js');
  const { prefix, token } = require('./config.json');
  const client = new Discord.Client();
//google drive
  const readline = require('readline');
  const { google } = require('googleapis');


//Important Variables
  var fileName = "";
  var dir = "SampleUploadFolder";
  var folderId = "1gg8qDIRBPw8J13vSMhHin8ahuiITdMJf";

/*
GOOGLE DRIVE STUFF
*/
  const SCOPES = ['https://www.googleapis.com/auth/drive'];
  const TOKEN_PATH = 'token.json';

  function authorize(credentials, callback) {
      const { client_secret, client_id, redirect_uris } = credentials.installed;
      const oAuth2Client = new google.auth.OAuth2(
          client_id, client_secret, redirect_uris[0]);

      // Check if we have previously stored a token.
      fs.readFile(TOKEN_PATH, (err, token) => {
          if (err) return getAccessToken(oAuth2Client, callback);
          oAuth2Client.setCredentials(JSON.parse(token));
          callback(oAuth2Client);//upload file

      });
  }

  function getAccessToken(oAuth2Client, callback) {
      const authUrl = oAuth2Client.generateAuthUrl({
          access_type: 'offline',
          scope: SCOPES,
      });
      console.log('Authorize this app by visiting this url:', authUrl);
      const rl = readline.createInterface({
          input: process.stdin,
          output: process.stdout,
      });
      rl.question('Enter the code from that page here: ', (code) => {
          rl.close();
          oAuth2Client.getToken(code, (err, token) => {
              if (err) return console.error('Error retrieving access token', err);
              oAuth2Client.setCredentials(token);
              // Store the token to disk for later program executions
              fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
                  if (err) return console.error(err);
                  console.log('Token stored to', TOKEN_PATH);
              });
              callback(oAuth2Client);
          });
      });
  }

  function uploadFile(auth) {
    const drive = google.drive({ version: 'v3', auth });
    var fileMetadata = {
      'name': fileName,
      parents: [folderId]
    };
    var media = {
      mimeType: 'application/pdf',
      body: fs.createReadStream(fileName)
    };
    drive.files.create({
      resource: fileMetadata,
      media: media,
      fields: 'id'
    }, (err, res) => {
      if (err) {
        console.log(err);
      } else {
        console.log('File Id: ', res.data.id);
      }
    });
  }


/*
DISCORD STUFF
*/

  client.once('ready', () => {
    console.log(`Bot is ready to go!`);
  });

  client.on('message', message => {

    if(message.content === `${prefix}upload`){

      fileName = message.attachments.first().name;
      const file = fs.createWriteStream(fileName);

      const urlAddress = message.attachments.first().url;
        const request = https.get(urlAddress, response => {
        response.pipe(file);
      });

      message.reply('your file was downloaded! Beginning upload...');

      //Uploads to Google Drive
      function uploadToGDrive(){
        fs.readFile('credentials.json', (err, c) => {
            if (err) return console.log('Error loading client secret file:', err);
            authorize(JSON.parse(c), uploadFile);
        });
      }

      //times out until file is made
      setTimeout(uploadToGDrive, 3000);

      message.reply('your file was uploaded to Google Drive');

    }


  });

  client.login(token);
