#!/bin/bash

# samples
## node java --prefix "dest.write" --camelcase --text-before-key "(" --suffix ");" --to-java-type test/java.json 
## node java --prefix "dest.write"  --text-before-key "(" --suffix ");" --to-java-type --key-to-all-caps --format "\$type KEY_\$KEY \"\$key\""  test/java.json
## etc.

cat $1 | cut -f 3 -d " " | cut -f 1 -d ";" | sed -e 's/^[[:space:]]*//' | grep
 -Ev "^$"