# Import necessary libraries
from sklearn.preprocessing import LabelEncoder
import pandas as pd
from datetime import datetime
import datetime
from importlib import reload
import urllib.request
import pyodbc
import asyncio
import sys
import json

# Get the filename to process from the command line arguments
file_to_process = sys.argv[1]

# Set up database connection information
server = 'leket1.database.windows.net'
database = 'leketDB'
username = 'sql'
password = 'Leket1234T'
driver = '{ODBC Driver 17 for SQL Server}'  # Driver for Azure SQL Database
connection_string = f"DRIVER={driver};SERVER={server};DATABASE={database};UID={username};PWD={password};charset=utf-8"


async def to_db_table(file):
    try:
        # Attempt to execute the following code within the 'try' block

        # Connect to the database using the provided connection string
        conn = pyodbc.connect(connection_string)
        cursor = conn.cursor()

        # Perform some data processing on 'file' and store the result in 'merged'
        merged = final_processing(file)

        # Save the first 50 rows of 'merged' DataFrame to a CSV file named 'Final Merged to database.csv'
        first_50_rows = merged.head(50) #TODO: DELETE THIS LINE CODE

        # Decode any byte-encoded values in the 'first_50_rows' DataFrame (if any)
        df_decoded = first_50_rows.applymap(lambda x: x.decode('utf8') if isinstance(x, bytes) else x)

        # Set the table name for the database
        table_name = 'merged'

        # Check if the table with the specified name already exists in the database
        table_exists = False
        query = "SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE='BASE TABLE'"
        cursor.execute(query)
        tables = cursor.fetchall()
        for table in tables:
            if table_name == table[0]:
                table_exists = True

        # If the table already exists, drop it to create a new one (cleanup step)
        if table_exists:
            drop_table_sql = f"DROP TABLE {table_name}"
            cursor.execute(drop_table_sql)
            cursor.commit()

        # Define the SQL statement for creating the 'merged' table
        create_table_sql = """
            CREATE TABLE merged (
                Zone NVARCHAR(50),
                Year_Weeks NVARCHAR(50),
                Quantity FLOAT,
                Week INT,
                Location NVARCHAR(50),
                Food NVARCHAR(50),
                Dis_Location_id INT,
                Food_id INT,
                Zone_id INT,
                Season INT,
                District FLOAT,
                Dis_Location INT,
                Date DATETIME,
                Max_temp FLOAT,
                Min_temp FLOAT,
                Year FLOAT,
                Month FLOAT,
                Day FLOAT,
                Snow FLOAT,
                Hail FLOAT,
                Gale FLOAT,
                Rain_06_next FLOAT,
                Rain_code FLOAT,
                Holiday FLOAT
            );"""
        
        # Execute the SQL statement to create the 'merged' table
        cursor.execute(create_table_sql)

        # Define a list of columns that need to be encoded (converted to Unicode) before inserting into the database
        columns_to_encode = ['Food', 'District', 'Location', 'Dis_Location']

        # Convert DataFrame 'df_decoded' to a list of tuples with encoded Hebrew values
        rows = []
        for _, row in df_decoded.iterrows():
            encoded_row = []
            for item in row.items():
                column_name = item[0]  # Get the column name
                column_value = item[1]  # Get the column value
                if column_name in columns_to_encode and isinstance(column_value, bytes):
                    encoded_item = column_value.decode('utf8')
                else:
                    encoded_item = column_value
                encoded_row.append(encoded_item)
            rows.append(tuple(encoded_row))

        # Insert the rows into the 'merged' table
        placeholders = ','.join(['?' for _ in range(len(df_decoded.columns))])
        sql = f"INSERT INTO merged VALUES ({placeholders})"
        cursor.executemany(sql, rows)
        cursor.commit()
        # print('Table Uploaded Successfuly to DB')

        # Execute a SQL query to fetch all rows from the 'merged' table
        query = 'SELECT * FROM merged'
        cursor.execute(query)

        # Fetch all rows from the database as a list of dictionaries
        rows = cursor.fetchall()

        # Get column names from the cursor description
        columns = [column[0] for column in cursor.description]

        # Convert the fetched data to a DataFrame 'df'
        df = pd.DataFrame.from_records(rows, columns=columns)

        # Encode each Hebrew value in the DataFrame to handle Unicode correctly
        for column in df.columns:
            df[column] = df[column].apply(lambda x: x.encode('utf-8').decode('utf-8') if isinstance(x, str) else x)

        # Close the database connection
        conn.close()
        # print("close the connection")
        # print('*******************************************')

        return 'SUCCESS'
    
    except pyodbc.Error as e:
        # If an error occurs during the execution of the code within the 'try' block, handle the exception here
        print("Error connecting to the database:", e)

