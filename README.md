# Refund Pros Single Page Application (SPA)

## Quick access
The application is running in a Docker container on https://refundprosspa-app-20230429162137.blackplant-56245ead.australiaeast.azurecontainerapps.io/
## Build
The project was developed using Visual Studio 2022 Community Edition and .NET 6.0.16.

## Using local dB instead
The project has the Azure dB preset, so there's no need to deploy dB on the local machine, however it is possible by changing connection string in appsettings.json file:

![image](https://user-images.githubusercontent.com/132027003/235334006-91f17224-2cff-4068-af5d-ead2f4b5cb21.png)

And changing used connection string in RefundProsContext.cs file from:
![image](https://user-images.githubusercontent.com/132027003/235334050-761ce6c6-8bf6-4200-8935-fe58d8677651.png)\
To:\
![image](https://user-images.githubusercontent.com/132027003/235334071-d4bc3a8e-ea44-4646-968c-bddf96c34b11.png)

## Repopulating dB
Every time the application starts it prompts you if you want to repopulate database, repopulating means the database is cleared out and repopulated via the https://jsonplaceholder.typicode.com/ REST API.

![image](https://user-images.githubusercontent.com/132027003/235334275-f5777df5-efbf-49d8-ac2c-518327dd7f07.png)
