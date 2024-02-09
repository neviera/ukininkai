import pandas as pd
import plotly.express as px

def main():
    # Read the ODS file into a DataFrame
    file_path = './data/straipsniai_src.ods'
    df = pd.read_excel(file_path, engine='odf')
    
    # Convert 'date' column to datetime
    df['date'] = pd.to_datetime(df['date']).dt.date
    
    # Aggregate the count of IDs per day
    daily_counts = df.groupby('date').size().reset_index(name='count')
    
    # Create the column chart
    fig = px.bar(daily_counts, x='date', y='count',
                 title='Count of IDs per Day',
                 labels={'count': 'Count of IDs', 'date': 'Date'},
                 template='plotly_white')
    
    # Improve layout
    fig.update_layout(xaxis_title='Date',
                      yaxis_title='Count of IDs',
                      xaxis_tickangle=-45)
    
    # Export to HTML
    html_file_path = 'id_count_per_day_chart.html'
    fig.write_html(html_file_path)
    
    print(f"Chart saved to {html_file_path}")

if __name__ == '__main__':
    main()
