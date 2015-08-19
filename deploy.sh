#!/usr/bin/env bash
VERSION=0.1.1
git tag -d $VERSION
git tag -a $VERSION -m "Version $VERSION"
git push -f --tags
bower cache clean
