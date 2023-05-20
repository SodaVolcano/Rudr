import unittest
from selenium import webdriver
import argparse
from selenium.webdriver.chrome.options import Options as Chrome_Options


class RegistrationTestSuite(unittest.TestCase):
    driver = None

    @classmethod
    def setUpClass(cls):
        parser = argparse.ArgumentParser(description="Selenium Test")
        parser.add_argument(
            "--browser",
            "-b",
            choices=["chrome", "firefox", "edge", "ie"],
            default="chrome",
            help="Specify the browser to use for the tests (default: chrome)",
        )
        args = parser.parse_args()

        try:
            if args.browser == "chrome":
                options = Chrome_Options()
                options.binary_location = (
                    "/mnt/c/Program Files (x86)/Google/Chrome/Application/chrome.exe"
                )
                cls.driver = webdriver.Chrome(options=options)
            elif args.browser == "firefox":
                cls.driver = webdriver.Firefox()
            elif args.browser == "edge":
                cls.driver = webdriver.Edge()
            elif args.browser == "ie":
                cls.driver = webdriver.Ie()
            else:
                raise ValueError(f"Invalid browser specified: {args.browser}")

            cls.driver.maximize_window()
            cls.driver.get("http://127.0.0.1:5000")
            print(f"Driver set up successfully: {args.browser}")
        except Exception as e:
            print(f"Error setting up driver: {str(e)}")
            cls.driver = None

    @classmethod
    def tearDownClass(cls):
        if cls.driver:
            cls.driver.quit()
            # Close database or perform other cleanup tasks

    def test_registration(self):
        if self.driver is None:
            self.fail("Driver not set up correctly. Skipping test.")
        else:
            # Perform tests
            print("Test registration")


if __name__ == "__main__":
    unittest.main(verbosity=2)
