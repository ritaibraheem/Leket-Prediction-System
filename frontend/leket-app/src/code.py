import pandas as pd
df = pd.read_excel(r'C:\SHAMS\kinds_groups.xlsx')
print(df)
data_dict = {}
list=[]
farmers = df['kind'].unique()
locations = df['number'].unique() 
for location in locations:
    d = df[df['number']==location]
    list = d['kind'].to_list()
    data_dict.update({location:list})
print(data_dict)

with open('output.txt', 'w', encoding='utf-8') as file:
    for key, value in data_dict.items():
       file.write(f'"{key}": {value},\n')

       

print(data_dict)