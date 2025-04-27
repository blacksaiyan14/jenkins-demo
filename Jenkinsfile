pipeline {
    agent any

    environment {
        API_BASE_URL = 'http://backend:8000'
        TAG = "${env.BUILD_NUMBER}"
        COMPOSE_FILE = 'docker-compose.yaml'
        DJANGO_SECRET_KEY = credentials('django-creds')
    }

    options {
        buildDiscarder(logRotator(numToKeepStr: '10'))
        timeout(time: 30, unit: 'MINUTES')
        disableConcurrentBuilds()
    }

    triggers {
        githubPush() // Déclenche à chaque push GitHub (webhook actif)
    }

    stages {
        stage('Checkout') {
            steps {
                checkout([
                    $class: 'GitSCM',
                    branches: [[name: '*/main']], // Branche MAIN
                    extensions: [[$class: 'CleanBeforeCheckout']],
                    userRemoteConfigs: [[
                        credentialsId: 'github-creds',
                        url: 'https://github.com/blacksaiyan14/jenkins-demo.git'
                    ]]
                ])
            }
        }

        stage('Build Backend') {
            steps {
                withCredentials([string(credentialsId: 'django-secret-key', variable: 'DJANGO_SECRET_KEY')]) {
                    sh '''
                        echo "🚀 Build Backend"
                        docker build -t blacksaiyan/projet-fil-rouge-jenkins:backend-${BUILD_NUMBER} \
                        --build-arg DJANGO_SECRET_KEY="$DJANGO_SECRET_KEY" \
                        ./Backend/odc
                    '''
                }
            }
        }


        stage('Build Frontend') {
            steps {
                script {
                    sh """
                        echo "🚀 Build Frontend"
                        docker build -t blacksaiyan/projet-fil-rouge-jenkins:frontend-${TAG} \
                          --build-arg VITE_API_BASE_URL=${API_BASE_URL} \
                          ./Frontend
                    """
                }
            }
        }

        stage('Unit Tests Backend') {
            steps {
                script {
                    echo "🧪 Tests unitaires backend"
                    sh "docker run --rm blacksaiyan/projet-fil-rouge-jenkins:backend-${TAG} python manage.py test --noinput"
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
                        echo "🔖 Tagging des images"
                        sh """
                            docker tag blacksaiyan/projet-fil-rouge-jenkins:backend-${TAG} blacksaiyan/projet-fil-rouge-jenkins:backend-latest
                            docker tag blacksaiyan/projet-fil-rouge-jenkins:frontend-${TAG} blacksaiyan/projet-fil-rouge-jenkins:frontend-latest
                        """

                        echo "📤 Push backend images"
                        sh """
                            docker push blacksaiyan/projet-fil-rouge-jenkins:backend-${TAG}
                            docker push blacksaiyan/projet-fil-rouge-jenkins:backend-latest
                        """

                        echo "📤 Push frontend images"
                        sh """
                            docker push blacksaiyan/projet-fil-rouge-jenkins:frontend-${TAG}
                            docker push blacksaiyan/projet-fil-rouge-jenkins:frontend-latest
                        """
                    }
                }
            }
        }

        stage('Deploy Local') {
            when {
                branch 'main'
            }
            steps {
                script {
                    echo "🚀 Déploiement local"
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
            echo "🧹 Nettoyage du workspace"
            cleanWs()
            script {
                sh 'docker system prune -f || true'
            }
        }
        failure {
            emailext (
                subject: "❌ ÉCHEC : ${env.JOB_NAME} #${env.BUILD_NUMBER}",
                body: "Voir la sortie console : ${env.BUILD_URL}console",
                to: 'cissetaif3@gmail.com',
                attachLog: true
            )
        }
        success {
            emailext (
                subject: "✅ SUCCÈS : ${env.JOB_NAME} #${env.BUILD_NUMBER}",
                body: "Le build s'est déroulé avec succès : ${env.BUILD_URL}console",
                to: 'cissetaif3@gmail.com'
            )
        }
    }
}
