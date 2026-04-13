pipeline {
    agent any

    environment {
        COMPOSE_FILE = 'docker/docker-compose.yml'
    }

    stages {
        stage('Clone Repository') {
            steps {
                checkout scm
            }
        }

        stage('Build Backend') {
            steps {
                dir('backend') {
                    bat 'mvn -q -DskipTests clean package'
                }
            }
        }

        stage('Build Frontend') {
            steps {
                dir('frontend') {
                    bat 'npm install'
                    bat 'npm run build'
                }
            }
        }

        stage('Build Docker Images') {
            steps {
                bat "docker compose -f ${COMPOSE_FILE} build"
            }
        }

        stage('Run Containers') {
            steps {
                bat "docker compose -f ${COMPOSE_FILE} up -d"
            }
        }
    }

    post {
        always {
            bat "docker compose -f ${COMPOSE_FILE} ps || true"
        }
    }
}
