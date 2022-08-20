name: Docker push to Dispatch

on:
  push:
    branches: [main]
    tags: ["*"]

jobs:
  build:
    runs-on: sat
    steps:
      - uses: actions/checkout@v2
        with:
          # Need all the history for git describe --tags to work
          fetch-depth: 0
      - name: Log in to registry
        run: echo "${{ secrets.DOCKER_PASSWORD }}" | docker login registry.dispatch.sh -u "registry" --password-stdin
      - name: Build
        run: docker buildx build -t registry.dispatch.sh/maartje/cdiwebflash:$GITHUB_SHA --push --platform "linux/amd64,linux/arm64,linux/arm" .
