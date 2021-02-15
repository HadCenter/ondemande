pipeline {
    agent any

    stages {
        stage('get user name') {
            steps {
                echo $USER
            }
        }
        stage('Build Docker images') {
            steps {
                docker-compose build
                docker-compose up -d
            }
        }

    }
}