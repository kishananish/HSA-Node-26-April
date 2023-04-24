# Home services application

# Prerequisite

1. node js >= 10

# how to setup application?

1. Clone repo
e.g
> git clone http://gitlab.neosofttech.in/JavaScript/hsa_backend.git

2. Run following command to start application
```bash
npm install
```

3. create configuration files :
    i) create a .env file and update content based on environment or copy paste the below data
    
```
ENV = development
PORT = 3000
HOST = localhost
JWT_SECRET = 3n98jokn(*&$M00ss0ksadnas$%@vr
DB_HOST = ''
DB_PORT = ''
DB_NAME = homeservice
DB_USER = ''
DB_PWD = ''
AWS_ACCESS_KEY = ''
AWS_SECRET_KEY = ''
AWS_REGION = ''
EMAIL_HOST = ''
EMAIL_PORT = ''
EMAIL_USER = ''
EMAIL_PASSWORD = ''
GOOGLE_APPID = ''
GOOGLE_APPSECRET = ''
FACEBOOK_APPID = ''
FACEBOOK_APPSECRET = ''
IMAGE_SERVER_URL = ''
SWAGGER_URL = 
SMTP_HOST = 
SMTP_PORT = 
SMTP_USER = 
SMTP_PASSWORD = 
```

4. Run following command to add admin user
```bash
npm run add:admin
```

### Example 
```
➜  hsa_backend git:(develop) ✗ npm run add:admin

> hsa-backend@0.1.2 add:admin /Users/webwerks/Documents/Workspace/HSA_Development/hsa_backend
> babel-node init.js --presets es2015,stage-2

Enter email: santosh.shinde@wwindia.com
Enter password: ***********

[1] admin
[2] service_provider
[3] user
[0] CANCEL

Select role [1, 2, 3, 0]: 1
User Created Successfully
➜  hsa_backend git:(develop) ✗
```

5. Run following command to start application
```bash
npm run dev
```

# Important packages used
1. bcryptjs : for encrypting password
2. joi : for validating request params
3. jsonwebtoken : for creating jwt token
4. winston: for logging 