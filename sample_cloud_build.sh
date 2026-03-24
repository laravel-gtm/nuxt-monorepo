mkdir /tmp/monorepo

repos=("backend" "frontend")

for item in "${repos[@]}"; do
  mv $item /tmp/monorepo/
done

cp -Rf /tmp/monorepo/backend/. .

composer install --no-dev --no-interaction --prefer-dist --optimize-autoloader

npm i -g bun

cd /tmp/monorepo/frontend
bun install
bun run generate

cp -Rf .output/public/* /var/www/html/public/

rm -rf /tmp/monorepo
