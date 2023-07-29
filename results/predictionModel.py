import numpy as np
import pandas as pd
import datetime
from importlib import reload
from datetime import datetime
import pyodbc
import sys
import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error
from datetime import timedelta
from datetime import datetime
import io
import json
import asyncio
import utils
import csv
import json
import math

# Access the variables from util.py
group1 = utils.group1
group2 = utils.group2
group3 = utils.group3
group4 = utils.group4

server = 'leket1.database.windows.net'
database = 'leketDB'
username = 'sql'
password = 'Leket1234T'
driver = '{ODBC Driver 17 for SQL Server}'  # Driver for Azure SQL Database
connection_string = f"DRIVER={driver};SERVER={server};DATABASE={database};UID={username};PWD={password};charset=utf-8"
# Create a wrapper around sys.stdout with the desired encoding
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')


def create_test(startDate, endDate, maxTemp, minTemp, rain, snow, hail, gale, kind ,holidayStartDate, holidayEndDate , data):

    zone_and_zone_id_and_kind = data[['Zone','Zone_id','Food','Food_id']].drop_duplicates()
    zone_and_Location_id = data[['Zone_id','Dis_Location_id','District']].drop_duplicates()
    start = datetime.strptime(startDate, '%Y-%m-%d').date()
    end = datetime.strptime(endDate, '%Y-%m-%d').date()
    selected_items_list=[]
    if (kind == 'קבוצה 1'):
        selected_items_list = utils.group1
    elif (kind == 'קבוצה 2'):
        selected_items_list = utils.group2
    elif (kind == 'קבוצה 3'):
        selected_items_list = utils.group3
    elif (kind == 'קבוצה 4'):
        selected_items_list = utils.group4
    elif (kind == 'הכל'):
        selected_items_list =  utils.all_kinds
    else : 
        selected_items_list.append(kind)
    test = pd.DataFrame()
    test['Food'] = selected_items_list
    date_list = []
    delta = timedelta(days=1)
    while start <= end:
        date_list.append(start)
        start += delta

    test['key'] = 1
    
    df2 = pd.DataFrame({"Timestamp":date_list})
    df2['key'] = 1
    test = pd.merge(test, df2, on='key')
    test['Min_temp'] = minTemp
    test['Max_temp'] = maxTemp
    test['Gale'] = gale
    test['rain_06_next'] = rain
    test['Hail'] = hail
    test['Snow'] = snow
    test['day'] = pd.to_datetime(test['Timestamp']).dt.day
    test['Month'] = pd.to_datetime(test['Timestamp']).dt.month
    test['Year'] = pd.to_datetime(test['Timestamp']).dt.year

    if holidayStartDate == 0:
        test['Holiday'] = 0
    else:
        startH = datetime.strptime(holidayStartDate, '%Y-%m-%d').date()
        endH = datetime.strptime(holidayEndDate, '%Y-%m-%d').date()

        test['Holiday'] = 0  # Initialize the new column with a default value

        test.loc[(test['Timestamp'] >= startH) & (test['Timestamp'] <= endH), 'Holiday'] = 1
    
    test = pd.merge(test, zone_and_zone_id_and_kind, on='Food')
    test = pd.merge(test, zone_and_Location_id, on='Zone_id')
    test= test.drop('Zone',axis=1)

    def sesoan(m):
                if 3<=m<=6:
                        return 1
                if 6<m<=9:
                        return 2
                if 9<m<=12:
                        return 3
                else:
                        return 4

    test["season"] = test["Month"].apply(sesoan)
    test.rename(columns={'Timestamp':'Date'},inplace=True)
    
    def exctract_week_num(date):
        import datetime
        year, month, day = date.split("-")
        return datetime.date(int(year), int(month), int(day)).isocalendar()[1]   
    
    test['Date'] = test['Date'].astype(str)
    test["Week"] = test['Date'].apply(exctract_week_num)
    test = test.drop(['key','Food','Date'],axis=1)
    test.rename(columns={'Timestamp':'Date'},inplace=True)
    return test

