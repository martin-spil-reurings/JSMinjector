#!/bin/bash
dir=$(dirname "$0")
if [ "$dir" = "." ]; then
  dir=$(pwd)
fi

osascript -e 'tell app "Terminal" to activate' -e 'tell app "System Events" to tell process "Terminal" to keystroke "t" using command down'
osascript -e "tell app \"Terminal\" to do script \"echo -n -e \\\"\\\\033]0;SimpleHTTPServer\\\\007\\\"\" in window 1"
osascript -e "tell app \"Terminal\"
    do script \"cd \\\"$dir\\\";python -m SimpleHTTPServer\" in window 1
end tell"
