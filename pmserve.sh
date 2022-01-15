pm2 stop server-test-01; pm2 delete server-test-01; pm2 start app.js -i 4 --name server-test-01; pm2 monit

