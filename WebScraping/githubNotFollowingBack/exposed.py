from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time

# Path to your chromedriver executable
CHROMEDRIVER_PATH = "path-to-chromedriver"

# GitHub credentials
USERNAME = 'your-email@email.com'
PASSWORD = 'your-password'

# URLs
FOLLOWING_URL = 'https://github.com/YOUR-USERNAME?tab=following'
FOLLOWERS_URL = 'https://github.com/YOUR-USERNAME?tab=followers'

# Don't unfollow these accounts
dontunfollow = {'god', 'jesus', 'obama', 'davidBowie'}

# Set up the WebDriver
options = Options()
# options.add_argument('--headless')  # Run in headless mode
service = Service(CHROMEDRIVER_PATH)
driver = webdriver.Chrome(service=service, options=options)


def scrape_usernames(url):
    driver.get(url)
    WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.CSS_SELECTOR, 'span.Link--secondary.pl-1')))

    usernames = set()
    last_count = 0

    while True:
        elements = driver.find_elements(By.CSS_SELECTOR, 'span.Link--secondary.pl-1')
        current_count = len(elements)

        for element in elements:
            username = element.text.strip()
            if username:
                usernames.add(username)

        # Scroll to the bottom of the page
        driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")

        # Wait for more users to load or until a timeout occurs
        try:
            WebDriverWait(driver, 5).until(
                lambda d: len(driver.find_elements(By.CSS_SELECTOR, 'span.Link--secondary.pl-1')) > current_count)
        except Exception as e:
            print(f"Exception during waiting or scrolling: {e}")
            break

        if len(usernames) == last_count:
            break

        last_count = len(usernames)
        time.sleep(2)

    return list(usernames)


try:
    # Log in to GitHub
    driver.get('https://github.com/login')
    WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.NAME, 'login')))
    driver.find_element(By.NAME, 'login').send_keys(USERNAME)
    driver.find_element(By.NAME, 'password').send_keys(PASSWORD)
    driver.find_element(By.NAME, 'commit').click()

    # Wait for login to complete
    WebDriverWait(driver, 10).until(EC.url_changes('https://github.com/login'))

    # Scrape following and followers
    following_list = scrape_usernames(FOLLOWING_URL)
    followers_list = scrape_usernames(FOLLOWERS_URL)

    # Calculate the difference
    following_set = set(following_list) - dontunfollow
    followers_set = set(followers_list)
    not_following_back = following_set - followers_set

    # Print results
    # print("Following List:")
    # print(following_list)
    # print("\nFollowers List:")
    # print(followers_list)
    print("\nAccounts not following back:")
    print(list(not_following_back))

finally:
    driver.quit()
