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

# Installation
## Requirements
* Google account (with Sheets language set as Swedish)
* Heroku account
* No previous coding experience!
* Some knowledge of Google Sheets / Excel

## General information
The application is comprised of 2 parts: one database server (Google Sheets) and one web app server (Heroku). The web app is accessed via a web browser and sends server requests to the database. Installation of the app will then be in 2 steps, first the database and then the web app.

## Create database server (Google Sheet)
First you will make a database Sheet from a template and enable it for web requests.
1. Go to [this Google Sheet](https://docs.google.com/spreadsheets/d/1gPa05XEx8V-suxmafw6fqGoaCoEWWZ85tGntNz_isi8/edit?usp=sharing "Database template Sheet").
2. Make a copy to your own Drive by clicking **Arkiv** -> **Kopiera...**. Give it a good name and place it in an empty folder where you can find it later.
3. Open the Sheet and then click the menu item **Verktyg** -> **Skriptredigerare...**.
4. In the new tab click the menu item **Publicera** -> **Implementera som webapp...**.
5. Select the following settings below and then click **Implementera**.
![Settings for web app](https://user-images.githubusercontent.com/28558941/31045184-3c29a8fc-a5de-11e7-8154-4d9814c28fd2.png "Settings for web app")

## Deploy web app to Heroku
Now you will deploy the web app to Heroku.
1. Open your Google Sheet and click the menu item **Admin** -> **Skapa ny webapp (Heroku)**.
   1. If it says *Behörighet krävs* click **Fortsätt** and then select your Google account.
   2. It will say that the app is not verified. This is OK. Click **Avancerat** and then click **Öppna Strecklista (osäkert)**. Choose confirm on any remaining dialog windows.
2. Finally press the button that says *Deploy to Heroku*.
3. After you have signed in at Heroku a dialog for deploying the app is shown. The name you choose will be the URL of your web app. For example if you choose *min-strecklista* the URL will be <https://min-strecklista.herokuapp.com>. Choose something descriptive, but still memorable and short. Now choose *Europe* as region and then click **Deploy app**.
 ![Create new app](https://user-images.githubusercontent.com/28558941/31045191-5a5c7462-a5de-11e7-9e2f-0e26e141b625.png "Create new app")
4. Your web app should now be live!

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

# Changelog
Can be found [here](/CHANGELOG.md) and contains the most important changes starting from release 1.0.0.
