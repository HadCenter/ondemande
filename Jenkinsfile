pipeline {
    agent any

    stages {
        stage('shutdown docker image') {
            steps {
                sh "docker-compose down"
            }
        }
        stage('remove cache from docker') {
            steps {
                sh "docker-compose rm -f"
            }
        }
        stage('docker build new image') {
            steps {
                sh "docker-compose build"
            }
        }
        stage('docker deploy new image') {
            steps {
                sh "docker-compose up -d"
            }
        }
//         stage('Dangling Images') {
//             steps {
//                 sh 'docker system prune -f'
//             }
//         }
    }
}