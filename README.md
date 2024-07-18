# Development Guide

### [GitHub Repository](https://github.com/ritaibraheem/src.git)

---

## Introduction

The product is a prediction-based system that allows the organization's relevant employees to predict and anticipate the surplus agricultural produce among farmers and plan the weekly/monthly work arrangements effectively. This enables the collection of more produce for those who require it while saving time and budgets. Despite the time limit, we expect that the final system will offer a high-quality solution to Leket as a web application to use in future agricultural planning.

As we proceed with the development, our team remains committed to delivering a top-tier solution that enhances Leket's agricultural planning capabilities. With our prediction-based system, we support Leket's mission by ensuring the efficient collection and distribution of surplus agricultural produce, ultimately making a positive impact on the communities and individuals served.

## Project Structure

### 1. Helpers Folder
- **db.js**: Responsible for building and updating the database, utilizing "user.model" and "result.model" for seamless database management.

### 2. Middleware Folder
- **admin.js**: Handles administrative access, verifying user credentials and permissions by roles.
- **authorize.js**: Controls access to ensure authorized users can only interact with permitted parts of the application.
- **errorhandler.js**: Centralized error-handling middleware, managing errors and providing meaningful responses.
- **validate-request.js**: Ensures incoming data and requests adhere to predefined rules and constraints.

### 3. Processing Folder
- **data_processing.py**: Handles data cleansing, adjustment, and processing tasks.
- **data_processing.js**: Bridges Python and Node.js environments for data exchange.
- **processing.controller.js**: Manages user requests for processing functions, interacting with the model to access and modify data.

### 4. Results Folder
- **results.model.js**: Constructs the results table schema in the database.
- **results.controller.js**: Handles user requests for displaying results.
- **results.service.js**: Contains functions utilized by the results table.
- **runPredModel.js**: Bridges Python and Node.js for running and retrieving prediction model results.
- **predictionModel.py**: Implements the prediction model using machine learning techniques.
- **utils.py**: Contains utility functions for data preprocessing and feature engineering.

### 5. Users Folder
- **user.model.js**: Constructs the user table schema in the database.
- **user.service.js**: Contains functions utilized by the user table.
- **user.controller.js**: Manages user requests for signing in, signing up, and permission control.
- **usersExamples.txt**: Contains examples of how the user table will look in the database.

### 6. Uploads Folder
- **Note**: Do not delete this folder. It is used for handling CSV file uploads.

### 7. Additional Files Used in the Backend
- **config.json**: Stores configuration settings and parameters for automatic server connection.
- **package.json**: Defines metadata and dependencies of the Node.js project.
- **package-lock.json**: Ensures consistent and reproducible builds across different environments.
- **README.md**: Contains essential project information, installation instructions, and usage guidelines.
- **passport-config.js**: Configures Passport.js for authentication and authorization.
- **server.js**: Entry point for the Node.js application, setting up and configuring the web server.

## Connections

### Python and the Backend
- **child_process module**: Uses the `spawn` function to create a child process running the Python application, enabling interaction between Python scripts and the Node.js environment.

### Backend and Database (using Python)
- **pyodbc library**: Uses the `cursor` object for database interactions, executing SQL queries and managing data operations.

### Frontend and Backend (using Node.js)
- **Axios library**: Simplifies making HTTP requests from the front end to the back end, supporting various HTTP methods and enhancing frontend-backend communication.

### Python and Government Databases (using API)
- **urllib library**: Handles URLs and performs web-related tasks, enabling access to government databases and retrieving relevant data.

## Data Processing Main Functions
- **to_db_table(file)**: Connects to a SQL Server database and creates the "merged" table.
- **import_table_as_df(table_name, cursor)**: Reads data from a database table and returns it as a DataFrame.
- **read_data_url_years(url, years)**: Reads data from a URL filtered by year.
- **read_data_url(url)**: Reads data from a URL and returns it as a DataFrame.
- **create_dfs(file)**: Creates and returns DataFrames by reading data from different sources.
- **change_cols_type_float(cols, df)**: Changes the data type of specified columns to float.
- **replace_word(text, old_word, new_word)**: Replaces occurrences of `old_word` with `new_word` in the given text.
- **create_dis_data(data, dist)**: Processes and merges data from input DataFrames.
- **final_processing(file)**: Performs final data processing steps, including data preprocessing and joining data.
- **process(data)**: Creates a new DataFrame with aggregated data for each week and location.
- **exctract_week_num(date)**: Extracts the week number from a given date.
- **preprocess_train(y_train)**: Prepares data for training, adding new columns and encoding categorical variables.
- **dis_id(dis)**: Maps district names to integer identifiers.
- **calculate_hebrew_holidays(holidays, start_year, end_year)**: Calculates Hebrew holiday dates for a specified year range.

## Prediction Model Main Functions
- **modify_selected_list**: Returns a list of selected items based on conditions.
- **create_test**: Creates a test DataFrame based on input parameters.
- **extract_week_num**: Extracts the week number from a given date.
- **sesoan**: Maps the month to a season.
- **get_predict**: Trains a random forest regression model and returns the R-squared score and result DataFrame.
- **get_district_and_food**: Extracts district and food information from a given zone.

## Database
The project uses a Microsoft SQL Server database to store and manage various datasets. It supports data processing, predictive modeling, and user management functionalities.

### Table Descriptions
- **dbo.Dis_Loc**: Contains data about districts and their locations.
- **dbo.Government_Settlements**: Holds data about districts obtained from government sources.
- **dbo.merged**: Created after running the data processing file, containing processed data for predictive modeling.
- **dbo.Results**: Stores prediction results from the predictive algorithm.
- **dbo.Users**: Manages user information and credentials.

---

For more details, please take a look at the [GitHub Repository](https://github.com/ritaibraheem/src.git).
