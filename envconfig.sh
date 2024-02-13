#!/bin/bash

compgen -A variable | grep -q REACT_APP || export $(grep -v '^#' .env.local) ; chmod +x env.sh && . ./env.sh