### Decodex Lambda ###

This code is built to be executed on AWS lambda.

You should have npm install.

Replace token / user repo by your own.

First build the zip for AWS lambda:
```bash
# install the dependencies
npm install

# create the zip package
zip -r lambda-decodex.zip .
```

Now you can upload it to aws lambda.