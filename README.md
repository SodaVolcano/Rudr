# CITS3403 Web Project

## **TODOS**

### General
- [ ] Define colour classes for bg and fg and replace all reference to colours with those classes
- [ ] Clean up CSS style - remove CSS and JS from HTML attributes, remove uneeded CSS properties
- [ ] Style scroll bar


### Home
- [ ] Robot image is too big - title should fit in centre of banner, and robot is small and below it
- [ ] Fix hamburger expansion of navbar links
- [ ] Image (the gif) is too small - design of webpage should focus on images, should make it bigger
    - [ ] suggestion: replace signup and login into single button, when clicked, go to sign up with extra link going to login?
- [ ] Fix social media not appearing in homepage
    
### Chatroom
- [ ] Create text bubble
- [ ] Add scrollable chat history view
  - [ ] Make chat history area auto scroll to the bottom


### Other
- [ ] Save conversation history to database - TIn chi and Martin



## Authors
- Cohen Rafiq 23348918
- Tin Chi Pang 23301921
- Martin Evans 23621647

## Purpose
This is INSERT_NAME_HERE, a fictitious website set in the future that aims 
to provide a dating platform for humans and robots. In this future, recent 
advancement in artificial general intelligence has produced near-human 
level sentience in robots. In this wave of new sentience, the interest 
in robot-dating has seen a surge in popularity.

Obviously this website is purely for entertainment purposes akin to 
dating-sim games. It is not intended to be a serious dating platform in any 
sense. It is also not intended to be a serious dating platform for robots 
so if you are a robot seeking love, then uhhh maybe go look elsewhere.

## Design
> Design philosophy or something idk


## Application Architecture
> Backend and frontend architecture?


## Running the Web Application
> On localhost
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
