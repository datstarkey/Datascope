# Datascope Interview Task

Please see a demo of this running at (https://datascope.jakestarkey.dev)

## Variables

Please configure the DatascopeTask/appsettings.json with your own SQL string to access your database.

If you run the backend on a different port other that 5003 in the launchsettings, please change the ClientApp/package.json proxy to your new port.




## Packages Used
Create-React-App Typescript was used to generate most of the react app.
Using Jest and Enzyme for frontend Tests.
(https://ant.design/) was used as the css framework.

EntitityFramework core was used for database managment for MySql.
JWT used for authentication.
Nunit Tests used for the test project.


Tests project will run through some basic tests including authorization, it will use an internal memory database instead of the live one.

.SLN located in the datascopeTask folder.