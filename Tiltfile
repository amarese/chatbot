# Frontend development
docker_build(
    'frontend',
    './frontend',
    dockerfile='./frontend/Dockerfile',
    live_update=[
        sync('./frontend', '/app'),
        run('cd /app && npm install', trigger=['package.json']),
    ]
)

# Backend development
docker_build(
    'backend',
    './backend',
    dockerfile='./backend/Dockerfile',
    live_update=[
        sync('./backend/src', '/app/src'),
        run('cd /app && npm install', trigger=['package.json']),
    ]
)

# API development
docker_build(
    'api',
    './api',
    dockerfile='./api/Dockerfile',
    live_update=[
        sync('./api/src', '/app/src'),
        run('cd /app && npm install', trigger=['package.json']),
    ]
)



# Run all services
docker_compose('docker-compose.yml') 