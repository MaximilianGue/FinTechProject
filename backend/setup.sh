#!/bin/bash

# Check if the virtual environment already exists
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv  # Create the virtual environment
else
    echo "Virtual environment already exists."
fi

# Activate the virtual environment (ensure it's only done once)
if [[ -z "$VIRTUAL_ENV" ]]; then
    echo "Activating virtual environment..."
    source venv/bin/activate  # Activate the virtual environment
else
    echo "Virtual environment is already activated."
fi

# Upgrade pip to make sure it's the latest version
echo "Upgrading pip..."
pip install --upgrade pip

# Install required libraries
echo "Installing libraries from requirements.txt..."
pip install -r requirements.txt  # Install libraries listed in requirements.txt

# Additionally install specific libraries if they are not in requirements.txt
pip install yfinance flask flask-cors  # Ensure specific libraries are installed

echo "Setup complete. Virtual environment is ready!"