def import_table_as_df(table_name, cursor):
    try:
        # Retrieve the data from the table
        query = f"SELECT * FROM [{table_name}]"
        cursor.execute(query)

        # Encode Hebrew characters to UTF8
        rows = cursor.fetchall()
        encoded_rows = []
        for row in rows:
            encoded_row = [item.encode('utf8').decode('utf8') if isinstance(item, str) else item for item in row]
            encoded_rows.append(encoded_row)

        # Create DataFrame from the encoded data
        columns = [column[0] for column in cursor.description]
        df = pd.DataFrame(encoded_rows, columns=columns)
        return df

    except pyodbc.Error as e:
        # If an error occurs during the execution of the code within the 'try' block, handle the exception here
        print("Error connecting to the database:", e)

def read_data_url_years(url, years):
    # trying to read the URL but with no internet connectivity
    url1 = url + '&filters={"year":"2010"}'
    fileobj = urllib.request.urlopen(url1)
    dic = json.load(fileobj)
    df = pd.DataFrame(dic['result']['records'])
    
    try:
        for year in years:
            if year == 2010:
                continue
            url1 = url + '&filters={"year":"' + str(year) + '"}'
            fileobj1 = urllib.request.urlopen(url1)
            dic = json.load(fileobj1)
            if len(dic['result']['records']) == 0:
                break
            df1 = pd.DataFrame(dic['result']['records'])
            df = pd.concat([df, df1])
        return df

    # Catching the exception generated     
    except Exception as e:
        # If an exception occurs during the execution of the code within the 'try' block, handle the exception here
        print(str(e))

def read_data_url(url):
    # trying to read the URL but with no internet connectivity
    try:
        fileobj = urllib.request.urlopen(url)
        dic = json.load(fileobj)
        df = pd.DataFrame(dic['result']['records'])
        return df

    # Catching the exception generated
    except Exception as e:
        print(str(e))

def create_dfs(file):
    try:
        conn = pyodbc.connect(connection_string)
        cursor = conn.cursor()

        # data = pd.read_excel(file)
        data = pd.read_csv(file)
        years = pd.to_datetime(data['Timestamp']).dt.year
        years = years.unique().tolist()
        years.sort()

        # Database Tables
        dist = import_table_as_df('Government Settlements', cursor)
        disloc = import_table_as_df('Dis_Loc', cursor)

        # API
        station = read_data_url(
            'https://data.gov.il/api/3/action/datastore_search?resource_id=83841660-b9c4-4ecc-a403-d435b3e8c92f&limit=50000')
        # station = pd.read_csv(r"C:\Users\DELL\mssql\src\processing\local files\new_stn_table_web.csv")
        station = station.astype({'stn_num': 'int64'})

        rain = read_data_url_years(
            'https://data.gov.il/api/3/action/datastore_search?resource_id=e80b470f-fcbc-4987-a685-d4fbefbd75d1&limit=50000', years)
        # rain = pd.read_csv(r"C:\Users\DELL\mssql\src\processing\local files\new_isr_rain_daily_web.csv")
        rain = rain.astype({'stn_num': 'int64'})

        data_w = read_data_url_years(
            'https://data.gov.il/api/3/action/datastore_search?resource_id=cee3ad4a-4e77-4015-8245-52505417d7ea&limit=50000', years)
        # data_w = pd.read_csv(r"C:\Users\DELL\mssql\src\processing\local files\new_isr_daily_data_web.csv")
        data_w = data_w.astype({'stn_num': 'int64'})
        data_w_cols = ['tmp_air_max', 'tmp_air_min', 'rpr_gale', 'rpr_hail', 'rpr_snow', 'year', 'month', 'day']
        data_w = change_cols_type_float(data_w_cols, data_w)

        holidays = read_data_url(
            'https://data.gov.il/api/3/action/datastore_search?resource_id=67492cda-b36e-45f4-9ed1-0471af297e8b')
        conn.close()

        return [data, dist, disloc, station, rain, data_w, holidays]
        # return holidays

    except pyodbc.Error as e:
        print("Error connecting to the database:", e)

def change_cols_type_float(cols, df):
    for col in cols:
        df[col] = df[col].astype(float)  # Convert the column to float
    return df

def replace_word(text, old_word, new_word):
    return text.replace(old_word, new_word)

