Development guide


Introduction
The product is a prediction-based system that allows the organization's relevant employees to predict and anticipate the surplus agricultural produce among farmers and plan the weekly/monthly work arrangements effectively, thus collecting more produce for those who require it while saving time and budgets. Despite the time limit, we expect that the final system will offer a high-quality solution to Leket as a web application to use in future agricultural planning. 
As we proceed with the development, our team remains committed to delivering a top-tier solution that enhances Leket's agricultural planning capabilities. With our prediction-based system, our project support Leket's mission by ensuring the efficient collection and distribution of surplus agricultural produce, ultimately making a positive impact on the communities and individuals served



Project Structure
1) Helpers Folder:
The "Helpers" folder contains a single file ‘db.js’ that is responsible for building and updating the database. This file effectively utilizes the "user.model" and "result.model" to ensure seamless database management.
The purpose of the "Helpers" folder is to encapsulate various utility functions and methods that streamline database interactions.

2) Middleware Folder - Need to be completed & integrate its functions in the code:
Each file in this folder serves a distinct purpose, contributing to the overall security, authorization, error handling, and data validation processes. We prepared the skeleton code for security handling, we used JSON Web Token mechanism.
1. admin.js: The "admin.js" file handles administrative access within the application. It is responsible for verifying the credentials and permissions of users by their roles. By implementing authentication mechanisms, "admin.js" ensures that only authorized matched roles can access and perform matched tasks, protecting sensitive functionalities from unauthorized access.
2. authorize.js: The "authorize.js" file is a controlling access making sure the authorized users can only access the parts of the application that they are allowed to interact with. This enhances security and protects sensitive data from unauthorized users.
3. errorhandler.js: The "errorhandler.js" file serves as a centralized error-handling middleware, ensuring that errors and exceptions occurring during request processing are managed. It captures and handles errors, providing meaningful responses to clients while preventing application crashes. 
4. validate-request.js: The "validate-request.js" file focuses on request validation, ensuring that incoming data and requests adhere to predefined rules and constraints.

3) Processing Folder:
The "processing" folder plays a vital role in data proccessing and manipulation in order to fit the ML model by this data. It comprises three essential files:
1. data_processing.py: This Python file is responsible for data cleansing, adjustment, and processing tasks. It contains the necessary code to ensure data integrity and prepare it for further analysis.
2. data_processing.js: The JavaScript code in this file acts as a bridge between Python and Node.js environments, facilitating data exchange between the two languages.
3. processing.controller.js: Following the Model-View-Controller (MVC) architectural pattern, the "processing_controller.js" serves as a intermediary between the user interface and the data layer. It is responsible for handling user requests for the processing functions, routing them to appropriate functions, and interacting with the model to access and modify data, and manages relevant errors if needed.

4) Results Folder:
The "Results" folder is responsible for managing the results of the predictions after by running the ML model and the uploading the results’ table to the database.
1. results.model.js: The `results.model.js` file plays a central role in constructing an object representing the results table in our database. It defines the schema and structure of the results table, facilitating efficient data storage and retrieval.
2. results.controller.js: It is responsible for handling user requests for the results showing functions, routing them to appropriate functions, and interacting with the model to access and modify data, and manages relevant errors if needed.
3. results.service.js: The `results.service.js` file contains all the functions utilized by the results table. It acts as a service layer that abstracts the database interactions from the controller. This separation of concerns promotes code organization and makes it easier to manage data-related operations.
4. runPredModel.js: The `runPredModel.js` file serves as a bridge between Python and Node.js environments, enabling data exchange between the two languages for running and retrieving results from the prediction model.
5. predictionModel.py: The `predictionModel.py` file houses the Python code that implements the prediction model. This file contains the necessary algorithms and calculations to make accurate predictions based on the provided data. It leverages various machine learning or statistical techniques to generate predictions.
6. utils.py: The `utils.py` file contains references and utility functions utilized in the prediction model. It offers a collection of helper functions that assist in data preprocessing, feature engineering, or other tasks related to the prediction process.
5) Users Folder:
user.mode.js: The `user.model.js` file plays a central role in constructing an object representing the results table in our database. It defines the schema and structure of the user's table.
user.service.js: The `user.service.js` file contains all the functions utilized by the user's table. It acts as a service layer that abstracts the database interactions from the controller. This separation of concerns promotes code organization and makes it easier to manage data-related operations.
user.controller.js: It is responsible for handling user requests for the siginin up, signing in, and for handling the permission controlling, routing requests to appropriate functions, and interacting with the model to access and modify data, and manages relevant errors if needed.
usersExamples.txt: Contains examples of how the user's table will look in the database.

6) Uploads Folder:
NOTE: DO NOT DELETE this folder even if it is empty. This folder is used by the processing code for handling the uploading CSV file.

