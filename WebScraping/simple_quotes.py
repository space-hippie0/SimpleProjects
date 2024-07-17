from bs4 import BeautifulSoup
import requests
import csv

page_to_scrape = requests.get("http://quotes.toscrape.com")
soup = BeautifulSoup(page_to_scrape.text, "html.parser")

quotes = soup.findAll("span", attrs={"class": "text"})
authors = soup.findAll("small", attrs={"class": "author"})

# write to csv file
file = open("scraped_quotes.csv", "w")
writer = csv.writer(file)
writer.writerow(["QUOTES", "AUTHORS"])

# output for testing
for quote, author in zip(quotes, authors):
    print(quote.text + " - " + author.text)
    writer.writerow([quote.text, author.text])
