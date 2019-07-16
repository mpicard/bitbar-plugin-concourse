#!/bin/bash
# <bitbar.title>Coucourse CI Plugin</bitbar.title>
# <bitbar.version>v1.0</bitbar.version>
# <bitbar.author>Martin Picard</bitbar.author>
# <bitbar.author.github>mpicard</bitbar.author.github>
# <bitbar.desc>Checks Concourse CI pipeline jobs for status</bitbar.desc>
# <bitbar.image>https://i.imgur.com/4QQFqRr.png</bitbar.image>
# <bitbar.dependencies>node,fly</bitbar.dependencies>
# <bitbar.abouturl>https://github.com/mpicard/bitbar-plugin-concourse</bitbar.abouturl>
set -euo pipefail

# User configuration
#####################
export BASEURL='https://concourse.example.com'
export PIPELINE='deploy'
export TARGET='mytarget'
export TEAM='main'
#####################

export PATH=$PATH:/usr/local/bin

cd "$(dirname "$0")"

if fly --target $TARGET status; then
  fly --target $TARGET jobs --pipeline $PIPELINE --json | node .jobs.js
else
  fly --target $TARGET login --open-browser
  fly --target $TARGET jobs --pipeline $PIPELINE --json | node .jobs.js
fi
