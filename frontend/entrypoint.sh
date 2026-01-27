#!/bin/sh

# Copy .env if it doesn't exist
if [ ! -f .env ]; then
    if [ -f .env.example ]; then
        cp .env.example .env
        echo ".env file created from .env.example"
        # Since we are in Docker, we should probably make sure 
        # API_BASE_URL is not hardcoded to localhost in .env if we want Docker env vars to take precedence
        # But usually process.env (Docker) takes precedence over .env file in many loaders 
        # unless the loader specifically uses dotenv with override.
    else
        echo "WARNING: .env.example not found"
    fi
fi

# We can also explicitly set the environment variables in .env if they are provided via Docker
# to ensure the frontend pick them up regardless of how it loads them.
if [ ! -z "$API_BASE_URL" ]; then
  sed -i "s|API_BASE_URL=.*|API_BASE_URL=$API_BASE_URL|g" .env
fi
if [ ! -z "$VITE_API_BASE_URL" ]; then
  sed -i "s|VITE_API_BASE_URL=.*|VITE_API_BASE_URL=$VITE_API_BASE_URL|g" .env
fi

# Execute the CMD
exec "$@"
