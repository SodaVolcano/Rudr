# CITS3403 Web Project

## Authors
- Cohen Rafiq 23348918
- Tin Chi Pang 23301921
- Martin Evans 23621647

## Purpose
This is INSERT_NAME_HERE, a fictitious website set in the future that aims to provide a dating platform for humans and robots. In this future, recent advancement in artificial general intelligence has produced near-human level sentience in robots. In this wave of new sentience, the interest in robot-dating has seen a surge in popularity.

Obviously this website is purely for entertainment purposes akin to dating-sim games. It is not intended to be a serious dating platform in any sense. It is also not intended to be a serious dating platform for robots so if you are a robot seeking love, then uhhh maybe go look elsewhere.

## Design
Our primary target audience, within the fictitious setting of the webpage, is to future humans and robots seeking to date. Assuming the current trend of minimalist design continues into the future, our visual design aims to be minimalist. This involves emphasis on the use of pictures and minimal texts while having large area of unused space. SVGs are used to scale images without affecting the quality. Space is used liberly to focus and emphasise the sparse content on the page.

We are going for a dark-nightly colour palette involving dark and light blue and purple. This is to convey a technical asthetics via the use of cold colours and is in line with the futuristic setting of the webpage. The choice for white text on black is partly inspired by terminal colours, and the choice for blue and purple is inspired by the early 2010s vapourwave asthetics used in internet culture, which reflects the online-interactivity aspect of our website. The softer tints of purple is commonly symbolic for love and hence is also chosen.

**INSERT FONT CHOICE** - legible, appropriate, consistent?

The homepage is divided into a top banner containing the page slogan and the robot, and the content area which includes additional information about the website. The top banner is designed to catch user's attention, this is accomplished using large fonts for the slogan with a typewriter transition to mimic the act of typing. As our eyes are naturally drawn towards the centre and to moving elements on an otherwise static canvas, the animated slogan is designed to guide users to read our slogan that introduces them to the purpose of our website. The robot conveys the quirk of our website - that you can date robots. The character makes the page more approachable to newcomers and combined with the slogan, will appear as though the character is greeting the user. Part of the content area is shown at the bottom of the viewport on purpose - this suggests that the page can be scrolled down. We uses either huge fonts or small fonts (specifically, in the navigation bar) to discourage overly verbose writing and thus address the (likely) short attention span of the user.

**Responsiveness?**


## Application Architecture
> Backend and frontend architecture?


## Running the Web Application
> On localhost
**IMPORTANT** - Make sure you are using Python version 3.11.2!

### Setting up Virtual Environment
It's recommended that you use a virtual environment to manage the required Python packages without intefering with other packages that you have installed. Virtual environments can be set up in two ways. It's recommended that you use mamba as it is the easiest.
1. Using conda/mamba, simply run below to create a virtual environment named `my-env` and install all packages specified by the `requirements.txt`
```bash
$ mamba create --name my-env --file requirements.txt
```
2. Or, you can use the Python `venv` module, and specify a path to store packages for your virtual environment
```bash
$ python -m venv /path/to/your/directory/my-env
```
- To activate your `venv` virtual environment...
    - On Unix shell, run `$ source <venv>/bin/activate`
        - Note that suffix of activate depends on shell see:
            - https://docs.python.org/3/library/venv.html
    - On WINDOWS...
        - CMD: `<venv>\Scripts\activate.bat`
        - PS: `<venv>\Scripts\Activate.ps1`
  
- Once activated, you can install the requirements by running
```bash
(my-env) $ pip install -r path/to/requirements.txt
```

### Setting up the Data Bases
In order for the chat and user features to be functional, the databases must be constructed and initialised.
These commands must be run in the src directory.
0. Enter the src directory

1. flask db init
    - note that it should list roughly the outline and schema of each table in the log
2. flask db migrate -m "db init"
3. flask db upgrade

### Running the Test Server
- In the command line, **from the top-most directory**, run
```bash
(my-env) $ flask --app ./src/flasky.py run --debug
```
- Then, open the output link in your browser


## Running Unit Testing
> How to run unit tests and validations


## Commit Logs
> Show contributions and review from each student