def create_dis_data(data, dist):
    # Replace specific words in the "Location" and "Food" columns of the "data" DataFrame
    data['Location'] = data['Location'].astype(str)
    data['Location'] = data['Location'].apply(replace_word, args=('קיבוץ', '')).str.strip()
    data['Location'] = data['Location'].apply(replace_word, args=('בקע אל גרביה', 'באקה אל-גרביה')).str.strip()
    data['Location'] = data['Location'].apply(replace_word, args=("בקה ג'ת", 'באקה אל-גרביה')).str.strip()
    data['Location'] = data['Location'].apply(replace_word, args=("באקה אל גרביה", 'באקה אל-גרביה')).str.strip()
    data['Food'] = data['Food'].astype(str)
    data['Food'] = data['Food'].apply(replace_word, args=('(א)', '')).str.strip()
    data['Food'] = data['Food'].apply(replace_word, args=('(ד)', '')).str.strip()
    data['Food'] = data['Food'].apply(replace_word, args=('(ק)', '')).str.strip()
    data['Food'] = data['Food'].apply(replace_word, args=('(דולב איטלקי)', '')).str.strip()
    data['Food'] = data['Food'].apply(replace_word, args=('(מ)', '')).str.strip()
    data['Food'] = data['Food'].apply(replace_word, args=('(ה)', '')).str.strip()
    data['Food'] = data['Food'].apply(replace_word, args=('(ד"כ)', '')).str.strip()

    # Prepare the data and dist DataFrames for merging
    data['Location'] = data['Location'].astype(str)
    dist['Location'] = dist['Location'].astype(str)
    dist['Location'] = dist['Location'].str.strip()
    data['Location'] = data['Location'].str.strip()

    # Drop rows with missing values (NaNs) in the "data" DataFrame
    data = data.dropna()

    # Perform a left join of "data" and "dist" DataFrames on the "Location" column
    join = data.merge(dist, how='left', on='Location')

    # Drop rows where the "Location" value is 'nan' after the join
    join = join.drop(join[join['Location'] == 'nan'].index)

    # Drop rows with missing values (NaNs) after the join
    join = join.dropna()

    # Create a copy of the join DataFrame
    join2 = join.copy()

    # Return the modified "dist", "join", and "join2" DataFrames
    return dist, join, join2