def get_predict(selected_item,test,data):
    data = data.dropna()
    data['Date'] = pd.to_datetime(data['Date'])
    selected_items_list = []

    if (selected_item == 'קבוצה 1'):
        selected_items_list = utils.group1
    elif (selected_item == 'קבוצה 2'):
        selected_items_list = utils.group2
    elif (selected_item == 'קבוצה 3'):
        selected_items_list = utils.group3
    elif (selected_item == 'קבוצה 4'):
        selected_items_list = utils.group4
    elif (selected_item == 'הכל'):
        selected_items_list =  utils.all_kinds
    else : 
        selected_items_list.append(selected_item)

    data = data[data['Food'].isin(selected_items_list)]

    data = data.drop(['Zone','Dis_Location','Food','Year_Weeks','Date','Location','rain_code','Unnamed: 0'],axis=1)

    # Split the data into features and target variable
    
    X = data.drop(['label'], axis=1)
    y = data['label']


    # Split the data into training and testing sets
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    
    # Create and fit the random forest regression model
    model = RandomForestRegressor(n_estimators=100, random_state=42)
    model.fit(X_train, y_train)
    # Make predictions on the test set

    y_pred = model.predict(X_test)
    from sklearn.metrics import r2_score
    r2 = r2_score(y_test, y_pred)
    test = test.reindex(columns=X.columns)
    pred_test = model.predict(test)
    test['prediction'] = pred_test
    test = pd.DataFrame(test)
    return  r2 , test

def get_result(kind,data,mytest):
    # data= create_df('merged')  #data = the final proccessed data to dataframe
    zone_and_zone_id_and_kind = data[['Zone','Zone_id','Food','Food_id']].drop_duplicates()
    r2, result = get_predict(kind,mytest,data)
    result = result[result['prediction']>=100]
    result = result[['Food_id','Dis_Location_id','prediction','Zone_id']]
    result = result.groupby(['Food_id','Dis_Location_id']).mean().reset_index()
    result = pd.merge(result, zone_and_zone_id_and_kind, on=['Zone_id','Food_id'],how='left')
    result['District'] = result['Zone'].apply(get_district_and_food)
    result = result[['Food','District','prediction']]
    result = result.rename(columns={'Unnamed: 0': 'index'})
    result['District'] = result['District'].str.strip() 
    result['Food'] = result['Food'].str.strip()
    result['prediction']=result['prediction'].apply(math.ceil) 
    result.to_csv('result1.csv', index=False)
    return r2 , result

def get_district_and_food(zone):
    x, y  = zone.split(",")
    if "other" not in x and "other" not in y:
        return y

def import_table_as_df(table_name , cursor ):
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
            print("Error connecting to the database:", e)

def create_df(table_name):
    try:
        conn = pyodbc.connect(connection_string)
        cursor = conn.cursor()
        
        data =  import_table_as_df('merged',cursor)

        conn.close()

    except pyodbc.Error as e:
        print("Error connecting to the database:", e)

    return data

async def main(startDate, endDate, maxTemp, minTemp, rain, snow, hail, gale, kind ,holidayStartDate, holidayEndDate):
    # create a dictionary
    result = []

    # TODO: Change this to the merged file in the database
    data = pd.read_csv(r"C:\\Users\\DELL\\mssql\src\\results\\alldata2023-222.xlsx")
    my_test = create_test(startDate, endDate, maxTemp, minTemp, rain, snow, hail, gale, kind ,holidayStartDate, holidayEndDate , data)
    r2,res = get_result(kind,data,my_test)
    # Open a csv reader called DictReader
    with open('result1.csv', encoding='utf-8') as csvf:
        csvReader = csv.DictReader(csvf)
         
        # Convert each row into a dictionary
        # and add it to data
        for rows in csvReader:
            result.append(rows)    

    response = {
    'result': result,
    'r2': r2}
    response_json = json.dumps(response, ensure_ascii=False)
    print(response_json)
    return response_json
 
startDate = sys.argv[1]
endDate = sys.argv[2]
maxTemp = sys.argv[3]
minTemp = sys.argv[4]
rain = sys.argv[5]
snow = sys.argv[6]
hail = sys.argv[7]
gale = sys.argv[8]
kind = sys.argv[9]
holidayStartDate = sys.argv[10]
holidayEndDate = sys.argv[11]

if holidayStartDate == '':
    holidayStartDate=0

if holidayEndDate == '':
    holidayEndDate =0

if snow:
    snow = 1
else :
    snow =0

if hail:
    hail = 1
else :
    hail =0

if gale:
    gale = 1
else :
    gale =0

if rain:
    rain = 1
else:
    rain =0

kinds = utils.kinds
loop = asyncio.new_event_loop()
loop.run_until_complete(main(startDate, endDate, maxTemp, minTemp, rain, snow, hail, gale, kind ,holidayStartDate, holidayEndDate))