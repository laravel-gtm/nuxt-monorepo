echo "creating temporary directory"
mkdir /tmp/monorepo

echo "moving repos to temporary directory"
repos=("backend" "frontend")

for item in "${repos[@]}"; do
  echo "moving $item to temporary directory"
  mv $item /tmp/monorepo/
done

echo "removing unnecessary files"
rm -rf composer.lock
rm -rf composer.json
rm -rf README.md
rm -rf .gitignore
rm -rf .git
rm -rf solo.yml

echo "copying backend to current directory"
cp -Rf /tmp/monorepo/backend/. .

echo "installing dependencies"
composer install --no-dev --no-interaction --prefer-dist --optimize-autoloader

echo "installing bun"
npm i -g bun

echo "installing frontend dependencies"
cd /tmp/monorepo/frontend
bun install
bun run generate

echo "copying frontend to current directory"
cp -Rf .output/public/* /var/www/html/public/

echo "removing temporary directory"
rm -rf /tmp/monorepo
