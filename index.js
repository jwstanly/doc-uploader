//imports
//file management
  const fs = require('fs');
  const https = require('https');
//discord
  const Discord = require('discord.js');
  const client = new Discord.Client();
//google drive
  const readline = require('readline');
  const { google } = require('googleapis');
//config
  const { prefix, discordToken, googleDriveFolderId } = require('./config.json');


//Declares global variable for file name
  var fileName = "";

/*
GOOGLE DRIVE STUFF
*/
  const SCOPES = ['https://www.googleapis.com/auth/drive'];
  const TOKEN_PATH = 'token.json';

  //attempts to authorize the client
    //credentials = the parsed credentials JSON file
    //callback = the method you actually want to run (uploadFile)
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

  //generates a token JSON file if one has not already been made
  //this should only run the first time the discord bot is ran (after that, you should always have a token JSON ready to go)
    //oAuth2Client = an instance of google.auth.OAuth2
    //callback = the method you actually want to run (uploadFile)
  function getAccessToken(oAuth2Client, callback) {
      const authUrl = oAuth2Client.generateAuthUrl({
          access_type: 'offline',
          scope: SCOPES,
      });
      //visit the following Google API URL if requested to do so
      console.log('Authorize this app by visiting this url:', authUrl);
      const rl = readline.createInterface({
          input: process.stdin,
          output: process.stdout,
      });
      //enter the code given by the URL to authenticate your token
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

  //uploads a file to the specified Google Drive directory
    //auth = an instance of google.auth.OAuth2
  function uploadFile(auth) {
    const drive = google.drive({ version: 'v3', auth });
    var fileMetadata = {
      'name': fileName, //the name of the file to be uploaded to Google Drive (which is the same as the file name from Discord because of the global variable fileName)
      parents: [googleDriveFolderId] //the Google Drive directory. Specified by the folder ID (found in URL on drive.google.com)
    };
    var media = {
      mimeType: 'application/pdf', //specifies the uploaded document is a PDF
      body: fs.createReadStream(fileName) //writes the PDF file stream
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

  //runs once at startup
  client.once('ready', () => {
    console.log(`Bot is ready to go!`); //Signals the bot is running and operational
  });

  //constantly runs, listening for messages
  client.on('message', message => {

    if(message.content === `${prefix}upload`){ //listens for !upload keyword

      if(message.attachments.size < 1){
        return message.reply('you didn\'t attach a file'); //ensures a file was uploaded
      }
      if(message.attachments.size > 1){
        return message.reply('you can only upload files one at a time'); //ensures only one file was uploaded
      }

      fileName = message.attachments.first().name; //grabs file name from the attachment in the Discord chat
      const file = fs.createWriteStream(fileName); //creates subsequent local file

      if(fileName.substring(fileName.length-4, fileName.length) !== ".pdf"){
        return message.reply('you must attach a PDF'); //ensures a file is a PDF
      }

      const urlAddress = message.attachments.first().url;
        const request = https.get(urlAddress, response => {
        response.pipe(file); //writes the local file from the Discord file's URL
      });

      //Uploads to Google Drive
      function uploadToGDrive(){
        fs.readFile('credentials.json', (err, c) => { //reads the Google API credentials JSON
            if (err) return console.log('Error loading client secret file:', err);
            authorize(JSON.parse(c), uploadFile); //authorizes instance of Google API along with the request to uploadFile
        });
      }

      //times out until file is made
      setTimeout(uploadToGDrive, 3000); //waits three seconds so the file is completely downloaded

      message.reply('your file was uploaded to Google Drive');

    }


  });

  client.login(discordToken); //creates the Discord bot given the token in the config JSON
