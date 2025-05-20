#!/bin/bash

# Check if a message was provided
if [ $# -eq 0 ]; then
    echo -e "\e[31mError: Migration message is required.\e[0m"
    echo "Usage: ./scripts/migrate.sh \"Your migration message\""
    exit 1
fi

# Change to project root directory where alembic.ini is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
cd "$PROJECT_ROOT" || { echo "Failed to change to project root directory"; exit 1; }

# Store the message
MESSAGE="$1"

# Colors
CYAN='\e[36m'
YELLOW='\e[33m'
GREEN='\e[32m'
RED='\e[31m'
NC='\e[0m' # No Color

echo -e "${CYAN}Generating migration: ${MESSAGE}${NC}"

# Generate the migration
echo -e "\n${YELLOW}Step 1: Creating migration script...${NC}"
alembic revision --autogenerate -m "$MESSAGE"

# Check if previous command was successful
if [ $? -ne 0 ]; then
    echo -e "\n${RED}Error generating migration!${NC}"
    exit 1
fi

# Apply the migration
echo -e "\n${YELLOW}Step 2: Applying migration to database...${NC}"
alembic upgrade head

# Check if previous command was successful
if [ $? -ne 0 ]; then
    echo -e "\n${RED}Error applying migration!${NC}"
    exit 1
fi

# Show current migration status
echo -e "\n${GREEN}Migration Status:${NC}"
alembic current

echo -e "\n${CYAN}Migration complete!${NC}" 