# *****************************************
#  THE MAIN PROCESSING FUNCTION
# *****************************************
def final_processing(file):
# Step 1: Call the function 'create_dfs(file)' and unpack the returned DataFrames into separate variables.
    data, dist, disloc, station, rain, data_w, holidays = create_dfs(file)

    # Step 2: Data Preprocessing
    # Rename the 'date' column to 'timestamp' in the 'data' DataFrame.
    data = data.rename(columns={'date': 'timestamp'})

    # Drop unnecessary columns 'Description', 'Status', 'MissionID', 'LeketKind' from the 'data' DataFrame.
    data = data.drop('Description', axis=1)
    data = data.drop('Status', axis=1)
    data = data.drop('MissionID', axis=1)
    data = data.drop('LeketKind', axis=1)

    # Drop rows with missing values (NaNs) in the 'data' DataFrame.
    data = data.dropna()

    # Extract the years from the 'Timestamp' column in the 'data' DataFrame and store them as a sorted list in 'years'.
    years = pd.to_datetime(data['Timestamp']).dt.year
    years = years.unique().tolist()
    years.sort()

    # Step 3: Data Preprocessing and Feature Engineering
    # Call the 'create_dis_data(data, dist)' function to perform data preprocessing on 'data' and store the modified DataFrames in 'dist', 'join', and 'join2'.
    dist, join, join2 = create_dis_data(data, dist)

    # Convert the 'Timestamp' column in the 'join' DataFrame to datetime format.
    join['Timestamp'] = pd.to_datetime(join['Timestamp'])

    # Set the 'Timestamp' column as the index of the 'join' DataFrame.
    join = join.set_index('Timestamp')

    # Step 4: Feature Engineering
    # Call the 'proces(join)' function to perform feature engineering on the 'join' DataFrame and store the result in 'fdata'.
    fdata = proces(join)

    # Step 5: Further Data Processing
    # Call the 'preprocess_train(fdata)' function to perform additional data processing on 'fdata' and store the result in 'DATA'.
    DATA = preprocess_train(fdata)

    # Drop duplicate rows in 'join2' DataFrame based on the 'Location' column, keeping the first occurrence.
    join2 = join2.drop_duplicates(subset='Location', keep='first')

    # Drop unnecessary columns 'Food', 'Quantity', 'FarmerID', 'Timestamp' from 'join2' DataFrame.
    join2 = join2.drop(['Food', 'Quantity', 'FarmerID', 'Timestamp'], axis=1)

    # Strip leading and trailing whitespaces from the 'Dis_Location' and 'District' columns in 'join2' and 'DATA' DataFrames.
    join2['Dis_Location'] = join2['Dis_Location'].str.strip()
    join2['District'] = join2['District'].str.strip()
    DATA['Dis_Location'] = DATA['Dis_Location'].str.strip()

    # Apply the 'dis_id' function to the 'District' column in 'join2' DataFrame.
    join2['District'] = join2['District'].apply(dis_id)

    # Rename the 'Dis_Location' column in 'DATA' DataFrame to 'Location'.
    DATA.rename(columns={'Dis_Location': 'Location'}, inplace=True)

    # Perform a left join of 'DATA' and 'join2' DataFrames on the 'Location' column.
    DATA = DATA.merge(join2, on='Location', how='left')

    # Rename the 'stn_name_heb' column in the 'station' DataFrame to 'Location'.
    station.rename(columns={'stn_name_heb': 'Location'}, inplace=True)

    # Perform a merge of 'station' and 'disloc' DataFrames on the 'Location' column.
    merge1 = pd.merge(station, disloc, on='Location')

    # Drop unnecessary columns from 'merge1' DataFrame.
    merge1 = merge1.drop(['Location', 'stn_long', 'stn_lat', 'isr_grid_X', 'isr_grid_Y', 'stn_type', 'stn_hgt', 'date_open',
                        'date_close', 'stn_auto', 'stn_num_env', 'date_web_frst', 'date_web_last', 'yearly_rain'], axis=1)

    # Perform a merge of 'data_w' and 'merge1' DataFrames on the 'stn_num' column.
    merge2 = pd.merge(data_w, merge1, on='stn_num')

    # Drop unnecessary columns from 'merge2' DataFrame.
    merge2 = merge2.drop(['evp_cls_a_12', 'evp_cls_a_18', 'evp_cls_a_06_next', 'evp_cls_a_code', 'tmp_grass_min', 'sns_drt',
                        'rpr_hail', 'rpr_snow', 'monthyear', 'stn_name', 'rpr_frost', 'rpr_dew', 'rpr_fog', 'rpr_mist',
                        'rpr_thunder', 'rpr_lightening', 'rpr_sand_storm'], axis=1)

    # Group 'merge2' DataFrame by 'Dis_Location' and 'time_obs', and calculate the mean for each group.
    merge2 = merge2.groupby(['Dis_Location', 'time_obs']).mean()

    # Reset the index of 'merge2' DataFrame.
    merge2 = merge2.reset_index()

    # Filter 'merge2' DataFrame to include only rows with years between 2010 and the last year in 'years' list.
    merge2 = merge2[merge2['year'] >= 2010.0]
    merge2 = merge2[merge2['year'] <= years[-1]]

    # Rename columns in 'merge2' DataFrame for consistency.
    merge2.rename(columns={'time_obs': 'Date', 'year': 'Year', 'month': 'Month', 'tmp_air_max': 'Max_temp',
                        'tmp_air_min': 'Min_temp', 'tmp_grass_min': 'Grass_temp'}, inplace=True)

    # Drop unnecessary columns from 'merge2' DataFrame.
    merge2 = merge2.drop(['rpr_gale', 'stn_num'], axis=1)

    # Filter 'data_w' DataFrame to include only rows with years between 2010 and the last year in 'years' list.
    data_w = data_w[data_w['year'] >= 2010.0]
    data_w = data_w[data_w['year'] <= years[-1]]

    # Drop unnecessary columns from 'data_w' DataFrame.
    data_w = data_w.drop(['tmp_air_max', 'tmp_air_min', 'tmp_grass_min', 'evp_cls_a_12', 'evp_cls_a_18', 'evp_cls_a_06_next',
                        'evp_cls_a_code'], axis=1)

    # Fill missing values (NaNs) in 'data_w' DataFrame with 0.
    data_w = data_w.fillna(0)

    # Filter 'data_w' DataFrame to include only rows with 'rpr_snow' column value equal to 1 (indicating snow).
    data_snow = data_w[data_w['rpr_snow'] == 1]

    # Keep only specific columns in 'data_snow' DataFrame: 'stn_num', 'time_obs', 'rpr_snow'.
    data_snow = data_snow[['stn_num', 'time_obs', 'rpr_snow']]

    # Replace specific values in the 'stn_num' column of 'data_snow' DataFrame with corresponding city names.
    data_snow['stn_num'] = data_snow['stn_num'].replace([4640, 6770, 8642], ['צפת', 'ירושלים', 'אילת'])

    # Rename columns in 'data_snow' DataFrame for consistency.
    data_snow.rename(columns={'time_obs': 'Date', 'rpr_snow': 'Snow', 'stn_num': 'Dis_Location'}, inplace=True)

    # Strip leading and trailing whitespaces from the 'Dis_Location' column in 'merge2' DataFrame.
    merge2['Dis_Location'] = merge2['Dis_Location'].str.strip()

    # Perform a left join of 'merge2' and 'data_snow' DataFrames on the 'Dis_Location' and 'Date' columns.
    merge3 = pd.merge(merge2, data_snow, on=['Dis_Location', 'Date'], how='left')

    # Fill missing values (NaNs) in 'merge3' DataFrame with 0.
    merge3 = merge3.fillna(0)

    # Filter 'data_w' DataFrame to include only rows with 'rpr_hail' column value equal to 1 (indicating hail).
    data_hail = data_w[data_w['rpr_hail'] == 1]

    # Keep only specific columns in 'data_hail' DataFrame: 'stn_num', 'time_obs', 'rpr_hail'.
    data_hail = data_hail[['stn_num', 'time_obs', 'rpr_hail']]

    # Replace specific values in the 'stn_num' column of 'data_hail' DataFrame with corresponding city names.
    data_hail['stn_num'] = data_hail['stn_num'].replace([9972, 2520, 4640, 6770, 7415, 8471], ['אילת', 'רמלה', 'צפת', 'ירושלים', 'באר שבע', 'צפת'])

    # Rename columns in 'data_hail' DataFrame for consistency.
    data_hail.rename(columns={'time_obs': 'Date', 'rpr_hail': 'Hail', 'stn_num': 'Dis_Location'}, inplace=True)

    # Perform a left join of 'merge3' and 'data_hail' DataFrames on the 'Dis_Location' and 'Date' columns.
    merge3 = pd.merge(merge3, data_hail, on=['Dis_Location', 'Date'], how='left')

    # Fill missing values (NaNs) in 'merge3' DataFrame with 0.
    merge3 = merge3.fillna(0)


    # Filter 'data_w' DataFrame to include only rows with 'rpr_gale' column value equal to 1 (indicating gale).
    data_rpr_gale = data_w[data_w['rpr_gale'] == 1]

    # Keep only specific columns in 'data_rpr_gale' DataFrame: 'stn_num', 'time_obs', 'rpr_gale'.
    data_rpr_gale = data_rpr_gale[['stn_num', 'time_obs', 'rpr_gale']]

    # Replace specific values in the 'stn_num' column of 'data_rpr_gale' DataFrame with corresponding city names.
    data_rpr_gale['stn_num'] = data_rpr_gale['stn_num'].replace(
        [9445, 9460, 9476, 9571, 9630, 9713, 8264, 21, 190, 550, 600],
        ['ירדן )יריחו(', 'ירדן )יריחו(', 'באר שבע', 'ירדן )יריחו(', 'באר שבע', 'באר שבע', 'צפת', 'עכו', 'עכו', 'חיפה', 'חיפה'])

    # Rename columns in 'data_rpr_gale' DataFrame for consistency.
    data_rpr_gale.rename(columns={'time_obs': 'Date', 'rpr_gale': 'Gale', 'stn_num': 'Dis_Location'}, inplace=True)

    # Replace specific values in the 'Dis_Location' column of 'data_rpr_gale' DataFrame with corresponding city names.
    data_rpr_gale['Dis_Location'] = data_rpr_gale['Dis_Location'].replace(
        [861, 1121, 1381, 2410, 2523, 3014, 3502, 3541, 4087, 4642, 4738],
        ['חיפה', 'עפולה', 'חדרה', 'תל אביב', 'רמלה', 'אשדוד', 'אשקלון', 'אשקלון', 'צפת', 'צפת', 'גולן'])

    data_rpr_gale['Dis_Location'] = data_rpr_gale['Dis_Location'].replace(
        [4741, 6055, 6101, 6251, 6262, 6301, 6663, 6771, 7246, 7822, 7933],
        ['עכו', 'עפולה', 'עפולה', 'שכם', 'טול כרם', 'באר שבע', 'בית לחם', 'ירושלים', 'בית לחם', 'באר שבע', 'באר שבע'])

    data_rpr_gale['Dis_Location'] = data_rpr_gale['Dis_Location'].replace(
        [7972, 8196, 8213, 8224, 8472],
        ['גולן', 'באר שבע', 'באר שבע', 'באר שבע', 'צפת'])

    # Perform a left join of 'merge3' and 'data_rpr_gale' DataFrames on the 'Dis_Location' and 'Date' columns.
    merge3 = pd.merge(merge3, data_rpr_gale, on=['Dis_Location', 'Date'], how='left')

    # Fill missing values (NaNs) in 'merge3' DataFrame with 0.
    merge3 = merge3.fillna(0)

    # Perform a left join of 'rain' and 'merge1' DataFrames on the 'stn_num' column.
    rain_with_loc = pd.merge(rain, merge1, on='stn_num', how='left')

    # Drop unnecessary columns from 'rain_with_loc' DataFrame.
    rain_with_loc = rain_with_loc.drop(['monthyear', 'month', 'day', '_id_x', '_id_y', 'stn_name'], axis=1)

    # Change the data type of specific columns in 'rain_with_loc' DataFrame to float using 'change_cols_type_float' function.
    rain_with_loc = change_cols_type_float(['rain_06_next', 'rain_code', 'year'], rain_with_loc)

    # Group 'rain_with_loc' DataFrame by 'Dis_Location', 'time_obs', 'stn_num', and 'year', and calculate the mean for each group.
    rain_with_loc = rain_with_loc.groupby(['Dis_Location', 'time_obs', 'stn_num', 'year']).mean()

    # Reset the index of 'rain_with_loc' DataFrame.
    rain_with_loc = rain_with_loc.reset_index()

    # Filter 'rain_with_loc' DataFrame to include only rows with years between 2010 and the last year in 'years' list.
    rain_with_loc = rain_with_loc[rain_with_loc['year'] >= 2010.0]
    rain_with_loc = rain_with_loc[rain_with_loc['year'] <= years[-1]]

    # Drop 'stn_num' column from 'rain_with_loc' DataFrame.
    rain_with_loc = rain_with_loc.drop('stn_num', axis=1)

    # Rename the 'time_obs' column in 'rain_with_loc' DataFrame to 'Date'.
    rain_with_loc.rename(columns={'time_obs': 'Date'}, inplace=True)

    # Strip leading and trailing whitespaces from the 'Dis_Location' column in 'rain_with_loc' DataFrame.
    rain_with_loc['Dis_Location'] = rain_with_loc['Dis_Location'].str.strip()

    # Group 'rain_with_loc' DataFrame by 'Dis_Location' and 'Date', and calculate the mean for each group.
    rain_with_loc = rain_with_loc.groupby(['Dis_Location', 'Date']).mean()

    # Reset the index of 'rain_with_loc' DataFrame.
    rain_with_loc = rain_with_loc.reset_index()

    # Perform a left join of 'merge3' and 'rain_with_loc' DataFrames on the 'Dis_Location' and 'Date' columns.
    merge3 = pd.merge(merge3, rain_with_loc, on=['Dis_Location', 'Date'], how='left')

    # Fill missing values (NaNs) in 'merge3' DataFrame with 0.
    merge3 = merge3.fillna(0)

    # Extract 'Name' column from 'holidays' DataFrame and assign it to 'names'.
    names = holidays.Name


    # Specify the desired year range
    start_year = 2009
    end_year = years[-1]

    holidays['HolidayStart'] = pd.to_datetime(holidays['HolidayStart'])
    holidays['HolidayEnds'] = pd.to_datetime(holidays['HolidayEnds'])

    # Calculate Hebrew holiday dates using the 'calculate_hebrew_holidays' function with specified start_year and end_year.
    hebrew_holidays = calculate_hebrew_holidays(holidays, start_year, end_year)

    # Convert the dates in 'hebrew_holidays' to string format ('YYYY-MM-DD HH:MM:SS') and store them in 'string_list'.
    string_list = [timestamp.strftime('%Y-%m-%d %H:%M:%S') for timestamp in hebrew_holidays[0]]

    # Convert the end dates in 'hebrew_holidays' to string format ('YYYY-MM-DD HH:MM:SS') and store them in 'string_list_E'.
    string_list_E = [timestamp.strftime('%Y-%m-%d %H:%M:%S') for timestamp in hebrew_holidays[1]]

    # Split the 'string_list' and 'string_list_E' into chunks of size 15 and store them in 'list_parts' and 'list_parts2' respectively.
    chunk_size = 15
    list_parts = [string_list[i:i + chunk_size] for i in range(0, len(string_list), chunk_size)]
    list_parts2 = [string_list_E[i:i + chunk_size] for i in range(0, len(string_list_E), chunk_size)]

    # Drop unnecessary columns from 'holidays' DataFrame.
    holidays = holidays.drop(['ShortDescription', '_id', 'FullDescription', 'HebrewDate'], axis=1)

    # Iterate through each chunk in 'list_parts' and 'list_parts2'.
    # For each name, start, and end date in each chunk, create a new row with the respective data and append it to the 'holidays' DataFrame.
    for i in range(len(list_parts)):
        for name, start, end in zip(names, list_parts[i], list_parts2[i]):
            new_row = {'row': [name, start, end]}
            df = pd.DataFrame.from_dict(new_row, orient='index', columns=['Name', 'HolidayStart', 'HolidayEnds'])
            holidays = pd.concat([holidays, df])

    # Add a new column 'holiday' to 'holidays' DataFrame and set its value to 1.
    holidays['holiday'] = 1

    # Convert 'HolidayStart' and 'HolidayEnds' columns in 'holidays' DataFrame to datetime format.
    holidays['HolidayStart'] = pd.to_datetime(holidays['HolidayStart']).dt.date
    holidays['HolidayEnds'] = pd.to_datetime(holidays['HolidayEnds']).dt.date

    # Convert 'HolidayStart' and 'HolidayEnds' columns in 'holidays' DataFrame to datetime format.
    holidays['HolidayStart'] = pd.to_datetime(holidays['HolidayStart'])
    holidays['HolidayEnds'] = pd.to_datetime(holidays['HolidayEnds'])


    # Create a new DataFrame for holiday dates
    holiday_dates = pd.DataFrame(columns=['Holiday', 'Date'])

    # Iterate over rows of the original DataFrame
    for index, row in holidays.iterrows():
        start_date = row['HolidayStart']
        end_date = row['HolidayEnds']
        holiday_name = row['holiday']

        # Generate the range of dates between start and end (inclusive)
        dates = pd.date_range(start=start_date, end=end_date)

        index = 1
        date_dic = {}
        for date in dates:
            date_dic[index] = [holiday_name, date]
            index += 1
        df = pd.DataFrame.from_dict(date_dic, orient='index', columns=['Holiday', 'Date'])
        holiday_dates = pd.concat([holiday_dates, df])

    merge3['Date'] = pd.to_datetime(merge3['Date'])
    merge3 = pd.merge(merge3, holiday_dates, on='Date', how='left')

    merge3 = merge3.fillna(0)

    DATA['Date'] = pd.to_datetime(DATA['Date'])

    # Split the WeekRange column into StartDate and EndDate columns
    DATA[['StartDate', 'EndDate']] = DATA['Year_Weeks'].str.split('/', expand=True)

    # Convert StartDate and EndDate columns to datetime objects
    DATA['StartDate'] = pd.to_datetime(DATA['StartDate'])
    DATA['EndDate'] = pd.to_datetime(DATA['EndDate'])

    # Apply the generate_dates function to each row and create a new column
    DATA['Dates'] = DATA.apply(generate_dates, axis=1)

    # # Explode the Dates column to create new rows for each date
    DATA = DATA.explode('Dates')
    DATA = DATA.drop(['StartDate', 'EndDate', 'Date'], axis=1)

    DATA.rename(columns={'Dates': 'Date'}, inplace=True)

    DATA['Dis_Location'] = DATA['Dis_Location'].str.strip()
    merge3['Dis_Location'] = merge3['Dis_Location'].str.strip()

    DATA = DATA.drop(['Year', 'Month'], axis=1)

    data1 = pd.merge(DATA, merge3, how='left', on=['Date', 'Dis_Location'])

    data1 = data1.dropna()

    # Initialize the LabelEncoder
    label_encoder = LabelEncoder()

    # Fit the label encoder to the column data
    label_encoder.fit(data1['Dis_Location'])
    # Transform the column values to indices
    data1['Dis_Location'] = label_encoder.transform(data1['Dis_Location'])

    data1 = data1.drop(['_id_x', '_id_y', 'year'], axis=1)
    data1.rename(columns={'day': 'Day'}, inplace=True)
    data1.rename(columns={'season': 'Season'}, inplace=True)
    data1.rename(columns={'rain_06_next': 'Rain_06_next'}, inplace=True)
    data1.rename(columns={'rain_code': 'Rain_code'}, inplace=True)
    data1.rename(columns={'label': 'Quantity'}, inplace=True)

    return data1