7) Additional file used in the back end:
1. config.json: The `config.json` file stores configuration settings and parameters values enabling automatic connection to the server. In general, it is commonly used to store environment-specific variables, database connection strings, API keys, and other settings that can be accessed by the application during runtime. 
2. package.json: The `package.json` file is a fundamental part of Node.js projects. It is used to define the metadata and dependencies of the application. This file includes information such as the project name, version, description, author, and entry points. Additionally, it lists all the dependencies required for the application to run. These dependencies can be third-party libraries or modules that the application relies on. The `package.json` file is crucial for package management, version control, and easy setup of the application on other systems.
3. package-lock.json: The `package-lock.json` file is automatically generated when using npm (Node Package Manager) to install or update packages. It ensures that the exact version of each package's dependencies is installed, preventing potential discrepancies between development and production environments. The `package-lock.json` file is essential for maintaining consistent and reproducible builds across different machines and is crucial for deterministic package resolution.
4. README.md: The `README.md` file is a Markdown document that serves as a project's main documentation. It contains essential information about the project, including its purpose, installation instructions, usage guidelines, and contribution guidelines. Developers and users can refer to the `README.md` file to understand how the project works, how to set it up, and how to contribute to its development. It acts as a central point of reference for anyone interacting with the project.
5. passport-config.js: The `passport-config.js` file is related to authentication and authorization in Node.js applications. It is used to configure and set up Passport.js, which is a popular authentication middleware for Node.js. The file defines various authentication strategies, such as local authentication (username and password) or third-party authentication (OAuth, Google, Facebook, etc.). It also includes logic for handling user authentication and authorization, managing sessions, and controlling access to protected routes.
6. server.js file: The `server.js` file serves as the entry point for the Node.js application. It contains code to set up and configure the web server, such as Express.js. The file typically includes middleware setup, route configuration, and database connections. Additionally, it listens for incoming HTTP requests and dispatches them to the appropriate routes or controllers. The `server.js` file is responsible for starting the application and making it available for users to access and interact with.



Connections
The connection between Python and the Backend:
To enable communication between Python and the Node.js backend, we leveraged the `child_process` module in Node.js. Specifically, we used the `spawn` function to create a child process that runs the Python application. This approach allowed us to seamlessly interact with Python scripts from the Node.js environment. The Python child process communicates with the Node.js parent process through inter-process communication (IPC) mechanisms. This connection was established in both the "Result" and "Processing" files, allowing Python scripts to perform data processing and predictions while benefiting from the Node.js backend's features and functionalities.

The connection between Backend and Database (using Python):
For database interaction in the backend, we utilized Python's `pyodbc` library. Specifically, we made use of the `cursor` object provided by `pyodbc`, which allowed us to interact with the database. The `cursor` object enabled us to execute SQL queries, retrieve data, and perform various database operations. By using Python's capabilities in conjunction with the backend, we ensured efficient and secure management of data stored in the database. This connection was established in both the "Result" and "Processing" files, allowing seamless database interactions for various operations within the application.

The connection between Frontend and Backend (using Node.js):
To establish a connection between the front and the back end, we relied on Node.js with the popular library `Axios`. Axios is a JavaScript library that simplifies making HTTP requests from the front end to the back end. With Axios, we were able to send asynchronous HTTP requests to the server, enabling smooth communication between the two layers. Additionally, Axios supports various HTTP methods (e.g., POST, GET, PUT, DELETE), providing flexibility in sending data to the server or modifying existing data. Moreover, Axios offers features like request cancellation, request, and response interceptors, and the ability to set headers and configure timeouts, enhancing the overall frontend-backend communication experience. This connection allowed us to efficiently retrieve data from the backend, perform actions on the server, and update the user interface accordingly.

The connection between Python and Government Databases (using API):
For interfacing with government databases via an API, we utilized Python's `urllib` library. The `urllib` library is a part of Python's standard library and offers functions for handling URLs and performing web-related tasks. Using `urllib`, we were able to fetch data from specific URLs corresponding to the government databases, send HTTP requests to the APIs, and handle URL encoding as needed. This connection enabled seamless access to government databases, allowing us to retrieve relevant data to enrich the application's functionalities.

Data processing main functions
The code is a Python script that performs various data processing tasks, including reading data from external sources, processing and merging data, creating a database table, and performing encoding operations. Let's go through each function in the script and explain its purpose, input, and output:
 `to_db_table(file)`: This function connects to a SQL Server database and performs several data processing tasks to create and populate a table named "merged" in the database. The input is a file path, and the function does not return anything.
`import_table_as_df(table_name, cursor)`: This function reads data from an existing table in the database with the given `table_name` and returns the data as a DataFrame.
 `read_data_url_years(url, years)`: This function reads data from a specified URL and returns the data as a DataFrame. The URL is augmented with the `years` parameter to filter the data by year.
 `read_data_url(url)`: This function reads data from a specified URL and returns the data as a DataFrame.
