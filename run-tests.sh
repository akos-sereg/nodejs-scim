#!/bin/bash

# Setup (cleanup users and groups from SCIM API server)
jasmine-node tests/cleanup_spec.js

# Run tests
jasmine-node tests/scim_api_spec.js

# Teardown
jasmine-node tests/cleanup_spec.js
