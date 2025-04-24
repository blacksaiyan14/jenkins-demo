pipeline {
    agent any
    
    environment {
        // Docker registry credentials
        DOCKER_REGISTRY = credentials('dockerhub-creds')
        
        // Database configuration
        DB_USER = 'odc_user'
        DB_PASSWORD = credentials('postgre-creds')
        DB_NAME = 'odc_db'
        
        // Django configuration
        DJANGO_SECRET_KEY = credentials('django-creds')
        API_BASE_URL = 'http://backend:8000'
        
        // Version tag (can be overridden by build parameters)
        TAG = "${env.BUILD_NUMBER}"
        
        // Docker compose file
        COMPOSE_FILE = 'docker-compose.yml'
    }
    
    options {
        buildDiscarder(logRotator(numToKeepStr: '10'))
        timeout(time: 30, unit: 'MINUTES')
    }
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        stage('Build Backend') {
            steps {
                script {
                    docker.build("backend:${TAG}", "--build-arg DJANGO_SECRET_KEY=${DJANGO_SECRET_KEY} ./Backend/odc")
                }
            }
        }
        
        stage('Build Frontend') {
            steps {
                script {
                    docker.build("frontend:${TAG}", "--build-arg VITE_API_BASE_URL=${API_BASE_URL} ./Frontend")
                }
            }
        }
        
        stage('Unit Tests Backend') {
            steps {
                script {
                    // Run backend tests in a container
                    docker.image("backend:${TAG}").inside {
                        sh 'python manage.py test --noinput'
                    }
                }
            }
        }
        
        stage('Integration Tests') {
            steps {
                script {
                    // Start the full stack
                    sh "docker-compose -f ${COMPOSE_FILE} up -d --build"
                    
                    // Wait for services to be healthy
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
                    
                    // Run integration tests (you would replace this with your actual test commands)
                    sh 'echo "Running integration tests..."'
                    // Example: sh 'docker-compose -f ${COMPOSE_FILE} run --rm backend python manage.py test integration_tests'
                }
            }
            post {
                always {
                    // Clean up
                    sh "docker-compose -f ${COMPOSE_FILE} down -v"
                }
            }
        }
        
        stage('Push Images') {
            when {
                branch 'main' // or 'master' or your production branch
            }
            steps {
                script {
                    // Tag and push backend
                    docker.withRegistry('https://hub.docker.com/repository/docker/blacksaiyan/projet-fil-rouge-jenkins/general', 'dockerhub-creds') {
                        docker.image("backend:${TAG}").push()
                        docker.image("backend:${TAG}").push('latest')
                    }
                    
                    // Tag and push frontend
                    docker.withRegistry('https://hub.docker.com/repository/docker/blacksaiyan/projet-fil-rouge-jenkins/general', 'dockerhub-creds') {
                        docker.image("frontend:${TAG}").push()
                        docker.image("frontend:${TAG}").push('latest')
                    }
                }
            }
        }
        
        stage('Deploy') {
            when {
                branch 'main' // or 'master' or your production branch
            }
            steps {
                script {
                    // On a production environment, you would deploy the images
                    sh """
                        docker-compose -f ${COMPOSE_FILE} pull
                        docker-compose -f ${COMPOSE_FILE} up -d
                    """
                }
            }
        }
    }
    
    post {
        always {
            // Clean up workspace
            cleanWs()
        }
        failure {
            // Notify on failure
            emailext (
                subject: "FAILED: Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]'",
                body: """Check console output at ${env.BUILD_URL}console""",
                to: 'cissetaif3@gmail.com'
            )
        }
        success {
            // Notify on success
            emailext (
                subject: "SUCCESS: Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]'",
                body: """Check console output at ${env.BUILD_URL}console""",
                to: 'cissetaif3@gmail.com'
            )
        }
    }
}