`create_dfs(file)`: This function creates and returns several DataFrames by reading data from different sources, including local files and URLs.
`change_cols_type_float(cols, df)`: This function changes the data type of specific columns to float in the given DataFrame and returns the modified DataFrame.
`replace_word(text, old_word, new_word)`: This function replaces occurrences of `old_word` with `new_word` in the given `text` and returns the modified text.
`create_dis_data(data, dist)`: This function processes and merges data from the input DataFrame `data` with the `dist` DataFrame and returns the processed and merged DataFrame.
`final_processing(file)`: This is the main processing function that performs the final data processing steps, including data preprocessing, joining data, generating Hebrew holiday dates, and creating a DataFrame `data1`. The processed DataFrame `data1` is returned.
`process(data)`: This function processes the input DataFrame `data` to create a new DataFrame named `pivot`, containing aggregated data for each week and food-district-location combination. The function returns the `pivot` DataFrame.
`exctract_week_num(date)`: This function extracts the week number from a given date in the format "YYYY-MM-DD" and returns the week number as an integer.
`preprocess_train(y_train)`: This function preprocesses the input DataFrame `y_train` to prepare the data for training. It adds new columns, generates week numbers and year values, and encodes categorical variables. The function returns the preprocessed DataFrame.
`dis_id(dis)`: This function maps the district name `dis` to an integer identifier representing the district type (e.g., "דרום" -> 1, "צפון" -> 2, etc.).
`calculate_hebrew_holidays(holidays, start_year, end_year)`: This function calculates Hebrew holiday dates for a specified year range based on the holiday dates in the `holidays` DataFrame for the year 2022. The calculated holiday dates are stored in the `holiday_dates` and `holiday_dates_E` lists.



Prediction model main functions

This code is a Python script that uses various libraries and modules to perform predictive modeling using a random forest regression model. Let's break down the code and understand its functionalities:
Importing Libraries: The code imports several libraries that are used throughout the script, such as NumPy, Pandas, Scikit-learn (for the machine learning model), datetime, io, json, asyncio, utils, CSV, math, and pyodbc.
Data Preparation: The script reads data from the DB table named "merged" and performs some data preprocessing to create a test dataset.

Functions:
`modify_selected_list`: This function takes a selected_item and returns a list of selected_items_list based on different conditions.
`create_test`: This function takes various input parameters (startDate, endDate, maxTemp, minTemp, rain, snow, hail, gale, kind, holidayStartDate, holidayEndDate) along with data and creates a test DataFrame.
`extract_week_num`: This function extracts the week number from a given date.
`sesoan`: This function maps the month to a season (1, 2, 3, or 4).
`get_predict`: This function takes a selected_item, test DataFrame, and data DataFrame as input and returns the R-squared score and a result DataFrame after training a random forest regression model on the data.
`get_district_and_food`: This function extracts the district and food information from a given zone.
`main`: This function is the entry point of the script. It performs the following steps:
- Calls `create_test` to create the test DataFrame based on the provided input parameters.
- Calls `get_result` to get the R-squared score and the result DataFrame.
- Reads the results from a CSV file named "result1.csv" into a list of dictionaries.
- Creates a response JSON containing the list of results and the R-squared score.
- Prints the response JSON.

Command Line Arguments: The script reads command-line arguments using `sys.argv`. It expects the following command-line arguments in order:
   - startDate
   - endDate
   - maxTemp
   - minTemp
   - rain
   - snow
   - hail
   - gale
   - kind
   - holidayStartDate
   - holidayEndDate
   If the values for holidayStartDate and holidayEndDate are not provided, they are set to 0.
Asynchronous Execution: The script uses the `asyncio` library to run the main function asynchronously.

Execution: The script executes the main function with the provided command-line arguments.
For successful execution, ensure that you have the required data and the correct file paths for the CSV files. Also, consider providing appropriate command-line arguments when running the script.



DataBase
The project uses a Microsoft SQL Server database to store and manage various datasets related to districts, locations, government settlements, processed data, prediction results, and user information. The database is a critical component of the system and supports data processing, predictive modeling, and user management functionalities.

Table Descriptions:
1. `dbo.Dis_Loc`:
   - Description: This table contains data about districts and their corresponding locations. It serves as a fundamental reference for geographical information within the system.
   - Usage: The table should be uploaded manually before running the system. It provides essential data for mapping districts and locations used in various analyses.
- User must upload the data to the table manually before starting from this link.
2. `dbo.Government_Settlements`:
   - Description: This table holds data about districts obtained from government sources. It provides additional information related to the districts, which complements the `dbo.Dis_Loc` table.
   - Usage: Similar to `dbo.Dis_Loc`, this table must be uploaded manually before running the system. It enriches the geographical data and helps in making more informed decisions during data processing and analysis.
- User must upload the data to the table manually before starting from this link
3. `dbo.merged`:
   - Description: The `dbo.merged` table is created after running the data processing file. It contains processed data obtained by combining and transforming data from multiple sources.
   - Usage: This table serves as the main dataset for the predictive modeling algorithm. It contains features and labels required for training and testing the machine learning model.
4. `dbo.Results`:
   - Description: The `dbo.Results` table is created when running the `helpers.db.js` file. It is used to store prediction results obtained from the predictive algorithm.
   - Usage: After executing the prediction algorithm, the results are stored in this table, providing a historical record of predictions for various districts and locations.
5. `dbo.Users`:
   - Description: The `dbo.Users` table is created when running the `helpers.db.js` file and is used for user management within the system.
   - Usage: This table stores information about registered users, including their credentials and other relevant details. It enables secure access to the system and allows personalized user experiences.


