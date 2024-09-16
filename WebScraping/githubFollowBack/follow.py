from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time

# Set up Chrome options
chrome_options = Options()
# run without a GUI
# chrome_options.add_argument("--headless")

# Path to the ChromeDriver
chrome_driver_path = "path-to-chromedriver"

# Set up the ChromeDriver service
service = Service(executable_path=chrome_driver_path)

# Initialize the driver
driver = webdriver.Chrome(service=service, options=chrome_options)

# Open GitHub
driver.get("https://github.com/login")

# Wait for the login page to load
time.sleep(3)

# Log in to GitHub
username_field = driver.find_element(By.ID, "login_field")
password_field = driver.find_element(By.ID, "password")

# Enter your GitHub username and password
username_field.send_keys("your-email@email.com")
password_field.send_keys("your-password")

# Submit the form
password_field.send_keys(Keys.RETURN)

# Wait for the page to load
time.sleep(7)

# Find all the "Follow" buttons on the page
follow_buttons = driver.find_elements(By.XPATH, "//input[@value='Follow']")

# Scroll into view and click all the "Follow" buttons
for button in follow_buttons:
    driver.execute_script("arguments[0].scrollIntoView(true);", button)
    WebDriverWait(driver, 10).until(EC.element_to_be_clickable(button))  # Ensure it's clickable
    button.click()
    time.sleep(1)

# Wait for some time to let the clicks go through
time.sleep(5)

# Close the browser
driver.quit()

