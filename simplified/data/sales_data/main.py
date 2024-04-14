from fastapi import FastAPI, HTTPException
from datetime import date
from pydantic import BaseModel, conint
from pydantic import BaseModel, Field
from forecaste import forecast_sales  # Ensure this is updated to accept date ranges
from data_cleaning_final import clean_sales_data
import pandas as pd


class ForecastRequest(BaseModel):
    start_day: int = Field(..., ge=1, le=31)
    end_day: int = Field(..., ge=1, le=31)
    month: int = Field(..., ge=1, le=12)
    year: int = Field(..., ge=2020)


app = FastAPI()


@app.post("/forecast/")
async def generate_forecast(request: ForecastRequest):
    try:
        # Assume clean_sales_data() prepares the data up to the current date
        cleaned_data = clean_sales_data()  # You might need to adjust based on actual data handling
        
        # Convert start and end days into actual dates
        forecast_start_date = date(request.year, request.month, request.start_day)
        forecast_end_date = date(request.year, request.month, request.end_day)

        # Generate forecast
        # This assumes forecast_sales() is adapted to accept start and end dates
        forecasted_data = forecast_sales(cleaned_data, forecast_start_date, forecast_end_date)
        
        # Convert forecasted data to JSON or suitable format for your front-end
        forecasted_json = forecasted_data.to_json(orient='split')
        
        return {"forecast": forecasted_json}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
