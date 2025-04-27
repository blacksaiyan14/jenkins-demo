pipeline {
    agent any

    triggers {
        githubPush() // Déclenche le job à chaque push GitHub (si webhook actif)
    }

    environment {
        API_BASE_URL = 'http://backend:8000'
        TAG = "${env.BUILD_NUMBER}"
        COMPOSE_FILE = 'docker-compose.yaml'
        DJANGO_SECRET_KEY = 'django-creds'
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

        stage('Build Backend') {
            steps {
                script{
                    sh """
                    docker build -t blacksaiyan/projet-fil-rouge-jenkins:backend-${env.BUILD_NUMBER} \
                      --build-arg DJANGO_SECRET_KEY=${DJANGO_SECRET_KEY} \
                      ./Backend/odc
                    """
                }
            }
        }

        stage('Build Frontend') {
            steps {
                script {
                    sh """
                        docker build -t blacksaiyan/projet-fil-rouge-jenkins:frontend-${env.BUILD_NUMBER} \
                          --build-arg VITE_API_BASE_URL=${API_BASE_URL} \
                          ./Frontend
                    """
                }
            }
        }

        stage('Unit Tests Backend') {
            steps {
                sh "docker run --rm blacksaiyan/projet-fil-rouge-jenkins:backend-${env.BUILD_NUMBER} python manage.py test --noinput"
            }
        }

        stage('Push Images') {
            steps {
                script {
                    docker.withRegistry('https://index.docker.io/v1/', 'docker-creds') {
                        echo "🔖 Tagging les images..."
                        sh """
                            docker tag blacksaiyan/projet-fil-rouge-jenkins:backend-${env.BUILD_NUMBER} blacksaiyan/projet-fil-rouge-jenkins:backend-latest
                            docker tag blacksaiyan/projet-fil-rouge-jenkins:frontend-${env.BUILD_NUMBER} blacksaiyan/projet-fil-rouge-jenkins:frontend-latest
                        """

                        echo "📤 Pushing Backend images vers DockerHub..."
                        sh """
                            docker push blacksaiyan/projet-fil-rouge-jenkins:backend-${env.BUILD_NUMBER}
                            docker push blacksaiyan/projet-fil-rouge-jenkins:backend-latest
                        """

                        echo "📤 Pushing Frontend images vers DockerHub..."
                        sh """
                            docker push blacksaiyan/projet-fil-rouge-jenkins:frontend-${env.BUILD_NUMBER}
                            docker push blacksaiyan/projet-fil-rouge-jenkins:frontend-latest
                        """
                    }
                }
            }
        }


        stage('Deploy Local') {
            steps {
                script {
                    sh """
                        echo "🚀 Déploiement local basé sur DockerHub depuis la racine"

                        # Supprimer l'image postgres local cassée si besoin
                        docker rmi postgres:latest || true

                        # Supprimer les anciennes images locales cassées
                        docker rmi blacksaiyan/projet-fil-rouge-jenkins:backend-latest || true
                        docker rmi blacksaiyan/projet-fil-rouge-jenkins:frontend-latest || true

                        # Tirer les dernières images Docker depuis DockerHub
                        docker-compose -f ${COMPOSE_FILE} pull

                        # Démarrer tous les services avec les nouvelles images
                        docker-compose -f ${COMPOSE_FILE} up -d

                        echo "✅ Déploiement terminé avec succès."
                    """
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
                subject: "ÉCHEC : ${env.JOB_NAME} #${env.BUILD_NUMBER}",
                body: "Consultez la sortie console : ${env.BUILD_URL}console",
                to: 'cissetaif3@gmail.com',
                attachLog: true
            )
        }
        success {
            emailext (
                subject: "SUCCÈS : ${env.JOB_NAME} #${env.BUILD_NUMBER}",
                body: "Le build est passé avec succès ! Voir : ${env.BUILD_URL}console",
                to: 'cissetaif3@gmail.com'
            )
        }
    }
}