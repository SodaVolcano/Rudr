# CITS3403 Web Project

## Authors
- Cohen Rafiq 23348918
- Tin Chi Pang 23301921
- Martin Evans 23621647

## Purpose
This is **Rudr**, a fictitious website set in the future that aims to provide a dating platform for humans and robots. In this future, recent advancement in artificial general intelligence has produced near-human level sentience in robots. In this wave of new sentience, the interest in robot-dating has seen a surge in popularity.

Obviously this website is purely for entertainment purposes akin to dating-sim games. It is not intended to be a serious dating platform in any sense. It is also not intended to be a serious dating platform for robots so if you are a robot seeking love, then uhhh maybe go look elsewhere.

## Design
Our primary target audience, within the fictitious setting of the webpage, is to future humans and robots seeking to date. Assuming the current trend of minimalist design continues into the future, our visual design aims to be minimalist. This involves emphasis on the use of pictures and minimal texts while having large area of unused space. Space is used liberly to focus and emphasise the sparse content on the page.

We are going for a dark-nightly colour palette involving dark and light blue and purple. This is to convey a technical asthetics via the use of cold colours and is in line with the futuristic setting of the webpage. The choice for white text on black is partly inspired by terminal colours, and the choice for blue and purple is inspired by the early 2010s vapourwave asthetics used in internet culture, which reflects the online-interactivity aspect of our website. The softer tints of purple is commonly symbolic for love and hence is also chosen.

The homepage is divided into a top banner containing the page slogan and the robot, and the content area which includes additional information about the website. The top banner is designed to catch user's attention, this is accomplished using large fonts for the slogan with a typewriter transition to mimic the act of typing. As our eyes are naturally drawn towards the centre and to moving elements on an otherwise static canvas, the animated slogan is designed to guide users to read our slogan that introduces them to the purpose of our website. Part of the content area is shown at the bottom of the viewport on purpose - this suggests that the page can be scrolled down. We uses either huge fonts or small fonts (specifically, in the navigation bar) to discourage overly verbose writing and thus address the (likely) short attention span of the user. Curious users who further scrolls down will find reviews that aims to further persuade themm into using the website.

The chatroom in contrast to the main page uses bright, more vibrant colours in the chosen background image to create a more lively atmosphere for the users to converse in. The chat history view is the biggest element on the page as it is the main focus of the page. The chat bubbles are centered in the middle of the chat history view with the input box on the bottom and past conversations on the left as standard in current messaging platforms.

## Application Architecture
> Boot-strap for css
> Flask for response handling and html serving
> Typescript for DOM handling
> SQLAlchemy for database handling
- Users
- Robots
- Conversations
- Messages

## Running the Web Application

### Setting up Virtual Environment
It's recommended that you use a virtual environment to manage the required Python packages without intefering with other packages that you have installed.
- You can set up a virtual environment using the Python `venv` module, and specify a path to store packages for your virtual environment.
```bash
$ python -m venv /path/to/your/directory/my-env
```
- To activate your `venv` virtual environment...
    - On Unix shell, run `$ source <venv>/bin/activate`
        - Note that suffix of activate depends on shell, see:
            - https://docs.python.org/3/library/venv.html
    - On WINDOWS...
        - CMD: `<venv>\Scripts\activate.bat`
        - PowerShell: `<venv>\Scripts\Activate.ps1`
  
- Once activated, you should see the name of your virtual environment (e.g. `(my-env)`) in your console prompt. You can install the requirements by running
```bash
(my-env) $ pip install -r path/to/requirements.txt
```

### Setting up the Data Bases
In order for the chat and user features to be functional, the databases must be constructed and initialised. From the *top-most directory*, run the following commands in order:

```bash
(my-env) $ cd ./src/
(my-env) $ cd flask db init    # NOTE: should list roughly the outline and schema of each table in the log
(my-env) $ cd flask db migrate -m "db init"
(my-env) $ cd flask db upgrade
(my-env) $ cd ..                # flasky.py should be run from top-most directory so we are changing back
```

### Running the Server
- You must add the gpt-key system variable, named `GPTKEY`. If not added, the website will default to a random agent that randomly returns lines from a preset text file.

```bash
(my-env) $ export GPTKEY=yourkeyhere
(my-env) $ flask --app ./src/flasky.py run
```
- The link for the output should be printed in the console.


## Running Unit Testing
> Go to src/tests directory
- For all tests, run python dbtest.py
> An output of unit test functions will appear


# References

## References
- The following resources were used to create our website:
    - ChatGPT3.5 and ChatGPT4 by OpenAI https://chat.openai.com/
    - W3School https://www.w3schools.com/
    - Flask Web Development, 2nd Edition by Miguel Grinberg
    - Chatroom vapourwave sunset https://opengameart.org/sites/default/files/sunset1.svg
    - Homepage background image https://wallpapers.com/images/featured/y3r21iaunx6u3tml.jpg
    - Login and Signup background image https://i.gifer.com/QWc9.gif
    - jQuery
    - Bootstrap
    - Code-like font https://fonts.googleapis.com/css?family=Exo%7COrbitron&display=swap
    - Social media icons on homepage https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css
