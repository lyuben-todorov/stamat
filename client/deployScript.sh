DEPLOY_ROOT=/var/www/stamat
npm run-script build && sudo cp -r dist/* /var/www/stamat
