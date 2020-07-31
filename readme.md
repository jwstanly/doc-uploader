A discord bot to upload attached documents in a chat to a Google Drive directory.

To run, simply type in a Discord chat ```!upload``` along with an attached PDF document. The document will be downloaded to the server and then uploaded into the specific Google Drive directory ID. 

You will need to modify/create the following files to run this bot...

* **config.json** - This includes your command prefix and your Discord bot token. A template has been created with a ```!``` prefix. Please provide your own Discord bot token
* **credentials.json** - This includes your Google Drive API credentials. You can receive your own credentials JSON by clicking on [this](https://developers.google.com/drive/api/v3/quickstart/nodejs) link to enable the Drive API on your Google account.
* **token.json** - This JSON generates once you have authenticated an instance of Google's API with the proper scope. You don't need to download this; the link above will subsequently generate this for you. Additionally, please note that the token JSON should be deleted if you ever alter your SCOPES. 
