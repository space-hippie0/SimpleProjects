import requests
from bs4 import BeautifulSoup
import json

# URL of the weather forecast page
url = 'https://www.mgm.gov.tr/tahmin/gunluk-tahmin.aspx'

# List of accepted regions
accepted_regions = [
    'VAN GÖLÜ', 'AKDENİZ', 'EGE', 'MARMARA', 'KARADENİZ',
    'GÜNEYDOĞU ANADOLU', 'DOĞU ANADOLU', 'ORTA ve DOĞU KARADENİZ',
    'BATI KARADENİZ', 'İÇ ANADOLU'
]

# Send a GET request to the website
response = requests.get(url)

# Initialize data structures for JSON output
data = {
    'cities': [],
    'regions': []
}

# Check if the request was successful
if response.status_code == 200:
    # Parse the content with BeautifulSoup
    soup = BeautifulSoup(response.content, 'html.parser')

    # Find all <h4> elements containing city names and temperatures
    city_entries = soup.find_all('h4')

    # Loop through the city entries and extract data
    for entry in city_entries:
        # Extract city name (text before the <span>)
        city_name = entry.contents[0].strip()

        # Extract temperature (text of the <span> with class 'renkMax')
        temperature_span = entry.find('span', class_='renkMax')
        if temperature_span:
            temperature = temperature_span.text.strip()
        else:
            temperature = 'No temperature data'

        # Append city and temperature to data
        data['cities'].append({
            'city': city_name,
            'temperature': temperature
        })

    # Track used regions
    used_regions = set()

    # Find all <h3> elements containing regional headings
    regional_entries = soup.find_all('h3')

    # Loop through the regional entries and extract data
    for entry in regional_entries:
        # Extract regional heading
        region_name = entry.text.strip()

        # Check if the region is in the accepted list and has not been used
        if region_name in accepted_regions and region_name not in used_regions:
            # Mark the region as used
            used_regions.add(region_name)

            # Find the next <p> element(s) for description
            paragraphs = []
            sibling = entry.find_next_sibling()
            while sibling and sibling.name == 'p':
                # Process the text without modifying commas
                description = sibling.text.strip()
                paragraphs.append(description)
                sibling = sibling.find_next_sibling()

            # Append region and its description to data
            data['regions'].append({
                'region': region_name,
                'description': paragraphs
            })

            # Remove the region from the list of accepted regions
            accepted_regions.remove(region_name)

    # Save JSON output to a file
    with open('weather_data.json', 'w', encoding='utf-8') as json_file:
        json.dump(data, json_file, ensure_ascii=False, indent=4)

    # Print JSON output
    print(json.dumps(data, ensure_ascii=False, indent=4))

else:
    print(f"Failed to retrieve the page. Status code: {response.status_code}")

