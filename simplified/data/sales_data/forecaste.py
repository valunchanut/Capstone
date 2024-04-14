from data_cleaning_final import clean_sales_data
from prophet import Prophet
import pandas as pd
import numpy as np

# Obtain the cleaned data from the clean_sales_data function
cleaned_data = clean_sales_data()

# Define the forecast_sales function to perform forecasting on the cleaned data
def forecast_sales(dataframe, future_days=2):
    all_forecasts = pd.DataFrame()
    products = dataframe.columns.tolist()

    for product in products:
        model = Prophet(daily_seasonality=False, yearly_seasonality=False,
                        growth='linear', seasonality_mode='multiplicative',
                        weekly_seasonality=True, holidays=None)
        sales_data = dataframe[[product]].reset_index().rename(columns={'index': 'ds', product: 'y'})
        sales_data['floor'] = 0

        model.fit(sales_data)

        future_dates = model.make_future_dataframe(periods=future_days, include_history=False)
        future_dates['floor'] = 0

        forecast = model.predict(future_dates)
        forecast['yhat'] = forecast['yhat'].apply(lambda x: np.random.randint(2, 6) if x < 0 else x)
        forecast = forecast[['ds', 'yhat']].rename(columns={'yhat': product})
        all_forecasts = pd.concat([all_forecasts, forecast.set_index('ds')], axis=1)

    all_forecasts = all_forecasts.astype(int)
    return all_forecasts

# Perform the forecasting using the cleaned data
forecasted_data = forecast_sales(cleaned_data)

# Combine the cleaned and forecasted data
# Ensure the indices are aligned properly before combining
forecasted_data = forecasted_data.reindex(cleaned_data.index.union(forecasted_data.index))
updated_data = cleaned_data.combine_first(forecasted_data)

# Display the updated DataFrame
print(updated_data.tail())

output_csv_path = '../updated_sales_data.csv'
updated_data.to_csv(output_csv_path)
