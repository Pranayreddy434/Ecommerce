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
                    sh 'mvn -q -DskipTests clean package'
                }
            }
        }

        stage('Build Frontend') {
            steps {
                dir('frontend') {
                    sh 'npm install'
                    sh 'npm run build'
                }
            }
        }

        stage('Build Docker Images') {
            steps {
                sh "docker compose -f ${COMPOSE_FILE} build"
            }
        }

        stage('Run Containers') {
            steps {
                sh "docker compose -f ${COMPOSE_FILE} up -d"
            }
        }
    }

    post {
        always {
            sh "docker compose -f ${COMPOSE_FILE} ps || true"
        }
    }
}
