import pandas as pd

# Read the ODS file
file_path = './data/straipsniai_src.ods'
df = pd.read_excel(file_path, engine='odf')

# Example preprocessing (adjust according to your needs)
# Convert 'date' column to just date (no time)
df['date'] = pd.to_datetime(df['date']).dt.date

# Sort by date and assign y-values (if needed)
df = df.sort_values(by='date')
df['y_value'] = df.groupby('date').cumcount()

# Select relevant columns
df = df[['date', 'title', 'link', 'y_value', 'article']]

# Convert DataFrame to JSON
json_file_path = './data/output_data.json'
df.to_json(json_file_path, orient='records', date_format='iso')

print(f"Data saved to {json_file_path}")
