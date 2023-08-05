<!-- Improved compatibility of back to top link: See: https://github.com/othneildrew/Best-README-Template/pull/73 -->
<a name="readme-top"></a>
<!--
*** Thanks for checking out the Best-README-Template. If you have a suggestion
*** that would make this better, please fork the repo and create a pull request
*** or simply open an issue with the tag "enhancement".
*** Don't forget to give the project a star!
*** Thanks again! Now go create something AMAZING! :D
-->



<!-- PROJECT SHIELDS -->
<!--
*** I'm using markdown "reference style" links for readability.
*** Reference links are enclosed in brackets [ ] instead of parentheses ( ).
*** See the bottom of this document for the declaration of the reference variables
*** for contributors-url, forks-url, etc. This is an optional, concise syntax you may use.
*** https://www.markdownguide.org/basic-syntax/#reference-style-links
-->
[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]
[![LinkedIn][linkedin-shield]][linkedin-url]



<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/yingtu35/Lets-Chat">
    <img src="assets/icon1.png" alt="Logo" width="300">
  </a>

<h3 align="center">Lets-Chat</h3>

  <p align="center">
    A web application for you and your friend to chat anywhere you want at any time!
    <br />
    <a href="https://github.com/yingtu35/Lets-Chat"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://github.com/yingtu35/Lets-Chat">View Demo</a>
    ·
    <a href="https://github.com/yingtu35/Lets-Chat/issues">Report Bug</a>
    ·
    <a href="https://github.com/yingtu35/Lets-Chat/issues">Request Feature</a>
  </p>
</div>



<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About The Project

[![Product Name Screen Shot][product-screenshot]](https://example.com)

Lets-Chat is a web application built on React and Flask.

Using WebSocket protocol, users can chat easily in chat rooms they create or from other users.

<p align="right">(<a href="#readme-top">back to top</a>)</p>



### Built With

* [![socketdotio][socketdotio.com]][socketdotio-url]
* [![React][React.js]][React-url]
* [![Python][Python.org]][Python-url]
* [![MUI][MUI.com]][MUI-url]
* [![Flask][Flask.org]][Flask-url]

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- GETTING STARTED -->
## Getting Started

**Currently there are issues related to [gsi](https://developers.google.com/identity/gsi/web/reference/js-reference#google.accounts.id.renderButton) so that the backend flask server cannot host the frontend production code.** 
To test the application in development mode, you have to run the flask server and frontend as separated applications

### Prerequisites

* **npm**
  
  Recommend using nvm for Node version management

  [nvm][nvm-url]
* **python**
  
  Recommend using miniconda for Python version management
  [miniconda][miniconda-url]

### Installation
* **in MacOS**
1. Clone the repo
   ```sh
   git clone https://github.com/yingtu35/Lets-Chat.git
   ```
2. Create a virtual environment (optional)
   ```sh
   python -m venv .venv
   source .venv/bin/activate
   ```
3. Install required python packages through `requirements.txt`
   ```sh
   pip install -r requirements.txt
   ```
4. Create a .env file in the root directory, add the following environment variables
    ```sh
    SECRET_KEY=PASTE_YOUR_SECRET_KEY_HERE
    SQLALCHEMY_DATABASE_URI=PASTE_YOUR_DATABASE_URI_HERE
    CLIENT_ID=PASTE_YOUR_GOOGLE_API_CLIENT_ID_HERE
    ```
    Read [flask-sqlalchemy configuration][sqlalchemy-url] here for connecting to your database
    Read [google_API][google_API-url] here for setting up your google client id.
5. Create a .env file in the client directory and add the REACT_APP_CLIENT_ID that has the same value as CLIENT_ID you added in the previous step
   ```sh
   REACT_APP_CLIENT_ID=PASTE_YOUR_GOOGLE_API_CLIENT_ID_HERE
   ```
6. Install all dependencies for the client app
   ```sh
   cd client
   npm install
   ```
7. Run `main.py` in the root directory to start the app
   ```sh
   python main.py
   ```

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- USAGE EXAMPLES -->
## Usage

Enjoy the short demo using ios simulator to see how Lets-Chat works.

[Demo][demo-url]
<!-- 
[![Lets-Chat demo](images/video%20thumbnail.png)](http://www.youtube.com/watch?v=MnJX33HtIVE "Lets-Chat demo") -->

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- ROADMAP -->
## Roadmap

- [ ] Allow users to create private room
- [ ] Responsive web design
- [ ] Rooms are paginated
- [ ] Add other third party social login
- [ ] Friend systems
- [ ] Welcome any new advice!
    <!-- - [ ] Nested Feature -->

See the [open issues](https://github.com/yingtu35/Lets-Chat/issues) for a full list of proposed features (and known issues).

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- CONTRIBUTING -->
## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE.txt` for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- CONTACT -->
## Contact

Your Name - [@YingTu1685990](https://twitter.com/YingTu1685990) - yingtu35@gmail.com

Project Link: [https://github.com/yingtu35/Lets-Chat](https://github.com/yingtu35/Lets-Chat)

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- ACKNOWLEDGMENTS -->
## Acknowledgments

* [Flask](https://flask.palletsprojects.com/en/2.3.x/)
* [Flask-sqlalchemy](https://flask-sqlalchemy.palletsprojects.com/en/3.0.x/)
* [Google Identity](https://developers.google.com/identity/gsi/web/guides/overview)
<!-- * []()
* []() -->

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/github/contributors/yingtu35/Lets-Chat.svg?style=for-the-badge
[contributors-url]: https://github.com/yingtu35/Lets-Chat/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/yingtu35/Lets-Chat.svg?style=for-the-badge
[forks-url]: https://github.com/yingtu35/Lets-Chat/network/members
[stars-shield]: https://img.shields.io/github/stars/yingtu35/Lets-Chat.svg?style=for-the-badge
[stars-url]: https://github.com/yingtu35/Lets-Chat/stargazers
[issues-shield]: https://img.shields.io/github/issues/yingtu35/Lets-Chat.svg?style=for-the-badge
[issues-url]: https://github.com/yingtu35/Lets-Chat/issues
[license-shield]: https://img.shields.io/github/license/yingtu35/Lets-Chat.svg?style=for-the-badge
[license-url]: https://github.com/yingtu35/Lets-Chat/blob/master/LICENSE.txt
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=0A66C2
[linkedin-url]: https://linkedin.com/in/yingtu
[product-screenshot]: assets/product.png
[React.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://reactjs.org/
[Flask.org]: https://img.shields.io/badge/Flask-80CAD4?style=for-the-badge&logo=Flask&logoColor=000000
[Flask-url]: https://www.Flask.com/
[Python.org]: https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=Python&logoColor=white
[Python-url]: https://Pythonjs.com/
[socketdotio.com]: https://img.shields.io/badge/socketdotio-010101?style=for-the-badge&logo=socketdotio&logoColor=white
[socketdotio-url]: https://socketdotio.com/
[nvm-url]: https://github.com/nvm-sh/nvm
[MUI.com]: https://img.shields.io/badge/MUI-007FFF?style=for-the-badge&logo=MUI&logoColor=C21325
[MUI-url]: https://mui.com/
[demo-url]: https://youtu.be/7ITpYW81BAs
[google_API-url]: https://developers.google.com/identity/oauth2/web/guides/get-google-api-clientid
[sqlalchemy-url]: https://flask-sqlalchemy.palletsprojects.com/en/2.x/config/

