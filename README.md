# Strecklista
Digital strecklista som webapp för simpel hantering av streckvaror

## App Features
* PIN-protected (no tedious personal logins)
* Save user as favourite to show at the top of the users list
* Live feed of transactions
* Swish into your account directly from the app
* Admin can send account balance emails in the app

## Technical Features
* Device agnostic
* No extra hardware required
* Google Sheet as database for easy handling (for the admin)
* No cost at all!

# Changelog
Can be found [here](/CHANGELOG.md) and contains the most important changes starting from release 1.0.0.

# Installation
## Requirements
* Google account (with Sheets language set as Swedish)
* Heroku account
* No previous coding experience!
* Some knowledge of Google Sheets / Excel

## General information
The application is comprised of two parts:
* Database server (Google Sheets)
* Web app server (Heroku)
Installation of the app will then be in two steps, first the database and then the web app.

## Create database server (Google Sheet)
First you will make a database Sheet from a template and enable it for web requests.
1. Go to [this Google Sheet](https://docs.google.com/spreadsheets/d/1gPa05XEx8V-suxmafw6fqGoaCoEWWZ85tGntNz_isi8/edit?usp=sharing "Database template Sheet").
2. Make a copy to your own Drive by clicking **Arkiv** -> **Kopiera...**. Give it a good name and place it in an empty folder where you can find it later.
3. Open the Sheet and then click the menu item **Verktyg** -> **Skriptredigerare...**.
4. In the new tab click the menu item **Publicera** -> **Implementera som webapp...**.
5. Select the following settings below and then click **Implementera**.
![Settings for web app](https://user-images.githubusercontent.com/28558941/31045184-3c29a8fc-a5de-11e7-8154-4d9814c28fd2.png "Settings for web app")

## Set up database
There are some database settings which will be described here.
### General settings
![Settings page](https://user-images.githubusercontent.com/28558941/31056498-d25ce4b6-a6d2-11e7-838f-e9242273cfd1.png)

* `password` - This is the password for the admin page in the web app.
* `groups` - A list of all the groups and in what order they should be shown.
* `buttons` - Which buttons should be shown in the action bar.
* `mail_user` - Email address and user name for Microsoft account which will be used to send out [account balance reminders](#account-balance-email-reminders).
* `mail_pw` - Password for the account above.
* `title` - Title of the web app (shown as title of browser tab).
* `pin` - PIN code for accessing the web app. Set to 0000 to make it accessible by everyone.
* `swish` - Mobile number for Swish account
* `mail_name` - Name of admin. Will be shown in various parts of the app.
* `negative` - Global flag for allowing transactions if it results in a negative balance. There is also a flag for every user that overrides this option if it is set to *Nej*. This means that you can allow only certain people to have a negative balance.
* `days_pin` - How many days will pass until the user has to enter the PIN code again. Notice that if you change the PIN code all users will have to immediately enter the new PIN code.
* `minutes` - How far back the list of transactions will go in minutes. Apart from this limit the maximum number of transactions in this list is 10.

### Acount balance email reminders

## Deploy web app to Heroku
Now you will deploy the web app to Heroku.
1. In your Google Sheet and click the menu item **Admin** -> **Skapa ny webapp (Heroku)**.
   1. If it says *Behörighet krävs* click **Fortsätt** and then select your Google account.
   2. It will say that the app is not verified. This is OK. Click **Avancerat** and then click **Öppna Strecklista (osäkert)**. Choose confirm on any remaining dialog windows.
2. Finally press the button that says *Deploy to Heroku*.
3. After you have signed in at Heroku a dialog for deploying the app is shown. The name you choose will be the URL of your web app. For example if you choose *min-strecklista* the URL will be <https://min-strecklista.herokuapp.com>. Choose something descriptive, but still memorable and short. Now choose *Europe* as region and then click **Deploy app**.
 ![Create new app](https://user-images.githubusercontent.com/28558941/31045191-5a5c7462-a5de-11e7-9e2f-0e26e141b625.png "Create new app")
4. Your web app should now be live and working!

# Usage
## User

## Admin
### Send out balance reminders

# Update to new versions
In order to update the app you need to first figure out if the version requires a *Sheet update* or not. You can do that by checking the latest version in the [changelog](/CHANGELOG.md).

## Update database Sheet
You can skip directly to [Update web app](#update-web-app) if the new version does not require a Sheet update.
First you will update the backup file, then create a new Sheet and finally import the backup file into the new one.
1. Open your Google Sheet and click **Admin** -> **Backup / Återsällning...**.
2. Click **Ladda ner fil** and then click the link to download the backup file. **Do not** lose this file!
3. Follow all the steps in [Create database server (Google Sheet)](#create-database-server-google-sheet) to create a new Sheet from the template (but now it will be the latest version). Put it in the same folder as the previous one.
4. In the new Sheet file click **Admin** -> **Backup / Återsällning...** and then scroll down to *Återställning*.
5. Select your downloaded file from step 2 and then click **Återställ**.
6. Check the imported data to make sure that everything has been uploaded. If everything looks OK, you can safely remove the old Sheet file. If not, complete step 2 (create backup file) and try from step 4 again (upload file).
7. Follow the steps below in [Update web app](#update-web-app) to create new version of the web app.

## Update web app
1. Go to [Heroku](https://dashboard.heroku.com) and navigate to your app.
2. Go to **Settings**, scroll down and click **Delete app...** and follow the instructions to delete the app. **Don't worry**, all your data is safe.
3. Follow the steps in [Deploy web app to Heroku](#deploy-web-app-to-Heroku) and set the name as the previous name (to keep the URL).

# Usage

# Contributing
If you have an idea for a new feature or found a bug please [create a new issue](https://github.com/JohanWinther/strecklista/issues/new).

A valid issue should
* Have an appropriate label
* Describe the idea/issue
* Back up the idea/issue with good enough arguments
* State your intentions, e.g. are you going to code it yourself and make a pull request or want someone else to do it

If the issue is well recieved, you can create a fork and start coding. A bad issue will lower the chances of approval for your pull request!
