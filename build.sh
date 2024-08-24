set -euo pipefail

export PATH=node_modules/.bin:$PATH
if [ ! -d node_modules ] 
then 
  yarn install
fi

if [ ! -f build/index.html ]
then
  yarn build
fi