def proces(data):
    # Define week range length
    week_range_length = 7

    # Determine start and end dates
    start_date = min(data.index)
    end_date = max(data.index)

    # Create list of week ranges
    weeks = []
    current_week_start = start_date
    while current_week_start <= end_date:
        weeks.append((current_week_start, current_week_start + datetime.timedelta(days=week_range_length - 1)))
        current_week_start += datetime.timedelta(days=week_range_length)

    data['Year_Weeks'] = ''
    for i, week in enumerate(weeks):
        week_str = f"{week[0].strftime('%Y-%m-%d')}/{week[1].strftime('%Y-%m-%d')}"
        data.loc[(data.index >= week[0]) & (data.index <= week[1]), 'Year_Weeks'] = week_str

    data['Food_and_District_Location'] = data['Food'] + ', ' + data['Dis_Location']
    # drop the original columns
    data.drop(['Food', 'District', 'Dis_Location', 'Location', 'FarmerID'], axis=1, inplace=True)

    grouped = data.groupby(['Year_Weeks', 'Food_and_District_Location']).mean().reset_index()
    pivot = grouped.pivot(index='Year_Weeks', columns='Food_and_District_Location', values='Quantity')
    pivot = pivot.fillna(0)

    return pivot

def exctract_week_num(date):
    # Function to extract the week number from a given date in the format "YYYY-MM-DD"
    # Split the date into year, month, and day components
    year, month, day = date.split("-")
    # Convert the components to integers and get the week number using isocalendar() function
    return datetime.date(int(year), int(month), int(day)).isocalendar()[1]

