# combine linear regression with gradient boosting using the XGBoost library:

import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from xgboost import XGBRegressor
from sklearn.metrics import mean_squared_error, r2_score

# Load the cryptocurrency dataset
dataset = pd.read_csv('cryptocurrency_data.csv')  # Replace with your dataset file

# Preprocess the dataset
# Select the relevant features and target variable
X = dataset[['Feature1', 'Feature2', ...]]  # Add the relevant features
y = dataset['Price']  # Target variable (Price)

# Split the dataset into training and testing sets
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Train the linear regression model
linear_model = LinearRegression()
linear_model.fit(X_train, y_train)

# Train the XGBoost model
xgb_model = XGBRegressor()
xgb_model.fit(X_train, y_train)

# Make predictions on the testing set using both models
linear_pred = linear_model.predict(X_test)
xgb_pred = xgb_model.predict(X_test)

# Combine the predictions using a weighted average
combined_pred = 0.5 * linear_pred + 0.5 * xgb_pred

# Evaluate the combined model
mse = mean_squared_error(y_test, combined_pred)
r2 = r2_score(y_test, combined_pred)

print("Mean Squared Error:", mse)
print("R-squared:", r2)
