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
                sh "docker-compose build"
                sh "docker-compose up -d"
            }
        }

    }
}