def preprocess_train(y_train):
    # Function to preprocess the training data

    # Convert y_train (a DataFrame with multi-index) to a stacked DataFrame with "label" column
    data = y_train.stack().to_frame()
    data = data.rename(columns={0: "label"})

    # Reset the index to create separate columns for the multi-index levels
    data = data.reset_index(level=["Year_Weeks"])
    data = data.reset_index().rename(columns={"Food_and_District_Location": "Zone"})

    # Extract "Week" and "Year" information from the "Year_Weeks" column
    data["Week"] = [int(exctract_week_num(x.split('/')[0])) for x in data.Year_Weeks]
    data["Year"] = [int(x.split('/')[0].split("-")[0]) for x in data.Year_Weeks]

    # Get unique zones from the "Zone" column and store them in the 'zones' list
    zones = list(set(data.Zone))

    def get_district_and_food(zone):
        # Function to extract the district and food information from the given 'zone' string

        x, y = zone.split(",")

        # Check if both 'x' and 'y' are not "other", return the district and food as a list [y, x]
        if "other" not in x and "other" not in y:
            return [y, x]
        # Check if 'x' is not "other" and 'y' is "other", return ["other", x]
        elif "other" not in x and "other" in y:
            return ["other", x]
        # Check if 'x' is "other" and 'y' is not "other", return [y, "other"]
        if "other" in x and "other" not in y:
            return [y, "other"]

    # Apply the 'get_district_and_food' function to the 'Zone' column of the 'data' DataFrame
    # and create new columns 'Dis_Location' and 'Food' based on the returned values
    data[["Dis_Location", "Food"]] = [get_district_and_food(z) for z in data.Zone]

    # Get unique districts and foods from the 'Dis_Location' and 'Food' columns, respectively,
    # and store them in 'districts' and 'foods' lists
    districts = list(set(data["Dis_Location"]))
    foods = list(set(data["Food"]))

    # Calculate and assign the 'Dis_Location_id', 'Food_id', and 'Zone_id' columns based on the index of each district, food, and zone
    data["Dis_Location_id"] = [districts.index(d) for d in data.Dis_Location]
    data["Food_id"] = [foods.index(d) for d in data.Food]
    data["Zone_id"] = [zones.index(z) for z in data.Zone]

    # Extract the date information from the 'Year_Weeks' column and create a new 'Date' column in the 'data' DataFrame
    data["Date"] = [datetime.datetime.strptime(x.split("/")[0], r"%Y-%m-%d") for x in data.Year_Weeks]

    # Extract the month information from the 'Year_Weeks' column and create a new 'Month' column in the 'data' DataFrame
    data["Month"] = [int(x.split("/")[0].split("-")[1]) for x in data.Year_Weeks]


    def sesoan(m):
        if 3 <= m <= 6:
            return 1
        if 6 < m <= 9:
            return 2
        if 9 < m <= 12:
            return 3
        else:
            return 4

    data["season"] = data["Month"].apply(sesoan)

    # return data, zones, years, districts, foods
    return data

