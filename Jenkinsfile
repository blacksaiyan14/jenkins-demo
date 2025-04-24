pipeline {
    agent any
    
    triggers {
        pollSCM('H/1 * * * *') // Vérifie les changements toutes les 5 minutes
    }
    
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
        disableConcurrentBuilds() // Empêche les builds concurrents
    }
    
    stages {
        stage('Checkout') {
            steps {
                checkout([
                    $class: 'GitSCM',
                    branches: [[name: '*/main']], // Adaptez selon votre branche principale
                    extensions: [[$class: 'CleanBeforeCheckout']],
                    userRemoteConfigs: [[
                        credentialsId: 'github-creds', // Ajoutez vos credentials Git si nécessaire
                        url: 'https://github.com/blacksaiyan14/jenkins-demo.git' // Remplacez par l'URL de votre dépôt
                    ]]
                ])
            }
        }
        
        stage('Build Backend') {
            steps {
                script {
                    def imageName = "blacksaiyan/projet-fil-rouge-jenkins:backend-${env.BUILD_ID}"
                    sh """
                        docker build -t ${imageName} \
                        --build-arg DJANGO_SECRET_KEY="${DJANGO_SECRET_KEY}" \
                        ./Backend/odc
                    """
                }
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
                    
                    // Run integration tests
                    sh 'echo "Running integration tests..."'
                    // Exemple: sh 'docker-compose -f ${COMPOSE_FILE} run --rm backend python manage.py test integration_tests'
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
                branch 'main'
            }
            steps {
                script {
                    // Tag and push backend
                    docker.withRegistry('https://hub.docker.com', 'dockerhub-creds') {
                        docker.image("blacksaiyan/projet-fil-rouge-jenkins:backend-${TAG}").push()
                        docker.image("blacksaiyan/projet-fil-rouge-jenkins:backend-${TAG}").push('latest')
                    }
                    
                    // Tag and push frontend
                    docker.withRegistry('https://hub.docker.com', 'dockerhub-creds') {
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
                    sshagent(['ssh-deploy-creds']) { // Ajoutez vos credentials SSH pour le déploiement
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
            // Clean up workspace
            cleanWs()
            
            // Clean up Docker
            script {
                sh 'docker system prune -f || true'
            }
        }
        failure {
            emailext (
                subject: "FAILED: Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]'",
                body: """Check console output at ${env.BUILD_URL}console""",
                to: 'cissetaif3@gmail.com',
                attachLog: true
            )
        }
        success {
            emailext (
                subject: "SUCCESS: Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]'",
                body: """Check console output at ${env.BUILD_URL}console""",
                to: 'cissetaif3@gmail.com'
            )
        }
    }
}