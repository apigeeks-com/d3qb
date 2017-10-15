#!/usr/bin/env bash
git add -A .
git commit -m 'pre-release'

npm version patch
CURRENT_VERSION=$(npm run version --silent)
git tag -a $CURRENT_VERSION -m "v$CURRENT_VERSION"
git push origin --tags