def dis_id(dis):
    if dis == 'דרום':
        return 1
    if dis == 'צפון':
        return 2
    if dis == 'מרכז':
        return 3
    else:
        return 4

def calculate_hebrew_holidays(holidays, start_year, end_year):
    # Hebrew holiday dates for 2022
    holiday_dates_2022 = holidays['HolidayStart']
    holiday_dates_2022_E = holidays['HolidayEnds']
    # Calculate holiday dates for the specified year range
    holiday_dates = []
    holiday_dates_E = []
    for year in range(start_year, end_year + 1):
        for holiday_date_2022 in holiday_dates_2022:
            shifted_date = holiday_date_2022 - datetime.timedelta(days=375 * (2022 - year) - 10 * (2022 - year))
            holiday_dates.append(shifted_date)
        for holiday_date_2022E in holiday_dates_2022_E:
            shifted_date = holiday_date_2022E - datetime.timedelta(days=375 * (2022 - year) - 10 * (2022 - year))
            holiday_dates_E.append(shifted_date)

    return holiday_dates, holiday_dates_E

# Function to generate a list of dates within a week range
def generate_dates(row):
    dates = pd.date_range(row['StartDate'], row['EndDate'])
    return dates

async def main(file):
    # print('')
    # print('Starting proccessing')
    # print('*******************************************')
    returned = await to_db_table(file)
    
    response = {'result': returned}
    response_json = json.dumps(response, ensure_ascii=False)
    
    print(response_json)
    return response_json

# Run the event loop
loop = asyncio.new_event_loop()
loop.run_until_complete(main(file_to_process))