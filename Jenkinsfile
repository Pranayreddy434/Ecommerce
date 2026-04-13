pipeline {
    agent any

    environment {
        COMPOSE_FILE = 'docker/docker-compose.yml'
    }

    options {
        timestamps()          // show timestamps in logs
        skipDefaultCheckout() // avoid duplicate checkout
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
                    bat 'mvn clean package -DskipTests'
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

        stage('Stop Old Containers') {
            steps {
                bat "docker compose -f %COMPOSE_FILE% down"
            }
        }

        stage('Build Docker Images') {
            steps {
                bat "docker compose -f %COMPOSE_FILE% build"
            }
        }

        stage('Run Containers') {
            steps {
                bat "docker compose -f %COMPOSE_FILE% up -d"
            }
        }

        stage('Verify Containers') {
            steps {
                bat "docker compose -f %COMPOSE_FILE% ps"
            }
        }
    }

    post {
        success {
            echo '✅ Deployment Successful!'
        }
        failure {
            echo '❌ Deployment Failed!'
        }
        always {
            echo '📦 Cleaning workspace...'
            cleanWs()
        }
    }
}