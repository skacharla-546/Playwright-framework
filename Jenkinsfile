// Cross-platform declarative pipeline for the Advanced Playwright Framework.
// Runs on either a Windows agent (uses `bat`) or a Linux/macOS agent (uses `sh`),
// so it won't hit the "Cannot run program sh" error on Windows.

// --- helpers (must live outside the pipeline block) ---
def runCmd(String command) {
    if (isUnix()) {
        sh command
    } else {
        bat command
    }
}

def installBrowsers() {
    // `--with-deps` installs OS packages and is only supported on Linux.
    if (isUnix()) {
        sh 'npx playwright install --with-deps'
    } else {
        bat 'npx playwright install'
    }
}

pipeline {
    agent any

    environment {
        // Makes playwright.config.ts use CI settings (retries + 4 workers).
        CI = 'true'
    }

    options {
        // `timeout` is built-in. `timestamps()` needs the Timestamper plugin
        // (bundled in most installs) — remove the line if your Jenkins lacks it.
        timeout(time: 30, unit: 'MINUTES')
        timestamps()
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Tool Check') {
            // Confirms Node/npm are on the agent PATH; fails fast with a clear
            // message if they are not (the most common Jenkins setup gap).
            steps {
                script {
                    if (isUnix()) {
                        sh 'node -v && npm -v && npx playwright --version'
                    } else {
                        bat 'node -v && npm -v && npx playwright --version'
                    }
                }
            }
        }

        stage('Install Dependencies') {
            steps {
                runCmd 'npm ci'
            }
        }

        stage('Install Browsers') {
            steps {
                installBrowsers()
            }
        }

        stage('Test') {
            steps {
                // Don't abort the build on test failures; we still want reports.
                catchError(buildResult: 'UNSTABLE', stageResult: 'FAILURE') {
                    runCmd 'npx playwright test'
                }
            }
        }
    }

    post {
        always {
            // JUnit results (configured in playwright.config.ts -> test-results.xml).
            junit testResults: 'test-results.xml', allowEmptyResults: true

            // Keep the generated reports as build artifacts.
            archiveArtifacts artifacts: 'playwright-report/**, allure-results/**, test-results/**, tta-report/**',
                             allowEmptyArchive: true,
                             fingerprint: false

            // Optional, if the HTML Publisher plugin is installed — publishes the
            // Playwright HTML report inline on the build page:
            // publishHTML(target: [reportDir: 'playwright-report', reportFiles: 'index.html',
            //                      reportName: 'Playwright Report', keepAll: true,
            //                      alwaysLinkToLastBuild: true, allowMissing: true])
        }
    }
}
