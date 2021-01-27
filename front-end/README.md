# onDemand


# SETUP and USAGE

The steps below will take you through cloning the repository, installing dependencies and building:

1. Clone the repository.

```bash
git clone https://aya_kilani@bitbucket.org/aya_kilani/ondemand.git
```

2. Open your copied repo folder in terminal and install necessary modules with command, make sure that you have installed [npm](https://www.npmjs.com/get-npm):

```bash
npm install
```

3. Install [angular-cli](https://cli.angular.io/) globally to use its commands in the terminal:

```bash
npm install --global @angular/cli
```

4. Now you are able to run or build the project:

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

Run `ng build --aot=false` to build the project. The build artifacts will be stored in the `dist/` directory.

You can also execute the Jar file of the backend application `java -jar ondemand-0.0.1-SNAPSHOT.jar` which allows you to run both applications (back and front) on the same port 8080.

