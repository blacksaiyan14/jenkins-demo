pipeline {
    agent any

    triggers {
        pollSCM('H/1 * * * *')
    }

    environment {
        DOCKER_REGISTRY = credentials('dockerhub-creds')
        DJANGO_SECRET_KEY = credentials('django-secret-key')
        API_BASE_URL = 'http://backend:8000'
        TAG = "${env.BUILD_NUMBER}"
        COMPOSE_FILE = 'docker-compose.yml'
    }

    options {
        buildDiscarder(logRotator(numToKeepStr: '10'))
        timeout(time: 30, unit: 'MINUTES')
        disableConcurrentBuilds()
    }

    stages {
        stage('Checkout') {
            steps {
                checkout([
                    $class: 'GitSCM',
                    branches: [[name: '*/main']],
                    extensions: [[$class: 'CleanBeforeCheckout']],
                    userRemoteConfigs: [[
                        credentialsId: 'github-creds',
                        url: 'https://github.com/blacksaiyan14/jenkins-demo.git'
                    ]]
                ])
            }
        }

        stage('Build Frontend') {
            steps {
                script {
                    docker.build("blacksaiyan/projet-fil-rouge-jenkins:frontend-${TAG}", "--build-arg VITE_API_BASE_URL=${API_BASE_URL} ./Frontend")
                }
            }
        }

        stage('Unit Tests Backend') {
            steps {
                script {
                    docker.image("blacksaiyan/projet-fil-rouge-jenkins:backend-${TAG}").inside {
                        sh 'python manage.py test --noinput'
                    }
                }
            }
        }

        stage('Integration Tests') {
            steps {
                script {
                    sh "docker-compose -f ${COMPOSE_FILE} up -d --build"
                    sh """
                        while ! docker-compose -f ${COMPOSE_FILE} ps backend | grep -q '(healthy)'; do
                            sleep 5
                            echo "Waiting for backend to be healthy..."
                        done
                        while ! docker-compose -f ${COMPOSE_FILE} ps frontend | grep -q '(healthy)'; do
                            sleep 5
                            echo "Waiting for frontend to be healthy..."
                        done
                    """
                    sh 'echo "Running integration tests..."'
                }
            }
            post {
                always {
                    sh "docker-compose -f ${COMPOSE_FILE} down -v"
                }
            }
        }

        stage('Push Images') {
            when {
                branch 'main'
            }
            steps {
                script {
                    docker.withRegistry('https://index.docker.io/v1/', 'dockerhub-creds') {
                        docker.image("blacksaiyan/projet-fil-rouge-jenkins:backend-${TAG}").push()
                        docker.image("blacksaiyan/projet-fil-rouge-jenkins:backend-${TAG}").push('latest')
                        docker.image("blacksaiyan/projet-fil-rouge-jenkins:frontend-${TAG}").push()
                        docker.image("blacksaiyan/projet-fil-rouge-jenkins:frontend-${TAG}").push('latest')
                    }
                }
            }
        }

        stage('Deploy') {
            when {
                branch 'main'
            }
            steps {
                script {
                    sshagent(['ssh-deploy-creds']) {
                        sh """
                            ssh -o StrictHostKeyChecking=no user@server "
                                cd /path/to/project &&
                                docker-compose -f ${COMPOSE_FILE} pull &&
                                docker-compose -f ${COMPOSE_FILE} up -d
                            "
                        """
                    }
                }
            }
        }
    }

    post {
        always {
            cleanWs()
            script {
                sh 'docker system prune -f || true'
            }
        }
        failure {
            emailext (
                subject: "❌ FAILED: ${env.JOB_NAME} #${env.BUILD_NUMBER}",
                body: "Job failed. Check console output: ${env.BUILD_URL}console",
                to: 'cissetaif3@gmail.com',
                attachLog: true
            )
        }
        success {
            emailext (
                subject: "✅ SUCCESS: ${env.JOB_NAME} #${env.BUILD_NUMBER}",
                body: "Job succeeded. View logs: ${env.BUILD_URL}console",
                to: 'cissetaif3@gmail.com'
            )
        }
    }
}
