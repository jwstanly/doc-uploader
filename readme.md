# Intro
Doc Uploader is a discord bot to upload attached documents in a chat to a Google Drive directory.

To run, simply type in a Discord chat ```!upload``` along with an attached PDF document. The document will be downloaded to the server and then uploaded into the specific Google Drive directory ID. When ran sucsessfully, the Discord chat should look like the following...

![Sucsessful Doc Uploader run](https://i.imgur.com/3obm0xi.png)

# Setup/Additional Files
This bot was programmed in JavaScript with NodeJS. The node modules and package JSONs are included in this repo; however, the Google Drive and Discord APIs still need to be configured with the client's respective Google and Discord accounts. 

You will need to modify/create the following files to run this bot...

* **config.json** - This includes your command prefix and your Discord bot token. A template has been created with a ```!``` prefix. Please provide your own Discord bot token
* **credentials.json** - This includes your Google Drive API credentials. You can receive your own credentials JSON by clicking on [this](https://developers.google.com/drive/api/v3/quickstart/nodejs) link to enable the Drive API on your Google account.
* **token.json** - This JSON generates once you have authenticated an instance of Google's API with the proper scope. You don't need to download this; the link above will subsequently generate this for you. Additionally, please note that the token JSON should be deleted if you ever alter your Google API scopes (it will once again automatically recreate the JSON for you).

Once complete, in addition to the node modules folder, your working directory should have all these files...

![finished working directory](https://i.imgur.com/5LNcT71.png)

# Further Configuration
To change the Google Drive directory where documents are uploaded, change the ```folderId``` variable (index.js - line 15) to the directory's ID. The ID can be found in the URL for the resepctive directory like so...

![Google Drive directory ID](https://ploi.io/storage/39/Image-2019-02-14-at-11.16.51-AM.png)

