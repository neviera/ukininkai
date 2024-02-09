import pandas as pd
import plotly.graph_objects as go

def prepare_data(df):
    # Convert 'date' column to just date (no time)
    df['date'] = pd.to_datetime(df['date']).dt.date
    
    # Sort by date to ensure consistency
    df = df.sort_values(by='date')
    
    # Assign unique y-values for each article within the same day for stacking effect
    df['y_value'] = df.groupby('date').cumcount()
    
    return df

def main():
    # Read the ODS file into a DataFrame
    file_path = './data/straipsniai_src.ods'
    df = pd.read_excel(file_path, engine='odf')
    
    # Prepare data for plotting
    df_prepared = prepare_data(df)
    
    # Initialize a figure
    fig = go.Figure()
    
    # Customize plot background, gridlines, and font
    fig.update_layout(
        plot_bgcolor='rgba(0,0,0,0)', # Transparent background
        paper_bgcolor='rgba(0,0,0,0)', # Transparent paper
        font=dict(
            family="Arial, sans-serif",
            size=12,
            color="#7f7f7f"
        ),
        hovermode='closest'
    )
    
    # Add horizontal lines for each article
    for index, row in df_prepared.iterrows():
        # Make the marker wider and remove labels
        fig.add_shape(type="line",
                      x0=row['date'], y0=row['y_value'], x1=row['date'], y1=row['y_value']+1, # Adjust y1 for wider appearance
                      line=dict(color="RoyalBlue", width=10), # Increase line width for wider markers
                      xref="x", yref="y")
        
        # Add hover text with the hyperlink
        fig.add_trace(go.Scatter(x=[row['date']], y=[row['y_value']+0.5],
                                 text=[f"{row['title']}<br><a href='{row['link']}'>{row['link']}</a>"], # Display title and URL in hover
                                 hoverinfo='text',
                                 mode="markers",
                                 marker=dict(size=10, color='rgba(0,0,0,0)'), # Transparent and size adjusted for hover alignment
                                 showlegend=False))

    # Adjust layout to remove y-axis labels
    fig.update_layout(title='Articles Published Over Time',
                      xaxis_title='Publication Date',
                      yaxis_title='',
                      xaxis_tickangle=-45,
                      yaxis_visible=False, # Hide y-axis
                      xaxis=dict(type='category'))

    # Export to HTML
    html_file_path = 'articles_horizontal_lines.html'
    fig.write_html(html_file_path, auto_open=True)
    
    print(f"Chart saved to {html_file_path}")

if __name__ == '__main__':
    main()
